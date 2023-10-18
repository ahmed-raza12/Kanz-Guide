// CustomHeader.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CustomHeader = ({ title }) => {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'center', // Align content to the right
    alignItems: 'center',
    width: "100%",
    height: 60, // Adjust as needed
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    backgroundColor: "#12ad0c"
  },
  title: {
    fontSize: 26,
    fontFamily: 'JameelNoori',
    textAlign: "center",
    color: "#fff"
  },
});

export default CustomHeader;
