import { render, screen } from '@testing-library/react';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';

test('renders the home page by default', () => {
    render(
        <Router>
            <App />
        </Router>
    );

    // Проверяем, что заголовок "Найдём, где остановиться!" отображается
    const headingElement = screen.getByText(/Найдём, где остановиться!/i);
    expect(headingElement).toBeInTheDocument();
});