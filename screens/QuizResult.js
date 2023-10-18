import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

// Calculate the percentage and grade based on the score
const calculatePercentage = (score, totalQuestions) => {
  return ((score / totalQuestions) * 100);
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

export default function QuizResult({ score, totalQuestions, onRestart }) {
  const percentage = calculatePercentage(score, totalQuestions);
  const grade = calculateGrade(percentage);

  return (
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
      <AntDesign style={{marginBottom: -20}} name="playcircleo" size={35} color='#fff' />
        <Text style={styles.restartButtonText}>دوبارہ</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    backgroundColor: '#eee',
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
