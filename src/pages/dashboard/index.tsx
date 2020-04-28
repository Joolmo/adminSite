import React from 'react'
import { MoneyCardSection, GraphicCard, LastestActivities, NewsSection } from 'components'
import './index.scss'

export const Dashboard = () => {
    return (
        <div id="dashboard">
            <MoneyCardSection/>
            <GraphicCard/>
            <div className="sectionContainer">
                <LastestActivities/>
                <NewsSection/>
            </div>
        </div>
    )
}
