import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView, Alert, Modal, FlatList, Button } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import MapView, { Marker, Callout, PROVIDER_APPLE } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

const icons = [
  require('../Images/red-flag.png'),
  require('../Images/no-littering-sign.png'),
  require('../Images/no-entry.png'),
  require('../Images/no-parking.png'),
  require('../Images/no-smoke.png'),
  require('../Images/stop.png'),
  require('../Images/road.png'),
  require('../Images/security-camera.png'),
  require('../Images/sign.png'),
];


const AddViolationScreen = () => {
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [savedPlaces, setSavedPlaces] = useState([]);
  const [placeName, setPlaceName] = useState('');
  const [placeDescription, setPlaceDescription] = useState('');
  const [showTraffic, setShowTraffic] = useState(true); // Enable traffic by default setPlaceDescription
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [modalVisibleIcon, setModalVisibleIcon] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [modalVisibleLocations, setModalVisibleLocations] = useState(false); // Modal for displaying locations
  const [fromTime, setFromTime] = useState('');
  const [fromPeriod, setFromPeriod] = useState('AM');
  const [toTime, setToTime] = useState('');
  const [toPeriod, setToPeriod] = useState('AM');
  const [imageName, setImageName] = useState('');
  const [categoryPopupVisible, setCategoryPopupVisible] = useState(false);  
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupContent, setPopupContent] = useState('');
  
  const [region, setRegion] = useState({
    latitude: 25.276987, // Doha's latitude
    longitude: 51.520008, // Doha's longitude
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });
  
  const handleCategoryChange = (text) => {
    setPlaceName(text);
    const lowerCaseText = text.toLowerCase();
  
    // Check if the input matches one of the categories
    const categories = ['evzones', 'fnbzones', 'violation', 'freeparking', 'mobilityhub', 'taxistands', 'dropoffpickup'];
    const isCategory = categories.includes(lowerCaseText);
  
    if (isCategory) {
      setPopupContent(`Category: ${text}`); // Set the content to display the category
      setCategoryPopupVisible(true); // Open the modal
    } else {
      setCategoryPopupVisible(false); // Close the modal if the input doesn't match
    }
  };
  

  
  const handleImagePicker = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 200,
      maxWidth: 200,
    };
  
    Alert.alert(
      'Upload Image',
      'Choose an option',
      [
        {
          text: 'Camera',
          onPress: () => {
            launchCamera(options, (response) => {
              if (response.didCancel) {
                console.log('User cancelled camera picker');
              } else if (response.errorCode) {
                console.log('Camera Error: ', response.errorMessage);
              } else {
                const imageUri = response.assets[0].uri;
                const imageFileName = response.assets[0].fileName || imageUri.split('/').pop(); // Get image name
                setImageName(imageFileName); // Update state with image name
                console.log('Camera Image: ', imageUri);
              }
            });
          },
        },
        {
          text: 'Gallery',
          onPress: () => {
            launchImageLibrary(options, (response) => {
              if (response.didCancel) {
                console.log('User cancelled gallery picker');
              } else if (response.errorCode) {
                console.log('Gallery Error: ', response.errorMessage);
              } else {
                const imageUri = response.assets[0].uri;
                const imageFileName = response.assets[0].fileName || imageUri.split('/').pop(); // Get image name
                setImageName(imageFileName); // Update state with image name
                console.log('Gallery Image: ', imageUri);
              }
            });
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };
  
  
  useEffect(() => {
    const loadSavedPlaces = async () => {
      try {
        const savedPlacesString = await AsyncStorage.getItem('savedPlaces');
        if (savedPlacesString) {
          const savedPlacesArray = JSON.parse(savedPlacesString);
          setSavedPlaces(savedPlacesArray);
          setFilteredPlaces(savedPlacesArray);
        }
      } catch (error) {
        console.error('Failed to load saved places', error);
      }
    };

    loadSavedPlaces();
  }, []);

  const handleSelectLocation = (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setSelectedLocation({ latitude, longitude });
  };

  const handleSaveLocation = async () => {
    if (!selectedLocation) {
      Alert.alert('Error', 'Please select a location on the map.');
      return;
    }
  
    if (!placeName.trim()) {
      Alert.alert('Error', 'Please enter a Category.');
      return;
    }
    if (!placeDescription.trim()) {
      Alert.alert('Error', 'Please enter a description.');
      return;
    }
  
    if (!imageName) {
      Alert.alert('Error', 'Please upload an image.');
      return;
    }
  
    const user = await AsyncStorage.getItem('loggedInUser');
    const parsedUser = JSON.parse(user);
  
    const newPlace = {
      name: placeName,
      Description: placeDescription,
      location: selectedLocation,
      iconIndex: selectedIcon,
      imageName: imageName, // Save the image name placeDescription
      hideFromMap: parsedUser?.email === 'user1@dal.com' && parsedUser?.password === 'passuser1',
    };
  
    const updatedPlaces = [...savedPlaces, newPlace];
    setSavedPlaces(updatedPlaces);
    setFilteredPlaces(updatedPlaces);
    setPlaceName('');
    setPlaceDescription('');
    setSelectedLocation(null);
    setImageName('');
    setSelectedIcon(null);
  
    try {
      await AsyncStorage.setItem('savedPlaces', JSON.stringify(updatedPlaces));
      Alert.alert('Success', 'Report sent successfully.');
    } catch (error) {
      console.error('Failed to save the location', error);
      Alert.alert('Error', 'Failed to save the violation.');
    }
  };
  
  
  
  
  const handleDeletePlace = async (index) => {
    const updatedPlaces = savedPlaces.filter((_, i) => i !== index);
    setSavedPlaces(updatedPlaces);
    setFilteredPlaces(updatedPlaces);
    try {
      await AsyncStorage.setItem('savedPlaces', JSON.stringify(updatedPlaces));
    } catch (error) {
      console.error('Failed to delete the location', error);
    }
  };
  const validateTime = (time) => {
    const timeFormat = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeFormat.test(time);
  };
  
  const handleZoomIn = () => {
    setRegion((prevRegion) => ({
      ...prevRegion,
      latitudeDelta: prevRegion.latitudeDelta / 2,
      longitudeDelta: prevRegion.longitudeDelta / 2,
    }));
  };

  const handleZoomOut = () => {
    setRegion((prevRegion) => ({
      ...prevRegion,
      latitudeDelta: prevRegion.latitudeDelta * 2,
      longitudeDelta: prevRegion.longitudeDelta * 2,
    }));
  };

  const validateAndFormatTime = (text) => {
    // Remove any non-numeric characters except colon
    text = text.replace(/[^0-9:]/g, '');
    
    // If there's a colon, split the input into hours and minutes
    if (text.includes(':')) {
      let [hours, minutes] = text.split(':');
  
      // Limit hours to 2 digits and minutes to 2 digits
      if (hours.length > 2) hours = hours.slice(0, 2);
      if (minutes.length > 2) minutes = minutes.slice(0, 2);
  
      // Ensure the hours and minutes are valid numbers
      if (hours && (isNaN(hours) || parseInt(hours) > 12)) hours = '12';
      if (minutes && (isNaN(minutes) || parseInt(minutes) > 59)) minutes = '59';
  
      // Return the formatted time
      return `${hours}:${minutes}`;
    } else {
      // If there's no colon, return the text as it is being typed
      if (text.length > 2) {
        text = text.slice(0, 2) + ':' + text.slice(2);
      }
      return text;
    }
  };
  
  
  
  

  return (
    <ScrollView style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require('../Images/logo.png')} style={styles.logo} />
      </View>
      <Text style={styles.title}>Report Problem</Text>
      <View style={styles.mapContainer}>
      <MapView
  style={styles.map}
  region={region}
  onRegionChangeComplete={setRegion}
  onPress={handleSelectLocation}
  showsCompass={true} // Display compass
  showsPointsOfInterest={true} // Display points of interest
  showsBuildings={true} // Display buildings
  showsIndoors={true} // Display indoor maps
  showsUserLocation={true} // Show user location
  followsUserLocation={true} // Follow user location
  showsMyLocationButton={true} // Show my location button
  showsScale={true} // Show scale
  showsZoomControls={true} // Show zoom controls
  onUserLocationChange={(event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setRegion({
      latitude,
      longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
  }}
>
  {selectedLocation && <Marker coordinate={selectedLocation} />}
  {filteredPlaces
    .filter(place => !place.hideFromMap)
    .map((place, index) => (
      <Marker
        key={`marker-${index}`}
        coordinate={place.location}
        onPress={() => {
          setPopupContent(place);
          setPopupVisible(true);
        }}
      >
        <Image source={icons[place.iconIndex]} style={styles.markerIcon} />
      </Marker>
    ))}
</MapView>


        {popupVisible && (
  <Modal
    transparent={true}
    animationType="fade"
    visible={popupVisible}
    onRequestClose={() => setPopupVisible(false)}
  >
    <View style={styles.popupContainer}>
      <View style={styles.popup}>
      <Text style={styles.customAlertTitle}>Violation</Text>
        <Text>{popupContent?.name ?? ''}</Text>
        <View style={styles.row1}>
  <Text>From: {popupContent?.fromTime ?? ''}</Text>
  <Text>To: {popupContent?.toTime ?? ''}</Text>
</View>

        <TouchableOpacity style={styles.closeButton} onPress={() => setPopupVisible(false)}>
          <Text style={styles.closeButtonText}>OK</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
)}


        {/* <View style={styles.zoomContainer}>
              <TouchableOpacity onPress={handleZoomIn} style={styles.zoomButton}>
                <Text style={styles.zoomText}>+</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleZoomOut} style={styles.zoomButton}>
                <Text style={styles.zoomText}>-</Text>
              </TouchableOpacity>
            </View> */}
      </View>
      <View style={styles.row}>
      <View style={styles.inputContainer}>
  <Text style={styles.label}>Category</Text>
  <TouchableOpacity
    style={[styles.input, styles.touchableInput]} // Added specific style for TouchableOpacity to avoid styling issues
    onPress={() => {
      setPopupContent(placeName || "No category selected"); // Set the popup content
      setCategoryPopupVisible(true); // Open the modal
    }}
  >
    <Text style={placeName ? styles.inputText : styles.placeholderText}>
      {placeName || "Enter place Category"} {/* Display placeholder or selected category */}
    </Text>
  </TouchableOpacity>
</View>



<Modal
  transparent={true}
  animationType="fade"
  visible={categoryPopupVisible}
  onRequestClose={() => setCategoryPopupVisible(false)}
>
  <View style={styles.popupContainer1}>
    <View style={styles.popup1}>
      <Text style={styles.customAlertTitle1}>Select a Category</Text>
      <FlatList
        data={['evzones', 'fnbzones', 'violation', 'freeparking', 'mobilityhub', 'taxistands', 'dropoffpickup']}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.categoryItem}
            onPress={() => {
              setPlaceName(item); // Set the selected category
              setCategoryPopupVisible(false); // Close the modal
            }}
          >
            <Text style={styles.categoryText}>{item}</Text>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity
        style={styles.closeButton1}
        onPress={() => setCategoryPopupVisible(false)}
      >
        <Text style={styles.closeButtonText1}>Cancel</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>





<View style={styles.inputContainer}>
  <Text style={styles.label}>Description</Text>
  <TextInput
    style={styles.inputArea}
    value={placeDescription}
    onChangeText={setPlaceDescription}
    placeholder="Add description"
    placeholderTextColor="#AAAAAA"
    multiline={true}
    numberOfLines={4} // Adjust the height of the input area
  />
</View>

<View style={styles.uploadContainer}>
  <Text style={styles.label}>Upload Image</Text>
  <TouchableOpacity style={styles.uploadButton} onPress={handleImagePicker}>
    <View style={styles.Browse}>
    <Text style={styles.uploadText}>Browse</Text>
    <Image source={require('../Images/upload.png')} style={styles.uploadIcon} />
    </View>
    {imageName ? (
  <Text style={styles.imageNameText}>
    Selected Image: {imageName.length > 14 ? `${imageName.substring(0, 14)}...` : imageName}
  </Text>
) : (
  <Text style={styles.placeholderText}>
    Please upload an image.
  </Text>
)}


  </TouchableOpacity>
  
</View>

      </View>
      {/* <Text style={styles.label}>Time</Text>
      <View style={styles.timePickersRow}>
  <View style={styles.timePickerContainer}>
    <TextInput
      style={styles.timePickerButton}
      value={fromTime}
      onChangeText={(text) => setFromTime(validateAndFormatTime(text))}
      placeholder="HH:MM"
      keyboardType="numeric"
      placeholderTextColor="#AAAAAA"
    />
    <View style={styles.periodButtonsContainer}>
      <TouchableOpacity
        style={[styles.periodButton, fromPeriod === 'AM' && styles.selectedPeriodButton]}
        onPress={() => setFromPeriod('AM')}
      >
        <Text style={styles.periodButtonText}>AM</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.periodButton, fromPeriod === 'PM' && styles.selectedPeriodButton]}
        onPress={() => setFromPeriod('PM')}
      >
        <Text style={styles.periodButtonText}>PM</Text>
      </TouchableOpacity>
    </View>
  </View>
  <View style={styles.timePickerContainer}>
    <TextInput
      style={styles.timePickerButton}
      value={toTime}
      onChangeText={(text) => setToTime(validateAndFormatTime(text))}
      placeholder="HH:MM"
      keyboardType="numeric"
      placeholderTextColor="#AAAAAA"
    />
    <View style={styles.periodButtonsContainer}>
      <TouchableOpacity
        style={[styles.periodButton, toPeriod === 'AM' && styles.selectedPeriodButton]}
        onPress={() => setToPeriod('AM')}
      >
        <Text style={styles.periodButtonText}>AM</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.periodButton, toPeriod === 'PM' && styles.selectedPeriodButton]}
        onPress={() => setToPeriod('PM')}
      >
        <Text style={styles.periodButtonText}>PM</Text>
      </TouchableOpacity>
    </View>
  </View>
</View> */}


      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.addButton} onPress={handleSaveLocation} >
          <Text style={styles.addButtonText}>Add Violation</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity style={styles.deleteButton} onPress={() => setModalVisibleLocations(true)}>
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity> */}
      </View>
      <Modal
        visible={modalVisibleIcon}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisibleIcon(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select an Icon</Text>
            <FlatList
              data={icons}
              numColumns={3}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => (
                <TouchableOpacity onPress={() => { setSelectedIcon(index); setModalVisibleIcon(false); }}>
                  <Image source={item} style={styles.iconOption} />
                </TouchableOpacity>
              )}
            />
            <Button title="Close" onPress={() => setModalVisibleIcon(false)} />
          </View>
        </View>
      </Modal>
      
      <Modal
        visible={modalVisibleLocations}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisibleLocations(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>All Locations</Text>
            <FlatList
              data={savedPlaces}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => (
                <View style={styles.locationItem}>
                  <Text style={styles.locationText}>{item.name}</Text>
                  <TouchableOpacity onPress={() => handleDeletePlace(index)} style={styles.deleteButtonLocation}>
                        <Text style={styles.deleteButtonText}>Delete</Text>
                      </TouchableOpacity>
                </View>
              )}
            />

            <TouchableOpacity style={styles.closepopupButton} onPress={() => setModalVisibleLocations(false)}>
              <Text style={styles.iconButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>



      
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp('5%'),
    backgroundColor: '#FFFFFF',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    width: wp('25%'),
    height: hp('25%'),
  },
  title: {
    fontSize: wp('4%'),
    fontWeight: 'bold',
    textAlign: 'start',
    marginBottom: hp('3%'),
    color: '#000',
  },
  mapContainer: {
    height: hp('40%'),
    borderRadius: wp('2%'),
    overflow: 'hidden',
    marginBottom: hp('2%'),
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  popupContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  popup: {
    width: wp('80%'),
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  customAlertTitle: {
    fontSize: wp('5%'),
    fontWeight: 'bold',
    marginBottom: wp('2%'),
  },
  row1: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%', // Adjust as necessary
    marginTop: 10, 
    gap: wp('5%'),
  },
  closeButton: {
    alignItems: 'center',
    alignSelf: 'center',
    paddingVertical: hp('2%'),
    width: wp('40%'),
    borderRadius: wp('3%'),
    marginTop: hp('4%'),
    marginBottom: hp('2%'),
    backgroundColor: '#12587B',
 

  },
  closeButtonText: {
    color: '#fff',
    fontSize: wp('3%'),
    fontWeight: 'bold',
  },
  markerIcon: {
    width: wp('5%'), // Adjust the width as needed
    height: wp('5%'), // Adjust the height as needed
  },
  zoomContainer: {
    position: 'absolute',
    bottom: hp('2%'),
    right: wp('3%'),
    flexDirection: 'column',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 5,
    padding: 5,
  },
  zoomButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  zoomText: {
    fontSize: wp('5%'),
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'col',
    alignItems: 'start',
    justifyContent: 'space-between',
    marginVertical: hp('1%'),
  },
  inputContainer: {
    marginVertical: hp('1%'),  // Adjust the margin as needed
  },
  label: {
    fontSize: wp('3%'),
    color: '#000000',
    marginBottom: hp('2%'),  // Add marginBottom to space label and input
  },
  inputArea: {
    padding: wp('3%'),
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: wp('2%'),
    fontSize: wp('3%'),
    color: '#000000',
    textAlignVertical: 'top', // Ensures text starts at the top
    height: hp('10%'), // Adjust height as needed
  },
  
  uploadContainer: {
    marginVertical: hp('1%'),  
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: wp('3%'),
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: wp('2%'),
    justifyContent: 'space-between',
  },
  Browse: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 5,
    justifyContent: 'center',
  },
  uploadText: {
    fontSize: wp('3%'),
    color: '#AAAAAA',
    alignItems: 'center',
  },
  uploadIcon: {
    width: wp('5%'),
    height: wp('5%'),
    marginLeft: wp('2%'),
  },
  input: {
    padding: wp('3%'),
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: wp('2%'),
    fontSize: wp('3%'),
    color: '#000000',
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  from: {
    flexDirection: 'column',
  },
  to: {
    flexDirection: 'column',
  },
  timeLabel: {
    fontSize: wp('3%'),
    color: '#000000',
    marginBottom: hp('1%'),  // Add marginBottom to space label and input
  },
  timePickerButton: {
    padding: wp('3%'),
    backgroundColor: '#FFFFFF',
    borderRadius: wp('2%'),
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
    marginBottom: hp('2%'),
    textAlign: 'center',
    fontSize: wp('3%'),
    color: '#000',
  },
  inputText: {
    fontSize: wp('3%'),
    color: '#000000',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp('15%'),

  },
  addButton: {
    backgroundColor: '#12587B',
    alignItems: 'center',
    paddingVertical: hp('2%'),
    width: wp('50%'),
    borderRadius: wp('5%'),
    marginTop: hp('3%'),
  },
  addButtonText: {
    fontSize: wp('3%'),
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  deleteButtonLocation: {
    backgroundColor: '#ff4d4d',
    padding: 5,
    borderRadius: 5,

  },
  deleteButton: {
    backgroundColor: '#d9534f',
    alignItems: 'center',
    paddingVertical: hp('2%'),
    width: wp('30%'),
    borderRadius: wp('5%'),
    marginTop: hp('3%'),
  },
  deleteButtonText: {
    fontSize: wp('3%'),
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  closepopupButton: {
    width: '50%',
    backgroundColor: '#12587B',
    padding: 10,
    borderRadius: 5,
    marginBottom: wp('3%'),
    alignSelf: 'center',
    marginTop: wp('3%'),
  },
  iconButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: wp('3%'),
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: wp('4%'),
    fontWeight: 'bold',
    marginBottom: 20,
  },
  iconOption: {
    width: wp('10%'),
    height: hp('5%'),
    margin: 10,
    resizeMode: 'contain',
  },
  locationItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: wp("20%")
  },
  locationText: {
    fontSize: wp('3%'),
    color: '#000000',
  },
  timePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('2%'),
  },
  periodButtonsContainer: {
    flexDirection: 'row',
    marginLeft: wp('2%'),
  },
  periodButton: {
    padding: wp('2%'),
    backgroundColor: '#E0E0E0',
    borderRadius: wp('2%'),
    marginLeft: wp('1%'),
    marginBottom: hp('2%'),
  },
  selectedPeriodButton: {
    backgroundColor: '#12587B',
  },
  periodButtonText: {
    color: '#FFFFFF',
    fontSize: wp('3%'),
  },
  timePickersRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('2%'),
  },
  imageNameText: {
    marginTop: 10,
    marginBottom: 5,
    fontSize: wp('3%'),
    color: '#000',
  },
  placeholderText: {
    marginTop: 10,
    marginBottom: 5,
    fontSize: wp('3%'),
    color: '#AAAAAA', // Placeholder text color
  },
  popupContainer1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  popup1: {
    width: wp('80%'),
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  customAlertTitle1: {
    fontSize: wp('4%'),
    fontWeight: 'bold',
    marginBottom: wp('2%'),
    color: '#000',
    alignItems: 'center',
    alignSelf: 'center',
  },
  closeButton1: {
    alignItems: 'center',
    alignSelf: 'center',
    paddingVertical: hp('2%'),
    width: wp('40%'),
    borderRadius: wp('3%'),
    marginTop: hp('4%'),
    marginBottom: hp('2%'),
    backgroundColor: '#12587B',
  },
  closeButtonText1: {
    color: '#fff',
    fontSize: wp('3%'),
    fontWeight: 'bold',
    
  },
  
  categoryItem: {
    padding: wp('1.5%'),
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  categoryText: {
    fontSize: wp('3%'),
    color: '#000',
    
  },
  
});

export default AddViolationScreen;
