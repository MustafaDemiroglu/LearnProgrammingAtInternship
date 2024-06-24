// src/pages/FormularPage.tsx

import React, { useState, useEffect } from 'react';
import FormularControl from '../components/FormularControl';
import FormularView from '../components/FormularView';
import { FormularModel } from '../models/FormularModel';
import axios from 'axios';

const FormularPage: React.FC = () => {
    const [model, setModel] = useState<FormularModel | null>(null);
    const [mode, setMode] = useState<string>('UseVGrid');

    useEffect(() => {
        const fetchModel = async () => {
            try {
                const response = await axios.get<FormularModel>('/formular/1');
                setModel(response.data);
            } catch (error) {
                console.error('Error fetching data', error);
            }
        };

        fetchModel();
    }, []);

    const handleUpdate = async (updatedModel: FormularModel) => {
        try {
            // Örneğin, güncellenmiş modeli sunucuya PUT veya PATCH isteğiyle göndermek
            await axios.put(`/formular/${updatedModel.id}`, updatedModel);
            setModel(updatedModel); // Yerel state'i güncelle
        } catch (error) {
            console.error('Error updating data', error);
        }
    };

    if (!model) return <div>Loading...</div>;

    return (
        <div>
            <FormularControl mode={mode} data={model} onUpdate={handleUpdate} />
            <FormularView model={model} />
        </div>
    );
};

export default FormularPage;
