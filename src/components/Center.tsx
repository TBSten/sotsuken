import { Stack, StackProps } from "@mui/material";
import { FC, ReactNode } from "react";

interface CenterProps extends StackProps {
    children: ReactNode
}
const Center: FC<CenterProps> = ({ children, ...stackProps }) => {
    return (
        <Stack direction="column" justifyContent="center" alignItems="center" textAlign="center" {...stackProps}>
            {children}
        </Stack>
    );
}

export default Center;