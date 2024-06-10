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
        imageSrc: 'https://www.freepik.com/free-photo/fruit-salad-spilling-floor-was-mess-vibrant-colors-textures-generative-ai_40333662.htm#query=food&position=4&from_view=keyword&track=sph&uuid=4aa4c0b2-c38e-4c46-bc08-336740fdf994',
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
    },
    {
        id: '1',
        imageSrc: 'https://via.placeholder.com/150',
        name: 'Business 1',
        address: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        zipcode: '90210',
        category: 'Food',
        rating: 4.5,
        reviewCount: 90,
    },
    {
        id: '2',
        imageSrc: 'https://via.placeholder.com/150',
        name: 'Business 2',
        address: '456 Main St',
        city: 'Anytown',
        state: 'CA',
        zipcode: '90210',
        category: 'Food',
        rating: 4.2,
        reviewCount: 70,
    },
    {
        id: '3',
        imageSrc: 'https://via.placeholder.com/150',
        name: 'Business 3',
        address: '789 Main St',
        city: 'Anytown',
        state: 'CA',
        zipcode: '90210',
        category: 'Food',
        rating: 4.7,
        reviewCount: 120,
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