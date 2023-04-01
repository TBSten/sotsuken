import { Box, BoxProps } from "@mui/material";
import { FC, ReactNode } from "react";
import BaseHeader from "./BaseHeader";
import BaseMenu from "./BaseMenu";

interface BaseLayoutProps {
    containView?: boolean
    children: ReactNode
    header?: ReactNode
    isAdmin?: boolean
}
const BaseLayout: FC<BaseLayoutProps> = ({
    containView = false,
    children,
    isAdmin = false,
}) => {
    const boxProps: BoxProps = containView
        ? { height: "100%" }
        : { minHeight: "100%" }
    return (
        <Box width="100%" height="100%" {...boxProps} bgcolor={t => t.palette.grey[100]} overflow="auto">
            <BaseMenu />
            <BaseHeader isAdmin={isAdmin} />
            {children}
        </Box>
    );
}

export default BaseLayout;
