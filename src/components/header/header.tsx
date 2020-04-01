import React, { useState } from 'react'
import './header.scss'


export const Header = () => {
    const [ navIsToggled, setNavToggled ] = useState(false)

    return (
        <header>
            <div id="mobileHeader">
                <h1>Navigation</h1>
                <i className="fa fa-bars fa-2x" onClick={() => setNavToggled(prev => !prev)}></i>
            </div>
            
            <nav className = { navIsToggled ? "toggled" : "notToggled" }>
                <div>Dashboard</div>
                <div>Contacs</div>
                <div>Perfil</div>
                <div>Settings</div>
            </nav>
        </header>
    )
}