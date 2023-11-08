import React, { useRef } from 'react';
import { AppRegistry, I18nManager } from 'react-native';
import App from './App';
import analytics from '@react-native-firebase/analytics';
import { name as appName } from './app.json';
import { QuizProvider } from './QuizContext';
import messaging from './firebase';
import { NavigationContainer } from '@react-navigation/native';


messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
});


function Main() {
    const routeNameRef = useRef();
    const navigationRef = useRef();
    return (
        <QuizProvider>
            <NavigationContainer
                ref={navigationRef}
                onReady={() => {
                    routeNameRef.current = navigationRef.current.getCurrentRoute().name;
                }}
                onStateChange={async () => {
                    const previousRouteName = routeNameRef.current;
                    const currentRouteName = navigationRef.current.getCurrentRoute().name;

                    if (previousRouteName !== currentRouteName) {
                        console.log(currentRouteName, 'current routr name')
                        await analytics().logScreenView({
                            screen_name: currentRouteName,
                            screen_class: currentRouteName,
                        });
                    }
                    routeNameRef.current = currentRouteName;
                }}
            >
                <App />
            </NavigationContainer>
        </QuizProvider>
    )
}


I18nManager.forceRTL(true);
I18nManager.allowRTL(true);
I18nManager.isRTL = true;

AppRegistry.registerComponent(appName, () => Main);
