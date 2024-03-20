import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App.js'; // Add .js extension
import reportWebVitals from './reportWebVitals.js'; // Add .js extension

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want to measure performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
