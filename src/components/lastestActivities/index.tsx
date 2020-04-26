import React from 'react'
import { Card } from 'containers'
import './index.scss'

export const LastestActivities = () => {
    const coins = [
        "ALL", "BTC", "ETH", "XRP", "XEM", 
        "LSK", "BTH", "FCT", "ETH", "JPY"
    ]

    const activities = [
        {id: 1000, date: "2018/10/02 10:57:46", detail: "Deposit Japanese Yen", price: "+10,000 JPY"},
        {id: 1001, date: "2018/10/10 10:57:46", detail: "Bought Bitcoin", price: "+ 0.00018147 BTC"},
        {id: 1002, date: "2018/10/10 10:57:46", detail: "Service fee", price: "- 500 JPY"},
        {id: 1003, date: "2018/10/13 10:57:46", detail: "システム手数料", price: "- 500 JPY", className:"decreasing"},
        {id: 1004, date: "2018/10/13 10:57:46", detail: "外貨交換", price: "+ 7,992 JPY", className: "rising"},
        {id: 1005, date: "2018/10/13 10:57:46", detail: "取引成約", price: "+ 0.5 BTC", className: "rising"},
        {id: 1006, date: "2018/10/23 10:57:46", detail: "BTC 入金", price: "- 0.00452 BTC", className: "decreasing"}
    ]
    
    return (
        <section className="lastestActivities">
            <Card className="activitiesCard">
                <div className="activitiesHeader">
                    <h2>Lastest Activities</h2>
                    <div>
                        { coins.map((coin, index) => <button key={coin} className={!index ? "selected" : undefined}>{coin}</button>) }
                    </div>
                </div>
                <div className="activitiesContent">
                    <div>
                        <span>Date</span>
                        <span>Detail</span>
                        <span>Price</span>
                    </div>
                    <ul>
                        { activities.map(({id, date, detail, price, className}) => (
                            <li className={className} key={id}>
                                <span>{date}</span>
                                <span>{detail}</span>
                                <span>{price}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="activitiesPagination">
                    <button><i className="fa fa-chevron-left"></i></button>
                    <button className = "selected" >1</button>
                    <button>2</button>
                    <button>3</button>
                    <button>4</button>
                    <button>5</button>
                    <button><i className="fa fa-chevron-right"></i></button>
                </div>
            </Card>
        </section>
    )
}