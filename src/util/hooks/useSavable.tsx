import { useCallback, useState } from "react";

export function useSavable<T>(init: T) {
    const [value, setValue] = useState(init)
    const [lastSaved, setLastSaved] = useState(init)
    const onSave = useCallback(() => { setLastSaved(value) }, [value])
    const handleSave = <A extends any[], R>(callback: (...args: A) => R) => (...a: A) => {
        const result = callback(...a)
        onSave()
        return result
    }
    return [value, {
        set: setValue,
        handleSave,
        onSave,
        lastSaved,
        hasChange: lastSaved !== value,
    }] as const
}