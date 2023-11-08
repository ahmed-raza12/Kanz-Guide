import messaging from '@react-native-firebase/messaging';

const requestUserPermission = async () => {
  const authorizationStatus = await messaging().requestPermission();
  if (authorizationStatus) {
    console.log('Permission granted.');
  } else {
    console.log('Permission denied.');
  }
};

requestUserPermission();

export default messaging;
