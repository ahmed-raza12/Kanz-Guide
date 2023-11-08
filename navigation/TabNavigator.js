import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TarkeebScreen from '../screens/TarkeebScreen';
import CustomTabBar from './CustomBottomTab';
import CustomHeader from './CustomHeader';
import HalShudaScreen from '../screens/HalShudaScreen';
import QuizScreen from '../screens/QuizScreen';
import CertificateScreen from '../screens/CertificateScreen';
import FeedbackScreen from '../screens/FeedbackScreen';
import ManaraScreen from '../screens/ManaraScreen';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
      <Tab.Navigator tabBar={(props) => <CustomTabBar {...props} />} screenOptions={{
      }}>
        <Tab.Screen name="HalShuda" 
        options={{
          title: "حل شدہ",
          header: () => <CustomHeader title={"حل شدہ"} />,
          headerTitleAlign: "center"
        }} component={HalShudaScreen} />
        <Tab.Screen
        options={{
          header: () => <CustomHeader title={"ترکیب"} />,
          headerTitleAlign: "center",
          title: "ترکیب"
        }}
        name="Tarkeeb" component={TarkeebScreen} />
        <Tab.Screen
        options={{
          header: () => <CustomHeader title={"منارة الفكر"} />,
          headerTitleAlign: "center",
          title: "منارة الفكر"
        }}
        name="ManaraScreen" component={ManaraScreen} />
        <Tab.Screen name="AsbaqScreen" 
        options={{
          title: "اسباق",
          header: () => <CustomHeader title={"اسباق"} />,
          headerTitleAlign: "center"
        }} component={HalShudaScreen} />
      </Tab.Navigator>
  );
}
