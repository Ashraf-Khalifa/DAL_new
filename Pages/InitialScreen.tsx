import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const InitialScreen: React.FC = () => {
  const navigation = useNavigation();

  const handleRoleSelection = (role: string) => {
    // You can save the selected role in a global state or AsyncStorage if needed
    console.log(`Selected Role: ${role}`);
    navigation.navigate('Splash'); // Navigate to Splash screen
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require('../Images/logo.png')} style={styles.logo} />
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Select Your Role</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleRoleSelection('Police Maker')}>
          <Text style={styles.buttonText}>Police Maker</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleRoleSelection('User')}>
          <Text style={styles.buttonText}>User</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: '#fff',
    padding: wp('5%'),
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: hp('5%'), // Add spacing between logo and content
  },
  logo: {
    width: wp('25%'),
    height: hp('25%'),
  },
  contentContainer: {
    justifyContent: 'center', // Center everything vertically
    alignItems: 'center', // Center text and buttons horizontally
    width: '100%', // Take full width for alignment
  },
  title: {
    fontSize: wp('6%'),
    fontWeight: 'bold',
    marginBottom: hp('3%'), // Space between title and buttons
    color: '#333',
    textAlign: 'center', // Ensure text is centered
  },
  button: {
    width: wp('80%'),
    padding: hp('2%'),
    borderRadius: wp('6.25%'),
    backgroundColor: '#12587B',
    alignItems: 'center',
    marginBottom: hp('2%'), // Space between buttons
  },
  buttonText: {
    color: '#fff',
    fontSize: wp('4.5%'),
  },
});

export default InitialScreen;
