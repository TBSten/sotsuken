import Center from '@/components/Center';
import BaseLayout from '@/components/layout/BaseLayout';
import LayoutContent from '@/components/layout/LayoutContent';
import H1 from '@/components/section/H1';
import { SecondaryThemeProvider } from '@/styles/theme';
import { trpc } from '@/trpc';
import { Alert, Box, Button, Link, TextField } from '@mui/material';
import { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState } from 'react';

const aboutPointRule = "https://www.notion.so/tbsten/52dec0fd80de4594b92b21cc9f481766"

interface Props {
}
const PointRequestPage: NextPage<Props> = ({ }) => {
    const { data: session } = useSession()

    const [point, setPoint] = useState<number>(1)
    const addPoint = trpc.point.add.useMutation()

    const [description, setDescription] = useState<string>("")

    const router = useRouter()
    const onSend = async () => {
        const userId = session?.user.userId
        if (!userId) throw new Error("not implement userId is invalid")
        const newPoint = await addPoint.mutateAsync({
            point,
            description,
        })
        // const newComment = await addPointComment.mutateAsync({
        //     pointOwnerId: userId,
        //     pointId: newPoint.pointId,
        //     comment: description,
        // })
        router.push(`/point/?pointId=${newPoint.pointId}`)
    }
    return (
        <SecondaryThemeProvider>
            <BaseLayout>
                <H1>
                    ポイント 申請
                </H1>
                <LayoutContent>
                    <Alert severity='info'>
                        詳しい入力方法については
                        <Link href={aboutPointRule} target="_blank">
                            入力方法
                        </Link>
                        を参照。
                    </Alert>
                </LayoutContent>
                <LayoutContent>
                    <Box p={1}>
                        <TextField
                            label="申請ポイント"
                            type="number"
                            variant='filled'
                            value={point}
                            onChange={e => setPoint(parseFloat(e.target.value))}
                        />
                    </Box>
                    <Box p={1}>
                        <TextField
                            label="申請理由"
                            fullWidth
                            multiline minRows={2}
                            placeholder='例) 記事を書いた'
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                        />
                    </Box>
                    <Center>
                        <Button variant='contained' onClick={onSend} disabled={addPoint.isLoading || addPoint.isSuccess}>
                            申請する
                        </Button>
                    </Center>
                    {addPoint.isSuccess &&
                        <Alert severity='success'>
                            送信されました
                        </Alert>
                    }
                </LayoutContent>
            </BaseLayout>
        </SecondaryThemeProvider>
    );
}
export default PointRequestPage;
