import { alpha, useTheme } from "@mui/material"
import { BoxProps } from "@mui/system"

export const useHBoxProps = (fill: boolean): BoxProps => {
    const theme = useTheme()
    const transparent = alpha("#000", 0)
    return fill
        ? {
            bgcolor: alpha(theme.palette.primary.main, 0.8),
            color: theme.palette.primary.contrastText,
            borderBottom: "none",
        }
        : {
            bgcolor: transparent,
            color: theme.palette.getContrastText(theme.palette.background.default),
            borderBottom: `solid 1px ${theme.palette.primary.dark}`,
        }
}