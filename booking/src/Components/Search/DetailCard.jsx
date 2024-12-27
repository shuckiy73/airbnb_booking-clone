import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Card from "./Card";
import NotFound from "../General page/NotFound";

const DetailCard = () => {
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
        const abortController = new AbortController();

        const fetchData = async () => {
            try {
                // Запрос данных о комнате
                const roomResponse = await axios.get(API_URL_ID, {
                    headers: HEADERS,
                    signal: abortController.signal,
                });
                setObjectRoom(roomResponse.data);

                // Запрос отзывов
                const reviewsResponse = await axios.get(API_REVIEWS, {
                    headers: HEADERS,
                    signal: abortController.signal,
                });
                setReviews(reviewsResponse.data);
            } catch (error) {
                if (!abortController.signal.aborted) {
                    console.error("Ошибка при загрузке данных:", error);
                    setError(error);
                }
            } finally {
                if (!abortController.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        fetchData();

        return () => {
            abortController.abort(); // Отмена запросов при размонтировании
        };
    }, [id, API_URL_ID, API_REVIEWS]);

    if (loading) {
        return (
            <div className="text-center mt-5">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Загрузка...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-danger text-center mt-5">
                Произошла ошибка при загрузке данных. Пожалуйста, попробуйте позже.
            </div>
        );
    }

    return (
        <div>
            <Card item={objectRoom} reviews={reviews} />
        </div>
    );
};

export default DetailCard;