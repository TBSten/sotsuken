import { SkillAssessment } from "@/skillAssessment/types"
import { useMenu } from "@/util/hooks/useMenu"
import { useOpen } from "@/util/hooks/useOpen"
import { useSavable } from "@/util/hooks/useSavable"
import { summaryString } from "@/util/summaryString"
import { Delete, ExpandMore, MoreVert } from "@mui/icons-material"
import { Accordion, AccordionActions, AccordionDetails, AccordionSummary, Alert, Box, Button, CircularProgress, Grid, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Stack, TextField } from "@mui/material"
import { FC, memo } from "react"
import AssessmentSlider, { getAssessmentLabel } from "./AssessmentSlider"
import InterestSwitch from "./InterestSwitch"

export interface SkillAssessmentCardProps {
    no: number
    skillAssessment: SkillAssessment
    onSaveChange: (skillAssessment: SkillAssessment) => void
    isSaving: boolean
    onMoveUp: () => void
    onMoveDown: () => void
    isFirst: boolean
    isLast: boolean
    onDelete: () => void
    isDeleting: boolean
}
const SkillAssessmentCard: FC<SkillAssessmentCardProps> = ({
    no, skillAssessment: defaultSkillAssessment,
    onSaveChange, isSaving,
    onMoveUp, onMoveDown,
    isFirst, isLast,
    onDelete, isDeleting,
}) => {

    const [skillAssessment, { set: onChangeSkillAssessment, hasChange, onSave }] = useSavable(defaultSkillAssessment)

    const menu = useMenu()
    const accordion = useOpen(false)
    const handleSaveChange = () => {
        onSaveChange(skillAssessment)
        onSave()
    }
    const handleToggle = (() => {
        accordion.toggle()
    })

    const skill = skillAssessment.skill.match(/^\s*$/) ? "(無題)" : skillAssessment.skill

    return (
        <Accordion
            expanded={accordion.open}
            onChange={handleToggle}
            sx={t => ({
                // my: 1,
                border: "solid 2px",
                borderColor:
                    hasChange
                        ? t.palette.warning.main
                        : accordion.open
                            ? t.palette.primary.dark
                            : "#0000"
            })}
            id={`skill-${no}`}
        >
            <AccordionSummary
                expandIcon={<ExpandMore />}
            >
                <Box color={t => t.palette.primary.main}>
                    #{no}
                    {" "}
                    {/* <Fade in={!accordion.open}> */}
                    <Box component="span">
                        {/* {!accordion.open && <> */}
                        {summaryString(skill, 15)}
                        {" "}
                        {getAssessmentLabel(skillAssessment.assessment)}
                        {" "}
                        {summaryString(skillAssessment.comment)}
                        {/* </>} */}
                    </Box>
                    {/* </Fade> */}
                </Box>
            </AccordionSummary>
            <AccordionDetails>
                <Grid container justifyContent="space-between" alignItems="center" spacing={1}>
                    <Grid item xs={12} md={12}>
                        <TextField
                            variant='standard'
                            label="スキル"
                            value={skillAssessment.skill}
                            onChange={e => onChangeSkillAssessment(p => ({ ...p, skill: e.target.value }))}
                            fullWidth
                            inputProps={{ style: { fontWeight: "bold" } }}
                            placeholder='例) Java, Spring Boot, Git'
                        />
                    </Grid>
                    <Grid item xs={12} md={10}>
                        <Box px={{ xs: 2.5, md: 6 }} py={2} border={t => `solid 1px ${t.palette.primary.main}`} borderRadius={1}>
                            <AssessmentSlider
                                assessment={skillAssessment.assessment}
                                onChange={(assessment) => onChangeSkillAssessment(p => ({ ...p, assessment }))}
                            />
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={2}>
                        <InterestSwitch
                            interest={skillAssessment.interest}
                            onChange={interest => onChangeSkillAssessment(p => ({ ...p, interest }))}
                        />
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <Box px={{ xs: 2, md: 4 }}>
                            <TextField
                                label="コメント(任意)"
                                value={skillAssessment.comment}
                                onChange={e => onChangeSkillAssessment(p => ({ ...p, comment: e.target.value }))}
                                variant='filled'
                                multiline maxRows={3}
                                fullWidth
                            />
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        {hasChange &&
                            <Alert severity="warning" sx={{ mb: 2 }}>
                                保存していない変更があります！
                            </Alert>
                        }
                    </Grid>
                </Grid>
            </AccordionDetails>
            <Actions
                {...{
                    isFirst, isLast,
                    menu,
                    onDelete, isDeleting,
                    onMoveDown, onMoveUp,
                    hasChange, onSave: handleSaveChange, isSaving,
                }}
            />
        </Accordion>
    );
}

interface ActionsProps {
    onMoveUp: () => void
    onMoveDown: () => void
    isFirst: boolean
    isLast: boolean
    onDelete: () => void
    isDeleting: boolean
    menu: ReturnType<typeof useMenu<HTMLButtonElement>>
    hasChange: boolean
    onSave: () => void
    isSaving: boolean
}
const Actions: FC<ActionsProps> = ({
    onMoveUp, onMoveDown,
    isFirst, isLast,
    onDelete, isDeleting,
    menu,
    hasChange, onSave, isSaving,
}) => {
    return (
        <>
            <AccordionActions>
                <Stack direction="row" justifyContent="space-between" width="100%">
                    <Box>
                        {/* <Tooltip title="上へ移動">
                            <IconButton onClick={onMoveUp} disabled={isFirst}>
                                <ArrowUpward />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="下へ移動">
                            <IconButton onClick={onMoveDown} disabled={isLast}>
                                <ArrowDownward />
                            </IconButton>
                        </Tooltip> */}
                    </Box>
                    <IconButton onClick={menu.show} ref={menu.btnRef}>
                        <MoreVert />
                    </IconButton>
                    <Menu {...menu.menuProps}>
                        <MenuItem onClick={menu.withHide(onDelete)}>
                            <ListItemIcon>
                                <Delete />
                            </ListItemIcon>
                            <ListItemText>
                                削除
                            </ListItemText>
                        </MenuItem>
                    </Menu>
                </Stack>
            </AccordionActions>
            <AccordionActions>
                <Stack direction={{ xs: "column", sm: "row" }} justifyContent="flex-end" alignItems="center">
                    <Button variant={hasChange ? "contained" : "text"} size="large" disabled={isSaving || !hasChange} onClick={onSave}>
                        {isSaving
                            ? "保存中"
                            : hasChange
                                ? "変更を保存する"
                                : "変更はありません"
                        }
                    </Button>
                    {(isSaving || isDeleting) &&
                        <CircularProgress />
                    }
                </Stack>
            </AccordionActions>
        </>
    );
}

export default memo(SkillAssessmentCard)

