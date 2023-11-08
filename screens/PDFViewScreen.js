import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Button } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import Feather from 'react-native-vector-icons/Feather';
import RNFetchBlob from 'react-native-fetch-blob';
import RNFS from 'react-native-fs';
import PdfRendererView from 'react-native-pdf-renderer';
import { useQuiz } from '../QuizContext';
import { RewardedAd, RewardedAdEventType, BannerAd, BannerAdSize, TestIds, InterstitialAd, AdEventType } from 'react-native-google-mobile-ads';
import AsyncStorage from '@react-native-async-storage/async-storage';

const adUnitId = __DEV__ ? TestIds.BANNER : 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy';
const adUnitId2 = __DEV__ ? TestIds.INTERSTITIAL : 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy';
const adUnitId3 = __DEV__ ? TestIds.REWARDED : 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy';

const interstitial = InterstitialAd.createForAdRequest(adUnitId2, {
    requestNonPersonalizedAdsOnly: true,
    keywords: ['fashion', 'clothing'],
});


const rewarded = RewardedAd.createForAdRequest(adUnitId3, {
    requestNonPersonalizedAdsOnly: true,
    keywords: ['fashion', 'clothing'],
});

const INTERSTITIAL_SHOW_INTERVAL = 120 * 1000; // 2 hours in milliseconds
const REWARDED_AD_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export default function PDFViewScreen({ route, navigation }) {
    const [isConnected, setIsConnected] = useState(true);
    const [pdfPath, setPdfPath] = useState(null);
    const [error, setError] = useState(null);
    const [loaded, setLoaded] = useState(false);
    const [rewardLoaded, setRewardLoaded] = useState(false);
    const { state } = useQuiz();
    const { title, link, fileName } = route.params;

    useEffect(() => {
        console.log('1sr useEffect')
        navigation.setOptions({ title: title });
        const checkNetworkStatus = async () => {
            const state = await NetInfo.fetch();
            setIsConnected(state.isConnected);
        };
        checkNetworkStatus();

        if (isConnected) {
            // Check specific conditions to view the PDF
            let conditionMet = true;
            let errorMessage = '';

            if (fileName === 'halshuda_1') {
                if (state.quiz1 === 0) {
                    conditionMet = false;
                    errorMessage = 'You have to pass the previous quiz to view this PDF';
                }
            } else if (fileName === 'halshuda_2') {
                if (state.quiz2 === 0) {
                    conditionMet = false;
                    errorMessage = 'You have to pass the previous quiz to view this PDF';
                }
            } else if (fileName === 'halshuda_3') {
                if (state.quiz3 === 0) {
                    conditionMet = false;
                    errorMessage = 'You have to pass the previous quiz to view this PDF';
                }
            } else if (fileName === 'halshuda_4') {
                if (state.quiz4 === 0) {
                    conditionMet = false;
                    errorMessage = 'You have to pass the previous quiz to view this PDF';
                }
            }

            if (!conditionMet) {
                setError(errorMessage);
            } else {
                const destinationPath = `${RNFS.DocumentDirectoryPath}/${fileName}.pdf`;

                RNFS.exists(destinationPath)
                    .then(exists => {
                        if (exists) {
                            setPdfPath(destinationPath);
                        } else {
                            downloadPdf(link, destinationPath);
                        }
                    })
                    .catch(error => {
                        console.error('Error checking for PDF existence:', error);
                        setError(error);
                    });
            }
        }
        const unsubscribeLoaded = rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
            setRewardLoaded(true);
        });
        const unsubscribeEarned = rewarded.addAdEventListener(
            RewardedAdEventType.EARNED_REWARD,
            reward => {
                console.log('User earned reward of ', reward);
            },
        );
        rewarded.load();    // Unsubscribe from events on unmount

        const unsubscribe = interstitial.addAdEventListener(AdEventType.LOADED, () => {
            setLoaded(true);
            console.log(AdEventType.LOADED, 'adevent')
        });
        interstitial.load();
        // Unsubscribe from events on unmount
        return () => {
            unsubscribe();
            unsubscribeLoaded();
            unsubscribeEarned();
        }

    }, []);
    async function showInterstitialAd() {
        const lastShownTime = await AsyncStorage.getItem('lastInterstitialShownTime');
        const currentTime = new Date().getTime();

        if (!lastShownTime || currentTime - parseInt(lastShownTime) >= INTERSTITIAL_SHOW_INTERVAL) {
            interstitial.show();
            await AsyncStorage.setItem('lastInterstitialShownTime', currentTime.toString());
        }
    }
    const showRewardedAd = async () => {
        const lastRewardedAdTime = await AsyncStorage.getItem('lastRewardedAdTime');
        const currentTime = new Date().getTime();

        // Check if it's been 24 hours or if it's the first time
        if (!lastRewardedAdTime || currentTime - parseInt(lastRewardedAdTime) >= REWARDED_AD_INTERVAL) {
            // Show the rewarded ad
            if (loaded) {
                rewarded.show();
                await AsyncStorage.setItem('lastRewardedAdTime', currentTime.toString());
            }
        }
    }
    // Start loading the interstitial straight away
    if (loaded) {
        console.log(loaded, 'lodaed')
        showInterstitialAd();
    }
    if (rewardLoaded) {
        showRewardedAd()
    }
    const downloadPdf = async () => {
        const config = {
            fileCache: true,
            appendExt: 'pdf',
        };

        const uniqueFileName = `${fileName}.pdf`;

        const destinationPath = `${RNFS.DocumentDirectoryPath}/${uniqueFileName}`;

        try {
            const res = await RNFetchBlob.config(config).fetch('GET', link);
            const downloadedPdfPath = res.path();

            await RNFS.moveFile(downloadedPdfPath, destinationPath);
            setPdfPath(destinationPath);
        } catch (error) {
            console.error('Error downloading PDF:', error.message);
            setError(error.message);
        }
    };

    return (
        <View style={styles.container}>
            {isConnected ? (
                pdfPath ? (
                    <PdfRendererView
                        style={{ backgroundColor: '#fff' }}
                        source={`file://${pdfPath}`}
                        maxZoom={5}
                        onPageChange={(current, total) => {
                            console.log(current, total);
                        }}
                    />
                ) : (
                    error ? (
                        <Text style={styles.noWifiText}>{error}</Text>
                    ) : (
                        <ActivityIndicator size="large" style={{ transform: [{ scale: 2 }], marginVertical: 100 }} />
                    )
                )
            ) : (
                <View style={styles.noWifiContainer}>
                    <Feather name="wifi-off" size={60} color="#0a8a06" />
                    <Text style={styles.noWifiText}>No Internet Connection</Text>
                </View>
            )}
            {pdfPath ? <BannerAd
                unitId={adUnitId}
                size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
                requestOptions={{
                    requestNonPersonalizedAdsOnly: true,
                }}
            /> : null}
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    noWifiContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noWifiText: {
        fontSize: 20,
        color: 'green',
        marginTop: 20,
    },
});
