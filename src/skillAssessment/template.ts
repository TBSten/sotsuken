import { db } from "@/gcp/firestore"
import { SkillAssessmentTemplate } from "@/skillAssessment/types"
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
    const skillAssessmentSnap = await skillAssessmentTemplates.get()
    return skillAssessmentSnap.docs.map(doc => doc.data())
}

export const addSkillAssessmentTemplate = async (...inputs: SkillAssessmentTemplate[]) => {
    const newSkillAssessment = await Promise.all(inputs.map(async input => {
        const skillAssessmentTemplate: SkillAssessmentTemplate = {
            ...input,
        }
        await skillAssessmentTemplates.add(skillAssessmentTemplate)
        return skillAssessmentTemplate
    }))
    return newSkillAssessment
}
