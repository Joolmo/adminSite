import React from 'react'
import { INews } from 'interfaces'
import './index.scss'


interface IProps {
    news: INews
}

export const NewsCard = ({news}: IProps) => {
   /* const selectColor = (tags: string[]): string => {
        // Card styles ordered by weight, if a new have two keyWords the one with more weight will be chosen
        const cardStyles = [
            {className: "danger", keyWord: "coronavirus"},
            {className: "bitcoin", keyWord: "BTC"}
        ]
        
        tags.reduce((acum, item) => {
            car
        }, {})
    }*/

    const body = (): string => {
        if(news.body.length > 170) {
            return news.body.split(" ")
                .slice(0,16)
                .reduce((acum, item) => `${acum} ${item}`,"")
                .concat("...")
        } else {
            return news.body
        }
    }

    const date = () => {
        const actualDate = new Date()
        const {date: newsDate} = news 
        if(newsDate.getDate() === actualDate.getDate() && newsDate.getMonth() == actualDate.getMonth()) {
            return `Today   ${newsDate.getHours().toString().padStart(2,'0')}:${newsDate.getMinutes().toString().padStart(2,'0')}`
        } return `Yesterday` //temporal
    }

    return (
        <div className="newsCard">
            <div>
                <span>{date()}</span>
                <h3>{news.title}</h3>
                <p>{body()}</p>
            </div>
            <div>
                <span>Security</span>
            </div>
        </div>
    )
}