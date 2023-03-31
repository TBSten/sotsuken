import { getUserBySlackId } from "@/auth/users";
import { client } from "@/slack";
import { joinNotJoinedChannels } from "@/slack/channels";
import { Message } from "@slack/web-api/dist/response/ConversationsRepliesResponse";
import dayjs from "dayjs";
import "dayjs/locale/ja";
import dayjsTimezone from "dayjs/plugin/timezone";
import dayjsUtc from "dayjs/plugin/utc";
import { addPoint } from ".";

dayjs.extend(dayjsUtc)
dayjs.extend(dayjsTimezone)

const datetimeFormat = "YYYY/MM/DD-HH:mm:ss"

const settings = {
    message: {
        pointPer: 5,
        limitCount: 10,
    },
    reply: {
        pointPer: 3,
        limitCount: 10,
    },
    reaction: {
        pointPer: 1,
        limitCount: 10,
    },
} as const

type Bonus = {
    channel: string
} & (
        {
            type: "reply" | "message"
            text?: string
        } |
        {
            type: "reaction"
            name?: string
            messageText?: string
        } |
        {
            type: "checkin" | "checkout"
        }
    )


export const totalPoints = async () => {
    console.log("------ total points - start ------");

    // TODO: 前準備 処理
    await joinNotJoinedChannels()
    const userAndBonus: Record<string, Bonus[]> = {}
    const addBonus = (userId: string, bonus: Bonus) => {
        if (userAndBonus[userId]) {
            userAndBonus[userId].push(bonus)
        } else {
            userAndBonus[userId] = [bonus]
        }
    }
    // 発言,リプライ,リアクションを集計
    const threads = await getBonusTargets()
    Object.entries(threads).forEach(([channel, thread]) => {
        thread.map((msgs, i) => {
            const [msg, ...replies] = msgs
            // 発言の集計
            const msgUserId = msg.user
            if (!msgUserId) throw new Error(`invalid msgUserId : ${msgUserId}`)
            addBonus(msgUserId, {
                type: "message",
                channel,
                text: msg.text,
            })
            // リプライの集計
            replies.forEach(reply => {
                const replyUserId = reply.user
                if (!replyUserId) throw new Error(`invalid replyUserId : ${replyUserId}`)
                addBonus(replyUserId, {
                    type: "reply",
                    channel,
                    text: reply.text,
                })
            })
            // リアクションの集計
            msgs.forEach(msg => {
                msg.reactions?.forEach((reaction) => {
                    reaction.users?.forEach((userId) => {
                        addBonus(userId, {
                            type: "reaction",
                            channel,
                            name: reaction.name,
                            messageText: msg.text,
                        })
                    })
                })
            })
        })
    })
    // TODO: チェックイン集計
    // TODO: チェックアウト集計
    // console.log("userAndBonus", userAndBonus);
    logSummary(userAndBonus)
    // userAndBonusを使ってポイント付与
    console.log("------ total points - end ------");
    await grantPoint(userAndBonus)
}

const getBonusTargets = async () => {
    const channels = (await client.conversations.list()).channels
    if (!channels) throw new Error(`invalid channels`)
    const threads: Record<string, Message[][]> = {}
    for (const channel of channels) {
        const channelName = channel.name
        const channelId = channel.id
        if (!channelName || !channelId) throw new Error(`invalid channelName or channelId : channelId:${channelName} channelName:${channelName}`)
        const thread = await getMessagesAndReplies(channelId)
        threads[channelName] = thread
    }
    return threads
}

const bonusTargetPeriod = {
    now() {
        return dayjs().tz('Asia/Tokyo')
    },
    get end() {
        return (
            this.now()
                .hour(0)
                .minute(0)
                .second(0)
                .millisecond(0)
        )
    },
    get start() {
        return (
            this.end
                .subtract(1, "d")
        )
    },
}

const getMessagesAndReplies = async (channelId: string) => {
    const now = dayjs().tz('Asia/Tokyo')
    const from = bonusTargetPeriod.start
    const to = bonusTargetPeriod.end
    const oldest = `${Math.floor((from.unix()))}`
    const latest = `${Math.floor(to.unix())}`
    console.log("now", now.format(datetimeFormat))
    console.log("from", from.format(datetimeFormat))
    console.log("to", to.format(datetimeFormat))
    console.log("oldest", oldest, "latest", latest,)
    console.groupEnd()
    const result: Message[][] = []
    let messagesRes = (await client.conversations.history({ channel: channelId, inclusive: true, oldest, latest, }))
    let messages = messagesRes.messages ?? []
    while (true) {
        for (const msg of messages) {
            const replies = (await client.conversations.replies({ channel: channelId, ts: msg.ts as string })).messages ?? []
            result.push(replies)
        }
        if (!messagesRes.has_more) break
        messagesRes = (await client.conversations.history({ channel: channelId, inclusive: true, oldest, latest, cursor: messagesRes.response_metadata?.next_cursor }))
        messages = messagesRes.messages ?? []
    }
    return result
}

const grantPoint = async (userAndBonus: Record<string, Bonus[]>) => {
    const grantDate = new Date() // 前日の00:00 0.0
    grantDate.setDate(grantDate.getDate() - 1)
    const grantDateText = `${grantDate.getMonth() + 1}/${grantDate.getDate()}`
    for (let [slackUserId, bonuses] of Object.entries(userAndBonus)) {
        const typeAndCount: Record<Bonus["type"], number> = {
            message: 0,
            reply: 0,
            reaction: 0,
            checkin: 0,
            checkout: 0,
        }
        const userId = (await getUserBySlackId(slackUserId))?.id
        if (!userId) continue
        const point = bonuses.reduce((total, b) => {
            let addPoint = 0
            if (b.type === "message" && typeAndCount.message < settings.message.limitCount)
                addPoint = settings.message.pointPer
            if (b.type === "reply" && typeAndCount.reply < settings.reply.limitCount)
                addPoint = settings.reply.pointPer
            if (b.type === "reaction" && typeAndCount.reaction < settings.reaction.limitCount)
                addPoint = settings.reaction.pointPer
            typeAndCount[b.type]++
            return total + addPoint
        }, 0)
        await addPoint(userId, {
            description: pointDescription({
                title: `【${grantDateText} 分】自動集計`,
                contents: [
                    bonuses.map((b, i) => {
                        const no = i + 1
                        if (b.type === "message") return lines([
                            `${no} #${b.channel} で発言`,
                            `　　発言内容 ${b.text ?? "(none)"}`,
                        ])
                        if (b.type === "reply") return lines([
                            `${no} #${b.channel} でリプライ`,
                            `　　リプライ内容 ${b.text ?? "(none)"}`,
                        ])
                        if (b.type === "reaction") return lines([
                            `${no} #${b.channel} でリアクション`,
                            `　　リアクション :${b.name}:`,
                            `　　リアクション元の発言:${b.messageText ?? "(none)"}`,
                        ])
                        throw new Error("not implement")
                    }).join("\n"),
                ],
            }),
            status: "auto",
            point,
        })
    }
}

const logSummary = (userAndBonus: Record<string, Bonus[]>) => {
    console.log("- report ----------------------------");
    console.log(userAndBonus);
    console.log("-------------------------------------");
    Object.entries(userAndBonus).forEach(([slacUserId, bonuses]) => {
        console.group("userId", slacUserId)
        bonuses.forEach(b => {
            if (b.type === "message") console.log("message", b.text);
            if (b.type === "reply") console.log("reply", b.text);
            if (b.type === "reaction") console.log("reaction", b.name, "to", b.messageText);
        })
        console.groupEnd()
    })
}

const pointDescription = ({
    contents, title, divider = "---------------------",
}: { title: string, contents: string[], divider?: string }) => (
    title + "\n" +
    divider + "\n" +
    contents.join("\n\n" + divider + "\n")
)

const lines = (lines: string[], { indent = "" }: { indent?: string } = {}) =>
    lines
        .map(l => indent + l)
        .join("\n")
