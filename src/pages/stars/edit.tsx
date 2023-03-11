import Center from '@/components/Center';
import BaseHeader from '@/components/layout/BaseHeader';
import BaseLayout from '@/components/layout/BaseLayout';
import LayoutContent from '@/components/layout/LayoutContent';
import H1 from '@/components/section/H1';
import Section from '@/components/section/Section';
import SectionContent from '@/components/section/SectionContent';
import StarsCard, { StarsCardProps } from "@/components/stars/StarsCard";
import { getStarsByUserId } from '@/stars';
import { trpc } from '@/trpc';
import { useSavable } from '@/util/hooks/useSavable';
import { useSnackbar } from '@/util/hooks/useSnackbar';
import { Add, Save } from '@mui/icons-material';
import { Box, Button, Fab, Snackbar, Stack } from '@mui/material';
import { GetServerSideProps, NextPage } from 'next';
import { getServerSession } from 'next-auth';
import { FC, memo, useCallback } from 'react';
import { authOptions } from '../api/auth/[...nextauth]';
import { Stars } from './types';

interface Props {
    stars: Stars[]
}
const StarsEditPage: NextPage<Props> = ({ stars: defaultStars }) => {
    // const [hash, setHash] = useHash()
    const [stars, { set: setStars, handleSave, hasChange }] = useSavable(defaultStars)
    const handleChangeStars = useCallback((i: number, updater: (p: Stars) => Stars) => {
        setStars(p => {
            const stars = [...p]
            stars[i] = updater(stars[i])
            return stars
        })
    }, [setStars])
    const handleAddStars = useCallback(() => {
        const newStars: Stars = {
            skill: "",
            comment: "",
            assessment: 0,
            interest: false,
            createAt: Date.now(),
            updateAt: Date.now(),
        }
        setStars(p => {
            setTimeout(() => {
                document.getElementById(`skill-${p.length + 1}`)?.scrollIntoView({ block: "center" })
            }, 100)
            return [...p, newStars]
        })
    }, [setStars])
    const handleMove = useCallback((startIdx: number, amount: number) => {
        const endIdx = startIdx + amount
        setStars(p => {
            if (endIdx < 0 || p.length <= endIdx) return p
            const stars = [...p]
            const amountPerLoop = amount >= 0 ? +1 : -1
            for (let i = startIdx; i !== endIdx; i += amountPerLoop) {
                const w = stars[i]
                stars[i] = stars[i + amountPerLoop]
                stars[i + amountPerLoop] = w
            }
            // setHash(`skill-${endIdx + 1}`)
            document.getElementById(`skill-${endIdx + 1}`)?.scrollIntoView({ block: "center" })
            return stars
        })
    }, [setStars])
    const handleMoveUp = useCallback((i: number) => handleMove(i, -1), [handleMove])
    const handleMoveDown = useCallback((i: number) => handleMove(i, +1), [handleMove])
    const handleDelete = useCallback((targetIndex: number) => {
        setStars(p => {
            return [...p].filter((_, i) => i !== targetIndex)
        })
    }, [setStars])

    const updateStars = trpc.stars.update.useMutation()
    const snackbar = useSnackbar()

    const handleSaveStars = handleSave(async () => {
        const res = await updateStars.mutateAsync(stars)
        // TODO snackbar
        snackbar.show("保存できました")
    })

    return (
        <BaseLayout header={
            <BaseHeader
                title="星取表の編集"
                action={
                    <Button variant='contained' onClick={handleSaveStars}>
                        保存
                    </Button>
                }
            />
        }>
            <LayoutContent>
                <Section>
                    <H1>星取表の編集</H1>
                    <SectionContent>
                        <StarsTable
                            stars={stars}
                            onChange={handleChangeStars}
                            onAdd={handleAddStars}
                            onMoveUp={handleMoveUp}
                            onMoveDown={handleMoveDown}
                            onDelete={handleDelete}
                        />
                    </SectionContent>
                </Section>
            </LayoutContent>
            <FixedActions
                onSave={handleSaveStars}
            />
            <Snackbar
                {...snackbar.snackbarProps}
            />
        </BaseLayout>
    );
}
export default StarsEditPage;

interface StarsTableProps {
    stars: Stars[]
    onChange: (i: number, updater: (p: Stars) => Stars) => void
    onAdd: () => void
    onMoveUp: (i: number) => void
    onMoveDown: (i: number) => void
    onDelete: (i: number) => void
}
const StarsTable: FC<StarsTableProps> = memo(function StarsTable({
    stars, onChange,
    onAdd,
    onMoveUp, onMoveDown,
    onDelete,
}) {

    const lastIndex = stars.length - 1

    const memoedOnChange = useCallback(onChange, [onChange])
    const memoedOnMoveUp = useCallback(onMoveUp, [onMoveUp])
    const memoedOnMoveDown = useCallback(onMoveDown, [onMoveDown])
    const memoedOnDelete = useCallback(onDelete, [onDelete])
    return (
        <Stack width="100%" overflow="visible" position="relative">
            {stars.map((stars, i) => {
                return (
                    <MemoedStarsCard
                        key={i}
                        i={i}
                        lastIndex={lastIndex}
                        stars={stars}
                        onChange={memoedOnChange}
                        onMoveUp={memoedOnMoveUp}
                        onMoveDown={memoedOnMoveDown}
                        onDelete={memoedOnDelete}
                    />
                )
            })}
            <Center>
                <Button variant='outlined' startIcon={<Add />} onClick={onAdd} fullWidth>
                    追加
                </Button>
            </Center>
            <Box width="100%" height="50vh" />
        </Stack>
    );
})

interface MemoedStarsCardrops {
    stars: Stars
    i: number
    lastIndex: number
    onChange: (i: number, updater: (p: Stars) => Stars) => void
    onMoveUp: (i: number) => void
    onMoveDown: (i: number) => void
    onDelete: (i: number) => void
}
const MemoedStarsCard: FC<MemoedStarsCardrops> = ({
    stars, i, onChange, lastIndex,
    onMoveDown, onMoveUp, onDelete,
}) => {
    const handleChange: StarsCardProps["onChange"] = useCallback(
        (updater) => onChange(i, p => updater(p)),
        [i, onChange],
    )
    const handleMoveUp = useCallback(
        () => onMoveUp(i),
        [i, onMoveUp],
    )
    const handleMoveDown = useCallback(
        () => onMoveDown(i),
        [i, onMoveDown],
    )
    const handleDelete = useCallback(
        () => onDelete(i),
        [i, onDelete],
    )
    return (
        <StarsCard
            key={i}
            no={i + 1}
            stars={stars}
            isFirst={i === 0}
            isLast={i === lastIndex}
            onChange={handleChange}
            onMoveUp={handleMoveUp}
            onMoveDown={handleMoveDown}
            onDelete={handleDelete}
        />
    )
}

interface FixedActionsProps {
    onSave: () => void
}
const FixedActions: FC<FixedActionsProps> = ({
    onSave,
}) => {
    return (
        <Box position="fixed" right={12} bottom={12} onClick={onSave}>
            <Fab color="primary" size='large'>
                <Save />
            </Fab>
        </Box>
    );
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
    const stars = await getStarsByUserId(session.user.userId)

    return {
        props: {
            stars,
        }
    }
}
