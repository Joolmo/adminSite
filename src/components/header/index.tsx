import React, { useState } from 'react'
import { NavItem } from 'components/nav-item'
import './header.scss'


export const Header = () => {
    const [ navIsToggled, setNavToggled ] = useState(false)
    const [ currentPage, setCurrentPage ] = useState("dashboard") // Temporal, testing

    return (
        <header>
            <div id="mobileHeader">
                <h1>Navigation</h1>
                <i className="fa fa-bars fa-2x" onClick={() => setNavToggled(prev => !prev)}></i>
            </div>
            
            <nav className = { navIsToggled ? "toggled" : "notToggled" }>
                <h3>Quick Acces</h3>
                <ul>
                    <NavItem 
                        label="Dashboard" 
                        onClick={() => {/* navigate /dashboard */ setCurrentPage("Dashboard")}}
                        icon="fa fa-home fa-lg"
                        active={currentPage === "Dashboard"}
                    />
                    <NavItem 
                        label="Exchange"
                        onClick={() => setCurrentPage("Exchange")}
                        icon="fa fa-refresh fa-lg"
                        active={currentPage === "Exchange"}
                    />
                    <NavItem 
                        label="My Wallet"
                        icon="fa fa-credit-card	fa-lg"
                        subItems={[
                            {label: "balance", onClick: () => setCurrentPage("balance"), active: currentPage === "balance"},
                            {label: "buy crypto", onClick: () => setCurrentPage("buy crypto"), active: currentPage === "buy crypto"},
                            {label: "sell crypto", onClick: () => setCurrentPage("sell crypto"), active: currentPage === "sell crypto"},
                        ]}
                    />
                    <NavItem 
                        label="Tradeview"
                        onClick={() => setCurrentPage("Tradeview")}
                        icon="fa fa-bar-chart fa-lg"
                        active={currentPage === "Tradeview"}
                    />
                </ul>
            </nav>
        </header>
    )
}