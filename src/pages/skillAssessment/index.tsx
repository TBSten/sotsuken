
import BaseLayout from '@/components/layout/BaseLayout';
import LayoutContent from '@/components/layout/LayoutContent';
import H1 from '@/components/section/H1';
import Section from '@/components/section/Section';
import { SkillAssessment } from '@/skillAssessment/types';
import { trpc } from '@/trpc';
import { Alert, Box, CircularProgress, Divider, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { NextPage } from 'next';
import { FC } from 'react';

interface Props {
}
const SkillAssessmentListPage: NextPage<Props> = ({ }) => {
    const searchResult = trpc.skillAssessment.getAll.useQuery()

    return (
        <BaseLayout>
            <LayoutContent>
                <Section>
                    <H1>
                        星取表の一覧
                    </H1>
                </Section>
            </LayoutContent>
            <Divider />
            <LayoutContent>
                {searchResult.data
                    ? <>
                        <Table size='small' sx={{ width: "auto" }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: "bold" }}>
                                        スキル
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: "bold" }}>
                                        メンバ
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: "bold" }}>
                                        評価
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    searchResult.data.map(sa =>
                                        <AssessmentRow
                                            key={sa.assessmentId}
                                            skillAssessment={sa}
                                        />
                                    )
                                }
                            </TableBody>
                        </Table>
                        {searchResult.data.length === 0 &&
                            <Alert severity='warning'>
                                1件も見つかりませんでした
                            </Alert>
                        }
                    </>
                    : <Alert severity='warning'>
                        キーワードを入力してください
                    </Alert>
                }
            </LayoutContent>
        </BaseLayout>
    );
}
export default SkillAssessmentListPage;

interface AssessmentListItemProps {
    skillAssessment: SkillAssessment
}
const AssessmentRow: FC<AssessmentListItemProps> = ({
    skillAssessment: { assessment, skill, userId },
}) => {
    const user = trpc.user.get.useQuery(userId)

    return (
        <TableRow>
            <TableCell>
                {skill}
            </TableCell>
            <TableCell>
                {user.data
                    ? user.data.name
                    : <CircularProgress />
                }
            </TableCell>
            <TableCell>
                <Box component="span" fontSize="1.2em" fontWeight="bold">
                    {assessment * 100}
                </Box>
                /100
            </TableCell>
        </TableRow>
    );
}

