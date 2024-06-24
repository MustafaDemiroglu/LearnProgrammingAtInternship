import React from "react";

interface VGridProps {
    data: any[];
}

const VGrid: React.FC<VGridProps> = ({ data }) => {
    return (
        <div>
            {/* VGrid burada render edilir*/}
            {data && data.map((row: any, index: number) => (
                <div key={index}>{JSON.stringify(row)}</div>
            ))}
        </div>
    );
};

export default VGrid;
