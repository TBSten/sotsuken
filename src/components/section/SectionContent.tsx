import { Box } from "@mui/material";
import { FC, ReactNode } from "react";

interface SectionContentProps {
    children: ReactNode
}
const SectionContent: FC<SectionContentProps> = ({ children }) => {
    return (
        <Box px={1} py={2}>
            {children}
        </Box>
    );
}

export default SectionContent;