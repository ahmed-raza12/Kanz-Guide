import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import quizData1 from '../assets/quiz-1.json'
import QuizResult from './QuizResult';
import CustomHeader from '../navigation/CustomHeader';
import { useQuiz } from '../QuizContext'; // Import the useQuiz hook

export default function QuizScreen({route ,navigation}) {
  const { link, title } = route.params
  const { completeQuiz, state } = useQuiz();

  console.log(link, state, 'quiz link')
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [questions, setQuestions] = useState([]);
  const totalQuestionsToDisplay = 5;
  const [quizCompleted, setQuizCompleted] = useState(false); // New state to track quiz completion

  useEffect(() => {
    if (!quizCompleted) {
      navigation.setOptions({
        header: () => <CustomHeader title={title} />,
      });
    } else {
      navigation.setOptions({
      header: () => <CustomHeader title={"Result"} />,
    });
    }
    const originalQuestions = quizData1;
    const shuffledQuestions = shuffleArray(originalQuestions);
    const selectedQuestions = shuffledQuestions.slice(0, totalQuestionsToDisplay);
    setQuestions(selectedQuestions);
    
  }, [quizCompleted]);

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const handleOptionSelect = (optionIndex) => {
    setSelectedOption(optionIndex);
  };
  const handleNextQuestion = () => {
    if (selectedOption !== null) {
      if (quizData1[currentQuestion].ansIndex === selectedOption) {
        setScore(score + 1);
      }

      setSelectedOption(null);
      if (currentQuestion === totalQuestionsToDisplay - 1) {
        // Check if the current question is the last one
        const quizCompletionThreshold = 0.2; // Set the completion threshold to 80%
        const userScore = score / totalQuestionsToDisplay;
        if (userScore >= quizCompletionThreshold) {
          completeQuiz('quiz1', userScore);
        }  
        setQuizCompleted(true); // Set the quiz as completed
        navigation.setOptions({
          header: () => <CustomHeader title={"Result"} />,
        }); 
        // navigation.setOptions({title: "Result"})
      } else {
        setCurrentQuestion(currentQuestion + 1);
      }
    }
  };
  const handleQuizRestart = () => {
    // Reset the quiz to its initial state
    setCurrentQuestion(0);
    setSelectedOption(null);
    setScore(0);
    setQuizCompleted(false);
    navigation.setOptions({
      header: () => <CustomHeader title={title} />,
    });
  };


  if (questions.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading questions...</Text>
      </View>
    );
  }
  return (
    <View>
      {quizCompleted ? ( // Conditionally render the QuizResult component
        <QuizResult
          score={score}
          totalQuestions={totalQuestionsToDisplay}
          onRestart={handleQuizRestart}
        />
      ) : (
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.questionBox}>
            <View style={styles.overlayCircle}>
              <Text style={styles.questionNumberText}>
                Q {currentQuestion + 1}/{questions.length}
              </Text>
            </View>
            <Text style={styles.questionText}>
              {questions[currentQuestion].question}
            </Text>
          </View>
          <View style={styles.optionsContainer}>
            {questions[currentQuestion].options.map((option, index) => (
              <Pressable
                key={index}
                style={[
                  styles.optionButton,
                  selectedOption === index && styles.selectedOption,
                ]}
                onPress={() => handleOptionSelect(index)}
              >
                <View style={styles.optionCircle}>
                  <Text style={styles.optionCircleText}>
                    {index === 0 ? 'ا' : index === 1 ? 'ب' : index === 2 ? 'ج' : 'د'}
                  </Text>
                </View>
                <Text style={styles.optionText}> {option} </Text>
              </Pressable>
            ))}
          </View>
          <Pressable
            style={styles.nextButton}
            onPress={handleNextQuestion}
          >
            <Text style={styles.nextButtonText}>
              {currentQuestion === totalQuestionsToDisplay - 1 ? 'Finish' : 'Next'}
            </Text>
          </Pressable>
        </ScrollView>
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
  },
  questionBox: {
    width: '90%',
    // flex: 1, // Allow the question box to expand and take available vertical space
    marginTop: 30,
    borderWidth: 1,
    borderColor: '#eee',
    padding: 30,
    borderRadius: 10,
    position: 'relative',
    marginBottom: 20,
    backgroundColor: '#fff',
    alignItems: 'center', // Center the content horizontally
    justifyContent: 'center', // Center the content vertically

  },
  overlayCircle: {
    width: 100,
    height: 40,
    borderRadius: 40,
    backgroundColor: 'green',
    position: 'absolute',
    top: -20,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  questionNumberText: {
    fontSize: 14,
    color: 'white',
    fontWeight: 'bold',
    paddingHorizontal: 8,
  },
  questionText: {
    fontSize: 22,
    textAlign: 'center',
    marginTop: 30,
    color: '#000',
    fontFamily: "JameelNoori",
    // fontWeight: "600"
  },
  optionsContainer: {
    width: '90%',
  },
  optionCircle: {
    width: 50,
    height: 50,
    borderRadius: 30,
    backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    // marginLeft: 20
  },

  optionCircleText: {
    color: 'white',
    fontSize: 22,
    // fontFamily: "JameelNoori"
  },

  optionButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: 'center',

  },
  optionText: {
    fontSize: 20,
    color: '#000',
    paddingRight: 15,
    fontFamily: "JameelNoori"
  },
  selectedOption: {
    backgroundColor: 'lightgreen',
  },
  nextButton: {
    marginTop: 10,
    marginBottom: 10,
    paddingHorizontal: 30,
    paddingVertical: 10,
    backgroundColor: 'green',
    borderRadius: 10,
  },
  nextButtonText: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
  },
});
