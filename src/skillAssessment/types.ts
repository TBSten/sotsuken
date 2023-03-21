import { UserSchema } from "@/auth/types";
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
}).extend({
    templateId: z.string(),
    createAt: z.number(),
    updateAt: z.number(),
})
export type SkillAssessmentTemplate = z.infer<typeof SkillAssessmentTemplateSchema>

export const SkillAssessmentSearchInputSchema = z.object({
    user: z.string().nullable().transform(str => str?.match(/^\s*$/g) ? null : str), // id or name
    skill: z.string().nullable().transform(str => str?.match(/^\s*$/g) ? null : str), // skill name
    forceRefresh: z.boolean(),
})
export type SkillAssessmentSearchInput = z.infer<typeof SkillAssessmentSearchInputSchema>

export const SkillAssessmentSearchResultSchema = z.object({
    assessments: SkillAssessmentSchema.array(),
    users: z.record(UserSchema),
})
export type SkillAssessmentSearchResult = z.infer<typeof SkillAssessmentSearchResultSchema>

export const SkillSchema = z.object({
    skill: z.string(),
})
export type Skill = z.infer<typeof SkillSchema>
