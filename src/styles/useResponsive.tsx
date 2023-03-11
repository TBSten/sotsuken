import { useMediaQuery, useTheme } from "@mui/material";
import { useCallback } from "react";

export function useResponsive() {
    const theme = useTheme()
    const isPc = useMediaQuery(theme.breakpoints.up("md"))
    const responsive = useCallback(<Pc, Sp>(onPc: Pc, onSp: Sp) => isPc ? onPc : onSp, [isPc])
    return {
        isPc,
        isSp: !isPc,
        responsive,
    } as const
}
