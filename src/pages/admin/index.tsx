import { getUser } from '@/auth/users';
import SquareButton from '@/components/SquareButton';
import BaseLayout from '@/components/layout/BaseLayout';
import LayoutContent from '@/components/layout/LayoutContent';
import H1 from '@/components/section/H1';
import { Stack } from '@mui/material';
import { GetServerSideProps, NextPage } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]';

interface Props {
}
const AdminTop: NextPage<Props> = ({ }) => {
    return (
        <BaseLayout>
            <H1>
                管理者用ページ
            </H1>
            <LayoutContent>
                <Stack direction="row" width="100%" overflow="auto" alignItems="flex-start" spacing={2}>
                    <SquareButton color="inherit" href="/admin/members">
                        メンバ一覧
                    </SquareButton>
                    <SquareButton color="primary" href="/admin/skillAssessment/templates">
                        星取表の<br />
                        デフォルトスキル<br />
                        編集
                    </SquareButton>
                    <SquareButton color="secondary" href="/admin/point">
                        ポイント一覧
                    </SquareButton>
                    <SquareButton color="secondary" href="/admin/point/new">
                        ポイント管理
                    </SquareButton>
                </Stack>
            </LayoutContent>
        </BaseLayout>
    );
}
export default AdminTop;

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
