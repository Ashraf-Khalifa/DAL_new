import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';

const EditAccountScreen: React.FC = () => {
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.logoContainer}>
        <Image source={require('../Images/logo.png')} style={styles.logo} />
      </View>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButtonContainer}>
          <Image source={require('../Images/back.png')} style={styles.backButton} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Edit Account</Text>
        </View>
      </View>
      <View style={styles.content}>
        <Text style={styles.label}>Username</Text>
        <TextInput style={styles.input} placeholder="Enter your username" placeholderTextColor="#AAAAAA" />
        <Text style={styles.label}>Email</Text>
        <TextInput style={styles.input} placeholder="Enter your email" placeholderTextColor="#AAAAAA" keyboardType="email-address" />
        <Text style={styles.label}>Password</Text>
        <TextInput style={styles.input} placeholder="Enter your password" placeholderTextColor="#AAAAAA" secureTextEntry={true} />
        <Text style={styles.label}>Confirm Password</Text>
        <TextInput style={styles.input} placeholder="Confirm your password" placeholderTextColor="#AAAAAA" secureTextEntry={true} />

        <View style={styles.saveButtonContainer}>
          <TouchableOpacity style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: wp('5%'),
  },
  contentContainer: {
    paddingBottom: hp('5%'),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: wp('10%'),
  },
  backButtonContainer: {
  },
  backButton: {
    width: wp('5%'),
    height: hp('2%'),
    resizeMode: 'contain',
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: hp('2.5%'),
    fontWeight: 'bold',
    color: '#000',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    width: wp('40%'),
    height: hp('25%'),
    resizeMode: 'cover',
  },
  content: {
    paddingVertical: hp('2%'),
  },
  label: {
    fontSize: hp('1.7%'),
    color: '#333',
    marginBottom: hp('1%'),
  },
  input: {
    width: '100%',
    height: hp('6%'),
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: wp('2%'),
    paddingLeft: wp('4%'),
    marginBottom: hp('2%'),
    fontSize: hp('1.5%'),
    color: '#000',
  },
  saveButtonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  saveButton: {
    width: '70%',
    height: hp('6%'),
    borderRadius: wp('6%'),
    backgroundColor: '#12587B',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp('4%'),
    marginBottom: hp('6%'),
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: hp('2%'),
    fontWeight: 'bold',
  },
});

export default EditAccountScreen;
