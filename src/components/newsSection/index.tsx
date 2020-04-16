import React, { useState, useEffect } from 'react'
import { Card } from 'containers'
import { INews } from 'interfaces'
import { NewsFeedService } from 'services'
import { NewsCard } from 'components/newsCard'
import './index.scss'


export const NewsSection = () => {
    const [news, setNews] = useState<INews[]>([])
    
    useEffect(() => {
        NewsFeedService().then((response) => {
            // This endpoint is not paginated, the result is always 50 elements
            setNews(response)
        })
    },[])

    return (
        <section>
            <Card className="newsSection">
                <div className = "newsHeader">
                    <h2>Crypto Newsfeed</h2>
                    <button>Subscribe</button>
                </div>
                <div className = "newsList">
                    { news.slice(0,9).map(news => <NewsCard news={news}/>)}
                </div>
            </Card>
        </section>
    )
}