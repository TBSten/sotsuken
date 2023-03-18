import Center from '@/components/Center';
import Confirm, { useConfirm } from '@/components/Confirm';
import DateView from '@/components/DateView';
import Text from '@/components/Text';
import BaseLayout from '@/components/layout/BaseLayout';
import LayoutContent from '@/components/layout/LayoutContent';
import StatusView from '@/components/point/StatusView';
import H1 from '@/components/section/H1';
import { Point } from '@/point/type';
import { SecondaryThemeProvider } from '@/styles/theme';
import { trpc } from '@/trpc';
import { useOpen } from '@/util/hooks/useOpen';
import { summaryString } from '@/util/summaryString';
import { Delete, KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { Box, Button, CircularProgress, Container, IconButton, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from '@mui/material';
import { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { FC, useEffect } from 'react';

const staleTime = 60 * 60 * 1000

interface Props {
}
const PointListPage: NextPage<Props> = ({ }) => {
    const { data: session } = useSession()
    const points = trpc.point.getAll.useQuery(undefined, { staleTime })

    const totalPoint = trpc.point.total.useQuery({ userId: session?.user.userId ?? "" }, { enabled: !!session, staleTime })

    const deletePoint = trpc.point.delete.useMutation()
    const handleDelete = async (point: Point) => {
        const userId = session?.user.userId
        if (!userId) throw new Error("not implement . userId is invalid " + userId)
        await deletePoint.mutateAsync({
            pointId: point.pointId,
            userId,
        })
        await points.refetch({ stale: false })
    }

    const router = useRouter()
    const selectedPointId = router.query.pointId as string | undefined
        ?? null
    return (
        <SecondaryThemeProvider>
            <BaseLayout>
                <H1>ポイント 履歴</H1>
                <LayoutContent>
                    <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems="center">
                        <Box fontSize={t => t.typography.h3.fontSize}>
                            合計
                            {" "}
                            <Box component="span" fontSize="1.2em" fontWeight="bold">
                                {totalPoint.data ?? "..."}
                            </Box>
                            {" "}
                            点
                        </Box>
                        <Button variant='contained' href="/point/new">
                            申請する
                        </Button>
                    </Stack>
                </LayoutContent>
                <LayoutContent>
                    {points.data ?
                        <PointTable
                            points={points.data}
                            selectedPointId={selectedPointId}
                            onDelete={handleDelete}
                        />
                        :
                        <Center>
                            <CircularProgress />
                        </Center>
                    }
                </LayoutContent>
            </BaseLayout>
        </SecondaryThemeProvider>
    );
}
export default PointListPage;

interface PointTableProps {
    points: Point[]
    onDelete: (point: Point) => void
    selectedPointId: string | null
}
const PointTable: FC<PointTableProps> = ({ points, onDelete, selectedPointId }) => {
    return (
        <Container>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ whiteSpace: "nowrap", fontWeight: "bold" }}>
                                申請日時
                            </TableCell>
                            <TableCell sx={{ whiteSpace: "nowrap", fontWeight: "bold" }}>
                                ポイント
                            </TableCell>
                            <TableCell sx={{ whiteSpace: "nowrap", fontWeight: "bold" }}>
                            </TableCell>
                            <TableCell sx={{ whiteSpace: "nowrap", fontWeight: "bold" }}>
                                申請状況
                            </TableCell>
                            <TableCell sx={{ whiteSpace: "nowrap", fontWeight: "bold" }}>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {points.map(point =>
                            <PointRow
                                key={point.pointId}
                                point={point}
                                onDelete={() => onDelete(point)}
                                selected={selectedPointId === point.pointId}
                            />
                        )}
                        {points.length === 0 &&
                            <>
                                <TableRow>
                                    <TableCell colSpan={5}>
                                        まだポイントを申請した履歴がありません
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell colSpan={5}>
                                        <Button variant='contained' href="/point/new" fullWidth>
                                            申請する
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            </>
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
}

interface PointRowProps {
    point: Point
    onDelete: () => void
    selected: boolean
}
const PointRow: FC<PointRowProps> = ({ point, onDelete, selected }) => {
    const confirmState = useConfirm()

    const { open, toggle, show } = useOpen()
    useEffect(() => {
        if (selected) show()
    }, [selected, show])
    return (
        <>
            <TableRow key={point.pointId} selected={selected} id={point.pointId}>
                <TableCell sx={{ minWidth: "fit-content", whiteSpace: "nowrap" }}>
                    <DateView date={point.createAt} />
                </TableCell>
                <TableCell>
                    {point.point}{" "}点
                </TableCell>
                <TableCell>
                    {summaryString(point.description, 80)}
                </TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>
                    {/* <Center direction="row" justifyContent="flex-start">
                        <StatusIconComponent color={status.color} />
                        <Box component="span">
                            {status.text} {" "}
                        </Box>
                    </Center> */}
                    <StatusView status={point.status} />
                </TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>
                    <IconButton onClick={toggle}>
                        {open
                            ? <KeyboardArrowUp />
                            : <KeyboardArrowDown />
                        }

                    </IconButton>
                    <Tooltip title="削除">
                        <IconButton
                            disabled={point.status !== "pending"}
                            onClick={confirmState.confirm}
                        >
                            <Delete />
                        </IconButton>
                    </Tooltip>
                </TableCell>
                <Confirm {...confirmState.props} onOk={onDelete} color="error">
                    削除してもいいですか？
                </Confirm>
            </TableRow>
            {open &&
                <TableRow selected={selected}>
                    <TableCell colSpan={5} sx={{ pl: { xs: 2, sm: 6 } }}>
                        <TableContainer>
                            <Table size="small">
                                <TableBody>
                                    <TableRow>
                                        <TableCell component="th" align='left' sx={{ verticalAlign: "top" }}>
                                            申請日時
                                        </TableCell>
                                        <TableCell>
                                            <DateView date={point.createAt} />
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                            ポイント
                                        </TableCell>
                                        <TableCell>
                                            {point.point}点
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>申請理由</TableCell>
                                        <TableCell>
                                            <Text>
                                                {point.description}
                                            </Text>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>申請状況</TableCell>
                                        <TableCell>
                                            <StatusView status={point.status} />
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </TableCell>
                </TableRow>
            }
        </>
    );
}

