import { ThemeOptions, ThemeProvider, createTheme } from "@mui/material";
import { FC, ReactNode } from "react";

const defaultTheme = createTheme({})
export const primaryTheme = createTheme(defaultTheme, {
    palette: {
        primary: {
            dark: "#7137EEf0",
            main: "#875BE7f0",
            light: "#9671e6f0",
        },
        secondary: {
            dark: "#2E7849f0",
            main: "#62A87Cf0",
            light: "#a7dab9f0",
        },
        background: {
            paper: "#f4f0f6f0",
        }
    },
    shape: {
        borderRadius: 16,
    },
} as ThemeOptions)

export const secondaryTheme = createTheme(primaryTheme, {
    palette: {
        primary: primaryTheme.palette.secondary,
        secondary: primaryTheme.palette.primary,
    },
} as ThemeOptions)

interface SotsukenThemeProviderProps {
    children: ReactNode
}
export const PrimaryThemeProvider: FC<SotsukenThemeProviderProps> = ({ children }) => {
    return (
        <ThemeProvider theme={primaryTheme}>
            {children}
        </ThemeProvider>
    );
}

export const SecondaryThemeProvider: FC<SotsukenThemeProviderProps> = ({ children }) => {
    return (
        <ThemeProvider theme={secondaryTheme}>
            {children}
        </ThemeProvider>
    );
}


