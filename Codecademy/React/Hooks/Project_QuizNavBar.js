import React, { useState } from 'react';

export default function QuizNavBar({ questions }) {
  const [questionIndex, setQuestionIndex] = useState(0);

  // define event handlers 
  const goBack = () => setQuestionIndex(prevQuestionIndex => prevQuestionIndex - 1); 
  const goToNext = () => setQuestionIndex(prevQuestionIndex => prevQuestionIndex + 1);
  // determine if on the first question or not 
  const onFirstQuestion = questionIndex === 0;
  const onLastQuestion = questionIndex === questions.length - 1;

  return (
    <nav>
      <span>Question #{questionIndex + 1}</span>
      <div>
        <button onClick = {goBack} disabled={onFirstQuestion}>
          Go Back
        </button>
        <button onClick = {goToNext} disabled={onLastQuestion}>
          Next Question
        </button>
      </div>
    </nav>
  );
}


// dataModel.js
export const questions = [
    {
      id: 123,
      prompt: "What two things can you never eat for breakfast?",
      answer: "Lunch and dinner"
    },
    {
      id: 124,
      prompt: "What word is spelled incorrectly in every single dictionary?",
      answer: "Incorrectly"
    },
    {
      id: 125,
      prompt:
        "What do you answer every day, even though it never asks you a question?",
      answer: "Your phone"
    },
    {
      id: 126,
      prompt:
        "What starts with “e” and ends with “e” but only has one letter in it?",
      answer: "An envelope."
    },
    {
      id: 127,
      prompt: "What has a face and two hands, but no arms or legs?",
      answer: "A clock"
    }
  ];
  
  // Shout out to [Thought Catalog](https://thoughtcatalog.com/january-nelson/2018/03/65-riddles-for-kids-guaranteed-to-stump-you-too/) for these important questions :)

  
// App.js
import React from "react";
import QuizNavBar from "./QuizNavBar";
import { questions } from "./dataModel";

export default function App() {
  return <QuizNavBar questions={questions} />;
}
