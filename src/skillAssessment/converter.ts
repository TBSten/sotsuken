import { Skill, SkillAssessment, SkillAssessmentSchema, SkillAssessmentTemplate, SkillAssessmentTemplateSchema, SkillSchema } from "@/skillAssessment/types";
import { FirestoreDataConverter } from "@google-cloud/firestore";

export const skillAssessmentConverter: FirestoreDataConverter<SkillAssessment> = {
    fromFirestore(snapshot) {
        return SkillAssessmentSchema.parse({
            ...snapshot.data(),
        })
    },
    toFirestore(skillAssessment) {
        return {
            ...skillAssessment,
        }
    },
}

export const skillAssessmentTemplateConverter: FirestoreDataConverter<SkillAssessmentTemplate> = {
    fromFirestore(snapshot) {
        return SkillAssessmentTemplateSchema.parse({
            ...snapshot.data(),
        })
    },
    toFirestore(skillAssessmentTemplate) {
        return {
            ...skillAssessmentTemplate,
        }
    }
}

export const skillConverter: FirestoreDataConverter<Skill> = {
    fromFirestore(snapshot) {
        return SkillSchema.parse({
            ...snapshot.data()
        })
    },
    toFirestore(skill) {
        return {
            ...skill,
        }
    }
}
