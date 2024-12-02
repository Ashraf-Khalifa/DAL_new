import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../Pages/HomeScreen';
import FullAnalysisReport from '../Pages/FullAnalysisReport';
import ManageYourArea from '../Pages/ManageYourArea';
import ViolationsScreen from '../Pages/ViolationsScreen';

const ProfileStack = createStackNavigator();

const HomeStackNavigator: React.FC = () => {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="Home" component={HomeScreen} />
      <ProfileStack.Screen name="FullAnalysisReport" component={FullAnalysisReport} />
      <ProfileStack.Screen name="ManageYourArea" component={ManageYourArea} />
      <ProfileStack.Screen name="ViolationsScreen" component={ViolationsScreen} />
    </ProfileStack.Navigator>
  );
};

export default HomeStackNavigator;
