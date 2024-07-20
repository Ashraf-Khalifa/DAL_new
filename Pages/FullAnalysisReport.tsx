import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity,Image } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import CommonImage from '../Images/map.jpg';

const FullAnalysisReport = ({ report, onClose }) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Full Analysis Report</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Overview</Text>
        <Text style={styles.sectionContent}>
          {report.overview || 'Overview information is not available.'}
        </Text>
        <Image source={CommonImage} style={styles.detailImage} />
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Details</Text>
        <Text style={styles.sectionContent}>
          {report.details || 'Details information is not available.'}
        </Text>
      
      </View>
      {/* Add more sections as needed */}
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeButtonText}>Close</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    
  },
  header: {
    alignItems: 'center',
    marginBottom: hp('3%'),
  },
  title: {
    fontSize: hp('2%'),
    fontWeight: 'bold',
    marginBottom: hp('1%'),
    color: '#000',
  },
  section: {
    marginBottom: hp('1%'),
  },
  sectionTitle: {
    fontSize: hp('1.7%'),
    fontWeight: 'bold',
    marginBottom: hp('1%'),
    color: '#000',
  },
  sectionContent: {
    fontSize: hp('1.5%'),
    lineHeight: hp('3%'),
    color: '#000',
  },
  detailImage: {
    width: wp('80%'),
    height: hp('17%'),
    marginTop: hp('1%'),
    marginBottom: hp('1%'),
  },
  closeButton: {
    alignItems: 'center',
    paddingVertical: hp('1.5%'),
    width: wp('40%'),
    borderRadius: wp('2%'),
    backgroundColor: '#12587B',
    alignSelf: 'center',
    marginTop: hp('1%'),
  },
  closeButtonText: {
    color: '#fff',
    fontSize: hp('2%'),
    fontWeight: 'bold',
  },
});

export default FullAnalysisReport;
