import { z } from "zod";

export const SkillAssessmentSchema = z.object({
    userId: z.string(),
    assessmentId: z.string(),
    skill: z.string(),
    assessment: z.number().min(0).max(1),
    comment: z.string(),
    interest: z.boolean(),
    createAt: z.number(),
    updateAt: z.number(),
})
export type SkillAssessment = z.infer<typeof SkillAssessmentSchema>

export const SkillAssessmentTemplateSchema = SkillAssessmentSchema.pick({
    skill: true,
    assessment: true,
    comment: true,
    interest: true,
})
export type SkillAssessmentTemplate = z.infer<typeof SkillAssessmentTemplateSchema>

export const SkillAssessmentSearchResultRecordSchema = z.object({
    userId: z.string(),
    starsNo: z.number(),
})
export type SkillAssessmentSearchResultRecord = z.infer<typeof SkillAssessmentSearchResultRecordSchema>
