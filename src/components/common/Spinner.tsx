import React from 'react'

function Spinner() {
  return (
    <div className="flex h-[20px] items-center justify-center bg-transparent">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-primary border-t-transparent"></div>
          </div>
  )
}

export default Spinner