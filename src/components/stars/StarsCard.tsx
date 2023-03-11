import { Stars } from "@/pages/stars/types"
import { useMenu } from "@/util/hooks/useMenu"
import { useOpen } from "@/util/hooks/useOpen"
import { summaryString } from "@/util/summaryString"
import { ArrowDownward, ArrowUpward, Delete, ExpandMore, MoreVert } from "@mui/icons-material"
import { Accordion, AccordionActions, AccordionDetails, AccordionSummary, Box, Fade, Grid, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Stack, TextField, Tooltip, useTheme } from "@mui/material"
import { FC, memo } from "react"
import AssessmentSlider, { getAssessmentLabel } from "./AssessmentSlider"
import InterestSwitch from "./InterestSwitch"

export interface StarsCardProps {
    no: number
    stars: Stars
    onChange: (updater: (p: Stars) => Stars) => void
    onMoveUp: () => void
    onMoveDown: () => void
    isFirst: boolean
    isLast: boolean
    onDelete: () => void
}
const StarsCard: FC<StarsCardProps> = ({
    no, stars, onChange,
    onMoveUp, onMoveDown,
    isFirst, isLast,
    onDelete,
}) => {

    const menu = useMenu()
    const accordion = useOpen(false)
    const handleToggle = () => {
        if (!accordion.open) {
            setTimeout(() => {
                location.hash = `skill-${no}`
            }, 100)
        }
        accordion.toggle()
    }

    const skill = stars.skill.match(/^\s*$/) ? "(無題)" : stars.skill
    const theme = useTheme()

    return (
        <Accordion
            expanded={accordion.open}
            onChange={handleToggle}
            sx={{ my: 1, }}
            id={`skill-${no}`}
        >
            <AccordionSummary
                expandIcon={<ExpandMore />}
            >
                <Box color={t => t.palette.primary.main}>
                    #{no}
                    {" "}
                    <Fade in={!accordion.open}>
                        <Box component="span">
                            {!accordion.open && <>
                                {summaryString(skill, 15)}
                                {" "}
                                {getAssessmentLabel(stars.assessment)}
                                {" "}
                                {summaryString(stars.comment)}
                            </>}
                        </Box>
                    </Fade>
                </Box>
            </AccordionSummary>
            <AccordionDetails>
                <Grid container justifyContent="space-between" alignItems="center" spacing={1}>
                    <Grid item xs={12} md={12}>
                        <TextField
                            variant='standard'
                            label="スキル"
                            value={stars.skill}
                            onChange={e => onChange(p => ({ ...p, skill: e.target.value }))}
                            fullWidth
                            inputProps={{ style: { fontWeight: "bold" } }}
                            placeholder='例) Java, Spring Boot, Git'
                        />
                    </Grid>
                    <Grid item xs={12} md={10}>
                        <Box px={{ xs: 2.5, md: 6 }} py={2} border={t => `solid 1px ${t.palette.primary.main}`} borderRadius={1}>
                            <AssessmentSlider
                                assessment={stars.assessment}
                                onChange={(assessment) => onChange(p => ({ ...p, assessment }))}
                            />
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={2}>
                        <InterestSwitch
                            interest={stars.interest}
                            onChange={interest => onChange(p => ({ ...p, interest }))}
                        />
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <Box px={{ xs: 2, md: 4 }}>
                            <TextField
                                label="コメント(任意)"
                                value={stars.comment}
                                onChange={e => onChange(p => ({ ...p, comment: e.target.value }))}
                                variant='filled'
                                multiline rows={3}
                                fullWidth
                            />
                        </Box>
                    </Grid>
                </Grid>
            </AccordionDetails>
            <Actions
                {...{
                    isFirst, isLast,
                    menu,
                    onDelete,
                    onMoveDown, onMoveUp
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
    menu: ReturnType<typeof useMenu<HTMLButtonElement>>
}
const Actions: FC<ActionsProps> = ({
    onMoveUp, onMoveDown,
    isFirst, isLast,
    onDelete,
    menu,
}) => {
    return (
        <AccordionActions>
            <Stack direction="row" justifyContent="space-between" width="100%">
                <Box>
                    <Tooltip title="上へ移動">
                        <IconButton onClick={onMoveUp} disabled={isFirst}>
                            <ArrowUpward />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="下へ移動">
                        <IconButton onClick={onMoveDown} disabled={isLast}>
                            <ArrowDownward />
                        </IconButton>
                    </Tooltip>
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
    );
}

export default memo(StarsCard)

