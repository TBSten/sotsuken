
import Center from '@/components/Center';
import BaseLayout from '@/components/layout/BaseLayout';
import LayoutContent from '@/components/layout/LayoutContent';
import H1 from '@/components/section/H1';
import Section from '@/components/section/Section';
import SectionContent from '@/components/section/SectionContent';
import { trpc } from '@/trpc';
import { Box, CircularProgress, TextField } from '@mui/material';
import { NextPage } from 'next';
import { useState } from 'react';

interface Props {
}
const SkillAssessmentListPage: NextPage<Props> = ({ }) => {
    const [searchKeywords, setSearchKeywords] = useState("")
    const searchResult = trpc.skillAssessment.search.useQuery(searchKeywords, {
        enabled: searchKeywords.length >= 1,
        staleTime: 3000, cacheTime: 5000,
    })

    console.log("keywords", searchKeywords)
    console.log("result", searchResult.data)

    return (
        <BaseLayout>
            <LayoutContent>
                <Section>
                    <H1>
                        星取表の検索
                    </H1>
                    <SectionContent>
                        <Box>
                            <TextField
                                value={searchKeywords}
                                onChange={e => setSearchKeywords(e.target.value)}
                                placeholder='スキル名やタグを入力'
                                fullWidth
                            />
                        </Box>
                        <Center>
                            <CircularProgress />
                        </Center>
                    </SectionContent>
                </Section>
            </LayoutContent>
        </BaseLayout>
    );
}
export default SkillAssessmentListPage;
