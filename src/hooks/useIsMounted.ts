import { MutableRefObject, useRef, useLayoutEffect } from "react"

export const useIsMounted = (): Readonly<MutableRefObject<boolean>> => {
  const isMounted = useRef(false)

  useLayoutEffect(() => {
    isMounted.current = true
    return () => {
      isMounted.current = false
    }
  }, [])
  return isMounted
}
