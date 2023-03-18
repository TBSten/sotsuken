import { useResponsive } from "@/styles/useResponsive";
import { useOpen } from "@/util/hooks/useOpen";
import { Button, ButtonProps, Dialog, DialogActions, DialogContent, DialogTitle, Drawer } from "@mui/material";
import { FC, ReactNode, useCallback } from "react";

interface ConfirmProps {
    open: boolean
    onClose: () => void
    onOk: () => void
    title?: ReactNode
    children?: ReactNode
    color?: ButtonProps["color"]
}
const Confirm: FC<ConfirmProps> = ({ open, onClose, onOk, title = "確認", children, color }) => {
    const { isPc } = useResponsive()
    const handleOk = useCallback(() => {
        onClose()
        onOk()
    }, [onClose, onOk])
    if (isPc) {
        return (
            <Dialog {...{ open, onClose }}>
                <DialogTitle>{title}</DialogTitle>
                <DialogContent>
                    {children}
                </DialogContent>
                <DialogActions>
                    <Button variant="text" onClick={onClose}>閉じる</Button>
                    <Button variant="contained" color={color} onClick={handleOk}>OK</Button>
                </DialogActions>
            </Dialog>
        )
    } else {
        return (
            <Drawer anchor="bottom" {...{ open, onClose }}>
                <DialogTitle>
                    {title}
                </DialogTitle>
                <DialogContent>
                    {children}
                </DialogContent>
                <DialogActions>
                    <Button variant="text" onClick={onClose}>閉じる</Button>
                    <Button variant="contained" color={color} onClick={handleOk}>OK</Button>
                </DialogActions>
            </Drawer>
        )
    }
}

export default Confirm;

export const useConfirm = () => {
    const confirmState = useOpen(false)
    const props = {
        open: confirmState.open,
        onClose: confirmState.hide,
    }
    return {
        ...confirmState,
        confirm: confirmState.show,
        props,
    }
}
