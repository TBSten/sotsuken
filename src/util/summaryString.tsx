
export const summaryString = (str: string, maxLen: number = 20) =>
    str.length >= maxLen ? str.substring(0, maxLen) + "..." : str
