import Confirm, { useConfirm } from '@/components/Confirm';
import DateView from '@/components/DateView';
import Text from '@/components/Text';
import BaseLayout from '@/components/layout/BaseLayout';
import LayoutContent from '@/components/layout/LayoutContent';
import H1 from '@/components/section/H1';
import H2 from '@/components/section/H2';
import UserInfoOf from '@/components/user/UserInfoOf';
import { UserSelect, useUserSelect } from '@/components/user/UserSelect';
import { Thank } from '@/point/type';
import { SecondaryThemeProvider } from '@/styles/theme';
import { useResponsive } from '@/styles/useResponsive';
import { trpc } from '@/trpc';
import { useSnackbar } from '@/util/hooks/useSnackbar';
import { FiberNew } from '@mui/icons-material';
import { Alert, Box, Button, CircularProgress, Container, Divider, Snackbar, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

const minThanksPoint = 1
const maxThanksPoint = 100

interface Props {
}
const ThanksPointPage: NextPage<Props> = ({ }) => {
    const { data: session } = useSession()
    const snackbar = useSnackbar()
    const [editingThank, setEditingThank] = useState<Partial<Thank>>({
        point: 0,
        reason: "",
    })
    const { props: userSelectProps, user, setUser } = useUserSelect(editingThank.targetUserId ?? null)
    const [lastSent, setLastSent] = useState<Partial<Thank>>(editingThank)
    const hasChange = lastSent === editingThank
    const addThank = trpc.point.thanks.add.useMutation()
    const confirmDialog = useConfirm()
    const handleConfirm = () => {
        if (!user?.id) return snackbar.show("ポイントを送るメンバを選んでください")
        if (user?.id === session?.user.userId) return snackbar.show("自分自身にポイントを送ることはできません")
        if (editingThank.point && editingThank.point <= 0) return snackbar.show("送るポイントは1以上の必要があります")
        if (editingThank.reason && editingThank.reason.length < 10) return snackbar.show("理由・メッセージを10文字以上入力してください")
        confirmDialog.show()
    }
    const handleAdd = async () => {
        const targetUserId = editingThank
        if (!targetUserId) throw new Error(`not implement : targetUserId is invalid`)
        const newThank = {
            ...editingThank,
            targetUserId: user?.id,
        }
        await addThank.mutateAsync(newThank)
        thanks.refetch()
        thanksLimit.refetch()
        setLastSent(editingThank)
        setEditingThank({
            point: 0,
            reason: "",
            targetUserId: undefined,
        })
        setUser(null)
    }
    const thanks = trpc.point.thanks.getAll.useQuery(undefined, { staleTime: 60 * 60 * 1000 })
    const thanksLimit = trpc.point.thanks.getLimit.useQuery(undefined, { staleTime: 60 * 60 * 1000 })

    const { responsive } = useResponsive()
    return (
        <BaseLayout>
            <SecondaryThemeProvider>
                <H1>感謝ポイント</H1>
                <LayoutContent>
                    <Container>
                        <Stack direction="row" alignItems="center" py={1.5} spacing={1}>
                            {responsive(
                                <>
                                    <FiberNew />
                                    <UserSelect
                                        label="送るメンバ"
                                        {...userSelectProps}
                                        error={hasChange && !user}
                                    />
                                    <Box>
                                        に
                                    </Box>
                                    <TextField
                                        type='number'
                                        InputProps={{ inputProps: { min: 0, step: 10, max: (thanksLimit.data ?? maxThanksPoint) } }}
                                        value={editingThank.point}
                                        onChange={(e) => setEditingThank(p => ({ ...p, point: parseFloat(e.target.value) ?? 0 }))}
                                        error={hasChange && (
                                            !editingThank.point || !(minThanksPoint <= editingThank.point && editingThank.point <= maxThanksPoint)
                                        )}
                                    />
                                    <Box>
                                        ポイント 渡す
                                    </Box>
                                </>,
                                <Stack>
                                    <Stack py={1}>
                                        ユーザ
                                        <UserSelect
                                            {...userSelectProps}
                                        />
                                    </Stack>
                                    <Stack py={1}>
                                        送るポイント
                                        <TextField
                                            type='number'
                                            value={editingThank.point}
                                            onChange={(e) => {
                                                const newPoint = parseFloat(e.target.value)
                                                setEditingThank(p => ({ ...p, point: newPoint }))
                                            }}
                                            error={!!(editingThank.point && editingThank.point < minThanksPoint)}
                                        />
                                    </Stack>
                                </Stack>
                            )}
                        </Stack>
                        <TextField
                            label="理由・メッセージ(10字以上)"
                            value={editingThank.reason} onChange={e => setEditingThank(p => ({ ...p, reason: e.target.value }))}
                            multiline minRows={2}
                            fullWidth
                            error={!!(editingThank.reason && editingThank.reason.length < 10)}
                        />
                        <Stack direction="row" justifyContent="space-between" py={1.5}>
                            <Typography variant='caption'>
                                {thanksLimit &&
                                    <>
                                        今週はあと
                                        {thanksLimit.data}
                                        ポイント送れます
                                    </>
                                }
                            </Typography>
                            <Box>
                                {addThank.isLoading &&
                                    <CircularProgress />
                                }
                                <Button variant='contained' onClick={handleConfirm} disabled={addThank.isLoading}>
                                    送信
                                </Button>
                            </Box>
                        </Stack>
                        <Box>
                            {addThank.isSuccess &&
                                <Alert severity="success">
                                    {lastSent?.point &&
                                        lastSent.point
                                    }
                                    ポイントを
                                    {lastSent?.targetUserId &&
                                        <UserInfoOf
                                            userId={lastSent?.targetUserId}
                                            render={user => user.name}
                                        />
                                    }
                                    に送信しました
                                </Alert>
                            }
                        </Box>
                    </Container>
                </LayoutContent>

                <Divider />

                <LayoutContent>
                    <H2>
                        履歴
                    </H2>
                    <TableContainer sx={{ px: 1 }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ whiteSpace: "nowrap" }}>日付</TableCell>
                                    <TableCell sx={{ whiteSpace: "nowrap" }}>送信先メンバ名</TableCell>
                                    <TableCell sx={{ whiteSpace: "nowrap" }}>送ったポイント</TableCell>
                                    <TableCell sx={{ whiteSpace: "nowrap" }}>理由・メッセージ</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {thanks.data && [...thanks.data].reverse().map(t =>
                                    <TableRow key={t.thankId}>
                                        <TableCell>
                                            <DateView
                                                date={t.createAt}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <UserInfoOf
                                                userId={t.targetUserId}
                                                render={user => user.name}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {t.point}
                                        </TableCell>
                                        <TableCell>
                                            <Text>
                                                {t.reason}
                                            </Text>
                                        </TableCell>
                                    </TableRow>
                                )}
                                {thanks.data
                                    ? thanks.data.length === 0 &&
                                    <TableRow>
                                        <TableCell colSpan={4}>
                                            <Alert severity='warning'>
                                                感謝ポイントを送信したことがありません
                                            </Alert>
                                        </TableCell>
                                    </TableRow>
                                    : <CircularProgress />}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </LayoutContent>
                <Confirm {...confirmDialog.props} onOk={handleAdd}>
                    {user?.name}
                    {" "}
                    に
                    {editingThank.point}ポイント送りますか？
                </Confirm>
                <Snackbar {...snackbar.snackbarProps} />
            </SecondaryThemeProvider>
        </BaseLayout >
    );
}
export default ThanksPointPage;
