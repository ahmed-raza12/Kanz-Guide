import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import TabNavigator from './TabNavigator';
import PDFViewScreen from '../screens/PDFViewScreen';
import ClassScreen from '../screens/ClassScreen';
import QuizScreen from '../screens/QuizScreen';
import CustomHeader from './CustomHeader';
import CertificateScreen from '../screens/CertificateScreen';
import FeedbackScreen from '../screens/FeedbackScreen';
import BlogScreen from '../screens/BlogScreen';
import BookScreen from '../screens/BookScreen';

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

function MainStackNavigator() {
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

      <Stack.Screen
        name="FeedbackScreen" options={{
          header: () => <CustomHeader title={"Feedback"} />,
          headerTitleAlign: "center",
        }} component={FeedbackScreen} />

      <Stack.Screen
        name="BlogScreen" options={{
          title: "Blog Post",
          headerTitleAlign: "center"
        }} component={BlogScreen} />

      <Stack.Screen
        name="BookScreen" options={{
          title: "مضامین",
          headerTitleAlign: "center"
        }} component={BookScreen} />
    </Stack.Navigator>
  );
}


export default MainStackNavigator