import { AppBar, Toolbar, Typography } from "@mui/material";
import { FC, ReactNode } from "react";

interface BaseHeaderProps {
    title?: string
    action?: ReactNode
}
const BaseHeader: FC<BaseHeaderProps> = ({
    title = "卒業研究",
    action,
}) => {
    return (
        <AppBar position="sticky" color="inherit" elevation={1} sx={{ backdropFilter: "blur(6px)" }}>
            <Toolbar>
                <Typography variant="h6" component="h1" flexGrow={1}>
                    {title}
                </Typography>
                {action}
            </Toolbar>
        </AppBar>
    );
}

export default BaseHeader;