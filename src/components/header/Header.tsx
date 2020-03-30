import React from 'react'
import './Header.scss'


export default () => {
    const MobileHeader = () => (
        <>
            <input id="mobileNavigationCheck" type="checkbox"/> {/* useState or pure css? */}
            <div id="mobileHeader">
                <h1>Navigation</h1>
                <label htmlFor="mobileNavigationCheck" className="fa fa-bars fa-2x"></label>
            </div>
        </>
    )

    const Nav = () => (
        <nav>
            <ul>
                <li>Dashboard</li>
                <li>Contacs</li>
                <li>Perfil</li>
                <li>Settings</li>
            </ul>
        </nav>
    )

    return (
        <header>
            <MobileHeader/>
            <Nav/>
        </header>
    )
}