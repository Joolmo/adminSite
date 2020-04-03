import React, { useState } from 'react'
import './nav-item.scss'


interface IProps {
    label: string
    icon: string
    onClick?: () => void
    subItems?: {
        label: string,
        onClick?: () => void,
        active?: boolean
    }[]
    active?: boolean
}

export const NavItem = ( {label, icon, onClick, subItems = [], active = false}: IProps ) => {
    const [ isToggled, setToggled ] = useState(false)

    const hasSubItems = subItems.length > 0
    const activeLink = "activeLink"

    return (
        <li className={`nav-item ${hasSubItems ? (isToggled ? "active" : "inactive" ) : ""}`}>
            <div 
                className={`main-item ${active ? activeLink : ""}`} 
                onClick={ hasSubItems ? (() => setToggled(prevSt => !prevSt)) : onClick }
            >
                <i className={icon}></i>
                {label} {/* <Link to={...}>{label}</Link> ? */}
                <i className={"toggle fa fa-angle-down fa-lg"}></i> 
            </div> 

            { hasSubItems && // if hasSubItems render all sub-items in a list
                <ul className="sub-items">
                    {subItems.map(({label: labelSubItem, onClick: onClickSubItem, active: activeSubItem = false}, index) => (
                        <li 
                            key={index} 
                            className={`sub-item ${activeSubItem ? activeLink : ""}`} 
                            onClick={onClickSubItem}
                        >
                            {labelSubItem} {/* <Link to={...}>{label}</Link> ? */}
                        </li> 
                    ))}  
                </ul>
            }
        </li>
    )
}