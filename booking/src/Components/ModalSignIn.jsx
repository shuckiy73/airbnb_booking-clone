import React, { useState, useEffect, useRef } from "react";
import { Modal, Button } from "react-bootstrap"; // Используем компоненты Bootstrap для React

const ModalSignIn = () => {
    const [showModal, setShowModal] = useState(false); // Состояние для управления видимостью модального окна
    const inputRef = useRef(null); // Ref для управления фокусом на input

    // Обработчик открытия модального окна
    const handleShowModal = () => setShowModal(true);

    // Обработчик закрытия модального окна
    const handleCloseModal = () => setShowModal(false);

    // Фокусировка на input при открытии модального окна
    useEffect(() => {
        if (showModal && inputRef.current) {
            inputRef.current.focus();
        }
    }, [showModal]);

    return (
        <>
            {/* Кнопка для открытия модального окна */}
            <Button variant="primary" onClick={handleShowModal}>
                Открыть модальное окно
            </Button>

            {/* Модальное окно */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Вход в систему</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Пожалуйста, введите ваши данные:</p>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Введите текст"
                        ref={inputRef}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Закрыть
                    </Button>
                    <Button variant="primary" onClick={handleCloseModal}>
                        Сохранить
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ModalSignIn;