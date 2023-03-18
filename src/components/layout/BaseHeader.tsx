import { Menu } from "@mui/icons-material";
import { AppBar, Box, CircularProgress, IconButton, Toolbar, Tooltip, Typography, useTheme } from "@mui/material";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { FC } from "react";
import Notifications from "../notification/Notifications";
import { useTopMenu } from "./BaseMenu";

interface BaseHeaderProps {
    title?: string
}
const BaseHeader: FC<BaseHeaderProps> = ({
    title = "卒業研究",
}) => {
    const topMenu = useTopMenu()
    const { data: session, status } = useSession()
    const theme = useTheme()
    return (
        <AppBar position="sticky" color="inherit" elevation={1} sx={{ backdropFilter: "blur(6px)" }}>
            <Toolbar>
                <IconButton color="inherit" size="large" edge="start" sx={{ mr: 1 }} onClick={topMenu.toggle}>
                    <Menu />
                </IconButton>
                <Typography variant="h6" component="h1" flexGrow={1}>
                    {title}
                </Typography>
                {status === "loading" &&
                    <CircularProgress />
                }
                {session &&
                    <Box>
                        <Tooltip title={`${session.user.name + "としてログイン中"}`}>
                            <Notifications>
                                {() =>
                                    <Image
                                        src={session.user.image ?? "/favicon.ico"}
                                        alt={session.user.name ?? "無名のユーザ"}
                                        width={40}
                                        height={40}
                                        style={{ borderRadius: "40px", boxShadow: theme.shadows[2] }}
                                    />
                                }
                            </Notifications>
                        </Tooltip>
                    </Box>
                }
            </Toolbar>
        </AppBar>
    );
}

export default BaseHeader;