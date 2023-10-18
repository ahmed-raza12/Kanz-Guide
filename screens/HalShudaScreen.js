import React from 'react';
import { View, Text, FlatList, StyleSheet, Pressable } from 'react-native';
const classes = [
  { className: 'اولی', id: 1 },
  { className: 'ثانیہ', id: 2 },
  { className: 'ثالثہ', id: 3 },
  { className: 'رابعہ', id: 4 },
  { className: 'خامسہ', id: 5 },
  { className: 'سادسہ', id: 6 },
  { className: 'سابعہ', id: 7 },
  { className: 'دورۃ الحدیث', id: 8 },
];

  
const CustomItem = ({ title, navigation}) => (
  <Pressable onPress={() => { navigation.navigate("ClassScreen", { title: title })}} style={styles.customItem}>
    <Text style={styles.titleText}>{title}</Text>
  </Pressable>
);

function HalShudaScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <FlatList
        data={classes}
        keyExtractor={(item) => item.id}
        renderItem={({ item, id }) => <CustomItem navigation={navigation} title={item.className} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20
  },
  customItem: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 15,
    marginTop: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 3,
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: "#12ad0c"
  },
  titleText: {
    color: '#066103',
    fontSize: 24,
    flex: 1,
    fontFamily: "JameelNoori"
  },
});

export default HalShudaScreen;
