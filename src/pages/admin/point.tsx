import DateView from '@/components/DateView';
import BaseLayout from '@/components/layout/BaseLayout';
import LayoutContent from '@/components/layout/LayoutContent';
import StatusView from '@/components/point/StatusView';
import H1 from '@/components/section/H1';
import type { PointQuery } from '@/point';
import { trpc } from '@/trpc';
import { copy } from '@/util/copy';
import { ContentCopy, ThumbDown, ThumbUp } from '@mui/icons-material';
import { Alert, Box, Button, CircularProgress, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { NextPage } from 'next';
import { useState } from 'react';

interface Props {
}
const AdminPointListPage: NextPage<Props> = ({ }) => {
    const [pointQuery, setPointQuery] = useState<PointQuery>({})
    const points = trpc.point.getAll.useQuery(pointQuery, { cacheTime: 3600 * 1000 })
    const toggleQueryPending = () => {
        setPointQuery(p => ({
            ...p,
            status: p.status !== "pending" ? "pending" : undefined,
        }))
    }
    const grant = trpc.point.grant.useMutation()
    const handleGrant = async (pointId: string) => {
        await grant.mutateAsync({ pointId })
        points.refetch()
    }
    const reject = trpc.point.reject.useMutation()
    const handleReject = async (pointId: string) => {
        await reject.mutateAsync({ pointId })
        points.refetch()
    }

    const handleCopyPointLink = async (pointId: string) => {
        await copy(`${location.origin}/point?pointId=${pointId}`)
    }
    return (
        <BaseLayout>
            <H1>
                ポイント一覧
            </H1>
            <LayoutContent>
                <Button
                    variant={pointQuery.status === "pending" ? "contained" : "outlined"}
                    color={pointQuery.status === "pending" ? "primary" : "inherit"}
                    onClick={toggleQueryPending}
                >
                    申請中
                </Button>
                <Button onClick={() => points.refetch()}>
                    更新
                </Button>
                {points.isLoading &&
                    <Box>
                        <CircularProgress />
                    </Box>
                }
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>日付</TableCell>
                                <TableCell>ポイント</TableCell>
                                <TableCell>ステータス</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {points.data?.map(p =>
                                <TableRow key={p.pointId}>
                                    <TableCell>
                                        <DateView
                                            date={p.updateAt}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {p.point}
                                    </TableCell>
                                    <TableCell>
                                        <StatusView
                                            status={p.status}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <IconButton
                                            disabled={p.status === "auto" || p.status === "granted"}
                                            onClick={() => handleGrant(p.pointId)}
                                        >
                                            <ThumbUp />
                                        </IconButton>
                                        <IconButton
                                            disabled={p.status === "auto" || p.status === "rejected"}
                                            onClick={() => handleReject(p.pointId)}
                                        >
                                            <ThumbDown />
                                        </IconButton>
                                        <IconButton onClick={() => handleCopyPointLink(p.pointId)}>
                                            <ContentCopy />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            )}
                            {points.data && points.data.length === 0 &&
                                <TableRow>
                                    <TableCell colSpan={4}>
                                        <Alert severity='warning'>
                                            1件もありませんでした。
                                        </Alert>
                                    </TableCell>
                                </TableRow>
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </LayoutContent>
        </BaseLayout>
    );
}
export default AdminPointListPage;
