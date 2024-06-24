import React from 'react';
import { FormularModel } from '../models/FormularModel';

interface FormularViewProps {
    model: FormularModel;
}

const FormularView: React.FC<FormularViewProps> = ({ model }) => {
    return (
        <div>
            <h1>{model.fileName}</h1>
            <p>ID: {model.id}</p>
            <p>File Name: {model.fileName}</p>
            <p>Text: {model.txt}</p>
            <p>Frei Text: {model.freiTxt}</p>
            <p>Unit Name: {model.unitName}</p>
            <p>Format Data: {model.fmtData}</p>
            <p>File Date: {model.fileDate}</p>
            <p>Date Created: {model.datErst}</p>
            <p>User Created: {model.userErst}</p>
            <p>Date Modified: {model.datAend}</p>
            <p>User Modified: {model.userAend}</p>
            <p>Date Deleted: {model.datDel}</p>
            {/* Diğer alanlar için aynı şekilde devam edebilirsiniz */}
        </div>
    );
};

export default FormularView;
