import React from 'react'
import './index.scss'


interface IProps {
    children: any,
    className?: string
}

export const Card = ({children, className = ""}: IProps) => {
    return (
        <div className={`card ${className}`}>
            {children}
        </div>
    )
}