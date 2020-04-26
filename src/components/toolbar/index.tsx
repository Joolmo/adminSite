import React from 'react'
import boxIcon from 'assets/images/boxIcon.svg'
import menuIcon from 'assets/images/menuIcon.svg'
import searchIcon from 'assets/images/searchIcon.svg'
import profileIcon from 'assets/images/profileIcon.svg'
import configIcon from 'assets/images/configIcon.svg'
import notificationsIcon from 'assets/images/notificationsIcon.svg'
import languageIcon from 'assets/images/languageIcon.svg'
import './index.scss'


export const Toolbar = () => {
    return(
        <div id="toolbar">
            <div>
                <img src={menuIcon} alt="menu"/>
                <img src={boxIcon} alt="box"/>
                <div>
                    <input placeholder="Type any cryptocurrency..."/>
                    <img src={searchIcon} alt="search"/>
                </div>
            </div>
            <div>
                <img className="profile" src={profileIcon} alt="profile"/>
                <img src={configIcon} alt="config"/>
                <img src={notificationsIcon} alt="notifications"/>
                <img src={languageIcon} alt="language"/>
            </div>
        </div>
    )
}