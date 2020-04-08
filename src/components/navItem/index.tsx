import React, { useState, ReactElement } from 'react'
import './index.scss'


interface IProps {
    label: string
    icon?: string
    onClick?: (arg: string) => void
    active?: boolean
    children?: ReactElement<IProps>[]
}

export const NavItem = ({ icon, onClick, label, children, active = false }: IProps) => {
    const [isToggled, setToggled] = useState(false)

    return (
        <li className={`nav-item ${isToggled ? "toggled" : !!children ? "unToggled" : "" } ${active ? "active" : ""}`}>
            <div onClick={() => {
                if(!!onClick) { onClick(label) }
                if(!!children) { setToggled(current => !current)}
            }}>
                {icon && <i className={`fa ${icon}`}></i>}
                <span>{label}</span>
                <i className="toggle fa fa-chevron-right"></i>
            </div >
            {children &&
                <ul className="nav-list">
                    {children}
                </ul >
            }
        </li>
    )
}