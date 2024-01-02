import React from 'react';
import { View, Text, FlatList, StyleSheet, Pressable } from 'react-native';
import chapters from '../assets/chapter.json'

const CustomItem = ({ title, link, chapterNo, fileName, navigation }) => {
  let overlayText = '';

  if (typeof chapterNo === 'number') {
    overlayText = `سبق نمبر ${chapterNo}`;
  } else if (typeof chapterNo === 'string') {
    overlayText = 'Test';
  } else if (typeof chapterNo === 'boolean') {
    overlayText = 'مشق';
  } else if (typeof chapterNo === 'object') {
    overlayText = ' مکمل';
  }
  const handlePress = () => {
    if (typeof chapterNo === 'string') {
      navigation.navigate("QuizScreen", { title, link, fileName });
    } else if (typeof chapterNo === 'object') {
      navigation.navigate("Certificate");
    } else {
      navigation.navigate("PDF", { title, link, fileName });
    }
  };

  return (
    <Pressable onPress={handlePress} style={styles.customItem}>
      <Text style={styles.titleText}>{title}</Text>
      <View style={styles.overlayView}>
        <Text style={styles.overlayText}>{overlayText}</Text>
      </View>
    </Pressable>
  );
};


function TarkeebScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <FlatList
        data={chapters}
        keyExtractor={(item, id) => id}
        renderItem={({ item, id }) => <CustomItem chapterNo={item.chapterNo} fileName={item.fileName} link={item.link} navigation={navigation} title={item.chapterName} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: "white"
  },
  customItem: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 14,
    marginTop: 10,
    marginVertical: 12,
    marginHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 3,
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: "#066103"
  },
  titleText: {
    color: '#066103',
    fontSize: 24,
    flex: 1,
    fontFamily: 'JameelNoori'
  },
  overlayView: {
    position: 'absolute',
    top: -15,
    left: 10,
    marginRight: 10,
    backgroundColor: '#0a8a06',
    marginTop: 1,
    borderRadius: 4,
    padding: 4,
    paddingHorizontal: 15,
    borderColor: "#0a8a06",
    borderWidth: 1
  },
  overlayText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'JameelNoori'
  },
});

export default TarkeebScreen;
