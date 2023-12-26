import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Pressable } from 'react-native';
import solvedBooks from '../assets/solved_paper.json';

const bookType = [
    { typeName: 'حل شدہ مختصر سوالات', id: 1 },
    { typeName: 'حل شدہ تفصیلی سوالات', id: 2 },
    { typeName: 'سوالیہ انشائیہ', id: 3 },
    { typeName: 'سوالیہ معروضی', id: 4 },
];

const CustomItem = ({ title, navigation, links, bookId }) => {
    const getLinkForType = (bookId) => {
      switch (bookId) {
        case 1:
          return links.short;
        case 2:
          return links.detail;
        case 3:
          return links.q_paper;
        case 4:
          return links.mcq;
        default:
          return '';
      }
    };
  
    const extractFileName = (url) => {
      const fileId = url.split('id=')[1]; // Extract the file ID from the URL
      const fileName = fileId ? `file_${fileId}.pdf` : ''; // Generate a file name using the file ID (you can modify this as needed)
    
      return fileName;
    };
    
    return (
      <Pressable onPress={() => {
        const link = getLinkForType(bookId);
        console.log(extractFileName(link), 'miiiink')

        navigation.navigate("PDF", { title, link, fileName: extractFileName(link) });
      }} style={styles.customItem}>
        <Text style={styles.titleText}>{title}</Text>
      </Pressable>
    );
  };
  
  function ClassScreen({ route, navigation }) {
    const { title, id, gradeId } = route.params;
    useEffect(() => {
      navigation.setOptions({ title: title });
    }, []);
  
    const grade = solvedBooks.find((g) => g.gradeId === gradeId);
    const filteredBooks = grade ? grade.books.find((book) => book.id === id) : null;  
    console.log(filteredBooks, 'soled')
    return (
      <View style={styles.container}>
        <FlatList
          data={bookType}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <CustomItem navigation={navigation} title={item.typeName} bookId={item.id} links={filteredBooks.links} />
          )}
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
        padding: 10,
        marginTop: 10,
        marginVertical: 8,
        marginHorizontal: 16,
        backgroundColor: '#12ad0c',
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
        color: 'white',
        fontSize: 26,
        flex: 1,
        fontFamily: "JameelNoori"
    },
});

export default ClassScreen;
