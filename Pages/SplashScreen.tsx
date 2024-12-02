import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const SplashScreen: React.FC = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require('../Images/logo.png')} style={styles.logo} />
      </View>
      <Image source={require('../Images/splash.png')} style={styles.illustration} />
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Register')}>
        <Text style={styles.buttonText}>Create Account</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'start',
    backgroundColor: '#fff',
    padding: wp('5%'),
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    width: wp('25%'),
    height: hp('25%'),
    // resizeMode: 'contain',
  },
  title: {
    fontSize: wp('6%'),
    fontWeight: 'bold',
    marginBottom: hp('2.5%'),
    color: '#2c2c54',
  },
  illustration: {
    width: wp('80%'),
    height: hp('30%'),
    resizeMode: 'contain',
    marginBottom: hp('3.5%'),
  },
  button: {
    width: wp('80%'),
    padding: hp('2%'),
    borderRadius: wp('6.25%'),
    backgroundColor: '#12587B',
    alignItems: 'center',
    marginBottom: hp('3%'),
  },
  buttonText: {
    color: '#fff',
    fontSize: wp('4%'),
  },
});

export default SplashScreen;
