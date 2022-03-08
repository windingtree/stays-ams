import { BrowserRouter } from 'react-router-dom';
import { StrictMode } from 'react';
import { render } from 'react-dom';
import reportWebVitals from './reportWebVitals';
import App from './App';
import './reset.css';

const renderApp = () => {
  render(
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>,
    document.getElementById('root')
  );
};

renderApp();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
