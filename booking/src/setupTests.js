// setupTests.js
import '@testing-library/jest-dom';

// App.test.js
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the header', () => {
  render(<App />);
  const headerElement = screen.getByRole('banner');
  expect(headerElement).toBeInTheDocument();
  expect(headerElement).toHaveTextContent(/Welcome to My App/i);
});