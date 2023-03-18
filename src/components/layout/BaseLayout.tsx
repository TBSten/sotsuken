import { Box, BoxProps } from "@mui/material";
import { FC, ReactNode } from "react";
import BaseHeader from "./BaseHeader";

interface BaseLayoutProps {
    containView?: boolean
    children: ReactNode
    header?: ReactNode
}
const BaseLayout: FC<BaseLayoutProps> = ({
    containView = false,
    header = <BaseHeader />,
    children,
}) => {
    const boxProps: BoxProps = containView
        ? { height: "100%" }
        : { minHeight: "100%" }
    return (
        <Box width="100%" height="100%" {...boxProps} bgcolor={t => t.palette.grey[100]} overflow="auto">
            {header}
            {children}
        </Box>
    );
}

export default BaseLayout;