import React from 'react'

const Card = ({ children }) => {
    return (
        <div style={{ maxWidth: '1000px', margin: 'auto', height: 'fit-content' }}>{children}</div>
    )
}

export default Card