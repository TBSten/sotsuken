import { Box, BoxProps } from "@mui/material";
import { FC, ReactNode } from "react";

interface BaseLayoutProps {
    containView?: boolean
    children: ReactNode
}
const BaseLayout: FC<BaseLayoutProps> = ({ containView = false, children }) => {
    const boxProps: BoxProps = containView
        ? { height: "100%" }
        : { minHeight: "100%" }
    return (
        <Box width="100%" {...boxProps} bgcolor={t => t.palette.grey[100]}>
            {children}
        </Box>
    );
}

export default BaseLayout;