import { useCallback, useState } from "react"

export function useOpen(defaultOpen: boolean = false) {
    const [open, setOpen] = useState(defaultOpen)
    const show = useCallback(() => setOpen(true), [])
    const hide = useCallback(() => setOpen(false), [])
    const toggle = useCallback(() => setOpen(p => !p), [])
    return {
        open,
        show,
        hide,
        toggle,
        setOpen,
    } as const
}