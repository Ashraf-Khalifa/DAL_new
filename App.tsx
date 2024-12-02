import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaView, StyleSheet } from 'react-native';
import SplashScreen from './Pages/SplashScreen';
import InitialScreen from './Pages/InitialScreen';
import LoginScreen from './Pages/LoginScreen';
import RegisterScreen from './Pages/RegisterScreen';
import FullAnalysisReport from './Pages/FullAnalysisReport';
import ViolationsScreen from './Pages/ViolationsScreen';

import MyTabs from './Components/TabBar'; // Adjust the import path as necessary

const Stack = createStackNavigator();

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <SafeAreaView style={styles.container}>
        <Stack.Navigator initialRouteName="Initial" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Initial" component={InitialScreen} />
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="FullAnalysisReport" component={FullAnalysisReport} />
          <Stack.Screen name="ViolationsScreen" component={ViolationsScreen} />
          <Stack.Screen name="Home" component={MyTabs} />
        </Stack.Navigator>
      </SafeAreaView>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});

export default App;
