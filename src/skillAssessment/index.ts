import { db } from "@/gcp/firestore";
import { SkillAssessment, SkillAssessmentTemplate } from "@/skillAssessment/types";
import { AdapterUser } from "next-auth/adapters";
import { v4 as uuidv4 } from "uuid";
import { skillAssessmentConverter } from "./converter";
import { getAllSkillAssessmentTemplateMulti } from "./template";

export const skillAssessments = db.collection("skillAssessments").withConverter(skillAssessmentConverter)

export const initSkillAssessment = async (user: AdapterUser): Promise<AdapterUser> => {
    // デフォルトのスキルを取得
    const skillAssessmentTemplates = await getAllSkillAssessmentTemplateMulti()

    const batch = db.batch()
    const now = Date.now()

    skillAssessmentTemplates.forEach(skillAssessmentTemplate => {
        const assessmentId = uuidv4()
        batch.set<SkillAssessment>(
            skillAssessments.doc(assessmentId),
            {
                ...skillAssessmentTemplate,
                assessmentId,
                userId: user.id,
                createAt: now,
                updateAt: now,
            },
        )
    })
    await batch.commit()

    return user
}

export const getSkillAssessmentsByUserId = async (userId: string): Promise<SkillAssessment[]> => {
    const snap = await skillAssessments.where("userId", "==", userId).orderBy("createAt").get()
    const assessments = snap.docs.map(d => d.data())
    return assessments
}

export const getSkillAssessmentByAssessmentId = async (assessmentId: string) => {
    const snap = await skillAssessments.doc(assessmentId).get()
    return snap.data()
}

export const getAllSkillAssessment = async (): Promise<SkillAssessment[]> => {
    const snap = await skillAssessments.get()
    const assessments = snap.docs.map(d => d.data())
    return assessments
}

export const addSkillAssessment = async (userId: string, input: SkillAssessmentTemplate | SkillAssessment) => {
    const assessmentId = uuidv4()
    const skillAssessment: SkillAssessment = {
        createAt: Date.now(),
        updateAt: Date.now(),
        ...input,
        assessmentId,
        userId,
    }

    await skillAssessments.doc(assessmentId).set(skillAssessment)
    const returnValue = await getSkillAssessmentByAssessmentId(assessmentId)
    if (!returnValue) throw new Error("not implement , skill assessment is undefined")
    return returnValue
}

export const updateSkillAssessment = async (assessmentId: string, skillAssessment: SkillAssessmentTemplate) => {
    await skillAssessments.doc(assessmentId).set({
        ...skillAssessment,
        updateAt: Date.now(),
    }, { merge: true })
    return await getSkillAssessmentByAssessmentId(assessmentId)
}

export const deleteSkillAssessment = async (assessmentId: string) => {
    await skillAssessments.doc(assessmentId).delete()
}
