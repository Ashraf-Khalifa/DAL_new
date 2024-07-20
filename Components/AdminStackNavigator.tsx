import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AdminScreen from '../Pages/AdminScreen';
import AddSpotScreen from '../Pages/AddSpotScreen';
import CategoryScreen from '../Pages/CategoryScreen';
import ViolationScreen from '../Pages/ViolationScreen';
import AddViolationType from '../Pages/AddViolationType';

const ProfileStack = createStackNavigator();

const AdminStackNavigator: React.FC = () => {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="Admin" component={AdminScreen} />
      <ProfileStack.Screen name="AddSpot" component={AddSpotScreen} />
       <ProfileStack.Screen name="Category" component={CategoryScreen} />
      <ProfileStack.Screen name="Violation" component={ViolationScreen} />
      <ProfileStack.Screen name="AddViolationType" component={AddViolationType} />
    </ProfileStack.Navigator>
  );
};

export default AdminStackNavigator;
