import { getUser } from "@/auth/users"
import { User } from "next-auth"
import { getSkillAssessmentsByUserId } from "."
import { SkillAssessment, SkillAssessmentSearchInput, SkillAssessmentSearchResult } from "./types"

// [JSON.stringify(input)]: { ... }
const cache: Record<string, { expireAt: number, data: SkillAssessmentSearchResult }> = {}
const cacheExpire = 1 * 3600

export const searchSkillAssessment = async (input: SkillAssessmentSearchInput): Promise<SkillAssessmentSearchResult> => {
    // const cacheKey = JSON.stringify(input)
    // if (cacheKey in cache && cache[cacheKey].expireAt <= Date.now()) return cache[cacheKey].data
    // const builder = searchResultBuilder()
    // if (input.user) {
    //     const splited = input.user.split(/\s+/)
    //     // ユーザIDで検索
    //     let users: User[];
    //     users = (
    //         await Promise.all(splited.map(id => getUser(id)))
    //     ).filter((u): u is User => !!u)
    //     builder.addUsers(users)
    //     // ユーザ名で検索
    //     users = (
    //         await Promise.all(splited.map(name => getUsersByName(name)))
    //     ).flat()
    //     await builder.addUsers(users)
    // }
    // if (input.skill) {
    //     const splited = input.skill.split(/\s+/)
    //     // スキルで検索
    //     let assessments: SkillAssessment[];
    //     assessments = (
    //         await Promise.all(splited.map(skill => getSkillAssessmentsBySkill(skill)))
    //     ).flat()
    //     await builder.addAssessments(assessments)
    // }
    // const result = builder.result
    // cache[cacheKey] = {
    //     expireAt: Date.now() + cacheExpire,
    //     data: result
    // }
    // return result
    return {
        assessments: [],
        users: {},
    }
}

const searchResultBuilder = () => {
    const result: SkillAssessmentSearchResult = {
        assessments: [],
        users: {},
    }
    const builder = {
        get result() {
            return result
        },
        async addUsers(users: User[]) {
            await Promise.all(users.map(async user => {
                if (result.users[user.id]) return
                // ユーザ追加
                result.users[user.id] = user
                // 評価追加
                const assessments =
                    await Promise.all(
                        users.map(user => getSkillAssessmentsByUserId(user.id))
                    ).then(sa =>
                        sa.flat()
                    )
                result.assessments = assessments
            }))
        },
        async addAssessments(assessments: SkillAssessment[]) {
            // スキル追加
            result.assessments.push(...assessments)
            // 当該スキルのユーザを追加
            const users = (
                await Promise.all(assessments.map(assessment =>
                    getUser(assessment.userId)
                ))
            ).filter((u): u is User => !!u)
            users.forEach(user => {
                result.users[user.id] = user
            })
        },
    } as const
    return builder
}