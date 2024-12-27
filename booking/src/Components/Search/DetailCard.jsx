import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Footer from "../General page/Footer";
import NavigateHeader from "../General page/NavigateHeader";
import Card from "./Card";
import NotFound from "../General page/NotFound";

const DetailCard = ({ images }) => {
    const { id } = useParams();
    const [objectRoom, setObjectRoom] = useState(null);
    const [reviews, setReviews] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_URL_ID = `http://127.0.0.1:8000/api/v1/search/${id}/`;
    const API_REVIEWS = `http://127.0.0.1:8000/api/v1/object_reviews/${id}/`;
    const HEADERS = {
        'Accept': '*/*',
        // "Authorization": `Bearer ${sessionStorage.getItem("auth_token")}`
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Запрос данных о комнате
                const roomResponse = await axios.get(API_URL_ID, { headers: HEADERS });
                setObjectRoom(roomResponse.data);

                // Запрос отзывов
                const reviewsResponse = await axios.get(API_REVIEWS, { headers: HEADERS });
                setReviews(reviewsResponse.data);
            } catch (error) {
                console.error("Ошибка при загрузке данных:", error);
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, API_URL_ID, API_REVIEWS]);

    if (loading) {
        return <div>Загрузка...</div>;
    }

    if (error) {
        return <NotFound />;
    }

    return (
        <div>
            <NavigateHeader />
            <Card item={objectRoom} reviews={reviews} image={images} />
            <Footer />
        </div>
    );
};

export default DetailCard;