// import messaging from '@react-native-firebase/messaging';
// import { firebase } from '@react-native-firebase/app';

// const requestUserPermission = async () => {
//   const authStatus = await messaging().requestPermission();
//   const enabled =
//     authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
//     authStatus === messaging.AuthorizationStatus.PROVISIONAL;

//   if (enabled) {
//     console.log('Notification permission granted.');
//   } else {
//     console.log('Notification permission denied.');
//   }
// };

// const initializeFirebase = () => {
//     const firebaseConfig = {
//         apiKey: "AIzaSyBhYg8xAB5Ci9B6Y2Vr1SbUucD9jGm_F3E",
//         authDomain: "virtual-jamia-8cb04.firebaseapp.com",
//         databaseURL: "https://virtual-jamia-8cb04-default-rtdb.firebaseio.com",
//         projectId: "virtual-jamia-8cb04",
//         storageBucket: "virtual-jamia-8cb04.appspot.com",
//         messagingSenderId: "609449581695",
//         appId: "1:609449581695:web:96b9bacee3e8d65510b34a",
//         measurementId: "G-JWC66WP0QE"
//       };

//   if (!firebase.apps.length) {
//     firebase.initializeApp(firebaseConfig);
//   }
// };

// export { requestUserPermission, initializeFirebase };
