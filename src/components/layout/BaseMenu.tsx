import { useResponsive } from "@/styles/useResponsive";
import { NavigateNext } from "@mui/icons-material";
import { Box, Drawer, List, ListItem, ListItemButton } from "@mui/material";
import { atom, useAtom } from "jotai";
import { FC, useCallback } from "react";

interface BaseMenuProps {
}
const BaseMenu: FC<BaseMenuProps> = () => {
    const topMenu = useTopMenu()
    const { responsive } = useResponsive()

    return (
        <Drawer anchor={responsive("left", "bottom")} open={topMenu.open} onClose={topMenu.hide}>
            <MenuList />
        </Drawer>
    )
}

export default BaseMenu;

interface MenuListProps {
}
const MenuList: FC<MenuListProps> = () => {
    return (
        <List>
            <ListItem sx={{ fontSize: "2em" }}>
                卒業研究
                <Box width="2em" height="1em" />
            </ListItem>
            <ListItem disablePadding>
                <ListItemButton href="/">
                    トップ
                    <NavigateNext />
                </ListItemButton>
            </ListItem>
            <ListItem>
                星取表
            </ListItem>
            <ListItem disablePadding>
                <Box width="1em" />
                <ListItemButton href="/skillAssessment/edit">
                    編集
                    <NavigateNext />
                </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
                <Box width="1em" />
                <ListItemButton href="/skillAssessment">
                    一覧
                    <NavigateNext />
                </ListItemButton>
            </ListItem>
            <ListItem>
                ポイント
            </ListItem>
            <ListItem disablePadding>
                <Box width="1em" />
                <ListItemButton href="/point">
                    履歴
                    <NavigateNext />
                </ListItemButton>
            </ListItem>
        </List>
    );
}


const menuAtom = atom({
    open: false,
})
export function useTopMenu() {
    const [menu, setMenu] = useAtom(menuAtom)
    const show = useCallback(
        () => setMenu({ open: true }),
        [setMenu],
    )
    const hide = useCallback(
        () => setMenu({ open: false }),
        [setMenu],
    )
    const toggle = useCallback(
        () => setMenu(p => ({ ...p, open: !p.open })),
        [setMenu],
    )

    return {
        open: menu.open,
        show,
        hide,
        toggle,
    }
}
