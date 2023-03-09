import { Box } from "@mui/material";
import { FC, ReactNode } from "react";
import { useHBoxProps } from "./H";

interface H3Props {
    children: ReactNode
    fill?: boolean
}
const H3: FC<H3Props> = ({ fill = true, children }) => {
    const hBoxProps = useHBoxProps(fill)
    return (
        <Box
            {...hBoxProps}
            sx={t => t.typography.h6}
            p={0.5}
        >
            {children}
        </Box>
    );
}

export default H3;