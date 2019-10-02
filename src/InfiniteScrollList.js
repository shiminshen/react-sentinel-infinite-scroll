import React, { useEffect, useRef, useState } from 'react'

const useOnScreen = (callback, rootMargin = '50px') => {
  const ref = useRef()
  // State and setter for storing whether element is visible
  useEffect(
    () => {
      const { current } = ref
      const observer = new IntersectionObserver(
        ([entry]) => {
          // Update our state when observer callback fires
          console.log(entry);
          callback && callback(entry.isIntersecting)
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
    [callback, ref, rootMargin]
  )

  return ref
}

const fetchMockData = (mockData = 'bottomAddItem') => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(mockData)
    }, 1000)
  })
};

const useInfiniteScroll = ({ topCallback, bottomCallback }) => {

  const [isFetching, setIsFetching] = useState(false)
  const listRef = useRef()

  const topSentinelRef = useOnScreen((onScreen) => {
    if (!isFetching && onScreen) {
      setIsFetching(true)
      topCallback && topCallback(listRef, topSentinelRef, setIsFetching)
    }
  })
  const bottomSentinelRef = useOnScreen((onScreen) => {
    if (!isFetching && onScreen) {
      setIsFetching(true)
      bottomCallback && bottomCallback(listRef, bottomSentinelRef, setIsFetching)
    }
  })

  return { listRef, topSentinelRef, bottomSentinelRef }
}

export default () => {
  const [list, setList] = useState(['test']);
  const topCallback = (listRef, sentinelRef, setIsFetching) => {
    fetchMockData('topAddItem').then((data) => {
      const originScrollHeight = listRef.current.scrollHeight
      setList(list => ([data, ...list]))
      listRef.current.scrollTop = sentinelRef.current.clientHeight + listRef.current.scrollHeight - originScrollHeight
      setIsFetching(false)
    })
  }

  const { listRef, topSentinelRef, bottomSentinelRef } = useInfiniteScroll({
    topCallback,
    bottomCallback: (listRef, sentinelRef, setIsFetching) => {
      fetchMockData().then((data) => {
        setList(list => ([...list, data]))
        setIsFetching(false)
      })
    }
  })

  return (
    <div ref={listRef} style={{ height: '200px', overflow: 'auto' }}>
      <div ref={topSentinelRef}>top</div>
      {list.map((item, idx) => (<div key={idx}>{item}</div>))}
      <div ref={bottomSentinelRef}>bottom</div>
    </div>
  )
}
