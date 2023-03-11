import { useState } from "react";

export function useSavable<T>(init: T) {
    const [value, setValue] = useState(init)
    const [lastSaved, setLastSaved] = useState(init)
    const handleSave = <A extends any[], R>(callback: (...args: A) => R) => (...a: A) => {
        const result = callback(...a)
        setLastSaved(value)
        return result
    }
    return [value, {
        set: setValue,
        handleSave,
        lastSaved,
        hasChange: lastSaved === value,
    }] as const
}