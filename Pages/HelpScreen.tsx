import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';

const HelpScreen: React.FC = () => {
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
          <Text style={styles.headerTitle}>Help</Text>
        </View>
      </View>
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
        <Text style={styles.question}>1. How do I reset my password?</Text>
        <Text style={styles.answer}>
          To reset your password, go to the login screen and click on "Forgot Password". Follow the instructions to reset your password.
        </Text>

        <Text style={styles.question}>2. How do I update my profile information?</Text>
        <Text style={styles.answer}>
          To update your profile information, go to the Profile screen, click on "Edit Account", make your changes, and save them.
        </Text>

        <Text style={styles.question}>3. How do I contact customer support?</Text>
        <Text style={styles.answer}>
          You can contact customer support by going to the Help section and clicking on "Contact Us". Fill out the form and submit your query.
        </Text>

        <Text style={styles.sectionTitle}>Contact Us</Text>
        <Text style={styles.answer}>
          If you have any other questions, feel free to contact us at support@example.com or call us at (123) 456-7890.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: wp('5%'),
    marginBottom: wp('10%'),
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
    position: 'absolute',
    left: 0,
    zIndex: 10,
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
  sectionTitle: {
    fontSize: hp('2.2%'),
    fontWeight: 'bold',
    marginBottom: hp('2%'),
    color: '#12587B',
  },
  question: {
    fontSize: hp('2%'),
    fontWeight: 'bold',
    marginBottom: hp('1%'),
    color: '#333',
  },
  answer: {
    fontSize: hp('1.8%'),
    color: '#666',
    marginBottom: hp('2%'),
  },
});

export default HelpScreen;
