import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import HalShudaScreen from '../screens/TarkeebScreen';
import TabNavigator from './TabNavigator';
import PDFViewScreen from '../screens/PDFViewScreen';
import ClassScreen from '../screens/ClassScreen';
import QuizScreen from '../screens/QuizScreen';
import CustomHeader from './CustomHeader';
import CertificateScreen from '../screens/CertificateScreen';

const Stack = createStackNavigator();
const customCardStyleInterpolator = ({ current, layouts }) => ({
  cardStyle: {
    transform: [
      {
        translateX: current.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [layouts.screen.width, 0],
        }),
      },
    ],
  },
});

export default function MainStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ gestureDirection: "horizontal", cardStyleInterpolator: customCardStyleInterpolator }}>
      <Stack.Screen name="TabNavigator" options={{
        headerShown: false
      }} component={TabNavigator} />
      <Stack.Screen name="PDF" options={{
        headerTitleAlign: "center",
        headerTitleStyle: {
          fontFamily: "JameelNoori",
          fontSize: 24
        }
      }} component={PDFViewScreen} />
      <Stack.Screen options={{
        headerTitleAlign: "center",
      headerTitleStyle: {
        fontFamily: "JameelNoori",
      fontSize: 24
        }
      }}
      name="ClassScreen" component={ClassScreen} />
      <Stack.Screen 
      name="QuizScreen" options={{
        header: () => <CustomHeader title={"Quiz Test"} />,
        headerTitleAlign: "center",
      }} component={QuizScreen} />
      <Stack.Screen 
      name="Certificate" options={{
        header: () => <CustomHeader title={"Certificate"} />,
        headerTitleAlign: "center",
      }} component={CertificateScreen} />
    </Stack.Navigator>
  );
}
