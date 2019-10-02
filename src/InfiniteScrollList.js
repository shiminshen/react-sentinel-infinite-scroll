import React, { useEffect, useRef, useState } from 'react'

const useSentinel = (callback, rootMargin = '0px') => {
  const [isFetching, setIsFetching] = useState(false)
  const ref = useRef()
  useEffect(
    () => {
      const { current } = ref
      const observer = new IntersectionObserver(
        ([entry]) => {
          callback && callback(entry.isIntersecting, isFetching, setIsFetching)
        },
        {
          rootMargin
        }
      )

      if (current) {
        observer.observe(current)
      }
      return () => {
        observer.unobserve(current)
      }
    },
    [callback, isFetching, ref, rootMargin]
  )

  return ref
}

const fetchMockData = (mockData = 'bottomAddItem') => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(mockData)
    }, 1000)
  })
}

const useInfiniteScroll = ({ topCallback, bottomCallback }) => {
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

export default () => {
  const [list, setList] = useState(['test'])
  const topCallback = (listRef, sentinelRef, setIsFetching) => {
    fetchMockData('topAddItem').then(data => {
      const originScrollHeight = listRef.current.scrollHeight
      setList(list => [data, ...list])
      // add 1px to prevent IntersectionObserver trigged again
      listRef.current.scrollTop =
        listRef.current.scrollHeight - originScrollHeight + 1
      setIsFetching(false)
    })
  }

  const bottomCallback = (listRef, sentinelRef, setIsFetching) => {
    fetchMockData().then(data => {
      setList(list => [...list, data])
      setIsFetching(false)
    })
  }

  const { listRef, topSentinelRef, bottomSentinelRef } = useInfiniteScroll({
    topCallback,
    bottomCallback
  })

  return (
    <div ref={listRef} style={{ height: '200px', overflow: 'auto' }}>
      <div ref={topSentinelRef}>Loading</div>
      {list.map((item, idx) => (
        <div key={idx}>{item}</div>
      ))}
      <div ref={bottomSentinelRef}>Loading</div>
    </div>
  )
}
