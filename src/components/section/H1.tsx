import { Box } from "@mui/material";
import { FC, ReactNode } from "react";
import { useHBoxProps } from "./H";

interface H1Props {
    children: ReactNode
    fill?: boolean
}
const H1: FC<H1Props> = ({ children, fill = true }) => {
    const hBoxProps = useHBoxProps(fill)
    return (
        <Box
            {...hBoxProps}
            sx={t => t.typography.h4}
            p={0.5}
        >
            {children}
        </Box>
    );
}

export default H1;