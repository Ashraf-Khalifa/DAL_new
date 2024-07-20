import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const violationsData = [
  { name: 'Waste', date: '02/05/2024', time: '02:50 PM' },
  { name: 'Littering', date: '03/05/2024', time: '03:15 PM' },
  { name: 'Illegal Parking', date: '04/05/2024', time: '01:30 PM' },
  { name: 'Graffiti', date: '05/05/2024', time: '12:45 PM' },
  { name: 'Vandalism', date: '06/05/2024', time: '04:20 PM' },
  { name: 'Loitering', date: '07/05/2024', time: '05:55 PM' },
  { name: 'Noise Violation', date: '08/05/2024', time: '06:10 PM' },
  { name: 'Public Drinking', date: '09/05/2024', time: '07:25 PM' },
  { name: 'Smoking Violation', date: '10/05/2024', time: '08:40 PM' },
];

const ViolationsScreen = ({ onClose }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>All Violations</Text>
      <View style={styles.header}>
        <Text style={styles.headerCell}>Name</Text>
        <Text style={styles.headerCell}>Date</Text>
        <Text style={styles.headerCell}>Time</Text>
      </View>
      {violationsData.map((item, index) => (
        <View key={index} style={styles.row}>
          <Text style={styles.cell}>{item.name}</Text>
          <Text style={styles.cell}>{item.date}</Text>
          <Text style={styles.cell}>{item.time}</Text>
        </View>
      ))}
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeButtonText}>Close</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    paddingHorizontal: wp('5%'),
  },
  title: {
    fontSize: hp('2%'),
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: hp('2%'),
    color: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: hp('1%'),
    marginBottom: hp('2%'),
    width: wp('90%'),
    alignSelf: 'center',
  },
  headerCell: {
    fontSize: hp('1.5%'),
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    color: '#000',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: hp('1%'),
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: wp('90%'),
    alignSelf: 'center',
  },
  cell: {
    fontSize: hp('1.5%'),
    flex: 1,
    textAlign: 'center',
    color: '#000',
  },
  closeButton: {
    alignItems: 'center',
    paddingVertical: hp('1.5%'),
    backgroundColor: '#12587B',
    borderRadius: wp('2%'),
    marginTop: hp('2%'),
    width: wp('50%'),
    alignSelf: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: hp('2%'),
    fontWeight: 'bold',
  },
});

export default ViolationsScreen;
