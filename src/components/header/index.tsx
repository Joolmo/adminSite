import React, { useState } from 'react'
import { NavItem } from 'components/navItem'
import logo from 'images/logo.svg'
import './header.scss'
import { Toolbar } from 'components/toolbar'


export const Header = () => {
    const [navIsToggled, setNavToggled] = useState(false)
    const [currentPage, setCurrentPage] = useState("dashboard") // Temporal, testing
    const items = [{
        label: "Dashboard",
        icon: "fa fa-home fa-lg",
    }]
    return (
        <header>
            <div id="header">
                <img src={logo} alt="page logo" />
                <h1>Navigation</h1>
                <i className="fa fa-bars fa-2x" onClick={() => setNavToggled(prev => !prev)}></i>
            </div>

            <nav className={navIsToggled ? "toggled" : "notToggled"}>
                <h3>Quick Acces</h3>
                <ul>


                    {items.map((item) =>
                        <NavItem
                            {...item}
                            onClick={(arg: string) => setCurrentPage(arg)}
                            active={currentPage === "dashboard"}
                        />
                    )}
                    <NavItem
                        label="Dashboard"
                        onClick={(arg: string) => setCurrentPage(arg)}
                        icon="fa fa-home fa-lg"
                        active={currentPage === "dashboard"}
                    />
                    <NavItem
                        label="Exchange"
                        onClick={(arg: string) => setCurrentPage(arg)}
                        icon="fa fa-refresh fa-lg"
                        active={currentPage === "Exchange"}
                    />
                    <NavItem
                        label="My Wallet"
                        icon="fa fa-credit-card	fa-lg"
                        active={currentPage === ""}
                    >
                        <NavItem
                            label="balance"
                            onClick={(arg: string) => setCurrentPage(arg)}
                            active={currentPage === "balance"}
                        ></NavItem>
                        <NavItem
                            label="buy crypto"
                            onClick={(arg: string) => setCurrentPage(arg)}
                            active={currentPage === "buy crypto"}
                        ></NavItem>
                        <NavItem
                            label="sell crypto"
                            onClick={(arg: string) => setCurrentPage(arg)}
                            active={currentPage === "sell crypto"}
                        ></NavItem>
                    </NavItem>

                    <NavItem
                        label="Tradeview"
                        onClick={(arg: string) => setCurrentPage(arg)}
                        icon="fa fa-bar-chart fa-lg"
                        active={currentPage === "Tradeview"}
                    />
                </ul>

                <h3>Service</h3>
                <ul>
                    <NavItem
                        label="Transactions"
                        icon="fa fa-university	fa-lg"
                        active={currentPage === ""}
                    />
                    <NavItem
                        label="Rewards"
                        onClick={(arg: string) => setCurrentPage(arg)}
                        icon="fa fa-trophy fa-lg"
                        active={currentPage === "Rewards"}
                    />
                </ul>

                <h3>Account</h3>
                <ul>
                    <NavItem
                        label="Notifications"
                        onClick={(arg: string) => setCurrentPage(arg)}
                        icon="fa fa-bell fa-lg"
                        active={currentPage === "Notifications"}
                    />
                    <NavItem
                        label="Settings"
                        onClick={(arg: string) => setCurrentPage(arg)}
                        icon="fa fa-cog fa-lg"
                        active={currentPage === "Settings"}
                    />
                </ul>
            </nav>
        </header>
    )
}