import React, { useState } from 'react'
import { NavItem } from 'components/nav-item'
import logo from 'images/logo.svg'
import './header.scss'


export const Header = () => {
    const [ navIsToggled, setNavToggled ] = useState(false)
    const [ currentPage, setCurrentPage ] = useState("dashboard") // Temporal, testing

    return (
        <header>
            <div id="header">
                <img src={logo} alt="page logo"/>
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

                <h3>Service</h3>
                <ul>
                    <NavItem 
                        label="Transactions"
                        icon="fa fa-university	fa-lg"
                        subItems={[
                            {label: "Buy & Sell Coin", onClick: () => setCurrentPage("Buy & Sell Coin"), active: currentPage === "Buy & Sell Coin"},
                            {label: "Deposit Yen", onClick: () => setCurrentPage("Deposit Yen"), active: currentPage === "Deposit Yen"},
                            {label: "Withdraw Yen", onClick: () => setCurrentPage("Withdraw Yen"), active: currentPage === "Withdraw Yen"},
                        ]}
                    />
                      <NavItem 
                        label="Rewards"
                        onClick={() => setCurrentPage("Rewards")}
                        icon="fa fa-trophy fa-lg"
                        active={currentPage === "Rewards"}
                    />
                </ul>

                <h3>Account</h3>
                <ul>
                    <NavItem 
                        label="Notifications" 
                        onClick={() => {/* navigate /dashboard */ setCurrentPage("Notifications")}}
                        icon="fa fa-bell fa-lg"
                        active={currentPage === "Notifications"}
                    />
                    <NavItem 
                        label="Settings"
                        onClick={() => setCurrentPage("Settings")}
                        icon="fa fa-cog fa-lg"
                        active={currentPage === "Settings"}
                    />
                </ul>
            </nav>
        </header>
    )
}