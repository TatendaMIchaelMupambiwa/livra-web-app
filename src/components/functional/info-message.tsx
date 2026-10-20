import React from 'react'

function InfoMessage({message}: {message:string}) {
  return (
    <div className="p-5 text-sm rounded border-gray-400 border">{message}</div>
  )
}

export default InfoMessage