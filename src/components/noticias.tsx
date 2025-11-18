import "../components/css/noticias.css";
import React, { useState } from "react";
import newsData from "../data/newsData.json";

interface News {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  fullText: string;
  image: string;
}

const NewsSection: React.FC = () => {
  const [selectedNews, setSelectedNews] = useState<News | null>(null);

  return (
    <section className="news-section">
      <h2 className="news-title">Últimas Noticias</h2>

      <div className="news-list">
        {newsData.map((item) => (
          <div key={item.id} className="news-card">
            <img src={item.image} alt={item.title} className="news-image" />

            <div className="news-content">
              <h3 className="news-card-title">{item.title}</h3>
              <p className="news-subtitle">{item.subtitle}</p>
              <p className="news-description">{item.description}</p>

              <button className="btn-green" onClick={() => setSelectedNews(item)}>
                Ver más
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedNews && (
        <div className="news-modal-overlay" onClick={() => setSelectedNews(null)}>
          <div className="news-modal" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedNews.title}</h2>
            <p className="modal-subtitle">{selectedNews.subtitle}</p>
            <img src={selectedNews.image} alt="img" className="modal-image" />
            <p className="modal-text">{selectedNews.fullText}</p>

            <button className="btn-close" onClick={() => setSelectedNews(null)}>
              Cerrar
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default NewsSection;