import React from 'react'
import PrivateLayoutHeader from './header';

function PrivateLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
        <PrivateLayoutHeader/>
        {children}</div> 
  )
}

export default PrivateLayout