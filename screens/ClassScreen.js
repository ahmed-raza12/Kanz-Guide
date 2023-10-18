import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Pressable } from 'react-native';
const classes = [
    { className: 'مختصر سوالات', id: 1 },
    { className: 'تفصیلی سوالات', id: 2 },
    { className: ' کثیر الانتخابی سوالات', id: 3 },
    { className: 'Guess Paper', id: 4 },
];


const CustomItem = ({ title, navigation }) => (
    <Pressable onPress={() => {
        navigation.navigate("PDF", { title })
    }} style={styles.customItem}>
        <Text style={styles.titleText}>{title}</Text>
    </Pressable>
);

function ClassScreen({ route, navigation }) {
    const { title } = route.params
    useEffect(() => {
        navigation.setOptions({ title: title });
    }, [])
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
