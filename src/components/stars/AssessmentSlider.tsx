import Center from "@/components/Center";
import { useResponsive } from "@/styles/useResponsive";
import { Slider, Stack } from "@mui/material";
import { FC } from "react";

export const assessmentMarks: { value: number, label: string }[] = [
    { value: 0.00, label: "わからない" },
    { value: 0.25, label: "要フォロー" },
    { value: 0.50, label: "概ね理解した" },
    { value: 0.75, label: "一人でできる" },
    { value: 1.00, label: "人に教えられる" },
]

export const getAssessmentLabel = (assessment: number) => {
    const mark = assessmentMarks.find(mark => mark.value === assessment)
    if (!mark) return null
    return mark.label
}

interface AssessmentSliderProps {
    assessment: number
    onChange: (assessment: number) => void
}
const AssessmentSlider: FC<AssessmentSliderProps> = ({ assessment, onChange }) => {
    const { responsive } = useResponsive()
    return (
        <Stack>
            <Slider
                marks={responsive(assessmentMarks, false)}
                min={0} step={1 / (assessmentMarks.length - 1)} max={1}
                slotProps={{
                    markLabel: { style: { fontSize: "0.25rem" } },
                }}
                value={assessment}
                onChange={(e, assessment) => onChange(assessment as number)}
            />
            <Center>
                {assessmentMarks[assessmentMarks.findIndex(p => p.value === assessment)].label}
            </Center>
        </Stack>
    );
}

export default AssessmentSlider;