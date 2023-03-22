import { db } from "@/gcp/firestore"
import { SkillAssessmentTemplate } from "@/skillAssessment/types"
import { v4 as uuidv4 } from "uuid"
import { skillAssessmentTemplateConverter } from "./converter"

// const skillAssessmentTemplates = db.collection("settings").doc("skillAssessmentTemplates").collection("values")
const skillAssessmentTemplates = db.collection("skillAssessmentTemplates")
    .withConverter(skillAssessmentTemplateConverter)

export const getSkillAssessmentTemplate = async (skillAssessmentId: string): Promise<SkillAssessmentTemplate | null> => {
    const skillAssessmentSnap = await skillAssessmentTemplates.doc(skillAssessmentId).get()
    const skillAssessmentData = skillAssessmentSnap.data()
    if (!skillAssessmentData) return null
    return skillAssessmentData
}
export const getAllSkillAssessmentTemplateMulti = async () => {
    const skillAssessmentSnap = await skillAssessmentTemplates.orderBy("createAt", "asc").get()
    return skillAssessmentSnap.docs.map(doc => doc.data())
}

export const addSkillAssessmentTemplate = async (...inputs: Partial<SkillAssessmentTemplate>[]) => {
    const newSkillAssessments = await Promise.all(inputs.map(async (input, i) => {
        const templateId = uuidv4()
        const now = Date.now() + i
        const skillAssessmentTemplate: SkillAssessmentTemplate = {
            skill: "",
            comment: "",
            assessment: 0,
            interest: false,
            ...input,
            templateId,
            createAt: now,
            updateAt: now,
        }
        await skillAssessmentTemplates.doc(templateId).set(skillAssessmentTemplate)
        return skillAssessmentTemplate
    }))
    return newSkillAssessments
}

export const updateSkillAssessmentTemplate = async (templateId: string, input: Partial<SkillAssessmentTemplate>) => {
    await skillAssessmentTemplates.doc(templateId).set(input, { merge: true })
}

export const deleteSkillAssessmentTemplate = async (templateId: string) => {
    await skillAssessmentTemplates.doc(templateId).delete()
}

