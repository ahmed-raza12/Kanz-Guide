import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

// Step 1: Create a new context
const QuizContext = createContext();

// Step 2: Define the initial state and reducer
const initialState = {
  quiz1: 0,
  quiz2: 0,
  quiz3: 0,
  quiz4: 0,
  applied: false,
};

const quizReducer = (state, action) => {
  switch (action.type) {
    case 'COMPLETE_QUIZ':
      return { ...state, [action.quizName]: action.score };
    case 'RESET_QUIZ':
      return { ...state, [action.quizName]: action.data };
    case 'LOAD_STATE':
      return { ...state, ...action.state };
    default:
      return state;
  }
};

// Step 3: Create a context provider
export const QuizProvider = ({ children }) => {
  const [state, dispatch] = useReducer(quizReducer, initialState);
  // const [interstitialAd, setInterstitialAd] = useState(null);
  // const [rewardedAd, setRewardedAd] = useState(null);

  useEffect(() => {
    // Load state from AsyncStorage when the component mounts
    const loadQuizState = async () => {
      try {
        const savedState = await AsyncStorage.getItem('quizState');
        if (savedState) {
          const loadedState = JSON.parse(savedState);
          dispatch({ type: 'LOAD_STATE', state: loadedState });
        }
      } catch (error) {
        console.error('Error loading quiz state from AsyncStorage:', error);
      }
    };
    
    loadQuizState();
  }, []); // Run this effect only once

  const completeQuiz = (quizName, score) => {
    dispatch({ type: 'COMPLETE_QUIZ', quizName, score });
  };

  const resetQuiz = (quizName, data) => {
    dispatch({ type: 'RESET_QUIZ', quizName, data });
  };
  
  // Update AsyncStorage whenever the state changes
  useEffect(() => {
    try {
      AsyncStorage.setItem('quizState', JSON.stringify(state));
    } catch (error) {
      console.error('Error saving quiz state to AsyncStorage:', error);
    }
  }, [state]);

  return (
    <QuizContext.Provider value={{ state, completeQuiz, resetQuiz }}>
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
