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

const fetchMockData = (mockData = 'bottomAddItem') => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(mockData)
    }, 1000)
  })
}

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
    'test'
  ])

  const topCallback = (listRef, sentinelRef, setIsFetching) => {
    return fetchMockData('topAddItem').then(data => {
      setList(list => [data, ...list])
    })
  }

  const bottomCallback = (listRef, sentinelRef, setIsFetching) => {
    return fetchMockData().then(data => {
      setList(list => [...list, data])
    })
  }

  const { listRef, topSentinelRef, bottomSentinelRef } = useInfiniteScroll({
    topOffset: 40,
    topCallback,
    topObserverOptions: { rootMargin: '40px 0px' },
    bottomCallback
  })

  const stopLoading = list.length > 15 && list.length < 20

  return (
    <div
      ref={listRef}
      style={{ height: '200px', width: '200px', overflow: 'auto' }}
    >
      {!stopLoading && <div ref={topSentinelRef}>Loading</div>}
      <div className="list">
        {list.map((item, idx) => (
          <div key={idx}>{item}</div>
        ))}
      </div>
      {<div ref={bottomSentinelRef}>Loading</div>}
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
    'test'
  ])

  const topCallback = (listRef, sentinelRef, setIsFetching) => {
    return fetchMockData('topAddItem').then(data => {
      setList(list => [data, ...list])
    })
  }

  const bottomCallback = (listRef, sentinelRef, setIsFetching) => {
    return fetchMockData().then(data => {
      setList(list => [...list, data])
    })
  }

  const stopLoading = list.length > 15 && list.length < 20

  return (
    <InfiniteScroll
      topOffset={40}
      topCallback={topCallback}
      bottomCallback={bottomCallback}
      topObserverOptions={{ rootMargin: '40px 0px' }}
    >
      {({ listRef, topSentinelRef, bottomSentinelRef }) => (
        <div
          ref={listRef}
          style={{ height: '200px', width: '200px', overflow: 'auto' }}
        >
          {!stopLoading && <div ref={topSentinelRef}>Loading</div>}
          <div className="list">
            {list.map((item, idx) => (
              <div key={idx}>{item}</div>
            ))}
          </div>
          {<div ref={bottomSentinelRef}>Loading</div>}
        </div>
      )}
    </InfiniteScroll>
  )
}

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h3>InfiniteScroll</h3>
        <div style={{ display: 'flex' }}>
          <InfiniteScrollExample />
          <InfiniteScrollExample2 />
        </div>
      </header>
    </div>
  )
}

export default App
```
