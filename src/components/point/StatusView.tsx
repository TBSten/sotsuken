import { Point, statusMap } from "@/point/type";
import { Box } from "@mui/material";
import { FC } from "react";
import Center from "../Center";

interface StatusViewProps {
    status: Point["status"]
}
const StatusView: FC<StatusViewProps> = ({ status }) => {
    const statusInfo = statusMap[status]
    const StatusIconComponent = statusInfo.icon
    return (
        <Center direction="row" justifyContent="flex-start">
            <StatusIconComponent color={statusInfo.color} />
            <Box component="span">
                {statusInfo.text} {" "}
            </Box>
        </Center>
    );
}

export default StatusView;