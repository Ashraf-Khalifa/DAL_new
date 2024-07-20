import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';

const AboutScreen: React.FC = () => {
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
          <Text style={styles.headerTitle}>About DAL</Text>
        </View>
      </View>
      <View style={styles.content}>
        <Text style={styles.contentText}>
          Welcome to the DAL Project, a cutting-edge smart city initiative designed to revolutionize urban living through advanced technology and intelligent infrastructure. Our vision is to create a seamless, efficient, and sustainable urban environment where every aspect of city life is interconnected and optimized.
        </Text>
        <Text style={styles.contentText}>
          <Text style={styles.boldText}>Smart City Integration: </Text>
          At the heart of the DAL Project is our sophisticated mapping system that integrates all city functions into a single, cohesive platform. From traffic management and public transportation to energy consumption and waste management, our smart city infrastructure ensures that every element is monitored and controlled in real-time.
        </Text>
        <Text style={styles.contentText}>
          <Text style={styles.boldText}>Innovative Technology: </Text>
          The DAL Project leverages the latest advancements in Internet of Things (IoT), artificial intelligence (AI), and big data analytics to provide a comprehensive view of the city’s operations. Our platform allows for predictive maintenance, automated responses to city needs, and continuous improvements based on data-driven insights.
        </Text>
        <Text style={styles.contentText}>
          <Text style={styles.boldText}>User-Centric Design: </Text>
          Our user-friendly interface provides residents with easy access to city services, real-time updates, and personalized information. Whether you're planning your daily commute, finding the nearest public service, or monitoring your energy usage, the DAL Project puts the power of smart city living at your fingertips.
        </Text>
        <Text style={styles.contentText}>
          <Text style={styles.boldText}>Sustainability and Efficiency: </Text>
          The DAL Project is committed to creating a sustainable urban environment. Our smart systems help reduce energy consumption, manage resources efficiently, and minimize the city’s carbon footprint. By optimizing urban operations, we aim to enhance the quality of life for all residents while preserving the environment for future generations.
        </Text>
        <Text style={styles.contentText}>
          <Text style={styles.boldText}>Community and Collaboration: </Text>
          We believe in the power of community and collaboration. The DAL Project fosters a sense of belonging and participation among residents, businesses, and government entities. Through open data and collaborative platforms, we encourage innovation and active involvement in shaping the future of our smart city.
        </Text>
        <Text style={styles.contentText}>
          Join us in transforming urban living with the DAL Project, where technology meets community to create a smarter, more connected, and sustainable city.
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
    paddingBottom: hp('5%'), // Add padding to the bottom to ensure content is scrollable
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
    marginBottom: hp('2%'),
  },
  boldText: {
    fontWeight: 'bold',
  },
});

export default AboutScreen;
