import React, { useRef, useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity, PermissionsAndroid, Alert, Pressable } from 'react-native';
import ViewShot from 'react-native-view-shot';
import RNFS from 'react-native-fs';
import certificateImage from '../assets/certificate.jpg';
import ApplicationForm from './ApplicationForn';
import { useQuiz } from '../QuizContext';
import { saveApplication } from '../assets/api/firebase-api';
import { useNavigation } from '@react-navigation/native';


const CertificateScreen = ({ route }) => {
    const [name, setName] = useState('');
    const [isNameSet, setIsNameSet] = useState(false);
    const captureRef = useRef();
    const [isFormVisible, setIsFormVisible] = useState(false);
    const { completeQuiz, state, resetQuiz } = useQuiz();
    const totalQuizzes = 4; // Change this to the total number of quizzes
    const completedQuizzes = Object.values(state).filter(score => score > 0).length;
    const { navigate } = useNavigation()
    console.log(completedQuizzes, state, 'quizzz')

    // const visibleFunction = () => {
    //     console.log(completedQuizzes < totalQuizzes)
    //     if (completedQuizzes < totalQuizzes) {
    //         Alert.alert('Incomplete Quizzes', 'You must complete all quizzes to apply for your certificate.');
    //         return;
    //     } else {
    //         setIsFormVisible(true)
    //     }
    // }
    const handleDownload = async () => {
        // completedQuizzes < totalQuizzes
        if (false) {
            Alert.alert('Incomplete Quizzes', 'You must complete all quizzes to apply for your certificate.');
            return;
        }
        if (!name || name.trim() === '') {
            Alert.alert('Name Not Set', 'Please set your name before downloading the certificate.');
            return;
        }

        try {
            if (Platform.OS === 'android') {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    {
                        title: 'Storage Permission Required',
                        message: 'This app needs access to your device storage to download the certificate.',
                    }
                );
                if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                    console.error('Storage permission denied.');
                    return;
                }
            }
            const uri = await captureRef.current.capture();
            const imagePath = `${RNFS.DownloadDirectoryPath}/certificate${((Math.random() * 1000) | 0)}.jpg`;
            await RNFS.copyFile(uri, imagePath);

            Alert.alert(
                'Certificate downloaded and saved successfully.',
                imagePath,
                [
                    {
                        text: 'OK',
                        style: 'default',
                    },
                ],
                { cancelable: false }
            );
            console.log('Certificate downloaded and saved successfully.', imagePath);
        } catch (error) {
            Alert.alert(
                'Error downloading certificate.',
                error,
                [
                    {
                        text: 'OK',
                        style: 'default',
                    },
                ],
                { cancelable: false }
            );
            console.error('Error downloading certificate:', error);
        }
    };

//     const handleDownload = async (formData) => {
//         console.log(state)
//         saveApplication(formData)
//             .then(() => {
//                 console.log('Application form data saved successfully');
//                 resetQuiz('applied', true); // Reset the applied state in context
//                 setIsFormVisible(false);
//                 Alert.alert('Success', 'Application submitted successfully');
//             })
//             .catch((error) => {
//                 Alert.alert('Error: form not submitted try again', error.message);
//                 setIsFormVisible(false);
//                 resetQuiz('applied', false);
//             });
// };

return (
    <View style={styles.container}>
        <View style={{ marginTop: 50 }}>
            <View style={{ flexDirection: "row-reverse", justifyContent: "space-around" }}>
                <TextInput
                    style={{ borderWidth: 1, padding: 10, borderRadius: 10, marginVertical: 10, width: "80%", color: "#000" }}
                    placeholder="اردو میں اپنا نام لکھیں"
                    placeholderTextColor={"black"}
                    onChangeText={(text) => setName(text)}
                    value={name}
                    // editable={!isNameSet} // Disable input field if name is already set
                />
            </View>
            <ViewShot ref={captureRef} options={{ format: 'jpg', quality: 0.9 }}>
                <Image source={certificateImage} style={styles.image} />
                <Text style={styles.overlayText}> {name}  </Text>
            </ViewShot>
            <TouchableOpacity onPress={handleDownload} style={[styles.downloadButton, { backgroundColor: state.applied ? "gray" : "green" }]}>
                <Text style={styles.buttonText}>Download Certificate</Text>
            </TouchableOpacity>
            {/* <ApplicationForm
                isVisible={isFormVisible}
                onClose={() => setIsFormVisible(false)}
                onSubmit={handleDownload}
            /> */}
        </View>
    </View>

);
};

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        // padding: 5,
    },
    image: {
        width: "100%",
        height: 300,
        resizeMode: "contain",
        // marginBottom: 60,
    },
    overlayText: {
        position: 'absolute',
        top: '60%',
        left: '19%',
        transform: [{ translateX: -50 }, { translateY: -50 }],
        fontSize: 24,
        color: '#fff',
        padding: 10,
        fontFamily: "JameelNoori"
    },
    downloadButton: {
        width: "50%",
        backgroundColor: 'green',
        padding: 10,
        borderRadius: 5,
        alignSelf: "center"
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: "center",
        letterSpacing: 1,
        lineHeight: 24
    },
});

export default CertificateScreen;
