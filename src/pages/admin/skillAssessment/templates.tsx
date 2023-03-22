import BaseLayout from '@/components/layout/BaseLayout';
import LayoutContent from '@/components/layout/LayoutContent';
import H1 from '@/components/section/H1';
import { SkillAssessmentTemplate } from '@/skillAssessment/types';
import { trpc } from '@/trpc';
import { Add, Delete } from '@mui/icons-material';
import { Box, Button, Grid, IconButton, TextField } from '@mui/material';
import { NextPage } from 'next';
import { FC, useState } from 'react';

interface Props {
}
const AdminSkillAssessmentDefaultSkillsPage: NextPage<Props> = ({ }) => {
    const [templates, setTemplates] = useState<SkillAssessmentTemplate[]>([])
    trpc.skillAssessment.template.getAll.useQuery(undefined, {
        onSuccess(data) {
            setTemplates(data)
        },
    })

    const addTemplate = trpc.skillAssessment.template.add.useMutation()
    const handleAdd = async () => {
        const newTemplate = await addTemplate.mutateAsync({})
        setTemplates(p => [...p, newTemplate])
    }

    const updateTemplate = trpc.skillAssessment.template.update.useMutation()
    const handleUpdate = (templateId: string) => async (template: Partial<SkillAssessmentTemplate>) => {
        await updateTemplate.mutateAsync({ templateId, template })
    }

    const deleteTemplate = trpc.skillAssessment.template.delete.useMutation()
    const handleDelete = (templateId: string) => async () => {
        await deleteTemplate.mutateAsync(templateId)
    }

    return (
        <BaseLayout>
            <H1>
                星取表の
                デフォルトスキル 編集
            </H1>
            <LayoutContent>
                {templates.map((template, i) =>
                    <TemplateRow
                        key={template.templateId}
                        no={i + 1}
                        template={template}
                        onSave={handleUpdate(template.templateId)}
                        onDelete={handleDelete(template.templateId)}
                    />
                )}
                <Box px={2} py={2}>
                    <Button variant='outlined' startIcon={<Add />} fullWidth onClick={handleAdd} disabled={addTemplate.isLoading}>
                        追加
                    </Button>
                </Box>
            </LayoutContent>
        </BaseLayout>
    );
}
export default AdminSkillAssessmentDefaultSkillsPage;

interface TemplateRowProps {
    no: number
    template: SkillAssessmentTemplate
    onSave: (input: Partial<SkillAssessmentTemplate>) => void
    onDelete: () => void
}
const TemplateRow: FC<TemplateRowProps> = ({ no, template, onSave, onDelete }) => {
    const [skill, setSkill] = useState(template.skill)
    const [lastSavedSkill, setLastSavedSkill] = useState(template.skill)
    const hasChange = skill !== lastSavedSkill
    const handleSave = () => {
        onSave({ skill })
        setLastSavedSkill(skill)
    }
    return (
        <Grid container py={1} spacing={1} alignItems="center">
            <Grid item xs="auto" component="span">
                #{no}
            </Grid>
            <Grid item xs>
                <TextField
                    value={skill}
                    onChange={e => setSkill(e.target.value)}
                    fullWidth
                    placeholder='スキル名'
                />
            </Grid>

            <Grid item xs="auto">
                <Button variant='contained' onClick={handleSave} disabled={!hasChange}>
                    保存
                </Button>
            </Grid>
            <Grid item xs="auto">
                <IconButton onClick={onDelete}>
                    <Delete />
                </IconButton>
            </Grid>
        </Grid>
    );
}

