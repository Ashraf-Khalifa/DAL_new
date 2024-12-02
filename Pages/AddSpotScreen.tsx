import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import MapView, { Marker, Callout, PROVIDER_APPLE } from 'react-native-maps';

const AddSpotScreen: React.FC = () => {
  const [spotName, setSpotName] = useState('');
  const [spotType, setSpotType] = useState('');
  const [spotCategory, setSpotCategory] = useState('');
  const [day, setDay] = useState('');
  const [showTraffic, setShowTraffic] = useState(true); // Enable traffic by default
  const [fromTime, setFromTime] = useState('');
  const [toTime, setToTime] = useState('');
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [region, setRegion] = useState({
    latitude: 26.2172,
    longitude: 50.1971,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
    
  });
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [date, setDate] = useState('');
  const navigation = useNavigation();

  const handleSelectLocation = (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setSelectedLocation({ latitude, longitude });
  };

  const handleAddSpot = () => {
    // Add spot logic here
    alert('Spot Added');
    resetForm();
  };

  const resetForm = () => {
    setSpotName('');
    setSpotType('');
    setSpotCategory('');
    setDay('');
    setFromTime('');
    setToTime('');
    setSelectedLocation(null);
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

  const validateAndFormatDate = (text) => {
    // Remove any non-numeric characters except hyphens
    text = text.replace(/[^0-9-]/g, '');
    
    // Ensure the format is YYYY-MM-DD
    const parts = text.split('-');
    if (parts.length > 3) {
      parts.splice(3, parts.length - 3); // Keep only the first three parts
    }
    
    if (parts[0] && parts[0].length > 4) {
      parts[0] = parts[0].slice(0, 4); // Limit year to 4 digits
    }
    if (parts[1] && parts[1].length > 2) {
      parts[1] = parts[1].slice(0, 2); // Limit month to 2 digits
    }
    if (parts[2] && parts[2].length > 2) {
      parts[2] = parts[2].slice(0, 2); // Limit day to 2 digits
    }
    
    return parts.join('-');
  };
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require('../Images/logo1.png')} style={styles.logo} />
      </View>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButtonContainer}>
          <Image source={require('../Images/back.png')} style={styles.backButton} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Add Spot</Text>
        </View>
      </View>
      <View style={styles.inputRow}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Spot Name</Text>
          <TextInput
            style={styles.input}
            value={spotName}
            onChangeText={setSpotName}
            placeholder="Name"
            placeholderTextColor="#AAAAAA"
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Spot Type</Text>
          <TextInput
            style={styles.input}
            value={spotType}
            onChangeText={setSpotType}
            placeholder="Type"
            placeholderTextColor="#AAAAAA"
          />
        </View>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Spot Category</Text>
        <TextInput
          style={styles.input}
          value={spotCategory}
          onChangeText={setSpotCategory}
          placeholder="Category"
          placeholderTextColor="#AAAAAA"
        />
      </View>
      <Text style={styles.label}>Available Time</Text>
      <View style={styles.timeRow}>
        <TextInput
          style={styles.dayInput}
          value={day}
          onChangeText={setDay}
          placeholder="Day"
          placeholderTextColor="#AAAAAA"
        />
        </View>
        <View style={styles.timeContainer}>
          <Text style={styles.labelTime}>From:</Text>
          <TextInput
  style={styles.dayInput}
  value={fromTime}
  onChangeText={(text) => setFromTime(validateAndFormatTime(text))}
  placeholder="HH:MM"
  keyboardType="numeric"
  placeholderTextColor="#AAAAAA"
/>

          <Text style={styles.labelTime}>To:</Text>
          <TextInput
  style={styles.dayInput}
  value={toTime}
  onChangeText={(text) => setToTime(validateAndFormatTime(text))}
  placeholder="HH:MM"
  keyboardType="numeric"
  placeholderTextColor="#AAAAAA"
/>

        </View>
      
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
          {selectedLocation && (
            <Marker coordinate={selectedLocation} />
          )}
{filteredPlaces.map((place, index) => (
  <Marker
    key={index}
    coordinate={place.location}
  >
    <Image source={icons[place.iconIndex]} style={styles.markerIcon} />
    <Callout>
      <View>
        <Text>Spot Name: {spotName}</Text>
        <Text>Spot Type: {spotType}</Text>
        <Text>Spot Category: {spotCategory}</Text>
        <Text>Day: {day}</Text>
        <Text>From: {fromTime}</Text>
        <Text>To: {toTime}</Text>
      </View>
    </Callout>
  </Marker>
))}

        </MapView>


        {/* <View style={styles.zoomContainer}>
              <TouchableOpacity onPress={handleZoomIn} style={styles.zoomButton}>
                <Text style={styles.zoomText}>+</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleZoomOut} style={styles.zoomButton}>
                <Text style={styles.zoomText}>-</Text>
              </TouchableOpacity>
            </View> */}
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.addButton} onPress={handleAddSpot}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: wp('5%'),
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
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputContainer: {
    width: wp('30%'),
    marginBottom: hp('2%'),
  },
  label: {
    fontSize: hp('1.7%'),
    color: '#333',
    marginBottom: hp('1%'),
  },

  labelTime: {
    fontSize: hp('1.7%'),
    color: '#333',
  },
  input: {
    padding: wp('1.5%'),
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: wp('2%'),
    fontSize: wp('3%'),
    color: '#000000',
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('2%'),
  },
  dayInput: {
    width: wp('20%'),
    padding: wp('1%'),
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: wp('2%'),
    textAlign: 'center',
    fontSize: wp('3%'),
    color: '#000',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'left',
    marginBottom: hp('2%'),
    gap: hp('2%'),
  },
  timeLabel: {
    fontSize: hp('2%'),
    marginBottom: hp('1%'),
    color: '#000',
  },
  timePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: wp('1%'),
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
    width: wp('30%'), 
    height: hp('5%'), 
    textAlign: 'center',
    color: '#000',
  },
  timeInput: {
    width: wp('20%'),
    padding: wp('1%'),
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: wp('2%'),
    textAlign: 'center',
    fontSize: wp('3%'),
  },
  mapContainer: {
    height: hp('30%'),
    borderRadius: wp('2%'),
    overflow: 'hidden',
    marginBottom: hp('5%'),
  },
  locationButton: {
    position: 'absolute',
    top: 10, // Adjust as needed
    right: 10, // Adjust as needed
    backgroundColor: 'white',
    borderRadius: 50,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 4,
  },
  locationIcon: {
    width: 24, // Adjust as needed
    height: 24, // Adjust as needed
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  markerIcon: {
    width: wp('10%'),
    height: wp('10%'),
    resizeMode: 'contain',
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp('3%'),
    marginBottom: hp('15%'),
  },
  addButton: {
    backgroundColor: '#12587B',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: hp('1.5%'),
    width: wp('30%'),
    borderRadius: wp('5%'),
  },
  addButtonText: {
    color: '#fff',
    fontSize: hp('2.5%'),
  },
});

export default AddSpotScreen;
