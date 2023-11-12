import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Linking, Image, ScrollView, Pressable, Alert } from 'react-native';
import { sendFeedback } from '../assets/api/firebase-api';

const FeedbackScreen = () => {
    const [feedback, setFeedback] = useState('');
    const [rated, setRated] = useState(null);
    const timestamp = new Date().toString();
    const emojis = [
        { rate: 1, emoji: '😠' }, // Worst
        { rate: 2, emoji: '😕' },
        { rate: 3, emoji: '😐' },
        { rate: 4, emoji: '😊' },
        { rate: 5, emoji: '😍' }, // Excellent
    ];

    const handleNumberSelect = (number) => {
        setRated(number);
    };
    const handleFollowOnInstagram = () => {
        // Define your Instagram profile URL
        const instagramProfileUrl = 'https://www.instagram.com/kanzul_madaris/';

        // Use the Linking API to open the URL
        Linking.openURL(instagramProfileUrl).catch((err) =>
            console.error('Error opening Instagram profile:', err)
        );
    };

    const handleSendFeedback = () => {
        if (rated !== null && feedback) {
            const feedbacObj = { feedback, rated, timestamp }
            sendFeedback(feedbacObj)
                .then((res) => {
                    setRated(null)
                    setFeedback('')
                    Alert.alert('Thank you for your feedback. 😊');
                })
        } else {
            Alert.alert('Please select an emoji and provide feedback.');
        }
    };

    return (
        <ScrollView>
            <View style={styles.container}>
                <Text style={{ padding: 10, color: "#000" }}>What do you feel about this App?</Text>
                <View style={styles.emojiContainer}>
                    {emojis.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => handleNumberSelect(item.rate)}
                            style={[
                                styles.emoji,
                                rated === item.rate && styles.selectedEmoji,
                            ]}
                        >
                            <Text style={styles.emojiText}>
                                {item.emoji}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
                <TextInput
                    style={styles.feedbackInput}
                    placeholder="Enter your feedback..."
                    placeholderTextColor={"#000"}
                    multiline
                    numberOfLines={5}
                    textAlignVertical="top"
                    value={feedback}
                    onChangeText={(text) => setFeedback(text)}
                />
                <TouchableOpacity style={styles.sendButton} onPress={handleSendFeedback}>
                    <Text style={styles.sendButtonText}>Send Feedback</Text>
                </TouchableOpacity>
                <Pressable onPress={handleFollowOnInstagram}>
                    <Image source={require('../assets/followus.png')} style={{ width: 180, resizeMode: "contain" }} />
                </Pressable>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        paddingHorizontal: 20,
        paddingVertical: 40
    },
    emojiContainer: {
        flexDirection: 'row-reverse',
        width: "90%",
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    emoji: {
        padding: 10,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: 'green',
    },
    selectedEmoji: {
        backgroundColor: 'lightgreen',
    },
    emojiText: {
        fontSize: 25,
    },
    feedbackInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        width: '100%',
        padding: 10,
        marginBottom: 20,
    },
    sendButton: {
        backgroundColor: 'green',
        padding: 10,
        borderRadius: 10,
    },
    sendButtonText: {
        color: 'white',
        fontSize: 16,
    },
    followUsText: {
        marginTop: 20,
    },
});

export default FeedbackScreen;
