import { FormControlLabel, Switch } from "@mui/material";
import { FC } from "react";
import Center from "../Center";

interface InterestSwitchProps {
    interest: boolean
    onChange: (interest: boolean) => void
}
const InterestSwitch: FC<InterestSwitchProps> = ({
    interest, onChange,
}) => {
    return (
        <Center flexDirection={{ xs: "row", md: "column" }} justifyContent={{ xs: "flex-end", md: "center" }}>
            興味
            <FormControlLabel
                control={
                    <Switch
                        checked={interest}
                        onChange={(_, interest) => onChange(interest)}
                    />
                }
                label={interest ? "あり" : "なし"}
                sx={{ px: 2 }}
            />
        </Center>
    );
}

export default InterestSwitch;