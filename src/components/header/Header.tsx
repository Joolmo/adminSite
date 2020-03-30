import React from 'react'
import './Header.scss'


export default () => {
    return (
        <header>
            <input id="mobileNavigationCheck" type="checkbox"/>
            <div id="mobileHeader">
                <h1>Navigation</h1>
                <label htmlFor="mobileNavigationCheck" className="fa fa-bars fa-2x"></label>
            </div>
            <nav id="siteNavigation">
                <ul>
                    <li>Dashboard</li>
                    <li>Contacs</li>
                    <li>Perfil</li>
                    <li>Settings</li>
                </ul>
            </nav>
        </header>
    )
}