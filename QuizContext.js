import React, { createContext, useContext, useReducer } from 'react';

// Step 1: Create a new context
const QuizContext = createContext();

// Step 2: Define the initial state and reducer
const initialState = {
  quiz1: 0,
  quiz2: 0,
  quiz3: 0,
  quiz4: 0,
};

const quizReducer = (state, action) => {
  switch (action.type) {
    case 'COMPLETE_QUIZ':
      return { ...state, [action.quizName]: action.score };
    default:
      return state;
  }
};

// Step 3: Create a context provider
export const QuizProvider = ({ children }) => {
  const [state, dispatch] = useReducer(quizReducer, initialState);

  const completeQuiz = (quizName, score) => {
    dispatch({ type: 'COMPLETE_QUIZ', quizName, score });
  };

  return (
    <QuizContext.Provider value={{ state, completeQuiz }}>
      {children}
    </QuizContext.Provider>
  );
};

// Step 4: Use the context in your components
export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};
