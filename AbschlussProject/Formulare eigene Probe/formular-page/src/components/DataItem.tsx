import React from "react";

interface DataItem {
    id: number;
    name: string;
    // Diğer alanlar...
}

interface VGridProps {
    data: DataItem[];
}

const VGrid: React.FC<VGridProps> = ({ data }) => {
    return (
        <div>
            {/* VGrid burada render edilir*/}
            {data && data.map((row, index) => (
                <div key={index}>{JSON.stringify(row)}</div>
            ))}
        </div>
    );
};

export default VGrid;
