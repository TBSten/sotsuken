import Center from '@/components/Center';
import BaseLayout from '@/components/layout/BaseLayout';
import LayoutContent from '@/components/layout/LayoutContent';
import H1 from '@/components/section/H1';
import { Button } from '@mui/material';
import { NextPage } from 'next';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { FC, ReactNode } from 'react';

interface Props {
}
const Login: NextPage<Props> = ({ }) => {
    const router = useRouter()
    const query = router.query as Record<string, string>
    const error = query.error
    return (
        <BaseLayout>
            <H1>
                ログイン
            </H1>
            <LayoutContent>
                <LoginErrorView error={error} />
            </LayoutContent>
            <LayoutContent>
                <Center py={4}>
                    <Button variant='contained' onClick={() => signIn("slack", { callbackUrl: "/" })}>
                        Slackでログイン
                    </Button>
                </Center>
            </LayoutContent>
        </BaseLayout>
    );
}
export default Login;


const errorMessages: Record<string, ReactNode> = {
    OAuthSignin: "OAuth関連のエラーが発生しました。別のアカウントでログインし直してください。",
    OAuthCallback: "OAuth関連のエラーが発生しました。別のアカウントでログインし直してください。",
    OAuthCreateAccount: "OAuth関連のエラーが発生しました。別のアカウントでログインし直してください。",
    EmailCreateAccount: "予期しないエラーが発生しました。別のアカウントでログインし直してください。",
    Callback: "サーバサイドエラーが発生しました。別のアカウントでログインし直してください。",
    OAuthAccountNotLinked: "予期しないエラーが発生しました。別のアカウントでログインし直してください。",
    EmailSignin: "予期しないエラーが発生しました。別のアカウントでログインし直してください。",
    CredentialsSignin: "予期しないエラーが発生しました。別のアカウントでログインし直してください。",
    SessionRequired: "続行するにはログインしてください。",
    Default: "予期しないエラーが発生しました。別のアカウントでログインし直してください。",
}
interface LoginErrorViewProps {
    error: string | null
}
const LoginErrorView: FC<LoginErrorViewProps> = ({ error }) => {
    if (!error) return <></>
    return (
        <LayoutContent>
            {errorMessages[error] ?? errorMessages.Default}
        </LayoutContent>
    )
}

