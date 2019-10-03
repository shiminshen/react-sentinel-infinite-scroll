import { useEffect, useRef, useState } from 'react'

export const useSentinel = (callback) => {
  const [isFetching, setIsFetching] = useState(false)
  const ref = useRef()
  useEffect(
    () => {
      const { current } = ref
      const observer = new IntersectionObserver(
        ([entry]) => {
          callback && callback(entry.isIntersecting, isFetching, setIsFetching)
        }
      )

      if (current) {
        observer.observe(current)
      }
      return () => {
        observer.disconnect()
      }
    },
    [callback, isFetching, ref]
  )

  return ref
}

export const useInfiniteScroll = ({ topCallback, bottomCallback }) => {
  const listRef = useRef()

  const topSentinelRef = useSentinel((onScreen, isFetching, setIsFetching) => {
    if (!isFetching && onScreen) {
      setIsFetching(true)
      topCallback && topCallback(listRef, topSentinelRef, setIsFetching)
    }
  })
  const bottomSentinelRef = useSentinel(
    (onScreen, isFetching, setIsFetching) => {
      if (!isFetching && onScreen) {
        setIsFetching(true)
        bottomCallback &&
          bottomCallback(listRef, bottomSentinelRef, setIsFetching)
      }
    }
  )

  return { listRef, topSentinelRef, bottomSentinelRef }
}

export default ({
  className,
  children,
  topCallback,
  bottomCallback
}) => {
  const { listRef, topSentinelRef, bottomSentinelRef } = useInfiniteScroll({
    topCallback,
    bottomCallback
  })

  return children({ listRef, topSentinelRef, bottomSentinelRef })
}
