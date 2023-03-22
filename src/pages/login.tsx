import BaseLayout from '@/components/layout/BaseLayout';
import { Button } from '@mui/material';
import { NextPage } from 'next';
import { signIn } from 'next-auth/react';

interface Props {
}
const Login: NextPage<Props> = ({ }) => {
    return (
        <BaseLayout>
            {/* <Button onClick={() => signIn("google", { callbackUrl: "/" })}>
                Googleでログイン
            </Button> */}
            <Button onClick={() => signIn("slack", { callbackUrl: "/" })}>
                Slackでログイン
            </Button>
        </BaseLayout>
    );
}
export default Login;
