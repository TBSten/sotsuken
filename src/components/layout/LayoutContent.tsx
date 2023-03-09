import { Box, BoxProps } from "@mui/material";
import { FC, ReactNode } from "react";

interface LayoutContentProps {
    fill?: boolean
    children: ReactNode
}
const LayoutContent: FC<LayoutContentProps> = ({ fill = false, children }) => {
    const boxProps: BoxProps = fill
        ? { width: "100%", height: "100%" }
        : {}
    return (
        <Box p={{ sm: 1, md: 2 }} {...boxProps}>
            {children}
        </Box>
    );
}

export default LayoutContent;