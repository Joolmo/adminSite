import React, { useState, ReactElement } from 'react'
import './nav-item.scss'


interface IProps {
    label: string
    icon?: string
    onClick?: (arg: string) => void
    children?: ReactElement<IProps>[]
    active?: boolean
}



export const NavItem = ({ icon, onClick, label, children, active = false }: IProps) => {
    const [isToggled, setToggled] = useState(false)
    debugger
    return (
        <>
            <li className={`nav-item ${active ? "active" : ""}`} onClick={!!onClick ? () => onClick(label) : () => setToggled(current => !current)}>
                {icon && <i className={`fa ${icon}`}></i>}
                <span>{label}</span>
                <i className={`fa toggle fa-chevron-up`}></i>
            </li >
            {children && isToggled &&
                <ul className="nav-list">
                    {children}
                </ul >
            }
        </>
    )
}


