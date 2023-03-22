import { FC } from "react";

const newLine = <br />

interface TextProps {
    children: string
}
const Text: FC<TextProps> = ({ children }) => {
    const texts = children.split(/(\n)/).map(str => str === "\n" ? newLine : str)
    return (
        <>{texts}</>
    );
}

export default Text;
