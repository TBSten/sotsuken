import { useRouter } from "next/router";
import { useCallback } from "react";

export function useHash() {
    const router = useRouter()
    const hash = router.asPath.split("#")[1] ?? ""
    const setHash = useCallback((newHash: string, replace: boolean = false) => {
        // let update = router.push
        // if (replace) {
        //     update = router.replace
        // }
        // update({ hash: newHash }, undefined, { shallow: true, scroll: true })
        location.hash = newHash
    }, [])
    return [hash, setHash] as const
}