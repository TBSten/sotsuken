import { Box } from "@mui/material";
import { FC, ReactNode } from "react";

interface SectionProps {
    children: ReactNode
}
const Section: FC<SectionProps> = ({ children }) => {
    return (
        <Box pb={4}>
            {children}
        </Box>
    );
}

export default Section;