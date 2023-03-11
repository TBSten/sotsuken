import { MenuProps } from "@mui/material"
import { useCallback, useRef } from "react"
import { useOpen } from "./useOpen"

export const useMenu = <RefType extends HTMLElement = HTMLButtonElement,>() => {
    const { open, show, hide } = useOpen()
    const btnRef = useRef<RefType>(null)
    const menuProps: MenuProps = {
        open,
        onClose: hide,
        anchorEl: btnRef.current,
    }
    const withHide = useCallback(<A extends any[], R>(callback: (...a: A) => R) => (...a: A): R => {
        hide()
        return callback(...a)
    }, [hide])
    return {
        open,
        show,
        hide,
        btnRef,
        menuProps,
        withHide,
    } as const
}
