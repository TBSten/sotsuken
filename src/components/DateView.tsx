import dayjs from "dayjs";
import { FC } from "react";

interface DateViewProps {
    date: number | Date
}
const DateView: FC<DateViewProps> = ({ date }) => {
    const showDate = date instanceof Date ? date : new Date(date)
    const formated = dayjs(showDate).format("YY/MM/DD HH:mm")
    return (
        <>
            {formated}
        </>
    );
}

export default DateView;