import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import Feather from 'react-native-vector-icons/Feather';
import RNFetchBlob from 'react-native-fetch-blob';
import RNFS, { stat } from 'react-native-fs';
import PdfRendererView from 'react-native-pdf-renderer';

export default function PDFViewScreen({ route, navigation }) {
    const [isConnected, setIsConnected] = useState(true);
    const [pdfPath, setPdfPath] = useState(null);
    const [error, setError] = useState(null);

    const { title, link, fileName } = route.params;

    useEffect(() => {
        console.log()
        navigation.setOptions({ title: title });
        const checkNetworkStatus = async () => {
            const state = await NetInfo.fetch();
            setIsConnected(state.isConnected);
        };
        checkNetworkStatus();
        console.log(fileName, 'filename')
        if (isConnected) {
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
                    setError(error)
                });
        }
    }, []);

    const downloadPdf = async () => {
        const config = {
            fileCache: true,
            appendExt: 'pdf',
        };
        const pdfUrl = 'YOUR_PDF_LINK'; // Replace with your PDF link
        
        const uniqueFileName = `${fileName}.pdf`; // Create a unique filename
    
        const destinationPath = `${RNFS.DocumentDirectoryPath}/${uniqueFileName}`;
    
        try {
            const res = await RNFetchBlob.config(config).fetch('GET', link);
            const downloadedPdfPath = res.path();
    
            // Move the downloaded PDF to the destination path
            await RNFS.moveFile(downloadedPdfPath, destinationPath);
            setPdfPath(destinationPath); // Set the path to the saved PDF
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
                        style={{ backgroundColor: 'red' }}
                        source={`file://${pdfPath}`}
                        distanceBetweenPages={16}
                        maxZoom={5}
                        onPageChange={(current, total) => {
                            console.log(current, total);
                        }}
                    />
                ) : (
                   error ? <Text style={styles.noWifiText}>{error}</Text>
                  : <ActivityIndicator size="large"  style={{ transform: [{ scale: 2 }], marginVertical: 100}} />
                    )
            ) : (
                <View style={styles.noWifiContainer}>
                    <Feather name="wifi-off" size={60} color="#0a8a06" />
                    <Text style={styles.noWifiText}>No Internet Connection</Text>
                </View>
            )}
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
