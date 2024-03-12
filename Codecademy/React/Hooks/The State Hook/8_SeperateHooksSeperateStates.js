function Subject() {
    const [state, setState] = useState({
      currentGrade: 'B',
      classmates: ['Hasan', 'Sam', 'Emma'],
      classDetails: {topic: 'Math', teacher: 'Ms. Barry', room: 201},
      exams: [{unit: 1, score: 91}, {unit: 2, score: 88}]
})}

setState((prev) => ({
    ...prev,
     exams: prev.exams.map((exam) => {
       if( exam.unit === updatedExam.unit ){
         return { 
           ...exam,
           score: updatedExam.score
         };
       } else {
         return exam;
       }
     }),
}));

function Subject() {
    const [currentGrade, setGrade] = useState('B');
    const [classmates, setClassmates] = useState(['Hasan', 'Sam', 'Emma']);
    const [classDetails, setClassDetails] = useState({topic: 'Math', teacher: 'Ms. Barry', room: 201});
    const [exams, setExams] = useState([{unit: 1, score: 91}, {unit: 2, score: 88}]);
    // ...
}




// ein kleines Projekt
import React, { useState } from "react";

function Musical() {
   const [state, setState] = useState({
    title: "Best Musical Ever",
    actors: ["George Wilson", "Tim Hughes", "Larry Clements"],
    locations: {
      Chicago: {
        dates: ["1/1", "2/2"], 
        address: "chicago theater"}, 
      SanFrancisco: {
        dates: ["5/2"], 
        address: "sf theater"
      }
    }
  })
 }

function MusicalRefactored() {
  const [title, setTitle] = useState ('Best Musical Ever');
  const [actors, setActors] = useState(["George Wilson", "Tim Hughes", "Larry Clements"]);
  const [locations, setLocations] = useState({
      Chicago: {
        dates: ["1/1", "2/2"], 
        address: "chicago theater"}, 
      SanFrancisco: {
        dates: ["5/2"], 
        address: "sf theater"
      },);
}

