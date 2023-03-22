import { Box } from "@mui/material";
import { FC, ReactNode } from "react";
import { useHBoxProps } from "./H";

interface H2Props {
    children: ReactNode
    fill?: boolean
}
const H2: FC<H2Props> = ({ fill = true, children }) => {
    const hBoxProps = useHBoxProps(fill)
    return (
        <Box
            {...hBoxProps}
            sx={t => t.typography.h5}
            p={0.5}
        >
            {children}
        </Box>
    );
}

export default H2;