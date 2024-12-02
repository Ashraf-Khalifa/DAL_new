import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Modal, Image } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const AdminScreen: React.FC = ({ navigation }) => {




  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require('../Images/logo1.png')} style={styles.logo} />
      </View>
      <View style={styles.header}>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Dashboard</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.settingItem} onPress={() => navigation.navigate('AddSpot')}>
  <View style={styles.settingTextContainer}>
    <Image source={require('../Images/add-spot.png')} style={styles.settingIcon} />
    <Text style={styles.settingText}>Add Spot</Text>
  </View>
</TouchableOpacity>

      <TouchableOpacity style={styles.settingItem} onPress={() => navigation.navigate('Category')}>
        <View style={styles.settingTextContainer}>
          <Image source={require('../Images/category.png')} style={styles.settingIcon} />
          <Text style={styles.settingText}>Add and Get Category</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.settingItem} onPress={() => navigation.navigate('Violation')}>
        <View style={styles.settingTextContainer}>
          <Image source={require('../Images/violation.png')} style={styles.settingIcon} />
          <Text style={styles.settingText}>Get Violations</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.settingItem} onPress={() => navigation.navigate('AddViolationType')}>
        <View style={styles.settingTextContainer}>
          <Image source={require('../Images/violation-type.png')} style={styles.settingIcon} />
          <Text style={styles.settingText}>Add Violation Type</Text>
        </View>
      </TouchableOpacity>


    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: wp('5%'),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: wp('10%'),
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: hp('2.5%'),
    fontWeight: 'bold',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    width: wp('25%'),
    height: hp('25%'),
    resizeMode: 'contain',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('2%'),
    marginBottom: wp('3%'),
    borderRadius: 5,
    backgroundColor: '#f8f8f8',
  },
  settingTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    width: wp('6%'),
    height: hp('3%'),
    resizeMode: 'contain',
    marginRight: wp('2%'),
  },
  settingText: {
    fontSize: hp('2%'),
    color: '#333',
  },
  settingLabel: {
    fontSize: hp('2%'),
    color: '#666',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: wp('80%'),
    padding: hp('3%'),
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: hp('2.5%'),
    fontWeight: 'bold',
    marginBottom: hp('3%'),
  },
  modalText: {
    fontSize: hp('2%'),
    marginBottom: hp('3%'),
    textAlign: 'center',
  },
  modalOption: {
    paddingVertical: hp('2%'),
    width: '100%',
    alignItems: 'center',
    marginVertical: hp('1%'),
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  modalOptionText: {
    fontSize: hp('2%'),
    color: '#333',
  },
  closeButton: {
    marginTop: hp('3%'),
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('5%'),
    backgroundColor: '#20135B',
    borderRadius: 5,
    width: '50%',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: hp('2%'),
  },
});

export default AdminScreen;
