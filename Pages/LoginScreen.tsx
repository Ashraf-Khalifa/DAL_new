import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';

const users = [
  { email: 'admin@dal.com', password: 'passadmin', role: 'admin' },
  { email: 'superadmin@dal.com', password: 'passsuperadmin', role: 'superadmin' },
  { email: 'user1@dal.com', password: 'passuser1', role: 'user' },
  { email: 'user2@dal.com', password: 'passuser2', role: 'user' },
  { email: 'user3@dal.com', password: 'passuser3', role: 'user' },
  { email: 'user4@dal.com', password: 'passuser4', role: 'user' },
  { email: 'user5@dal.com', password: 'passuser5', role: 'user' },
];

const LoginScreen: React.FC = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);


  const handleLogin = async () => {
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      await AsyncStorage.setItem('loggedInUser', JSON.stringify(user));
      navigation.navigate('Home', { user });
        } else {
      Alert.alert('Login Failed', 'Invalid email or password');
    }
  };
  

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image source={require('../Images/logo.png')} style={styles.logo} />
        </View>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Login</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#AAAAAA"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <View style={styles.passwordContainer}>
           
   
            <TextInput
              style={styles.passwordInput}
              placeholder="Password"
              placeholderTextColor="#AAAAAA"
              secureTextEntry={!passwordVisible}
              value={password}
              onChangeText={setPassword}
            />
                     <TouchableOpacity
              style={styles.eyeIconContainer}
              onPress={() => setPasswordVisible(!passwordVisible)}
            >
              <Image source={require('../Images/eye.png')} style={styles.eyeIcon} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.linkContainer}>
            <Text style={styles.linkText}>
              Don't have an account? <Text style={styles.signUpText}>Sign Up</Text>
            </Text>
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
    fontSize: wp('5%'),
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
    color: "#000"

  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: wp('2%'),
    marginBottom: hp('2%'),
    justifyContent: 'space-between',
  },
  passwordInput: {
    flex: 1,
    height: hp('6%'),
    paddingLeft: wp('4%'),
    color: "#000"
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
    width: wp('80%'),
    padding: hp('2%'),
    borderRadius: wp('6.25%'),
    backgroundColor: '#12587B',
    alignItems: 'center',
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
  signUpText: {
    color: '#12587B',
  },
});

export default LoginScreen;
