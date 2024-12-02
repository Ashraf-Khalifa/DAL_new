import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const violationsData = [
  {
    type: 'randoms top-micromobility',
    date: '02/05/2024',
    time: '02:50 PM',
    location: 'Downtown Parking Lot A',
    status: 'Pending',
  },
  {
    type: 'randoms top-EV charging',
    date: '03/05/2024',
    time: '03:15 PM',
    location: 'Green EV Charging Station',
    status: 'Resolved',
  },
  {
    type: 'randoms top-shared mobility',
    date: '04/05/2024',
    time: '01:30 PM',
    location: 'Main Street Bus Stop',
    status: 'In Progress',
  },
  {
    type: 'randoms top-fardtrack',
    date: '05/05/2024',
    time: '12:45 PM',
    location: 'City Center Garage',
    status: 'Pending',
  },
  {
    type: 'randoms top-micromobility',
    date: '06/05/2024',
    time: '04:20 PM',
    location: 'Metro Station - West Wing',
    status: 'Resolved',
  },
  {
    type: 'randoms top-EV charging',
    date: '07/05/2024',
    time: '05:55 PM',
    location: 'Eastside Mall Parking',
    status: 'Pending',
  },
  {
    type: 'randoms top-shared mobility',
    date: '08/05/2024',
    time: '06:10 PM',
    location: 'Community Park Zone 3',
    status: 'In Progress',
  },
  {
    type: 'randoms top-fardtrack',
    date: '09/05/2024',
    time: '07:25 PM',
    location: 'Highway Checkpoint B',
    status: 'Resolved',
  },
];


const ViolationsScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedViolation, setSelectedViolation] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);

  const handleActionClick = (item) => {
    setSelectedViolation(item);
    setSelectedOption(null); // Reset selection when opening the modal
    setModalVisible(true);
  };

  const handleTakeAction = () => {
    if (!selectedOption) {
      alert('Please select an option to proceed.');
      return;
    }
    alert(`Taking action for: ${selectedOption}`);
    setModalVisible(false);
  };

  const renderOption = (option) => (
    <TouchableOpacity
      key={option}
      style={styles.optionContainer}
      onPress={() => setSelectedOption(option)}
    >
      <View style={[styles.optionCircle, selectedOption === option && styles.selectedOptionCircle]} />
      <Text style={styles.optionText}>{option}</Text>
    </TouchableOpacity>
  );


  return (
    <View style={styles.container}>
     <View style={styles.headerContainer}>
  <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
    <Image source={require('../Images/back.png')} style={styles.backIcon} />
    {/* If you're using react-native-vector-icons, replace the Image with the Icon */}
    {/* <Icon name="arrow-back" size={24} color="#000" /> */}
  </TouchableOpacity>
  <Text style={styles.modalTitle}>All Violations</Text>
</View>
      <View style={styles.header}>
        <Text style={styles.headerType}>Type</Text>
        <Text style={styles.headerCell}>Date</Text>
        <Text style={styles.headerCell}>Time</Text>
        <Text style={styles.headerCell}>Location</Text>
        <Text style={styles.headerCell}>Status</Text>
        <Text style={styles.headerCell}>Action</Text>
      </View>
      {violationsData.map((item, index) => (
        <View key={index} style={styles.row}>
          <Text style={styles.type}>{item.type}</Text>
          <Text style={styles.cell}>{item.date}</Text>
          <Text style={styles.cell}>{item.time}</Text>
          <Text style={styles.cell}>{item.location}</Text>
          <Text style={styles.cell}>{item.status}</Text>
          <TouchableOpacity onPress={() => handleActionClick(item)} style={styles.actionButton}>
            <Image source={require('../Images/more.png')} style={styles.backIcon} />
          </TouchableOpacity>
        </View>
      ))}
     <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Action</Text>
            {['Violation Issuance', 'Notification from service provider', 'Skip'].map(renderOption)}
            <TouchableOpacity style={styles.takeActionButton} onPress={handleTakeAction}>
              <Text style={styles.takeActionText}>Take Action</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
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
        gap: wp('20%'),
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
  headerType: {
    fontSize: hp('1.2%'),
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'left',
    color: '#000',
  },
  headerCell: {
    fontSize: hp('1.2%'),
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    color: '#000',
    marginLeft: hp('1.5%'),
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
  type: {
    fontSize: hp('1%'),
    flex: 1,
    textAlign: 'left',
    color: '#000',
   marginRight: hp('1%'),
  },
  cell: {
    fontSize: hp('1%'),
    flex: 1,
    textAlign: 'left',
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
  actionButton: {
    flex: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    fontSize: hp('2%'),
    fontWeight: 'bold',
    color: '#000',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: wp('80%'),
    padding: wp('5%'),
    backgroundColor: 'white',
    borderRadius: wp('3%'),
    alignItems: 'center',
  },

  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: hp('1%'),
    padding: hp('1%'),
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: wp('2%'),
    backgroundColor: '#f9f9f9',
    width: '100%',
  },
  optionCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp('3%'),
  },
  selectedOptionCircle: {
    backgroundColor: '#000',
  },
  optionText: {
    fontSize: wp('3%'),
    color: '#000',
   
  },
  takeActionButton: {
    marginTop: hp('3%'),
    backgroundColor: '#007BFF',
    paddingVertical: hp('1%'),
    paddingHorizontal: wp('10%'),
    borderRadius: wp('3%'),
  },
  takeActionText: {
    color: '#fff',
    fontSize: wp('4%'),
    fontWeight: 'bold',
  },
});

export default ViolationsScreen;
