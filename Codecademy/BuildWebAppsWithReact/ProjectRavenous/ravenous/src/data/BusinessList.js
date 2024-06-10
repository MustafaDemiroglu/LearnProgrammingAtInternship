import React from "react";
import './BusinessList.css';
import Business from "../components/Business";
import sampleBusiness from "./sampleBusiness";
import sampleBusiness2 from "./sampleBusiness2";

const businessData = [
    {
        imageSrc: 'https://content.codecademy.com/programs/react/ravenous/pizza.jpg',
        name: 'MarginOtto Pizzeria',
        address: '1010 Paddington Way',
        city: 'Flavortown',
        state: 'NY',
        zipCode: '10101',
        category: 'Italian',
        rating: 4.5,
        reviewCount: 90
    },
    {
        imageSrc:
          "https://s3.amazonaws.com/codecademy-content/programs/react/ravenous/pizza.jpg",
        name: "MarginOtto Pizzeria",
        address: "1010 Paddington Way",
        city: "Bordertown",
        state: "NY",
        zipCode: "10101",
        category: "Italian",
        rating: 4.5,
        reviewCount: 90,
    },
    {
        imageSrc: 'https://via.placeholder.com/300',
        name: 'Restaurant A',
        address: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipcode: '10001',
        category: 'Italian',
        rating: 4.5,
        reviewCount:90
    },
    {
        imageSrc: 'https://via.placeholder.com/300',
        name: 'Restaurant B',
        address: '456 Maple Dr',
        city: 'Los Angeles',
        state: 'CA',
        zipcode: '90001',
        category: 'Sushi',
        rating: 4.0,
        reviewCount: 120,
    }, 
    {
        imageSrc: 'https://via.placeholder.com/300',
        name: 'The Good Place',
        address: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        zipCode: '90210',
        category: 'Cafe',
        rating: 4.5,
        reviewCount: 90
    }
        // Weitere Geschäfte können hier hinzugefügt werden
];

businessData.push(sampleBusiness);
businessData.push(sampleBusiness2);

const BusinessList = () => {
    return (
        <div className="business-list">
            {businessData.map((business, index) => (
                <Business key={index} business={business} />
            ))}
        </div>
    )
}

export default BusinessList;