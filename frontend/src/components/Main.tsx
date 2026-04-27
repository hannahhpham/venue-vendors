import React from 'react'

interface MainProps {
    type: 'wholePage' | 'dashboard' | 'venue'
    children: React.ReactNode
}

const Main = ({children}: MainProps) => {
  return (
    <main>
        {children}
    </main>
  )
}

export default Main
