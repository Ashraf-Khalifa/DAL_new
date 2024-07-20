import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';

const PrivacyPolicyScreen: React.FC = () => {
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
          <Text style={styles.headerTitle}>Privacy Policy</Text>
        </View>
      </View>
      <View style={styles.content}>
        <Text style={styles.contentText}>
          <Text style={styles.boldText}>Introduction</Text>
          {"\n"}{"\n"}
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce ullamcorper, dui a suscipit sollicitudin, metus metus gravida leo, at vehicula urna odio id odio. Integer fermentum libero ac elit ornare, at suscipit urna faucibus.
        </Text>
        <Text style={styles.contentText}>
          <Text style={styles.boldText}>Information Collection</Text>
          {"\n"}{"\n"}
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </Text>
        <Text style={styles.contentText}>
          <Text style={styles.boldText}>Use of Information</Text>
          {"\n"}{"\n"}
          Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
        </Text>
        {/* Add more sections as needed */}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: wp('5%'),
    marginBottom: hp('5%'),

  },
  contentContainer: {
    paddingBottom: hp('5%'), // Add padding to the bottom to ensure content is scrollable
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('5%'),
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
    fontSize: hp('3%'),
    fontWeight: 'bold',
    color: '#333',
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
  contentText: {
    fontSize: hp('2%'),
    color: '#333',
    marginBottom: hp('3%'),
    lineHeight: hp('2.5%'),
  },
  boldText: {
    fontWeight: 'bold',
    fontSize: hp('2.2%'),
    marginBottom: hp('1%'),
  },
});

export default PrivacyPolicyScreen;
