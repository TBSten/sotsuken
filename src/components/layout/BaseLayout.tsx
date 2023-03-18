import { Box, BoxProps } from "@mui/material";
import { FC, ReactNode } from "react";
import BaseHeader from "./BaseHeader";
import BaseMenu, { useTopMenu } from "./BaseMenu";

interface BaseLayoutProps {
    containView?: boolean
    children: ReactNode
    header?: ReactNode
}
const BaseLayout: FC<BaseLayoutProps> = ({
    containView = false,
    children,
}) => {
    const topMenu = useTopMenu()
    const boxProps: BoxProps = containView
        ? { height: "100%" }
        : { minHeight: "100%" }
    return (
        <Box width="100%" height="100%" {...boxProps} bgcolor={t => t.palette.grey[100]} overflow="auto">
            <BaseMenu />
            <BaseHeader />
            {children}
        </Box>
    );
}

export default BaseLayout;
