import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, FlatList } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import map1 from '../Images/map1.jpeg';
import map2 from '../Images/map2.jpeg';
import map3 from '../Images/map3.jpeg';

const FullAnalysisReport = ({ navigation}) => {
  const [selectedMap, setSelectedMap] = useState(map1); // Default map
  const [overview, setOverview] = useState(
    'The satellite map provides a detailed aerial view of the city, showcasing infrastructure, landmarks, and urban layout in high resolution. This perspective helps analyze geographical distribution and urban planning.'
  ); // Default overview for Satellite Map
  
  const [details, setDetails] = useState(
    'Satellite imagery allows urban planners to assess land usage, monitor environmental changes, and ensure optimized space utilization. It provides insights into transportation networks, building density, and natural resource management.'
  ); // Default details for Satellite Map
  // Default details
  const [dropdownVisible, setDropdownVisible] = useState(false); // Control dropdown visibility

  const maps = [
    { 
      id: 'map1', 
      label: 'Satellite Map', 
      map: map1, 
      overview: 'The satellite map provides a detailed aerial view of the city, showcasing infrastructure, landmarks, and urban layout in high resolution. This perspective helps analyze geographical distribution and urban planning.', 
    details: 'Satellite imagery allows urban planners to assess land usage, monitor environmental changes, and ensure optimized space utilization. It provides insights into transportation networks, building density, and natural resource management.'
    },
    { 
      id: 'map2', 
      label: 'Heatmap', 
      map: map2, 
      overview: 'The heatmap visualizes data intensity across various areas, highlighting hotspots of activity such as popular locations, high-traffic zones, and potential problem areas.', 
      details: 'Heatmaps are crucial for understanding patterns such as pedestrian flow, traffic congestion, and service demands. They enable decision-makers to focus resources on critical areas and optimize infrastructure to meet citizen needs.' 
    },
    { 
      id: 'map3', 
      label: 'Standard Map', 
      map: map3, 
      overview: 'The standard map provides a simplified representation of the city, including roads, landmarks, and zones. It is ideal for navigation and general reference purposes.', 
    details: 'This map is used for planning routes, locating important services, and providing an intuitive layout for general navigation. It ensures users have a clear understanding of city layouts and connectivity without overwhelming details.'
    },
  ];

  const handleMapChange = (item) => {
    setSelectedMap(item.map);
    setOverview(item.overview);
    setDetails(item.details);
    setDropdownVisible(false); // Hide dropdown after selection
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
<View style={styles.headerContainer}>
  <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
    <Image source={require('../Images/back.png')} style={styles.backIcon} />
    {/* If you're using react-native-vector-icons, replace the Image with the Icon */}
    {/* <Icon name="arrow-back" size={24} color="#000" /> */}
  </TouchableOpacity>
  <Text style={styles.modalTitle}>Full Analysis Report</Text>
</View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <TouchableOpacity
            style={styles.dropdownToggle}
            onPress={() => setDropdownVisible(!dropdownVisible)}
          >
            <Text style={styles.dropdownToggleText}>Select Map Type</Text>
          </TouchableOpacity>
        </View>

        {dropdownVisible && (
          <View style={styles.dropdownContainer}>
            <FlatList
              data={maps}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => handleMapChange(item)}
                >
                  <Text style={styles.dropdownItemText}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}

        {/* Overview Text */}
        <Text style={styles.overviewText}>{overview}</Text>

        {/* Map Image */}
        <Image source={selectedMap} style={styles.detailImage} />

        {/* Details Text */}
        <Text style={styles.detailsText}>{details}</Text>
      </View>

      
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  modalTitle: {
    fontSize: wp('4%'),
    fontWeight: 'bold',
    marginBottom: hp('3%'),
    marginTop: hp('2%'),
    textAlign: 'center',
    color: '#000',
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: hp('0%'),
        paddingHorizontal: wp('0%'),
        gap: wp('14%'),
      },
      backButton: {
        marginRight: wp('3%'),
        padding: wp('2%'),
      },
      backIcon: {
        width: wp('5%'),
        height: hp('3%'),
        resizeMode: 'contain',
      },

  header: {
    alignItems: 'center',
    marginBottom: hp('3%'),
  },
  title: {
    fontSize: hp('2%'),
    fontWeight: 'bold',
    marginTop: hp('1.5%'),
    marginBottom: hp('1.5%'),
    color: '#000',

  },
  section: {
    marginBottom: hp('2%'),
    paddingHorizontal: hp('1.3%'),
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('1%'),
   
  },
  sectionTitle: {
    fontSize: hp('1.7%'),
    fontWeight: 'bold',
    color: '#000',
  },
  dropdownToggle: {
    backgroundColor: '#12587B',
    paddingVertical: hp('1%'),
    paddingHorizontal: wp('4%'),
    borderRadius: wp('2%'),
  },
  dropdownToggleText: {
    color: '#fff',
    fontSize: hp('1.2%'),
    fontWeight: 'bold',
  },
  dropdownContainer: {
    position: 'absolute',
    top: hp('5%'),
    right: wp('0%'),
    width: wp('50%'),
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: wp('2%'),
    zIndex: 1000,
    elevation: 5,
  },
  dropdownItem: {
    padding: hp('1%'),
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  dropdownItemText: {
    fontSize: hp('1.5%'),
    color: '#000',
  },
  overviewText: {
    fontSize: hp('1.5%'),
    lineHeight: hp('2.5%'),
    color: '#333',
    marginTop: hp('1.5%'),
    marginBottom: hp('1.5%'),

  },
  detailImage: {
    width: wp('100%'),
    height: hp('30%'),
    marginTop: hp('1%'),
    marginBottom: hp('1%'),
    alignSelf: 'center',
    resizeMode: 'contain',
  },
  detailsText: {
    fontSize: hp('1.5%'),
    lineHeight: hp('2.5%'),
    color: '#333',
    marginTop: hp('1.5%'),
    marginBottom: hp('1.5%'),
    
    
  },
  closeButton: {
    alignItems: 'center',
    paddingVertical: hp('1.5%'),
    width: wp('40%'),
    borderRadius: wp('2%'),
    backgroundColor: '#12587B',
    alignSelf: 'center',
    marginTop: hp('2%'),
  },
  closeButtonText: {
    color: '#fff',
    fontSize: hp('2%'),
    fontWeight: 'bold',
  },
});

export default FullAnalysisReport;
