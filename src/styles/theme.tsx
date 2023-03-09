import { ThemeOptions, ThemeProvider, createTheme } from "@mui/material";
import { FC, ReactNode } from "react";

const defaultTheme = createTheme({})
export const theme = createTheme(defaultTheme, {
    palette: {
        primary: {
            dark: "#7137EE",
            main: "#875BE7",
            light: "#9671e6",
        },
        secondary: {
            dark: "#2E7849",
            main: "#62A87C",
            light: "#a7dab9",
        },
    },
    shadows: [
        "none", "none", "none", "none", "none", "none", "none", "none", "none", "none",
        "none", "none", "none", "none", "none", "none", "none", "none", "none", "none",
        "none", "none", "none", "none", "none",
    ],
} as ThemeOptions)

export const reversedTheme = createTheme(theme, {
    palette: {
        primary: theme.palette.secondary,
        secondary: theme.palette.primary,
    },
} as ThemeOptions)

interface SotsukenThemeProviderProps {
    children: ReactNode
}
export const SotsukenThemeProvider: FC<SotsukenThemeProviderProps> = ({ children }) => {
    return (
        <ThemeProvider theme={theme}>
            {children}
        </ThemeProvider>
    );
}

export const ReversedSotsukenThemeProvider: FC<SotsukenThemeProviderProps> = ({ children }) => {
    return (
        <ThemeProvider theme={reversedTheme}>
            {children}
        </ThemeProvider>
    );
}


