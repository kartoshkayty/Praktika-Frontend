import { useEffect, useState } from "react";
import Carousel from "../ui/Carousel/Carousel";
import Plate from "../ui/Carousel/Plate";
import { getNews, type News } from "@/api/news/getNews";
import Fallback from "../../assets/fallback.png";

export default function News() {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNews()
      .then((news) => {
        setNews(news);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="mt-22 mb-8">
      {loading ? (
        <div className="flex">
          <div className="w-106.5 h-128.75 bg-[#D9D9D9] animate-pulse"></div>
          <div className="w-106.5 h-128.75 ml-8.25 bg-[#D9D9D9] animate-pulse"></div>
          <div className="w-106.5 h-128.75 ml-8.25 bg-[#D9D9D9] animate-pulse"></div>
        </div>
      ) : (
        <Carousel gap={33} displayElementsNumber={3} elementWidth={426}>
          {news.map((news) => (
            <Plate
              data={{
                id: news.id,
                title: news.title,
                description: news.content,
                thumbnailUrl: news.thumbnail ?? Fallback.src,
                link: "/news",
                createdAt: new Date(news.created_at),
              }}
            />
          ))}
        </Carousel>
      )}
    </div>
  );
}
