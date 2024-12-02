import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const data = [
    { name: 'Waste', date: '02/05/2024', time: '02 : 50 PM' },
    { name: 'Littering', date: '03/05/2024', time: '03 : 15 PM' },
    { name: 'Illegal Parking', date: '04/05/2024', time: '01 : 30 PM' },
    { name: 'Graffiti', date: '05/05/2024', time: '12 : 45 PM' },
    { name: 'Vandalism', date: '06/05/2024', time: '04 : 20 PM' },
    { name: 'Loitering', date: '07/05/2024', time: '05 : 55 PM' },
    { name: 'Noise Violation', date: '08/05/2024', time: '06 : 10 PM' },
    { name: 'Public Drinking', date: '09/05/2024', time: '07 : 25 PM' },
    { name: 'Smoking Violation', date: '10/05/2024', time: '08 : 40 PM' },
    { name: 'Pet Waste', date: '11/05/2024', time: '09 : 05 PM' },
    { name: 'Waste', date: '02/05/2024', time: '02 : 50 PM' },
    { name: 'Littering', date: '03/05/2024', time: '03 : 15 PM' },
    { name: 'Illegal Parking', date: '04/05/2024', time: '01 : 30 PM' },
    { name: 'Graffiti', date: '05/05/2024', time: '12 : 45 PM' },
    { name: 'Vandalism', date: '06/05/2024', time: '04 : 20 PM' },
    { name: 'Loitering', date: '07/05/2024', time: '05 : 55 PM' },
    { name: 'Noise Violation', date: '08/05/2024', time: '06 : 10 PM' },
    { name: 'Public Drinking', date: '09/05/2024', time: '07 : 25 PM' },
    { name: 'Smoking Violation', date: '10/05/2024', time: '08 : 40 PM' },
    { name: 'Pet Waste', date: '11/05/2024', time: '09 : 05 PM' },
  ];
  

const ViolationScreen = () => {
    const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require('../Images/logo1.png')} style={styles.logo} />
      </View>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButtonContainer}>
          <Image source={require('../Images/back.png')} style={styles.backButton} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>All Violations</Text>
        </View>
      </View>
      <View style={styles.tableHeader}>
        <Text style={styles.tableHeaderText}>Name</Text>
        <Text style={styles.tableHeaderText}>Date</Text>
        <Text style={styles.tableHeaderText}>Time</Text>
        
      </View>
      <FlatList
  data={data}
  keyExtractor={(item, index) => index.toString()}
  renderItem={({ item }) => (
    <View style={styles.tableRow}>
      <Text style={styles.tableCell}>{item.name}</Text>
      <Text style={styles.tableCell}>{item.date}</Text>
      <Text style={styles.tableCell}>{item.time}</Text>
    </View>
  )}
  contentContainerStyle={{ flexGrow: 1, marginBottom: hp('10%') }}
/>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp('5%'),
    backgroundColor: '#fff',
    marginBottom: hp('5%')
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
    alignItems: 'center',
    marginBottom: wp('10%'),
  },
  backButtonContainer: {
  },
  backButton: {
    width: wp('5%'),
    height: hp('2%'),
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: hp('2%'),
    fontWeight: 'bold',
    color: '#000',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: wp('5%'),
  },
  backIcon: {
    width: wp('5%'),
    height: hp('2%'),
    resizeMode: 'contain',
  },
  title: {
    fontSize: hp('3%'),
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: hp('4%'),
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp('1%'),
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: hp('1%'),
  },
  tableHeaderText: {
    fontSize: hp('2%'),
    fontWeight: 'bold',
    width: wp('20%'),
    textAlign: 'center',
    color: '#000',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp('2%'),
    alignItems: 'center',
  },
  tableCell: {
    fontSize: hp('1.5%'),
    width: wp('20%'),
    textAlign: 'center',
    color: '#000',
  },
  uploadContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  uploadIcon: {
    width: wp('5%'),
    height: hp('3%'),
    resizeMode: 'contain',
  },
  browseText: {
    fontSize: hp('2%'),
    marginLeft: wp('2%'),
  },
});

export default ViolationScreen;
