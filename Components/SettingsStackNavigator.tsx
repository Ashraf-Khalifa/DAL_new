import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SettingsScreen from '../Pages/SettingsScreen';
import AboutScreen from '../Pages/AboutScreen';
import TermsAndConditionsScreen from '../Pages/TermsAndConditionsScreen';
import PrivacyPolicyScreen from '../Pages/PrivacyPolicyScreen';


const SettingsStack = createStackNavigator();

const SettingsStackNavigator: React.FC = () => {
  return (
    <SettingsStack.Navigator screenOptions={{ headerShown: false }}>
      <SettingsStack.Screen name="Settings" component={SettingsScreen} />
      <SettingsStack.Screen name="About" component={AboutScreen} />
      <SettingsStack.Screen name="TermsAndConditions" component={TermsAndConditionsScreen} />
      <SettingsStack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />

    </SettingsStack.Navigator>
  );
};

export default SettingsStackNavigator;
   