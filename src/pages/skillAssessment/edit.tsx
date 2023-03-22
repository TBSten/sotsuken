import Center from '@/components/Center';
import BaseLayout from '@/components/layout/BaseLayout';
import LayoutContent from '@/components/layout/LayoutContent';
import H1 from '@/components/section/H1';
import SkillAssessmentCard from "@/components/skillAssessment/SkillAssessmentCard";
import { getSkillAssessmentsByUserId } from '@/skillAssessment';
import { trpc } from '@/trpc';
import { Add } from '@mui/icons-material';
import { Box, Button, CircularProgress, Stack } from '@mui/material';
import { GetServerSideProps, NextPage } from 'next';
import { getServerSession } from 'next-auth';
import { FC, memo, useCallback, useState } from 'react';
import { SkillAssessment } from '../../skillAssessment/types';
import { authOptions } from '../api/auth/[...nextauth]';

interface Props {
    stars: SkillAssessment[]
}
const SkillAssessmentEditPage: NextPage<Props> = ({ stars: defaultSkillAssessment }) => {
    const {
        skillAssessments,
        add: addSkillAssessment,
        isAdding,
        update: updateSkillAssessment,
        isUpdating,
        delete: deleteSkillAssessment,
        isDeleting,
    } = useSkillAssessments(defaultSkillAssessment)

    return (
        <BaseLayout>
            <H1>星取表の編集</H1>
            <LayoutContent>
                <SkillAssessmentTable
                    skillAssessments={skillAssessments}
                    onAdd={addSkillAssessment}
                    isAdding={isAdding}
                    onSaveChange={updateSkillAssessment}
                    isSaving={isUpdating}
                    onDelete={deleteSkillAssessment}
                    isDeleting={isDeleting}
                    onMoveDown={() => { alert("not implement") }}
                    onMoveUp={() => { alert("not implement") }}
                />
            </LayoutContent>
        </BaseLayout>
    );
}
export default SkillAssessmentEditPage;

export function useSkillAssessments(init: SkillAssessment[]) {
    // const [skillAssessment, { set: setSkillAssessment, handleSave, hasChange }] = useSavable(init)
    const [skillAssessments, setSkillAssessments] = useState(init)

    const addSA = trpc.skillAssessment.add.useMutation()
    const updateSA = trpc.skillAssessment.update.useMutation()
    const deleteSA = trpc.skillAssessment.delete.useMutation()

    return {
        skillAssessments,
        setSkillAssessments,
        add: useCallback(async () => {
            const newSkillAssessment = await addSA.mutateAsync({})
            setSkillAssessments(p => {
                const newSkillAssessments = [...p]
                let idx = skillAssessments.findIndex(sa => sa.assessmentId === newSkillAssessment.assessmentId)
                idx = idx === -1 ? p.length : idx
                newSkillAssessments[idx] = newSkillAssessment
                return newSkillAssessments
            })
        }, [addSA, skillAssessments]),
        isAdding: addSA.isLoading,
        update: useCallback(async (assessmentId: string, skillAssessment: SkillAssessment) => {
            return await updateSA.mutateAsync({
                ...skillAssessment,
                assessmentId,
            })
        }, [updateSA]),
        isUpdating: updateSA.isLoading,
        delete: useCallback(async (assessmentId: string) => {
            await deleteSA.mutateAsync(assessmentId)
            setSkillAssessments(p => p.filter(sa => sa.assessmentId !== assessmentId))
        }, [deleteSA]),
        isDeleting: deleteSA.isLoading,
    } as const
}

interface SkillAssessmentTableProps {
    skillAssessments: SkillAssessment[]
    onSaveChange: (assessmentId: string, skillAssessment: SkillAssessment) => void
    isSaving: boolean
    onAdd: () => void
    isAdding: boolean
    onMoveUp: (assessmentId: string) => void
    onMoveDown: (assessmentId: string) => void
    onDelete: (assessmentId: string) => void
    isDeleting: boolean
}
const SkillAssessmentTable: FC<SkillAssessmentTableProps> = memo(function SkillAssessmentTable({
    skillAssessments,
    onSaveChange, isSaving,
    onAdd, isAdding,
    onMoveUp, onMoveDown,
    onDelete, isDeleting,
}) {

    const lastIndex = skillAssessments.length - 1

    const memoedOnSaveChange = useCallback(onSaveChange, [onSaveChange])
    const memoedOnMoveUp = useCallback(onMoveUp, [onMoveUp])
    const memoedOnMoveDown = useCallback(onMoveDown, [onMoveDown])
    const memoedOnDelete = useCallback(onDelete, [onDelete])
    return (
        <Stack width="100%" overflow="visible" position="relative">
            {skillAssessments.map((skillAssessment, i) => {
                return (
                    <MemoedSkillAssessmentCard
                        key={skillAssessment.assessmentId}
                        i={i}
                        lastIndex={lastIndex}
                        skillAssessment={skillAssessment}
                        onSaveChange={memoedOnSaveChange}
                        isSaving={isSaving}
                        onMoveUp={memoedOnMoveUp}
                        onMoveDown={memoedOnMoveDown}
                        onDelete={memoedOnDelete}
                        isDeleting={isDeleting}
                    />
                )
            })}
            <Center mt={1}>
                {isAdding &&
                    <CircularProgress sx={{ my: 1 }} />
                }
                <Button variant='outlined' startIcon={<Add />} onClick={onAdd} fullWidth disabled={isAdding}>
                    追加
                </Button>
            </Center>
            <Box width="100%" height="50vh" />
        </Stack>
    );
})

interface MemoedSkillAssessmentCardrops {
    skillAssessment: SkillAssessment
    i: number
    lastIndex: number
    onSaveChange: (assessmentId: string, skillAssessment: SkillAssessment) => void
    isSaving: boolean
    onMoveUp: (assessmentId: string) => void
    onMoveDown: (assessmentId: string) => void
    onDelete: (assessmentId: string) => void
    isDeleting: boolean
}
const MemoedSkillAssessmentCard: FC<MemoedSkillAssessmentCardrops> = ({
    skillAssessment, i, lastIndex,
    onSaveChange, isSaving,
    onMoveDown, onMoveUp,
    onDelete, isDeleting,
}) => {
    const handleSaveChange = useCallback(
        (skillAssessment: SkillAssessment) => onSaveChange(skillAssessment.assessmentId, skillAssessment),
        [onSaveChange]
    )
    const handleMoveUp = useCallback(
        () => onMoveUp(skillAssessment.assessmentId),
        [skillAssessment.assessmentId, onMoveUp],
    )
    const handleMoveDown = useCallback(
        () => onMoveDown(skillAssessment.assessmentId),
        [skillAssessment.assessmentId, onMoveDown],
    )
    const handleDelete = useCallback(
        () => onDelete(skillAssessment.assessmentId),
        [skillAssessment.assessmentId, onDelete],
    )
    return (
        <SkillAssessmentCard
            key={i}
            no={i + 1}
            skillAssessment={skillAssessment}
            isFirst={i === 0}
            isLast={i === lastIndex}
            onSaveChange={handleSaveChange}
            isSaving={isSaving}
            onMoveUp={handleMoveUp}
            onMoveDown={handleMoveDown}
            onDelete={handleDelete}
            isDeleting={isDeleting}
        />
    )
}


export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
    const session = await getServerSession(ctx.req, ctx.res, authOptions)
    if (!session) {
        return {
            redirect: {
                destination: "/login",
                permanent: false,
            }
        }
    }
    const stars = await getSkillAssessmentsByUserId(session.user.userId)

    return {
        props: {
            stars,
        }
    }
}
