import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Pressable } from 'react-native';
import booksData from '../assets/books.json';


const CustomItem = ({ title, id, gradeId,navigation }) => (
    <Pressable onPress={() => { navigation.navigate("ClassScreen", { title, id, gradeId }) }} style={styles.customItem}>
        <Text style={styles.titleText}>{title}</Text>
    </Pressable>
);

function BookScreen({ route, navigation }) {
    const { title, id } = route.params
    const gradeBooks = booksData.find(grade => grade.gradeId === id)?.books || [];
    const gradeId = booksData.find(grade => grade.gradeId === id)?.gradeId || 1;
    console.log(title, id)
    useEffect(() => {
        // console.log(navigation.params)
        navigation.setOptions({ title: title });
    }, [])
    return (
        <View style={styles.container}>
            <FlatList
                data={gradeBooks}
                keyExtractor={(item) => item.id}
                renderItem={({ item, id }) => <CustomItem navigation={navigation} title={item.name} id={item.id} gradeId={gradeId} />}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 10
    },
    customItem: {
        flexDirection: 'column',
        alignItems: 'center',
        padding: 12,
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
        fontSize: 22,
        flex: 1,
        fontFamily: "JameelNoori"
    },
});

export default BookScreen;
