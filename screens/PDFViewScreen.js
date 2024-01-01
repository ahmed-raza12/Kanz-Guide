import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Button, Pressable } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import Feather from 'react-native-vector-icons/Feather';
import RNFetchBlob from 'react-native-fetch-blob';
import RNFS from 'react-native-fs';
import PdfRendererView from 'react-native-pdf-renderer';
import { useQuiz } from '../QuizContext';
import { RewardedAd, RewardedAdEventType, BannerAd, BannerAdSize, TestIds, InterstitialAd, AdEventType } from 'react-native-google-mobile-ads';
import AsyncStorage from '@react-native-async-storage/async-storage';

const adUnitId = true ? TestIds.BANNER : 'ca-app-pub-3940256099942544/6300978111';
const adUnitId2 = true ? TestIds.INTERSTITIAL : 'ca-app-pub-3940256099942544/1033173712';
const adUnitId3 = true ? TestIds.REWARDED : 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy';

const interstitial = InterstitialAd.createForAdRequest(adUnitId2, {
    requestNonPersonalizedAdsOnly: true,
});


const rewarded = RewardedAd.createForAdRequest(adUnitId3, {
    requestNonPersonalizedAdsOnly: true,
    // keywords: ['fashion', 'clothing'],
});

export default function PDFViewScreen({ route, navigation }) {
    const [isConnected, setIsConnected] = useState(true);
    const [pdfPath, setPdfPath] = useState(null);
    const [error, setError] = useState(null);
    const [bannerLoaded, setBannerLoaded] = useState(false);
    const [loaded, setLoaded] = useState(null);
    const [showLoader, setShowLoader] = useState(true);
    const [rewardLoaded, setRewardLoaded] = useState(false);
    const [screenViews, setScreenViews] = useState(0);
    const { state } = useQuiz();
    const { title, link, fileName } = route.params;
    const [showRewardedAdDialog, setShowRewardedAdDialog] = useState(false);
    useEffect(() => {
        const unsubscribe = interstitial.addAdEventListener(AdEventType.LOADED, () => {
            setLoaded(true);
            console.log(AdEventType.LOADED, 'adevent')
        });
        const unsubscribeError = interstitial.addAdEventListener(AdEventType.ERROR, () => {
            setLoaded(false);
            console.log(AdEventType.ERROR, 'adevent')
        });
        const unsubscribeClosed = interstitial.addAdEventListener(AdEventType.CLOSED, () => {
            setLoaded(false);
            console.log(AdEventType.CLOSED, 'adevent')
        });
        const unsubscribeClicked = interstitial.addAdEventListener(AdEventType.CLICKED, () => {
            setLoaded(false);
            console.log(AdEventType.CLICKED, 'adevent')
        });
        interstitial.load();
        rewarded.load();    // Unsubscribe from events on unmount
        const trackScreenViews = async () => {
            try {
                const disableCountString = await AsyncStorage.getItem('disableCount');
                const disableCount = disableCountString === 'true'; // Parse string to boolean
                console.log(disableCountString, 'dis');

                if (disableCount) {
                    const storedDisableViews = await AsyncStorage.getItem('disableViews');
                    const currentDisableViews = !isNaN(parseInt(storedDisableViews)) ? parseInt(storedDisableViews) : 0;
                    const updatedDisableViews = currentDisableViews + 1;
                    await AsyncStorage.setItem('disableViews', updatedDisableViews.toString());
                    console.log(updatedDisableViews, 'dis views');

                    if (updatedDisableViews === 10) {
                        await AsyncStorage.setItem('disableCount', 'false');
                        await AsyncStorage.setItem('disableViews', '0');
                    }

                } else {
                    // Increment screenViews and videoViews if disableCount is false
                    const storedViews = await AsyncStorage.getItem('screenViews');
                    const currentViews = storedViews ? parseInt(storedViews) : 0;
                    const updatedViews = currentViews + 1;
                    setScreenViews(updatedViews);
                    await AsyncStorage.setItem('screenViews', updatedViews.toString());

                    const videoViews = await AsyncStorage.getItem('videoViews');
                    const currentVidViews = videoViews ? parseInt(videoViews) : 0;
                    const updatedVidViews = currentVidViews + 1;
                    await AsyncStorage.setItem('videoViews', updatedVidViews.toString());
                    console.log(updatedViews, 'views');
                    console.log(updatedVidViews, 'video views');

                    if (updatedViews === 4) {
                        setScreenViews(0);
                        await AsyncStorage.setItem('screenViews', '0');
                        handleScreenViewCount10();
                    }

                    if (updatedVidViews === 10) {
                        await AsyncStorage.setItem('videoViews', '0');
                        handleVidView();
                    }
                }

            } catch (error) {
                console.error('Error tracking screen views:', error);
            }
        };
        navigation.setOptions({ title: title });
        const checkNetworkStatus = async () => {
            const response = await NetInfo.fetch();
            // console.log(response)
            if (response.isConnected) {
                setIsConnected(true);
            } else {
                setIsConnected(false);
            }
        };

        checkNetworkStatus();

        if (isConnected) {
            trackScreenViews();
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


        // Unsubscribe from events on unmount
        return () => {
            unsubscribe();
            unsubscribeLoaded();
            unsubscribeClicked();
            unsubscribeClosed();
            unsubscribeError();
            unsubscribeEarned();
            setScreenViews((prevViews) => prevViews + 1);
        }

    }, []);

    const handleRewardedAdDecision = async (decision) => {
        console.log(decision);
        if (decision === 'yes') {
            console.log(decision, 'deee');
            await AsyncStorage.setItem('disableCount', 'true');
            setShowRewardedAdDialog(false)
            if (rewardLoaded) {
                rewarded.show()
            }
        } else {
            setShowRewardedAdDialog(false)
        }
    };
    const handleScreenViewCount10 = async () => {
        console.log('Screen view count reached 5!', loaded);
        if (loaded) {
            interstitial.show();
        }
        await AsyncStorage.setItem('screenViews', '0');
    };

    const handleVidView = async () => {
        console.log('Screen video view count reached 9!', rewardLoaded);
        if (!showRewardedAdDialog) {
            console.log(showRewardedAdDialog, 'shoee');
            setShowRewardedAdDialog(true);
        }
        await AsyncStorage.setItem('videoViews', '0');
    };

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

    // console.log(screenViews, 'sreen views')
    return (
        <View style={styles.container}>
            <View style={styles.pdfContainer}>
                {isConnected ? (
                    loaded === null ? (
                        <ActivityIndicator size="large" style={{ transform: [{ scale: 2 }], marginVertical: 100 }} />
                    ) :
                       loaded === false && pdfPath ? (
                            <PdfRendererView
                                style={styles.pdfView}
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
                                // Another fallback UI if PDF path is not available
                                <ActivityIndicator size="large" style={{ transform: [{ scale: 2 }], marginVertical: 100 }} />
                            )
                        )
                ) : (
                    // Show no internet connection UI
                    <View style={styles.noWifiContainer}>
                        <Feather name="wifi-off" size={60} color="#0a8a06" />
                        <Text style={styles.noWifiText}>No Internet Connection</Text>
                    </View>
                )}

            </View>
            {
                isConnected && showRewardedAdDialog && (
                    <View style={styles.dialogContainer}>
                        <Text style={styles.dialogText}>Skip full screen ads for 10 screens with one ad now!</Text>
                        <View style={styles.buttonsContainer}>
                            <Pressable
                                style={styles.button}
                                onPress={() => handleRewardedAdDecision('yes')}
                            >
                                <Text style={styles.buttonText}>Yes</Text>
                            </Pressable>
                            <Pressable
                                style={styles.button}
                                onPress={() => handleRewardedAdDecision('no')}
                            >
                                <Text style={styles.buttonText}>No</Text>
                            </Pressable>
                        </View>
                    </View>
                )

            }
            {pdfPath ?
                <View style={{ backgroundColor: '#eee', height: 'auto' }}>
                    <BannerAd
                        unitId={adUnitId}
                        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
                        // style={{border: '1px solid black'}}
                        requestOptions={{
                            // requestNonPersonalizedAdsOnly: true,
                        }}
                        onAdFailedToLoad={e => {
                            // console.log('onAdFailedToLoad');
                            console.log(bannerLoaded, 'banner');
                            console.log(e);
                        }}
                        onAdLoaded={e => {
                            // console.log('onAdLoaded');
                            console.log(e);
                            setBannerLoaded(true)
                        }}

                    />
                </View>
                : null}
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    pdfContainer: {
        flex: 1,
        width: '100%',
        borderWidth: 1,
        borderColor: "green",
    },
    pdfView: {
        flex: 1,
        backgroundColor: '#fff',
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
    dialogContainer: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        elevation: 5,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: '40%',
        left: '10%',
        right: '10%',
        zIndex: 999,
    },
    dialogText: {
        fontSize: 18,
        marginBottom: 20,
        textAlign: 'center',
        color: "black"
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    },
    button: {
        backgroundColor: '#3498db',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        elevation: 3,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});
