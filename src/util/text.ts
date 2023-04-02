export const lines = (lines: string[], { indent = "" }: { indent?: string } = {}) =>
    lines
        .map(l => indent + l)
        .join("\n")
