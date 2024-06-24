import React from 'react';
import { FormularModel } from '../models/FormularModel';

interface FormularControlProps {
    mode: string;
    data: FormularModel;
    onUpdate: (updatedModel: FormularModel) => void;
}

const FormularControl: React.FC<FormularControlProps> = ({ mode, data, onUpdate }) => {
    const handleUpdate = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        onUpdate({ ...data, [name]: value });
    };

    return (
        <div>
            {mode === 'UseVGrid' ? (
                <div>
                    <h2>Formular Details</h2>
                    <p>ID: {data.id}</p>
                    <label>
                        File Name:
                        <input type="text" name="fileName" value={data.fileName} onChange={handleUpdate} />
                    </label>
                    <br />
                    <label>
                        Text:
                        <textarea name="txt" value={data.txt} onChange={handleUpdate} />
                    </label>
                    <br />
                    <label>
                        Frei Text:
                        <input type="text" name="freiTxt" value={data.freiTxt} onChange={handleUpdate} />
                    </label>
                    {/* Diğer alanlar için aynı şekilde devam edebilirsiniz */}
                </div>
            ) : (
                <div>Design Mode</div>
            )}
        </div>
    );
};

export default FormularControl;
