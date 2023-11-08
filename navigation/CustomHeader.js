import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableHighlight, TouchableWithoutFeedback } from 'react-native';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';

const CustomHeader = ({ title }) => {
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const titlesWithMoreIcon = title === 'حل شدہ' ? true : false; // Add your specific titles here
  const { navigate } = useNavigation()
  const feedbackHandle = () => {
    setDropdownVisible(false)
    navigate('FeedbackScreen')
  }
  return (
    <View style={styles.headerContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {titlesWithMoreIcon && (
          <FontAwesome6 name="ellipsis-vertical" onPress={() => setDropdownVisible(!isDropdownVisible)} size={22} color="#fff" style={styles.moreIcon} />
        )}
      </View>
      {isDropdownVisible && (
        <TouchableWithoutFeedback onPress={() => setDropdownVisible(false)}>
          <View style={styles.overlay}>
            <TouchableHighlight onPress={feedbackHandle} style={styles.dropdown}>
              <Text style={styles.feedbackText}> اپنی رائے دیجئے </Text>
            </TouchableHighlight>
          </View>
        </TouchableWithoutFeedback>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    position: 'relative',
    width: '100%',
    zIndex: 1,
    // Add any other styles you need for the header container
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    backgroundColor: '#12ad0c',
  },
  title: {
    fontSize: 26,
    fontFamily: 'JameelNoori',
    textAlign: 'center',
    color: '#fff',
    flex: 1,
  },
  moreIcon: {
    right: 24,
    padding: 5,
  },
  overlay: {
    position: 'absolute',
    top: 60,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 2,
  },
  dropdown: {
    backgroundColor: 'green',
    alignSelf: "flex-end",
    // padding: 10,
    marginTop: 4,
    width: 140,
    marginRight: 16,
    borderRadius: 10
  },
  feedbackText: {
    color: 'white',
    textAlign: "center",
    fontSize: 22,
    marginBottom: 10,
    fontFamily: "JameelNoori"
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 5,
    backgroundColor: '#12ad0c',
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default CustomHeader;
