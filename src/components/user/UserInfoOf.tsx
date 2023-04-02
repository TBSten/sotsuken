import { trpc } from "@/trpc";
import { CircularProgress } from "@mui/material";
import { User } from "next-auth";
import { FC, ReactNode } from "react";

interface UserInfoOfProps {
    userId: string
    render: (user: User) => ReactNode
}
const UserInfoOf: FC<UserInfoOfProps> = ({ userId, render }) => {
    const user = trpc.user.get.useQuery(userId).data
    if (!user) {
        return <CircularProgress size="1.5em" />
    }
    return <>
        {render(user)}
    </>
}

export default UserInfoOf;
