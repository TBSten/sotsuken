import { SnackbarProps } from "@mui/material";
import { useCallback, useState } from "react";

interface SnackbarState {
    msg: string
    open: boolean
}
export function useSnackbar() {
    const [snackbarState, setSnackbarState] = useState<SnackbarState>({
        msg: "",
        open: false,
    })
    const show = useCallback((msg: string) => {
        setSnackbarState({ msg, open: true })
    }, [])
    const hide = useCallback(() => {
        setSnackbarState(p => ({ ...p, open: false }))
    }, [])
    const snackbarProps: SnackbarProps = {
        open: snackbarState.open,
        onClose: hide,
        message: snackbarState.msg,
        autoHideDuration: 5000,
    }
    return {
        show, hide,
        ...snackbarState,
        snackbarProps,
    } as const
}