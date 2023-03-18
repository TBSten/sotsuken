import { Notification } from "@/notification/type";
import { trpc } from "@/trpc";
import { useMenu } from "@/util/hooks/useMenu";
import { NotificationsNone } from "@mui/icons-material";
import { Badge, BadgeProps, ListItem, Menu } from "@mui/material";
import { FC, ReactNode, useRef } from "react";
import Center from "../Center";

interface NotificationsProps {
    children?: ({ }: { hasNew: boolean }) => ReactNode
    badgeProps?: BadgeProps
}
const Notifications: FC<NotificationsProps> = ({
    children = defaultChildren,
    badgeProps,
}) => {
    const notifications = trpc.notifications.get.useQuery(undefined, { staleTime: 10 * 60 * 1000 })
    const hasNew = (
        notifications.data &&
        hasNewNotifications(notifications.data.lastReadAt, notifications.data.notifications)
    ) ?? false
    const anchor = useRef<HTMLDivElement>(null)
    const menu = useMenu()
    return (
        <>
            <Badge badgeContent={hasNew ? "" : 0} color="primary" overlap="circular" ref={anchor} {...badgeProps}>
                <Center onClick={menu.toggle}>
                    {children?.({ hasNew })}
                </Center>
            </Badge>
            {notifications.data &&
                <Menu anchorEl={anchor.current} {...menu.menuProps}>
                    {notifications.data.notifications.map(notification =>
                        <ListItem key={notification.notificationId}>
                            {notification.title}
                        </ListItem>
                    )}
                </Menu>
            }
        </>
    );
}

export default Notifications;

const defaultChildren: NotificationsProps["children"] = ({ }) =>
    <NotificationsNone />

const hasNewNotifications = (lastReadAt: number, notifications: Notification[]) => {
    return (
        notifications.length !== 0 &&
        notifications[0].createAt < lastReadAt
    )
}
