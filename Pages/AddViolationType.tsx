import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const AddViolationType = () => {
  const [name, setName] = useState('');
  const [points, setPoints] = useState('');
  const [expirationDays, setExpirationDays] = useState('');

  const navigation = useNavigation();

  const resetForm = () => {
    setName('');
    setPoints('');
    setExpirationDays('');
  };

  const handleAdd = () => {
    if (!name || !points || !expirationDays) {
      Alert.alert('All fields required', 'Please fill out all fields.');
      return;
    }
    Alert.alert('Violation Type Added', 'The violation type has been successfully added.');
    resetForm();
  };
  

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require('../Images/logo1.png')} style={styles.logo} />
      </View>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButtonContainer}>
          <Image source={require('../Images/back.png')} style={styles.backButton} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Add Violation Type</Text>
        </View>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Waste"
          placeholderTextColor="#AAAAAA"
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>No. Points</Text>
        <TextInput
          style={styles.input}
          value={points}
          onChangeText={setPoints}
          placeholder="5 Points"
          placeholderTextColor="#AAAAAA"
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>expiration days</Text>
        <TextInput
          style={styles.input}
          value={expirationDays}
          onChangeText={setExpirationDays}
          placeholder="10 Days"
          placeholderTextColor="#AAAAAA"
        />
      </View>
      <TouchableOpacity style={[styles.addButton, styles.centerButton]} onPress={handleAdd}>
        <Text style={styles.addButtonText}>Add</Text>
      </TouchableOpacity>

    </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: wp('5%'),
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    width: wp('25%'),
    height: hp('25%'),
    resizeMode: 'contain',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'start',
    marginBottom: wp('6%'),
  },
  backButtonContainer: {},
  backButton: {
    width: wp('5%'),
    height: hp('2%'),
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
  title: {
    fontSize: hp('3%'),
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: hp('5%'),
  },
  inputContainer: {
    marginBottom: hp('2%'),
  },
  label: {
    fontSize: hp('2%'),
    color: '#333',
    marginBottom: hp('1.5%'),
    textAlign: 'start',
  },
  input: {
    padding: wp('3%'),
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: wp('2%'),
    fontSize: wp('3%'),
    color: '#000000',
    width: hp('40%'),
  },
  centerButton: {
    alignSelf: 'center', 
    marginTop: wp('7%'),
  },
  addButton: {
    backgroundColor: '#12587B',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: hp('2%'),
    width: wp('40%'),
    borderRadius: wp('5%'),
  },
  addButtonText: {
    color: '#fff',
    fontSize: hp('2%'),
    fontWeight: 'bold',
  },
});

export default AddViolationType;
