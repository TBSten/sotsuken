import { getUser } from '@/auth/users';
import BaseLayout from '@/components/layout/BaseLayout';
import LayoutContent from '@/components/layout/LayoutContent';
import H1 from '@/components/section/H1';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { Point } from '@/point/type';
import { trpc } from '@/trpc';
import { useSnackbar } from '@/util/hooks/useSnackbar';
import { Box, Button, Chip, CircularProgress, ListItemAvatar, ListItemText, MenuItem, Select, Snackbar, Stack, TextField } from '@mui/material';
import { GetServerSideProps, NextPage } from 'next';
import { User, getServerSession } from 'next-auth';
import Image from 'next/image';
import { FC, useState } from 'react';


const defaultPoint: Partial<Point> = {
    point: 0,
    description: "",
}
interface Props {
}
const AdminNewPoint: NextPage<Props> = ({ }) => {
    const [user, setUser] = useState<User | null>(null)
    const addPoint = trpc.point.add.useMutation()
    // const [point, setPoint] = useState(0)
    // const [description, setDescription] = useState("")
    const [point, setPoint] = useState<Partial<Point>>(defaultPoint)
    const snackbar = useSnackbar()
    const handleAddPoint = async () => {
        const userId = user?.id
        if (!userId) {
            snackbar.show("対象メンバを選択してください")
            return
        }
        if (!point.point) {
            snackbar.show("ポイントの値が不正です")
            return
        }
        if (!userId || !point) throw new Error("invalid user")
        const newPoint = await addPoint.mutateAsync({
            userId,
            point: {
                ...point,
                status: point.point > 0 ? "auto" : "deducte",
            },
        })
        snackbar.show("ポイントを追加しました")
        setUser(null)
        setPoint(defaultPoint)
    }
    return (
        <BaseLayout>
            <H1>
                新規ポイント
            </H1>
            <LayoutContent>
                <Box p={1}>
                    <UserSelect
                        user={user}
                        onChange={user => setUser(user)}
                    />
                </Box>
                <Box p={1}>
                    <TextField
                        variant='filled'
                        label="追加ポイント"
                        type="number"
                        value={point.point}
                        onChange={e => setPoint(p => ({ ...p, point: parseFloat(e.target.value) }))}
                    />
                </Box>
                <Box p={1}>
                    <TextField
                        variant='outlined'
                        label="追加理由"
                        fullWidth
                        multiline minRows={2}
                        value={point.description}
                        onChange={e => setPoint(p => ({ ...p, description: e.target.value }))}
                    />
                </Box>
                <Stack direction="row" justifyContent="flex-end" p={2}>
                    <Button variant='contained' onClick={handleAddPoint} disabled={addPoint.isLoading}>
                        送信
                    </Button>
                    {addPoint.isLoading &&
                        <CircularProgress />
                    }
                </Stack>
            </LayoutContent>
            <Snackbar {...snackbar.snackbarProps} />
        </BaseLayout>
    );
}
export default AdminNewPoint;


interface UserSelectProps {
    user: User | null
    onChange: (userId: User | null) => void
    label?: string
}
const UserSelect: FC<UserSelectProps> = ({ user, onChange, label }) => {
    const users = trpc.user.list.useQuery()
    const handleChange = (userId: string) => {
        if (!users.data) return
        const user = users.data.filter(u => u.id === userId)[0]
        onChange(user ?? null)
    }
    if (!users.data) return <CircularProgress />
    return (
        <Select
            value={user?.id ?? null}
            onChange={(e) => handleChange(e.target.value as string)}
        >
            {users.data.map(user =>
                <MenuItem key={user.id} value={user.id}>
                    <Stack direction="row" alignItems="center">
                        <ListItemAvatar>
                            <Image
                                src={user.image ?? "/favicon.ico"}
                                alt={user.name ?? "無名"}
                                width={30}
                                height={30}
                            />
                        </ListItemAvatar>
                        <ListItemText>
                            {user.name}
                        </ListItemText>
                        {user.isAdmin &&
                            <Chip
                                variant='outlined'
                                color='primary'
                                label="管理者"
                                size='small'
                                sx={{ mx: 1 }}
                            />
                        }
                    </Stack>
                </MenuItem>
            )}
        </Select>
    );
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
    const session = await getServerSession(ctx.req, ctx.res, authOptions)
    const sessionUserId = session?.user.userId
    if (!sessionUserId) return { notFound: true }
    const user = await getUser(sessionUserId)
    if (!user?.isAdmin) return { notFound: true }
    return {
        props: {}
    }
}

