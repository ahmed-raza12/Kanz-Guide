import React, { useRef, useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity, PermissionsAndroid, Alert, Pressable } from 'react-native';
import ViewShot from 'react-native-view-shot';
import RNFS from 'react-native-fs';
import certificateImage from '../assets/certificate.jpg';


const CertificateScreen = ({ route }) => {
    const [name, setName] = useState('');
    const [isNameSet, setIsNameSet] = useState(false);
    const captureRef = useRef();
    const [showCertificate, setShowCertificate] = useState(true);

    const saveName = () => {
        if (isNameSet) {
            Alert.alert('Name Already Set', 'You can only set your name once.');
            return;
        }
        Alert.alert(
            'Save Name',
            `Are you sure you want to save the name as ${name}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'OK',
                    onPress: () => {
                        setIsNameSet(true);
                    },
                },
            ]
        );
    };

    const handleDownload = async () => {
        if (!isNameSet) {
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

    return (
        <View style={styles.container}>
            {
                showCertificate ? (
                    // User has completed all quizzes, show certificate
                    <View style={{ marginTop: 50 }}>
                        <View style={{ flexDirection: "row-reverse", justifyContent: "space-around" }}>
                            <TextInput
                                style={{ borderWidth: 1, padding: 10, borderRadius: 10, marginVertical: 10, width: "70%" }}
                                placeholder="Enter Your Name"
                                onChangeText={(text) => setName(text)}
                                editable={!isNameSet} // Disable input field if name is already set
                            />
                            <Pressable title="Save Name" onPress={saveName} style={{ width: "20%", height: 45, justifyContent: "center", marginTop: 14, borderRadius: 10, backgroundColor: "green" }} disabled={isNameSet}>
                                <Text style={{ alignSelf: "center", color: "#fff", fontSize: 18 }}> Save </Text>
                            </Pressable>
                        </View>
                        <ViewShot ref={captureRef} options={{ format: 'jpg', quality: 0.9 }}>
                            <Image source={certificateImage} style={styles.image} />
                            <Text style={styles.overlayText}> {name}  </Text>
                        </ViewShot>
                        <TouchableOpacity onPress={handleDownload} style={styles.downloadButton}>
                            <Text style={styles.buttonText}>Download</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={{ flexDirection: "column", justifyContent: "flex-start" }}>
                        <Text style={{ color: '#000', padding: 10, textAlign: 'center', fontSize: 18 }}>
                            You have to complete all quizzes to download your certificate.
                        </Text>
                    </View>
                )
            }
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
        height: 255,
        marginBottom: 20,
    },
    overlayText: {
        position: 'absolute',
        top: '55%',
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
        textAlign: "center"
    },
});

export default CertificateScreen;
