import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { BannerAd, BannerAdSize, TestIds, InterstitialAd, AdEventType } from 'react-native-google-mobile-ads';

const adUnitId = true ? TestIds.BANNER : 'ca-app-pub-3940256099942544/6300978111';

// Calculate the percentage and grade based on the score
const calculatePercentage = (score, totalQuestions) => {
  const percentage = (score / totalQuestions) * 100;
  const roundedPercentage = Math.round(percentage);
  return roundedPercentage;
};


const calculateGrade = (percentage) => {
  if (percentage === 100) {
    return 'A++';
  } else if (percentage >= 90) {
    return 'A+';
  } else if (percentage >= 80) {
    return 'A';
  } else {
    return 'B'; // You can define more grades as needed
  }
};

export default function QuizResult({ score, totalQuestions, onRestart, correctAnswers }) {
  const percentage = calculatePercentage(score, totalQuestions);
  const grade = calculateGrade(percentage);
  console.log(correctAnswers, 'correct');
  const correctData = correctAnswers.filter(item => {
    return item.ansIndex >= 0 && item.ansIndex < item.options.length;
  });

  // Take the first 5 correct answers
  const firstFiveCorrectAnswers = correctData.slice(0, 5);

  return (
    <View style={{marginBottom: 80}}>
      <View style={{ backgroundColor: '#eee', height: 'auto', borderWidth: 1, borderColor: 'green', marginTop: 2 }}>
        <BannerAd
          unitId={adUnitId}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          // style={{border: '1px solid black'}}
          requestOptions={{
            // requestNonPersonalizedAdsOnly: true,
          }}
          onAdFailedToLoad={e => {
            // console.log('onAdFailedToLoad');
            // console.log(bannerLoaded, 'banner');
            console.log(e);
          }}
          onAdLoaded={e => {
            // console.log('onAdLoaded');
            console.log(e);
          }}

        />
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.resultBox}>
          <View style={styles.circleContainer}>
            <View style={styles.circle}>
              <Text style={styles.circleText}>{score}</Text>
            </View>
            <Text style={styles.circleLabel}>درست جواب</Text>
          </View>
          <View style={styles.circleContainer}>
            <View style={styles.circle}>
              <Text style={styles.circleText}>{percentage}%</Text>
            </View>
            <Text style={styles.circleLabel}>اوسط فیصد</Text>
          </View>
          <View style={styles.circleContainer}>
            <View style={styles.circle}>
              <Text style={styles.circleText}>{grade}</Text>
            </View>
            <Text style={styles.circleLabel}>گریڈ</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.restartButton} onPress={onRestart}>
          <AntDesign style={{ marginBottom: -20 }} name="playcircleo" size={35} color='#fff' />
          <Text style={styles.restartButtonText}>دوبارہ</Text>
        </TouchableOpacity>
        {
          correctAnswers ?
            <View style={styles.correctAnswersContainer}>
              <Text style={styles.correctAnswersTitle}>Correct Answers</Text>
              {firstFiveCorrectAnswers.map((item, index) => (
                <View key={index} style={styles.answerContainer}>
                  <Text style={styles.questionText}>
                    {`سوال : ${item.question}`}
                  </Text>
                  <Text style={styles.answerText}>
                    {`جواب : ${item.options[item.ansIndex]}`}
                  </Text>
                </View>
              ))}
            </View> : null
        }
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    backgroundColor: '#eee',
  },
  correctAnswersContainer: {
    marginVertical: 20,
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
  },
  correctAnswersTitle: {
    color: "green",
    fontSize: 20,
    textAlign: "center",
    marginVertical: 10,
    fontWeight: "bold"
  },
  answerContainer: {
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
  },
  questionText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: "black",
  },
  answerText: {
    fontSize: 16,
    color: "black"
  },
  resultBox: {
    flexDirection: 'row',
    alignSelf: "center",
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    width: "90%",
    padding: 20,
    paddingVertical: 60,
    backgroundColor: "#fff",
    borderRadius: 20,
    marginTop: 20
  },
  circleContainer: {
    alignItems: 'center',
  },
  circle: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 90,
    width: 90,
    borderRadius: 100,
    borderWidth: 4,
    borderColor: "green"
  },
  circleText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: "green",
  },
  circleLabel: {
    fontSize: 18,
    color: 'green',
    fontFamily: "JameelNoori"
  },
  restartButton: {
    backgroundColor: 'green',
    // padding: 20,
    justifyContent: "center",
    borderRadius: 20,
    height: 100,
    alignItems: "center",
    alignContent: "center",
    width: 120,
    marginVertical: 30
  },
  restartButtonText: {
    color: 'white',
    fontSize: 30,
    fontFamily: "JameelNoori"
  },
});
