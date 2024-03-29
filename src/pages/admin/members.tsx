import { getUser } from '@/auth/users';
import Center from '@/components/Center';
import BaseLayout from '@/components/layout/BaseLayout';
import H1 from '@/components/section/H1';
import { trpc } from '@/trpc';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { GetServerSideProps, NextPage } from 'next';
import { getServerSession } from 'next-auth';
import Image from 'next/image';
import { authOptions } from '../api/auth/[...nextauth]';

interface Props {
}
const AdminMembersPage: NextPage<Props> = ({ }) => {
    const members = trpc.user.list.useQuery()
    return (
        <BaseLayout>
            <H1>メンバ一覧</H1>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>メンバ</TableCell>
                            <TableCell>メンバ区分</TableCell>
                            <TableCell>SlackのメンバーId</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {members.data?.map(member =>
                            <TableRow key={member.id}>
                                <TableCell sx={{ verticalAlign: "middle" }}>
                                    <Center direction="row" justifyContent="flex-start">
                                        <Image
                                            src={member.image ?? "/favicon.ico"}
                                            alt={member.name ?? "無名"}
                                            width={30}
                                            height={30}
                                            style={{ marginRight: "1em" }}
                                        />
                                        {member.name}
                                    </Center>
                                </TableCell>
                                <TableCell>
                                    {member.isAdmin ? "管理者" : "一般メンバ"}
                                </TableCell>
                                <TableCell>
                                    {member.slackId}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </BaseLayout>
    );
}
export default AdminMembersPage;

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
