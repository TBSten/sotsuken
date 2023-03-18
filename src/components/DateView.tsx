import { FC } from "react";

interface DateViewProps {
    date: number | Date
}
const DateView: FC<DateViewProps> = ({ date }) => {
    const showDate = date instanceof Date ? date : new Date(date)
    return (
        <>
            {showDate.getMonth() + 1}
            /
            {showDate.getDate()}
            {" "}
            {showDate.getHours()}
            :
            {showDate.getMinutes()}
        </>
    );
}

export default DateView;