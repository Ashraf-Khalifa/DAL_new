import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const ContactUs = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    // Validate form fields
    if (!name.trim() || !email.trim() || !message.trim()) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    // Log or send form data to the backend
    Alert.alert('Success', 'Your message has been submitted.');
    console.log({ name, email, phone, message });

    // Clear form fields
    setName('');
    setEmail('');
    setPhone('');
    setMessage('');
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Contact Us</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter your name"
          placeholderTextColor="#AAAAAA"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          placeholderTextColor="#AAAAAA"
          keyboardType="email-address"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          placeholder="Enter your phone number"
          placeholderTextColor="#AAAAAA"
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Message</Text>
        <TextInput
          style={styles.textArea}
          value={message}
          onChangeText={setMessage}
          placeholder="Enter your message"
          placeholderTextColor="#AAAAAA"
          multiline={true}
          numberOfLines={4}
        />
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp('5%'),
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: wp('5%'),
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: hp('3%'),
  },
  inputContainer: {
    marginBottom: hp('2%'),
  },
  label: {
    fontSize: wp('4%'),
    color: '#000',
    marginBottom: hp('1%'),
  },
  input: {
    padding: wp('3%'),
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: wp('2%'),
    fontSize: wp('4%'),
    color: '#000',
  },
  textArea: {
    padding: wp('3%'),
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: wp('2%'),
    fontSize: wp('4%'),
    color: '#000',
    textAlignVertical: 'top',
    height: hp('15%'),
  },
  submitButton: {
    backgroundColor: '#12587B',
    padding: wp('3%'),
    borderRadius: wp('2%'),
    alignItems: 'center',
    marginTop: hp('2%'),
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: wp('4%'),
    fontWeight: 'bold',
  },
});

export default ContactUs;
