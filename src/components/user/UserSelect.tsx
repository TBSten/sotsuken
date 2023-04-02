import { trpc } from "@/trpc"
import { Chip, CircularProgress, ListItemAvatar, ListItemText, MenuItem, Select, Stack } from "@mui/material"
import { User } from "next-auth"
import Image from "next/image"
import { FC, useCallback, useState } from "react"

interface UserSelectProps {
    user: User | null
    onChange: (userId: User | null) => void
    label?: string
    error?: boolean
}
export const UserSelect: FC<UserSelectProps> = ({ user, onChange, label, error }) => {
    const users = trpc.user.list.useQuery()
    const handleChange = (userId: string) => {
        if (!users.data) return
        const user = users.data.filter(u => u.id === userId)[0]
        onChange(user ?? null)
    }
    if (!users.data) return <CircularProgress />
    return (
        <Select
            value={user?.id ?? null}
            onChange={(e) => handleChange(e.target.value as string)}
            error={error}
        >
            {users.data.map(user =>
                <MenuItem key={user.id} value={user.id}>
                    <Stack direction="row" alignItems="center">
                        <ListItemAvatar>
                            <Image
                                src={user.image ?? "/favicon.ico"}
                                alt={user.name ?? "無名"}
                                width={30}
                                height={30}
                            />
                        </ListItemAvatar>
                        <ListItemText>
                            {user.name}
                        </ListItemText>
                        {user.isAdmin &&
                            <Chip
                                variant='outlined'
                                color='primary'
                                label="管理者"
                                size='small'
                                sx={{ mx: 1 }}
                            />
                        }
                    </Stack>
                </MenuItem>
            )}
        </Select>
    );
}

export const useUserSelect = (userId: string | null) => {
    const [user, setUser] = useState<User | null>(null)
    trpc.user.get.useQuery(userId ?? "", {
        enabled: !!userId,
        onSuccess(user) {
            setUser(user)
        },
    })
    const onChange: UserSelectProps["onChange"] = useCallback((user) => {
        setUser(user)
    }, [])
    const props: UserSelectProps = {
        user, onChange,
    }
    return {
        user,
        setUser,
        props,
    } as const
}
