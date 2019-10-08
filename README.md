react-sentinel-infinite-scroll
===
[![npm version](https://badge.fury.io/js/react-sentinel-infinite-scroll.svg)](https://badge.fury.io/js/react-sentinel-infinite-scroll)
[![Build Status](https://travis-ci.org/shiminshen/react-sentinel-infinite-scroll.svg?branch=master)](https://travis-ci.org/shiminshen/react-sentinel-infinite-scroll)

React hook based infinite scroll by sentinel

Demo Code
---

```javascript
import React, { useState } from 'react'
import InfiniteScroll, { useInfiniteScroll } from './SentinelInfiniteScroll'

const InfiniteScrollExample = () => {
  const [list, setList] = useState([
    'test',
    'test',
    'test',
    'test',
    'test',
    'test',
    'test',
    'test',
    'test',
    'test',
  ])
  const topCallback = (listRef, sentinelRef, setIsFetching) => {
    fetchMockData('topAddItem').then(data => {
      const originScrollHeight = listRef.current.scrollHeight
      setList(list => [data, ...list])
      listRef.current.scrollTop =
        listRef.current.scrollTop +
        listRef.current.scrollHeight -
        originScrollHeight
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
    topOffset: 30,
    topCallback,
    bottomCallback
  })

  return (
    <div ref={listRef} style={{ height: '200px', width: '200px', overflow: 'auto' }}>
      <div ref={topSentinelRef}>Loading</div>
      <div className='list'>
        {list.map((item, idx) => (
          <div key={idx}>{item}</div>
        ))}
      </div>
      <div ref={bottomSentinelRef}>Loading</div>
    </div>
  )
}

const InfiniteScrollExample2 = () => {
  const [list, setList] = useState([
    'test',
    'test',
    'test',
    'test',
    'test',
    'test',
    'test',
    'test',
    'test',
    'test',
  ])

  const topCallback = (listRef, sentinelRef, setIsFetching) => {
    fetchMockData('topAddItem').then(data => {
      const originScrollHeight = listRef.current.scrollHeight
      setList(list => [data, ...list])
      listRef.current.scrollTop =
        listRef.current.scrollTop +
        listRef.current.scrollHeight -
        originScrollHeight
      setIsFetching(false)
    })
  }

  const bottomCallback = (listRef, sentinelRef, setIsFetching) => {
    fetchMockData().then(data => {
      setList(list => [...list, data])
      setIsFetching(false)
    })
  }

  return (
    <InfiniteScroll topOffset={30} topCallback={topCallback} bottomCallback={bottomCallback}>
      {({ listRef, topSentinelRef, bottomSentinelRef }) => (
        <div ref={listRef} style={{ height: '200px', width: '200px', overflow: 'auto' }}>
          <div ref={topSentinelRef}>Loading</div>
          <div className='list'>
            {list.map((item, idx) => (
              <div key={idx}>{item}</div>
            ))}
          </div>
          <div ref={bottomSentinelRef}>Loading</div>
        </div>
      )}
    </InfiniteScroll>
  )
}
```

