import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';

const DocumentsScreen: React.FC = () => {
  const navigation = useNavigation();

  const documents = [
    { id: 1, name: 'Document 1', icon: require('../Images/pdf.png') },
    { id: 2, name: 'Document 2', icon: require('../Images/pdf.png') },
    { id: 3, name: 'Document 3', icon: require('../Images/pdf.png') },
    // Add more documents as needed
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.logoContainer}>
        <Image source={require('../Images/logo1.png')} style={styles.logo} />
      </View>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButtonContainer}>
          <Image source={require('../Images/back.png')} style={styles.backButton} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Documents</Text>
        </View>
      </View>
      <View style={styles.content}>
        {documents.map((document) => (
          <View key={document.id} style={styles.documentContainer}>
            <Image source={document.icon} style={styles.documentIcon} />
            <Text style={styles.documentName}>{document.name}</Text>
            <TouchableOpacity style={styles.downloadButton}>
              <Text style={styles.downloadButtonText}>Download</Text>
            </TouchableOpacity>
          </View>
        ))}
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
    color: '#000',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    width: wp('25%'),
    height: hp('25%'),
    resizeMode: 'contain',
  },
  content: {
    paddingVertical: hp('2%'),
  },
  documentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('2%'),
    padding: wp('2%'),
    borderRadius: wp('2%'),
    backgroundColor: '#f8f8f8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  documentIcon: {
    width: wp('8%'),
    height: hp('5%'),
    resizeMode: 'contain',
    marginRight: wp('3%'),
  },
  documentName: {
    flex: 1,
    fontSize: hp('2%'),
    color: '#333',
  },
  downloadButton: {
    backgroundColor: '#12587B',
    paddingVertical: hp('1%'),
    paddingHorizontal: wp('4%'),
    borderRadius: wp('2%'),
  },
  downloadButtonText: {
    color: '#fff',
    fontSize: hp('1.5%'),
  },
});

export default DocumentsScreen;
