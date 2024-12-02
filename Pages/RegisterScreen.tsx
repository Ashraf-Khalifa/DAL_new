import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const RegisterScreen: React.FC = () => {
  const navigation = useNavigation();
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image source={require('../Images/logo.png')} style={styles.logo} />
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.title}>Create an Account</Text>
          <TextInput style={styles.input} placeholder="Username" placeholderTextColor="#AAAAAA" />
          <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#AAAAAA" keyboardType="email-address" />
          <View style={styles.passwordContainer}>
       
            <TextInput
              style={styles.passwordInput}
              placeholder="Password"
              placeholderTextColor="#AAAAAA"
              secureTextEntry={!passwordVisible}
            />
    <TouchableOpacity
              style={styles.eyeIconContainer}
              onPress={() => setPasswordVisible(!passwordVisible)}
            >
              <Image source={require('../Images/eye.png')} style={styles.eyeIcon} />
            </TouchableOpacity>

          </View>
          <TouchableOpacity style={styles.button} >
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.linkContainer}>
            <Text style={styles.linkText}>Already have an account? <Text style={styles.loginText}>Login</Text></Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
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
  formContainer: {
    width: wp('80%'),
    alignItems: 'center',
  },
  title: {
    fontSize: wp('4%'),
    fontWeight: 'bold',
    color: '#12587B',
    marginBottom: hp('2%'),
  },
  input: {
    width: '100%',
    height: hp('6%'),
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: wp('2%'),
    paddingLeft: wp('4%'),
    marginBottom: hp('2%'),
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: wp('2%'),
    marginBottom: hp('2%'),
  },
  passwordInput: {
    flex: 1,
    height: hp('6%'),
    paddingLeft: wp('4%'),
  },
  eyeIconContainer: {
    paddingRight: wp('4%'),
  },
  eyeIcon: {
    width: wp('5%'),
    height: hp('3%'),
    resizeMode: 'contain',
  },
  button: {
    width: '100%',
    height: hp('6%'),
    borderRadius: wp('6%'),
    backgroundColor: '#12587B',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp('3%'),
    marginTop: hp('4%'),
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: wp('4.5%'),
    fontWeight: 'bold',
  },
  linkContainer: {
    marginTop: hp('2%'),
  },
  linkText: {
    color: '#000',
    fontSize: wp('4%'),
    textAlign: 'center',
  },
  loginText: {
    color: '#12587B',
  },
});

export default RegisterScreen;
