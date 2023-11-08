import React, { useState, useEffect, useRef } from 'react';
import MainStackNavigator from './navigation/MainStackNavigation';
import { useNavigation } from '@react-navigation/native';
import messaging from './firebase'; // Import your Firebase messaging configuration


const App = () => {
  // messaging.n
  const { navigate } = useNavigation()

  useEffect(() => {
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('Notification caused app to open from background state:', remoteMessage);
      if (remoteMessage) {
        const { screen, title, link } = remoteMessage.data
        if (screen === 'TabNavigator') {
          navigate(screen, { screen: remoteMessage.data.nested });
        } else {
          const finalTitle = title ? title : 'default'
          const finalLink = link ? link: 'defaul'
          navigate(screen, { title: finalTitle, link: finalLink });
        }
      }
    })
    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        console.log(remoteMessage, 'remoteMsg')
        if (remoteMessage) {
          const { screen, title, link } = remoteMessage.data
          if (screen === 'TabNavigator') {
            navigate(screen, { screen: remoteMessage.data.nested });
          } else {
            const finalTitle = title ? title : 'default'
            const finalLink = link ? link: 'defaul'
            navigate(screen, { title: finalTitle, link: finalLink });
          }
        }
      })
  }, []);

  return (
    <MainStackNavigator />
  );
}

export default App;
