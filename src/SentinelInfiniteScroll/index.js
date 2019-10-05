import { useEffect, useRef, useState } from 'react'

export const useSentinel = (callback, observerOptions) => {
  const [isFetching, setIsFetching] = useState(false)
  const ref = useRef()
  useEffect(
    () => {
      const { current } = ref
      const observer = new IntersectionObserver(([entry]) => {
        callback && callback(entry.isIntersecting, isFetching, setIsFetching)
      }, observerOptions)

      if (current) {
        observer.observe(current)
      }
      return () => {
        observer.disconnect()
      }
    },
    [callback, isFetching, observerOptions, ref]
  )

  return ref
}

export const useInfiniteScroll = ({
  topOffset,
  topCallback,
  topObserverOptions,
  bottomOffset,
  bottomCallback,
  bottomObserverOptions
}) => {
  const listRef = useRef()

  const topSentinelRef = useSentinel((onScreen, isFetching, setIsFetching) => {
    if (!isFetching && onScreen) {
      setIsFetching(true)
      topCallback && topCallback(listRef, topSentinelRef, setIsFetching)
    }
  }, topObserverOptions)

  const bottomSentinelRef = useSentinel(
    (onScreen, isFetching, setIsFetching) => {
      if (!isFetching && onScreen) {
        setIsFetching(true)
        bottomCallback &&
          bottomCallback(listRef, bottomSentinelRef, setIsFetching)
      }
    },
    bottomObserverOptions
  )

  // layout offset while did mount if necessary
  useEffect(
    () => {
      if (topOffset) {
        listRef.current.scrollTop = topOffset
      } else if (bottomOffset) {
        console.log(listRef.current.scrollHeight)
        listRef.current.scrollTop =
          listRef.current.scrollHeight -
          listRef.current.clientHeight -
          bottomOffset
      }
    },
    [listRef, topOffset, bottomOffset]
  )

  return { listRef, topSentinelRef, bottomSentinelRef }
}

export default ({
  className,
  children,
  topOffset,
  topCallback,
  topObserverOptions,
  bottomOffset,
  bottomCallback,
  bottomObserverOptions
}) => {
  const { listRef, topSentinelRef, bottomSentinelRef } = useInfiniteScroll({
    topOffset,
    topCallback,
    topObserverOptions,
    bottomOffset,
    bottomCallback,
    bottomObserverOptions
  })

  return children({ listRef, topSentinelRef, bottomSentinelRef })
}
