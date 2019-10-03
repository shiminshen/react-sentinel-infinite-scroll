import React, { useState, useEffect } from 'react'
import logo from './logo.svg'
import './App.css'

import InfiniteScroll from './InfiniteScroll'

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

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h3>InfiniteScroll</h3>
        <InfiniteScrollExample />
      </header>
    </div>
  )
}

export default App
