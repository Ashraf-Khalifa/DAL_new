import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import FullAnalysisReport from '../Pages/FullAnalysisReport';
import StatusModal from '../Pages/StatusModal';
import EditAccountScreen from '../Pages/EditAccountScreen';
import HelpScreen from '../Pages/HelpScreen';

const ProfileStack = createStackNavigator();

const ProfileStackNavigator: React.FC = () => {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="Status" component={StatusModal} />
      <ProfileStack.Screen name="Analysis" component={FullAnalysisReport} />
      {/* <ProfileStack.Screen name="EditAccount" component={EditAccountScreen} />
      <ProfileStack.Screen name="Help" component={HelpScreen} /> */}
    </ProfileStack.Navigator>
  );
};

export default ProfileStackNavigator;
