import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TarkeebScreen from '../screens/TarkeebScreen';
import CustomTabBar from './CustomBottomTab';
import CustomHeader from './CustomHeader';
import HalShudaScreen from '../screens/HalShudaScreen';
import QuizScreen from '../screens/QuizScreen';
import CertificateScreen from '../screens/CertificateScreen';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
      <Tab.Navigator tabBar={(props) => <CustomTabBar {...props} />} screenOptions={{
      }}>
        <Tab.Screen name="حل شدہ" 
        options={{
          header: () => <CustomHeader title={"حل شدہ"} />,
          headerTitleAlign: "center"
        }} component={HalShudaScreen} />
        <Tab.Screen
        options={{
          header: () => <CustomHeader title={"ترکیب"} />,
          headerTitleAlign: "center"
        }}
        name="ترکیب" component={TarkeebScreen} />
        <Tab.Screen name="اسباق" 
        options={{
          header: () => <CustomHeader title={"اسباق"} />,
          headerTitleAlign: "center"
        }} component={CertificateScreen} />
      </Tab.Navigator>
  );
}
