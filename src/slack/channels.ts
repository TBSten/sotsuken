import { client } from "."

export const joinNotJoinedChannels = async () => {
    const cons = await client.conversations.list({ limit: 500 })
    const notJoined = cons.channels?.filter(channel => !channel.is_member) ?? null

    const res = await Promise.all(notJoined?.map(async (channel) => {
        if (!channel.id) throw new Error(`invalid channel id ${channel} (${JSON.stringify(channel)})`)
        await client.conversations.join({ channel: channel.id, })
    }) ?? [])
    return notJoined
}
