import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Alert } from 'react-native';
import QuizResult from './QuizResult';
import CustomHeader from '../navigation/CustomHeader';
import { useQuiz } from '../QuizContext'; // Import the useQuiz hook
import { RewardedAd, InterstitialAd,  AdEventType, RewardedAdEventType, TestIds } from 'react-native-google-mobile-ads';
import NetInfo from '@react-native-community/netinfo';
import Feather from 'react-native-vector-icons/Feather';


const adUnitId = true ? TestIds.REWARDED : 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy';
const adUnitIdInterstitial = true ? TestIds.INTERSTITIAL : 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy';

const rewarded = RewardedAd.createForAdRequest(adUnitId, {
  requestNonPersonalizedAdsOnly: true,
  keywords: ['clothing', 'fashion']
});

const interstitial = InterstitialAd.createForAdRequest(adUnitIdInterstitial, {
  keywords: ['fashion', 'clothing'],
});

const quizData = {
  1: require('../assets/quiz-1.json'),
  2: require('../assets/quiz-2.json'),
  3: require('../assets/quiz-3.json'),
  4: require('../assets/quiz-4.json')
  // Add more quiz data files as needed
};

export default function QuizScreen({ route, navigation }) {
  const { link, title } = route.params
  const { completeQuiz, state, resetQuiz } = useQuiz();
  const [loaded, setLoaded] = useState(false);
  const [institialLoaded, setInstitialLoaded] = useState(false);

  // console.log(link, state, 'quiz link')
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [isConnected, setIsConnected] = useState(true);
  const [showRewardedAdDialog, setShowRewardedAdDialog] = useState(false);
  const [correctAnswers, setcorrectAnswers] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [showAnswer, setShowAnswer] = useState(true);
  const totalQuestionsToDisplay = 7;
  const [quizCompleted, setQuizCompleted] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    const unsubscribeLoaded = rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
      setLoaded(true);
    });
    const unsubscribeEarned = rewarded.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      reward => {
        console.log('User earned reward of ', reward);
      },
    );
    const unsubscribeInstitial = interstitial.addAdEventListener(AdEventType.LOADED, () => {
      setInstitialLoaded(true);
    });
    interstitial.load();
    rewarded.load();
    return () => {
      unsubscribe();
      unsubscribeLoaded();
      unsubscribeEarned();
    };
  }, []);

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
    if (state[`quiz${link}`]) {
      setQuizCompleted(true)
      setScore(state[`quiz${link}`])
    }
    const originalQuestions = quizData[link];
    const shuffledQuestions = shuffleArray(originalQuestions);
    const selectedQuestions = shuffledQuestions.slice(0, totalQuestionsToDisplay);
    setQuestions(selectedQuestions);
    setcorrectAnswers(questions)
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
    console.log(showRewardedAdDialog, 'show reward');
    if (selectedOption !== null) {
      const isCorrect = quizData[link][currentQuestion].ansIndex === selectedOption;

      setScore((prevScore) => isCorrect ? prevScore + 1 : prevScore);
      console.log(correctAnswers,questions, 'cooo');
      setSelectedOption(null);
      if (currentQuestion === totalQuestionsToDisplay - 1) {
        const quizCompletionThreshold = 0.8;
        const userScore = score; // Update the user's score based on the current question
        if (userScore / totalQuestionsToDisplay >= quizCompletionThreshold) {
          completeQuiz(`quiz${link}`, userScore);
        }
        // console.log(loaded, 'loaded')
        
        if (!showRewardedAdDialog) {
          console.log(showRewardedAdDialog, 'shoee');
          setShowRewardedAdDialog(true);
        } else {
          console.log(showRewardedAdDialog, 'shoee');
          setQuizCompleted(true);
          navigation.setOptions({
            header: () => <CustomHeader title={"Result"} />,
          });
        }

      } else {
        setCurrentQuestion(currentQuestion + 1);
      }
    } else {
      Alert.alert('Please select an option!')
    }
  };
  const handleRewardedAdDecision = (decision) => {
    setShowRewardedAdDialog(false);
    if (decision === 'yes') {
      setShowAnswer(true)
      if (loaded) {
        rewarded.show()
      } else {
        setQuizCompleted(true);
          navigation.setOptions({
            header: () => <CustomHeader title={"Result"} />,
          });
      }
    } else {
      setShowAnswer(false)
      setQuizCompleted(true);
          navigation.setOptions({
            header: () => <CustomHeader title={"Result"} />,
          });
    }
  };

  const handleQuizRestart = () => {
    // Reset the quiz to its initial state
    setCurrentQuestion(0);
    setSelectedOption(null);
    setScore(0);
    setQuizCompleted(false);
    completeQuiz(`quiz${link}`, 0)
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
  if (institialLoaded) {
    // interstitial.show()
  }
  return (
    <View>
      {
        !isConnected ? (
          <View style={styles.noWifiContainer}>
            <Feather name="wifi-off" size={60} color="#0a8a06" />
            <Text style={styles.noWifiText}>No Internet Connection</Text>
          </View>
        ) :
          quizCompleted ? ( // Conditionally render the QuizResult component
          <QuizResult
          score={score}
          totalQuestions={totalQuestionsToDisplay}
          onRestart={handleQuizRestart}
          correctAnswers={showAnswer ? correctAnswers : []}
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
          )
      }
      {
        showRewardedAdDialog && (
          <View style={styles.dialogContainer}>
            <Text style={styles.dialogText}>پہلے 5 سوالات کے جوابات دیکھنے کے لیے ایک مختصر اشتہار دیکھیں۔</Text>
            <View style={styles.buttonsContainer}>
              <Pressable
                style={styles.button}
                onPress={() => handleRewardedAdDecision('yes')}
              >
                <Text style={styles.buttonText}>Yes</Text>
              </Pressable>
              <Pressable
                style={styles.button}
                onPress={() => handleRewardedAdDecision('no')}
              >
                <Text style={styles.buttonText}>No</Text>
              </Pressable>
            </View>
          </View>
        )

      }
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
  dialogContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: '40%',
    left: '10%',
    right: '10%',
    zIndex: 999,
  },
  dialogText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    color: "black"
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  button: {
    backgroundColor: '#3498db',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    elevation: 3,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
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
  noWifiContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: "center",
    marginTop: 20
  },
  noWifiText: {
    fontSize: 20,
    color: 'green',
    marginTop: 20,
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
