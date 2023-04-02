import { getUser } from '@/auth/users';
import BaseLayout from '@/components/layout/BaseLayout';
import LayoutContent from '@/components/layout/LayoutContent';
import H1 from '@/components/section/H1';
import { UserSelect } from '@/components/user/UserSelect';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { Point } from '@/point/type';
import { trpc } from '@/trpc';
import { useSnackbar } from '@/util/hooks/useSnackbar';
import { Box, Button, CircularProgress, Snackbar, Stack, TextField } from '@mui/material';
import { GetServerSideProps, NextPage } from 'next';
import { User, getServerSession } from 'next-auth';
import { useState } from 'react';


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

