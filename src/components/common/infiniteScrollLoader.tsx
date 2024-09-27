import React from 'react'

function InfiniteScrollLoader() {
  return (
    <div className="flex h-[20vh] items-center justify-center bg-white dark:bg-black">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
          </div>
  )
}

export default InfiniteScrollLoader