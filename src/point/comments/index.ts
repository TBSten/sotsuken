import { v4 as uuidv4 } from "uuid";
import { points } from "..";
import { PointComment } from "../type";
import { commentConverter } from "./converter";

export const pointComments = (userId: string, pointId: string) => points(userId).doc(pointId)
    .collection("comments")
    .withConverter(commentConverter)

export const addPointComment = async (
    pointOwnerId: string, pointId: string,
    commentAuthorId: string, input: Partial<PointComment>,
) => {
    const commentId = uuidv4()
    const now = Date.now()
    const comment: PointComment = {
        commentId,
        text: "",
        authorId: commentAuthorId,
        createAt: now,
        updateAt: now,
        ...input,
    }
    const ref = await pointComments(pointOwnerId, pointId).doc(commentId).set(comment)
    return comment
}

export const getAllPointComments = async (userId: string, pointId: string) => {
    const snap = await pointComments(userId, pointId)
        .orderBy("updateAt", "desc")
        .get()
    const comments = snap.docs.map(d => d.data())
    return comments
}
