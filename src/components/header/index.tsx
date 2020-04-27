import React, { useState } from 'react'
import { NavItem } from 'components/navItem'
import logo from 'assets/images/logo.svg'
import './index.scss'


export const Header = () => {
    const [navIsToggled, setNavToggled] = useState(false)
    const [currentPage, setCurrentPage] = useState("dashboard") // Temporal, testing
    
    const titleSection = [
        { 
            label: "Dashboard",
            icon: "fa-home fa-lg",
        },
        {
            label: "Exchange",
            icon: "fa-refresh fa-lg",
        },
        {
            label: "My Wallet",
            icon: "fa-credit-card fa-lg",
            navItems: [
                { label: "balance" },
                { label: "buy crypto"},
                { label: "sell crypto"},
            ]
        },
        {
            label: "Tradeview",
            icon: "fa-bar-chart fa-lg"
        }
    ]
    const serviceSection = [
        {
            label: "Transactions",
            icon: "fa-university fa-lg"
        },
        {
            label: "Rewards",
            icon: "fa-trophy fa-lg"
        }
    ]
    const accountSection = [
        {
            label: "Notifications",
            icon:"fa-bell fa-lg"
        },
        {
            label: "Settings",
            icon: "fa-cog fa-lg"
        }
    ]
    const bottomNav = [
        {
            label: "Log Out",
            icon: "fa-power-off"
        }
    ]

    const renderItems = (items: any[]) => {
        return items.map(item => {
            let { navItems, ...props} = item
            
            return (
                <NavItem
                    {...props}
                    onClick={ navItems ? undefined : (arg: string) => setCurrentPage(arg)}
                    active={currentPage === props.label}
                    key={props.label}
                >
                    { navItems && renderItems(navItems) }
                </NavItem>
            )
        })
    }

    return (
        <header>
            <div id="header">
                <img src={logo} alt="page logo" />
                <h1>COINSPACE</h1>
                <i className="fa fa-bars fa-2x" onClick={() => setNavToggled(prev => !prev)}></i>
            </div>
            <hr />
            <nav className={navIsToggled ? "toggled" : "notToggled"}>
                <h3>Quick Access</h3>
                <ul> {renderItems(titleSection)} </ul>

                <h3>Service</h3>
                <ul> {renderItems(serviceSection)} </ul>
                
                <h3>Account</h3>
                <ul> {renderItems(accountSection)} </ul>
                
                <ul className="bottomNav">
                    <hr/>
                    {renderItems(bottomNav)}
                </ul>
            </nav>
        </header>
    )
}