import { Button, ButtonProps } from "@mui/material";
import { FC } from "react";

interface SquareButtonProps extends ButtonProps {
}
const SquareButton: FC<SquareButtonProps> = ({ variant = "outlined", sx, ...buttonProps }) => {
    return (
        <Button
            variant={variant}
            sx={{ aspectRatio: "1 / 1", fontWeight: "bold", textAlign: "center", ...sx }}
            {...buttonProps}
        ></Button>
    );
}

export default SquareButton;