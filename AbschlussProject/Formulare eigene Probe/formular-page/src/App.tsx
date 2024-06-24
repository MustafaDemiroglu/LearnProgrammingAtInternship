// src/App.tsx

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import FormularPage from './pages/FormularPage';

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<FormularPage />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
