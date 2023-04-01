import { useResponsive } from "@/styles/useResponsive";
import { trpc } from "@/trpc";
import { NavigateNext } from "@mui/icons-material";
import { Box, Drawer, List, ListItem, ListItemButton } from "@mui/material";
import { atom, useAtom } from "jotai";
import { useSession } from "next-auth/react";
import { FC, ReactNode, useCallback } from "react";

interface BaseMenuProps {
}
const BaseMenu: FC<BaseMenuProps> = ({
}) => {
    const topMenu = useTopMenu()
    const { responsive } = useResponsive()

    return (
        <Drawer
            anchor={responsive("left", "bottom")}
            open={topMenu.open} onClose={topMenu.hide}
        >
            <MenuList />
        </Drawer>
    )
}

export default BaseMenu;

interface MenuListProps {
}
const MenuList: FC<MenuListProps> = ({ }) => {
    const { isPc } = useResponsive()
    const { data: session } = useSession()
    const sessionUserId = session?.user.userId
    const sessionUser = trpc.user.get.useQuery(sessionUserId ?? "", {
        enabled: !!sessionUserId,
    })
    return (
        <List sx={{ maxHeight: "80vh" }}>
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
            {sessionUser.data?.isAdmin &&
                <>
                    <ListItem>
                        管理者
                    </ListItem>
                    <MenuButton href="/admin/members">
                        トップ
                    </MenuButton>
                    <MenuButton href="/admin/members">
                        メンバ一覧
                    </MenuButton>
                    <MenuButton href="/admin/skillAssessment/templates">
                        星取表の {isPc && <br />}
                        デフォルトスキル  {isPc && <br />}
                        編集  {isPc && <br />}
                    </MenuButton>
                    <MenuButton href="/admin/point">
                        ポイント一覧
                    </MenuButton>
                    <MenuButton href="/admin/point/new">
                        ポイント管理
                    </MenuButton>
                </>
            }
        </List>
    );
}

interface MenuItemProps {
    children: ReactNode
}
const MenuItem: FC<MenuItemProps> = ({ children }) => {
    return (
        <ListItem>
            {children}
        </ListItem>
    );
}
interface MenuButtonProps {
    children: ReactNode
    href: string
}
const MenuButton: FC<MenuButtonProps> = ({ children, href }) => {
    return (
        <ListItem disablePadding>
            <Box width="1em" />
            <ListItemButton href={href}>
                {children}
                <NavigateNext />
            </ListItemButton>
        </ListItem>
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
