import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ProfileScreen from '../Pages/ProfileScreen';
import DocumentsScreen from '../Pages/DocumentsScreen';
import EditAccountScreen from '../Pages/EditAccountScreen';
import HelpScreen from '../Pages/HelpScreen';

const ProfileStack = createStackNavigator();

const ProfileStackNavigator: React.FC = () => {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="Profile" component={ProfileScreen} />
      <ProfileStack.Screen name="Documents" component={DocumentsScreen} />
      <ProfileStack.Screen name="EditAccount" component={EditAccountScreen} />
      <ProfileStack.Screen name="Help" component={HelpScreen} />
    </ProfileStack.Navigator>
  );
};

export default ProfileStackNavigator;
