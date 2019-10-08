react-sentinel-infinite-scroll
===
[![Build Status](https://travis-ci.org/shiminshen/react-sentinel-infinite-scroll.svg?branch=master)](https://travis-ci.org/shiminshen/react-sentinel-infinite-scroll)

React hook based infinite scroll by sentinel

Demo Code
---

```javascript
import React, { useState, useEffect } from 'react'
import InfiniteScroll from 'react-sentinel-infinit-scroll'

const InfiniteScrollExample = () => {
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

  const [enable, setEnable] = useState(false)

  useEffect(() => {
    const listDom  = document.getElementsByClassName('list')[0]
    setEnable(true)
    listDom.scrollIntoView()
  }, [])

  const stopLoading = list.length > 15 && list.length < 20
  console.log('render');

  return (
    <InfiniteScroll topCallback={topCallback} bottomCallback={bottomCallback}>
      {({ listRef, topSentinelRef, bottomSentinelRef }) => (
        <div ref={listRef} style={{ height: '200px', overflow: 'auto' }}>
          {enable && !stopLoading && <div ref={topSentinelRef}>Loading</div>}
          <div className='list'>
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
```

