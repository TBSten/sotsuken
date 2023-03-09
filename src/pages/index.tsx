import Center from '@/components/Center';
import H2 from '@/components/H2';
import SquareButton from '@/components/SquareButton';
import BaseLayout from '@/components/layout/BaseLayout';
import LayoutContent from '@/components/layout/LayoutContent';
import { ReversedSotsukenThemeProvider, SotsukenThemeProvider } from '@/styles/theme';
import { Box, Button, CircularProgress, Grid, Stack } from '@mui/material';
import { NextPage } from 'next';
import { Session } from 'next-auth';
import { signOut, useSession } from 'next-auth/react';
import Image from "next/image";
import { useRouter } from 'next/router';
import { FC } from 'react';

interface Props {
}
const Top: NextPage<Props> = ({ }) => {
  const router = useRouter()
  const { data } = useSession({
    required: true,
    onUnauthenticated: () => {
      router.push(`/login`)
    },
  })
  if (!data) return (
    <CircularProgress />
  )

  return (
    <BaseLayout containView>
      <LayoutContent fill>
        <Grid container spacing={2} width="100%" height="100%">
          <Grid item xs={12} md="auto" height="100%" overflow="auto">
            <Center py={2}>
              <UserSummary user={data.user} />
              {/* TODO show point */}
              <Button onClick={() => signOut()} fullWidth>
                ログアウト
              </Button>
            </Center>
          </Grid>
          <Grid item xs={12} md height="100%" overflow="auto">
            <MainMenus />
          </Grid>
        </Grid>
      </LayoutContent>
    </BaseLayout>
  );
}
export default Top;

interface UserSummaryProps {
  user: Session["user"]
  // editable?:boolean
  // onChangeImage?: (src:string)=>void
}
const UserSummary: FC<UserSummaryProps> = ({
  user,
}) => {
  return (
    <Box width={200}>
      <Image
        src={user?.image ?? "/favicon.ico"}
        alt={user?.name ?? "無名のアイコン"}
        width={200}
        height={200}
        style={{ objectFit: "cover", borderRadius: "1rem" }}
      />
      <Center>
        {user?.name}
      </Center>
    </Box>
  );
}

interface MainMenusProps {
}
const MainMenus: FC<MainMenusProps> = () => {
  return (
    <Box>
      <StarsMenus />
      <PointMenus />
    </Box>
  );
}

interface StarsMenusProps {
}
const StarsMenus: FC<StarsMenusProps> = () => {
  return (
    <SotsukenThemeProvider>
      <Box pb={4}>
        <H2>
          星取表
        </H2>
        <Stack p={2} direction="row" width="100%" overflow="auto" columnGap={2}>
          <SquareButton href="/stars/edit">
            星取表の<br />編集
          </SquareButton>
          <SquareButton href="/stars/">
            星取表の<br />検索
          </SquareButton>
        </Stack>
      </Box>
    </SotsukenThemeProvider>
  );
}

interface PointMenusProps {
}
const PointMenus: FC<PointMenusProps> = () => {
  return (
    <ReversedSotsukenThemeProvider>
      <Box pb={4}>
        <H2>
          ポイント
        </H2>
        <Stack p={2} direction="row" width="100%" overflow="auto" columnGap={2}>
          <SquareButton href="/point/new">
            ポイント<br />
            申請
          </SquareButton>
          <SquareButton href="/point/edit">
            ポイント<br />
            履歴
          </SquareButton>
        </Stack>
      </Box>
    </ReversedSotsukenThemeProvider>
  );
}

