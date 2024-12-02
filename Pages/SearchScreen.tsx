import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Modal, TextInput, Button, FlatList, Alert } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import MapView, { Marker, Callout, Polyline, Polygon } from 'react-native-maps';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const icons = [
  require('../Images/parking-sign.png'),
  require('../Images/red-flag.png'),
  require('../Images/no-littering-sign.png'),
  require('../Images/no-entry.png'),
  require('../Images/no-parking.png'),
  require('../Images/no-smoke.png'),
  require('../Images/parking.png'),
  require('../Images/stop.png'),
  require('../Images/road.png'),
  require('../Images/security-camera.png'),
  require('../Images/sign.png'),
  require('../Images/bus.png'),
  require('../Images/taxi.png'),
  require('../Images/bicycle.png'),
  require('../Images/metro.png'),
  require('../Images/restaurant.png'),
  require('../Images/shop.png'),
];

const categories = [
  { label: 'MOBILITY HUB', value: 'mobilityHub' },
  { label: 'Free Parking', value: 'freeParking' },
  { label: 'Violation', value: 'Violation' },
  { label: 'F&B Zones', value: 'fnbZones' },
  { label: 'Taxi Stands', value: 'taxiStands' },
  { label: 'Drop off/ Pickup points', value: 'dropOffPickup' },
  { label: 'evZones', value: 'evZones' },
];

const SearchScreen = ({ navigation }) => {
  const [date, setDate] = useState('');
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [fromTime, setFromTime] = useState('');
  const [toTime, setToTime] = useState('');
  const [drawnPolygons, setDrawnPolygons] = useState([]);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [savedPlaces, setSavedPlaces] = useState([]);
  const [placeName, setPlaceName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchCity, setSearchCity] = useState('');
  const [searchActivity, setSearchActivity] = useState('');
  const [showTraffic, setShowTraffic] = useState(true);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [locationModalVisible, setLocationModalVisible] = useState(false);
  const [modalVisibleIcon, setModalVisibleIcon] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [startPoint, setStartPoint] = useState(null);
  const [endPoint, setEndPoint] = useState(null);
  const [path, setPath] = useState([]);
  const [selectedMode, setSelectedMode] = useState('none');
  const [lineStyleModalVisible, setLineStyleModalVisible] = useState(false);
  const [lineStyle, setLineStyle] = useState('dashedRed');
  const [areaPopupVisible, setAreaPopupVisible] = useState(false);
  const [polygonName, setPolygonName] = useState('');
  const [currentPolygon, setCurrentPolygon] = useState([]);
  const [mode, setMode] = useState('none'); // 'marker' or 'polyline'
  const [popupVisible, setPopupVisible] = useState(true);
  const [polylineName, setPolylineName] = useState('');

  const [region, setRegion] = useState({
    latitude: 26.2172,
    longitude: 50.1971,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,    
  });
  const [filters, setFilters] = useState({
    all: true,
    mobilityHub: true,
    freeParking: true,
    fnbZones: true,
    taxiStands: true,
    dropOffPickup: true,
    evZones: true,
  });
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [isDrawing, setIsDrawing] = useState('green');
  const [drawColor, setDrawColor] = useState('green');

  const showCustomAlert = (title, message) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const filterPlacesByCategory = () => {
    if (selectedCategory) {
      const filteredMarkers = savedPlaces.filter(
        (place) => place.category === selectedCategory.value && place.location
      );
      
      const filteredLines = savedPlaces.filter(
        (place) => place.category === selectedCategory.value && place.start && place.end
      );
  
      const filteredAreas = drawnPolygons.filter(
        (polygon) => polygon.category === selectedCategory.value
      );
  
      setFilteredPlaces([...filteredMarkers, ...filteredLines, ...filteredAreas]);
    } else {
      setFilteredPlaces([...savedPlaces, ...drawnPolygons]);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userString = await AsyncStorage.getItem('loggedInUser');
        const user = userString ? JSON.parse(userString) : null;
        if (user) {
          setLoggedInUser(user);
        } else {
          navigation.navigate('Login');
        }
      } catch (error) {
        console.error('Error fetching user from AsyncStorage', error);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const getLocations = async () => {
      if (!loggedInUser) return;
      try {
        const places = await AsyncStorage.getItem(`savedPlaces_${loggedInUser.email}`);
        const polygons = await AsyncStorage.getItem(`drawnPolygons_${loggedInUser.email}`); // Load drawnPolygons
  
        if (places !== null) {
          const parsedPlaces = JSON.parse(places);
          setSavedPlaces(parsedPlaces);
          setFilteredPlaces(parsedPlaces);
          // console.log('Retrieved places:', parsedPlaces);
        }
  
        if (polygons !== null) {
          const parsedPolygons = JSON.parse(polygons);
          setDrawnPolygons(parsedPolygons); // Set drawnPolygons state
          // console.log('Retrieved polygons:', parsedPolygons);
        }
      } catch (error) {
        console.error('Failed to load the locations', error);
      }
    };
  
    getLocations();
  }, [loggedInUser]);
  
  


  useEffect(() => {
    const filtered = savedPlaces.filter(place => 
      place.name && place.name.toLowerCase().includes(searchActivity.toLowerCase())
    );
    setFilteredPlaces(filtered);
  }, [searchActivity, savedPlaces]);

  const handleSelectLocation = (event) => {
    const { coordinate } = event.nativeEvent;
    if (!coordinate) {
      console.error('Coordinate is undefined', event.nativeEvent);
      return;
    }
  
    const { latitude, longitude } = coordinate;
    if (mode === 'marker') {
      setSelectedLocation({ latitude, longitude });
    } else if (mode === 'polyline') {
      if (!startPoint) {
        setStartPoint({ latitude, longitude });
      } else if (!endPoint) {
        setEndPoint({ latitude, longitude });
      } else {
        // If both points are already set, reset them
        setStartPoint({ latitude, longitude });
        setEndPoint(null);
      }
    } else if (mode === 'area') {
      setPath([...path, { latitude, longitude }]);
    }
  };

  const handleSaveLocation = async () => {
    if (!loggedInUser) {
      alert('No logged in user found. Please log in and try again.');
      return;
    }
  
    if (mode === 'marker') {
      if (selectedLocation && placeName && selectedIcon !== null && selectedCategory) {
        const newPlace = {
          name: placeName,
          location: selectedLocation,
          iconIndex: selectedIcon,
          category: selectedCategory.value,
        };
        const updatedPlaces = [...savedPlaces, newPlace];
        setSavedPlaces(updatedPlaces);
        setPlaceName('');
        setSelectedLocation(null);
        setSelectedIcon(null);
        setSelectedCategory('');
        setFilteredPlaces(updatedPlaces); // Update filteredPlaces immediately
        try {
          await AsyncStorage.setItem(`savedPlaces_${loggedInUser.email}`, JSON.stringify(updatedPlaces));
          alert('Location saved successfully');
          setSelectedCategory('');  // Clear the category field
          console.log('Saved places:', updatedPlaces); // Logging saved places
        } catch (error) {
          console.error('Failed to save the location', error);
        }
      } else {
        alert('Please select a location, enter a name, choose an icon, and select a category.');
      }
    } else if (mode === 'polyline' && startPoint && endPoint) {
      if (!polylineName) {
        alert('Please enter a name for the line.');
        return;
      }
      if (!selectedCategory) {
        alert('Please select a category.');
        return;
      }
      const newPolyline = {
        name: polylineName,
        start: startPoint,
        end: endPoint,
        lineStyle,
        category: selectedCategory.value,
      };
      const updatedPolylines = [...savedPlaces, newPolyline];
      setSavedPlaces(updatedPolylines);
      setStartPoint(null);
      setEndPoint(null);
      setPolylineName('');
      setFilteredPlaces(updatedPolylines); // Update filteredPlaces immediately
      try {
        await AsyncStorage.setItem(`savedPlaces_${loggedInUser.email}`, JSON.stringify(updatedPolylines));
        alert('Polyline saved successfully');
        setSelectedCategory('');  // Clear the category field
        console.log('Saved polylines:', updatedPolylines); // Logging saved polylines
      } catch (error) {
        console.error('Failed to save the polyline', error);
      }
    } else if (isDrawing) {
      if (path.length > 0) {
        if (!selectedCategory) {
          alert('Please select a category.');
          return;
        }
        const closedPolygon = [...path, path[0]]; // Closing the polygon if path has more than 2 points
        const newPolygon = {
          name: polygonName || 'Unnamed Polygon',
          coordinates: closedPolygon,
          color: drawColor,
          category: selectedCategory.value,
        };
        const updatedPolygons = [...drawnPolygons, newPolygon];
        setDrawnPolygons(updatedPolygons);
        setSavedPlaces([...savedPlaces, newPolygon]);
        setCurrentPolygon([]);
        setPath([]); // Clear path to start fresh for new drawing
        setPolygonName('');
        setFilteredPlaces([...savedPlaces, newPolygon]);
  
        try {
          await AsyncStorage.setItem(`savedPlaces_${loggedInUser.email}`, JSON.stringify([...savedPlaces, newPolygon]));
          await AsyncStorage.setItem(`drawnPolygons_${loggedInUser.email}`, JSON.stringify(updatedPolygons)); // Save drawnPolygons
          alert('Polygon saved successfully');
          setSelectedCategory('');  // Clear the category field
          console.log('Saved polygons:', updatedPolygons);
        } catch (error) {
          console.error('Failed to save the polygon', error);
        }
      } else {
        alert('Please draw a polygon or set a location to save.');
      }
    }
  };


  useEffect(() => {
    filterPlacesByCategory();
  }, [selectedCategory]);
  

  useEffect(() => {
    const getLoggedInUser = async () => {
      try {
        const user = await AsyncStorage.getItem('loggedInUser');
        if (user !== null) {
          const parsedUser = JSON.parse(user);
          setLoggedInUser(parsedUser);
          console.log('Logged in user:', parsedUser); // Logging user info
        } else {
          console.error('No logged in user found');
        }
      } catch (error) {
        console.error('Failed to load the logged-in user', error);
      }
    };

    getLoggedInUser();
  }, []);

  const handleDeletePlace = async (index) => {
    const updatedPlaces = savedPlaces.filter((_, i) => i !== index);
    const updatedPolygons = drawnPolygons.filter((_, i) => i !== index); // Update drawnPolygons
  
    setSavedPlaces(updatedPlaces);
    setFilteredPlaces(updatedPlaces);  // Update filteredPlaces immediately
    setDrawnPolygons(updatedPolygons); // Update state for drawnPolygons
  
    try {
      await AsyncStorage.setItem(`savedPlaces_${loggedInUser.email}`, JSON.stringify(updatedPlaces));
      await AsyncStorage.setItem(`drawnPolygons_${loggedInUser.email}`, JSON.stringify(updatedPolygons)); // Save updated polygons
    } catch (error) {
      console.error('Failed to delete the location', error);
    }
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

  const handleSearchCity = async () => {
    if (!searchCity) {
      Alert.alert('Please enter a city name');
      return;
    }

    const apiKey = '8a384ada02594d2a8f5be971a7d48c01';
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${searchCity}&key=${apiKey}`;

    try {
      const response = await axios.get(url);
      const { results } = response.data;

      if (results && results.length > 0) {
        const { geometry } = results[0];
        setRegion({
          latitude: geometry.lat,
          longitude: geometry.lng,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      } else {
        Alert.alert('No results found for the specified city');
      }
    } catch (error) {
      console.error('Error fetching city coordinates', error);
      Alert.alert('Failed to fetch city coordinates');
    }
  };

  const handleDrawStart = (event) => {
    const { coordinate } = event.nativeEvent;
    if (!coordinate) {
      console.error('Coordinate is undefined', event.nativeEvent);
      return;
    }
  
    if (isDrawing) {
      const { latitude, longitude } = coordinate;
      setPath([...path, { latitude, longitude }]);
    }
  };
  
  
  
  const handleDrawEnd = () => {
    if (isDrawing && path.length > 2) {
      setDrawnPolygons([...drawnPolygons, { coordinates: path, color: drawColor }]);
      setPath([]);
    }
    setIsDrawing(false);  // Optionally, stop drawing mode
  };

  const handleToggleFilter = (filter) => {
    setFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      updatedFilters[filter] = !updatedFilters[filter];

      if (filter === 'all') {
        Object.keys(updatedFilters).forEach((key) => {
          updatedFilters[key] = updatedFilters.all;
        });
      } else {
        updatedFilters.all = Object.keys(updatedFilters).every((key) => key === 'all' || updatedFilters[key]);
      }

      const activeFilters = Object.keys(updatedFilters).filter(
        (key) => key !== 'all' && updatedFilters[key]
      );

      if (activeFilters.length > 0) {
        const filtered = savedPlaces.filter((place) => activeFilters.includes(place.category));
        setFilteredPlaces(filtered);
      } else if (updatedFilters.all) {
        setFilteredPlaces(savedPlaces);
      } else {
        setFilteredPlaces([]);
      }

      return updatedFilters;
    });
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
      <TouchableOpacity style={styles.logoContainer} onPress={() => setShowForm(true)}>
        <Image source={require('../Images/logo1.png')} style={styles.logo} />
      </TouchableOpacity>
      <View style={styles.header}>
        <TouchableOpacity style={styles.filterButtonContainer} onPress={() => setFilterModalVisible(true)}>
          <Image source={require('../Images/filter.png')} style={styles.filterButton} />
        </TouchableOpacity>
      </View>
      <View style={styles.dateTimeContainer}>
        <Text style={styles.label}>Select date</Text>
        <TextInput
  style={styles.datePickerButton}
  value={date}
  onChangeText={(text) => setDate(validateAndFormatDate(text))}
  placeholder="YYYY-MM-DD"
  placeholderTextColor="#AAAAAA"
/>

        <Text style={styles.label}>Time</Text>
        <View style={styles.timeContainer}>
          <Text style={styles.timeLabel}>From:</Text>
          <TextInput
  style={styles.timePickerButton}
  value={fromTime}
  onChangeText={(text) => setFromTime(validateAndFormatTime(text))}
  placeholder="HH:MM"
  keyboardType="numeric"
  placeholderTextColor="#AAAAAA"
/>

          <Text style={styles.timeLabel}>To:</Text>
          <TextInput
  style={styles.timePickerButton}
  value={toTime}
  onChangeText={(text) => setToTime(validateAndFormatTime(text))}
  placeholder="HH:MM"
  keyboardType="numeric"
  placeholderTextColor="#AAAAAA"
/>

        </View>
      </View>
      <View style={styles.mapContainer}>
      <MapView
  key={JSON.stringify(filteredPlaces)}
  style={styles.map}
  region={region}
  onRegionChangeComplete={setRegion}
  onPress={(event) => {
    if (isDrawing) {
      handleDrawStart(event);
    } else {
      handleSelectLocation(event);
    }
  }}
  onLongPress={handleDrawEnd}
  showsCompass={true}
  showsPointsOfInterest={true}
  showsBuildings={true}
  showsIndoors={true}
  showsUserLocation={true}
  followsUserLocation={true}
  showsMyLocationButton={true}
  showsScale={true}
  showsZoomControls={true}
  onUserLocationChange={(event) => {
    const { coordinate } = event.nativeEvent;
    if (coordinate) {
      const { latitude, longitude } = coordinate;
      setRegion({
        latitude,
        longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    }
  }}
>
  {selectedLocation && (
    <Marker coordinate={selectedLocation} />
  )}
{filteredPlaces.map((place, index) => {
  if (place.start && place.end) {
    return (
      <Polyline
        key={index}
        coordinates={[place.start, place.end]}
        strokeColor={
          place.lineStyle === 'dashedRed' || place.lineStyle === 'straightRed' ? 'red' : 'green'
        }
        strokeWidth={6}
        lineDashPattern={
          place.lineStyle === 'dashedRed' || place.lineStyle === 'dashedGreen' ? [5, 10] : []
        }
        onPress={() => showCustomAlert('Line', place.name)}
      />
    );
  } else if (place.location) {
    return (
      <Marker
        key={index}
        coordinate={place.location}
        onPress={() => showCustomAlert('Drop', place.name)}
      >
        <Image source={icons[place.iconIndex]} style={styles.markerIcon} />
      </Marker>
    );
  }
})}






{startPoint && endPoint && (
  <Polyline
    coordinates={[startPoint, endPoint]}
    strokeColor={
      lineStyle === 'dashedRed' || lineStyle === 'straightRed' ? 'red' : 'green'
    }
    strokeWidth={6}
    lineDashPattern={
      lineStyle === 'dashedRed' || lineStyle === 'dashedGreen' ? [5, 10] : []
    }
  >
    <Callout>
      <Text >{polylineName || 'Temporary Line'}</Text>
    </Callout>
  </Polyline>
)}

{path.length > 0 && (
  <Polyline
    coordinates={path}
    strokeColor={drawColor}
    strokeWidth={2}
  >
    <Callout>
      <Text>{polygonName || 'Drawing Path'}</Text>
    </Callout>
  </Polyline>
)}

{drawnPolygons.length > 0 && drawnPolygons.map((polygon, index) => (
  <Polygon
    key={index}
    coordinates={polygon.coordinates}
    fillColor={`rgba(${polygon.color === 'green' ? '0,255,0,0.3' : '255,0,0,0.3'})`}
    strokeColor={polygon.color}
    strokeWidth={2}
    onPress={() => showCustomAlert('Area', polygon.name)}  // Updated line
  >
    <Callout>
      <Text>{polygon.name}</Text>
    </Callout>
  </Polygon>
))}



</MapView>
      </View>

      <Modal
  visible={alertVisible}
  transparent={true}
  animationType="fade"
  onRequestClose={() => setAlertVisible(false)}
>
  <View style={styles.modalOverlay}>
    <View style={styles.customAlertContainer}>
      <Text style={styles.customAlertTitle}>{alertTitle}</Text>
      <Text style={styles.customAlertMessage}>{alertMessage}</Text>
      <TouchableOpacity style={styles.closeButton} onPress={() => setAlertVisible(false)}>
        <Text style={styles.closeButtonText}>OK</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>

      <TouchableOpacity style={styles.searchButton}>
        <Text style={styles.searchButtonText}>Search</Text>
      </TouchableOpacity>

   
      <Modal
  visible={showForm}
  transparent={true}
  animationType="slide"
  onRequestClose={() => setShowForm(false)}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContent}>
      
      <ScrollView contentContainerStyle={styles.modalScrollContent}>
        

      <Text style={styles.modalTitle}>Add Location Details</Text>


      <View style={styles.radioButtonContainer}>
      <TouchableOpacity
    style={styles.radioButton}
    onPress={() => {
      setSelectedMode('none');
      setMode('none');
      setPopupVisible(false);
      setIsDrawing(false);
    }}
  >
    <View style={[
      styles.radioCircle,
      selectedMode === 'none' && styles.selectedRadioCircle
    ]}/>
    <Text style={styles.radioText}>None</Text>
  </TouchableOpacity>
  <TouchableOpacity
        style={styles.radioButton}
        onPress={() => {
          setSelectedMode('marker');
          setMode('marker');
          setPopupVisible(false);
          setIsDrawing(false);
          setModalVisibleIcon(true); // Ensure this line is present to show the modal
        }}
      >
        <View style={[
          styles.radioCircle,
          selectedMode === 'marker' && styles.selectedRadioCircle
        ]}/>
        <Text style={styles.radioText}>Drop</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisibleIcon}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisibleIcon(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalIcon}>
              <Text style={styles.modalTitle}>Select an Icon</Text>
              <FlatList
                data={icons}
                numColumns={3}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => (
                  <TouchableOpacity onPress={() => { setSelectedIcon(index); setModalVisibleIcon(false); setShowForm(true); }}>
                    <Image source={item} style={styles.iconOption} />
                  </TouchableOpacity>
                )}
              />
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={() => { setModalVisibleIcon(false); setShowForm(true); }}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
  <TouchableOpacity
  style={styles.radioButton}
  onPress={() => {
    setSelectedMode('polyline');
    setMode('polyline');
    setLineStyleModalVisible(true);
    setIsDrawing(false);
  }}
>
  <View style={[
    styles.radioCircle,
    selectedMode === 'polyline' && styles.selectedRadioCircle
  ]}/>
  <Text style={styles.radioText}>Line</Text>
</TouchableOpacity>

  <TouchableOpacity
  style={styles.radioButton}
  onPress={() => {
    setSelectedMode('area'); // Set the selected mode to 'area'
    setAreaPopupVisible(true);
  }}
>
  <View style={[
    styles.radioCircle,
    selectedMode === 'area' && styles.selectedRadioCircle // Ensure the circle highlights when Area is selected
  ]}/>
  <Text style={styles.radioText}>Area</Text>
</TouchableOpacity>


</View>

        <Modal
  visible={lineStyleModalVisible}
  transparent={true}
  animationType="slide"
  onRequestClose={() => setLineStyleModalVisible(false)}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContent}>
    <Text style={styles.modalTitle}>Select Line Style</Text>

    <View style={styles.lineStyleContainer}>
      
  <TouchableOpacity
    style={styles.radioButton2}
    onPress={() => {
      setLineStyle('dashedRed');
      setLineStyleModalVisible(false);  // Hide the modal after selection
      handleSaveLocation();  // Save immediately
    }}
  >
    <View style={[
      styles.radioCircle,
      lineStyle === 'dashedRed' && styles.selectedRadioCircle
    ]}/>
    <Text style={styles.radioText}>Dashed Red</Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={styles.radioButton2}
    onPress={() => {
      setLineStyle('dashedGreen');
      setLineStyleModalVisible(false);
      handleSaveLocation();
    }}
  >
    <View style={[
      styles.radioCircle,
      lineStyle === 'dashedGreen' && styles.selectedRadioCircle
    ]}/>
    <Text style={styles.radioText}>Dashed Green</Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={styles.radioButton2}
    onPress={() => {
      setLineStyle('straightRed');
      setLineStyleModalVisible(false);
      handleSaveLocation();
    }}
  >
    <View style={[
      styles.radioCircle,
      lineStyle === 'straightRed' && styles.selectedRadioCircle
    ]}/>
    <Text style={styles.radioText}>Straight Red</Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={styles.radioButton2}
    onPress={() => {
      setLineStyle('straightGreen');
      setLineStyleModalVisible(false);
      handleSaveLocation();
    }}
  >
    <View style={[
      styles.radioCircle,
      lineStyle === 'straightGreen' && styles.selectedRadioCircle
    ]}/>
    <Text style={styles.radioText}>Straight Green</Text>
  </TouchableOpacity>
</View>


      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => setLineStyleModalVisible(false)}
      >
        <Text style={styles.closeButtonText}>Close</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>




{areaPopupVisible && (
  <Modal
    visible={areaPopupVisible}
    transparent={true}
    animationType="slide"
    onRequestClose={() => setAreaPopupVisible(false)}
  >
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Select Area Style</Text>
        <View style={styles.lineStyleContainer}>
          <TouchableOpacity
            style={styles.radioButton}
            onPress={() => {
              setIsDrawing(true); // Ensure drawing mode is enabled
              setDrawColor('green'); // Set the drawing color to green
            }}
          >
            <View style={[
              styles.radioCircle,
              isDrawing && drawColor === 'green' && styles.selectedRadioCircle
            ]}/>
            <Text style={styles.radioText}>Draw Green</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.radioButton}
            onPress={() => {
              setIsDrawing(true); // Ensure drawing mode is enabled
              setDrawColor('red'); // Set the drawing color to red
            }}
          >
            <View style={[
              styles.radioCircle,
              isDrawing && drawColor === 'red' && styles.selectedRadioCircle
            ]}/>
            <Text style={styles.radioText}>Draw Red</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => setAreaPopupVisible(false)}
        >
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
)}



      


<View style={styles.containerSearch}>
  {selectedMode !== 'polyline' && selectedMode !== 'area' && (
    <TextInput
      style={styles.placeContainer}
      placeholder="Enter drop name"
      placeholderTextColor="#AAAAAA"
      value={placeName}
      onChangeText={setPlaceName}
    />
  )}
  {selectedMode === 'polyline' && (
    <TextInput
      style={styles.placeContainer}
      placeholder="Enter line name"
      placeholderTextColor="#AAAAAA"
      value={polylineName}
      onChangeText={setPolylineName}
    />
  )}
  {selectedMode === 'area' && (
    <TextInput
      style={styles.placeContainer}
      placeholder="Enter area name"
      placeholderTextColor="#AAAAAA"
      value={polygonName}
      onChangeText={setPolygonName}
    />
  )}
</View>


        
        <View style={styles.dropdownContainer}>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setCategoryModalVisible(true)}
          >
            <Text style={selectedCategory ? styles.dropdownText : [styles.dropdownText, styles.placeholderText]}>
              {selectedCategory ? selectedCategory.label : 'Select a Category'}
            </Text>
          </TouchableOpacity>

          {dropdownVisible && (
            <View style={styles.dropdownList}>
              <ScrollView nestedScrollEnabled={true}>
                {categories.map((category, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setSelectedCategory(category);
                      setDropdownVisible(false);
                    }}
                  >
                    <Text style={styles.dropdownItemText}>{category.label}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
        
        <Modal
          visible={categoryModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setCategoryModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select a Category</Text>
              <FlatList
                data={categories}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.dropdownItem}
                    onPress={() => {
                      setSelectedCategory(item);
                      setCategoryModalVisible(false);
                    }}
                  >
                    <Text style={styles.dropdownItemText}>{item.label}</Text>
                  </TouchableOpacity>
                )}
              />
              <TouchableOpacity style={styles.closeButton} onPress={() => setCategoryModalVisible(false)}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <View style={styles.buttonRow}>


  <TouchableOpacity style={styles.saveButton} onPress={handleSaveLocation}>
    <Text style={styles.saveButtonText}>Save Location</Text>
  </TouchableOpacity>

  <TouchableOpacity style={styles.deleteOptionsButton} onPress={() => { setShowForm(false); setDeleteModalVisible(true); }}>
    <Text style={styles.deleteOptionsButtonText}>Delete Location</Text>
  </TouchableOpacity>
</View>


        <TouchableOpacity style={styles.closeButton} onPress={() => setShowForm(false)}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>

        
      </ScrollView>
    </View>
  </View>
</Modal>



<Modal
  visible={deleteModalVisible}
  transparent={true}
  animationType="slide"
  onRequestClose={() => setDeleteModalVisible(false)}
>
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>Delete Saved Places</Text>
      <FlatList
        data={savedPlaces}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.savedPlaceItem}>
            <Text>{item.name || (item.start && item.end ? `${item.start.latitude.toFixed(2)}, ${item.start.longitude.toFixed(2)} to ${item.end.latitude.toFixed(2)}, ${item.end.longitude.toFixed(2)}` : '')}</Text>
            <TouchableOpacity onPress={() => handleDeletePlace(index)} style={styles.deleteButton}>
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <TouchableOpacity style={styles.closeButton} onPress={() => { setDeleteModalVisible(false); setShowForm(true); }}>
        <Text style={styles.closeButtonText}>Close</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>



<Modal
  visible={filterModalVisible}
  transparent={true}
  animationType="slide"
  onRequestClose={() => setFilterModalVisible(false)}
>
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>Filters</Text>
      <View style={styles.filterAllContainer}>
        <View style={styles.filterItem}>
          <TouchableOpacity
            style={styles.customCheckBox}
            onPress={() => handleToggleFilter('all')}
          >
            {filters.all && <View style={styles.checkedBox} />}
          </TouchableOpacity>
          <Text style={styles.filterText}>ALL</Text>
        </View>
      </View>
      <View style={styles.filterGroup}>
        {Object.keys(filters).filter(filter => filter !== 'all').map((filter, index) => (
          <View key={filter} style={styles.filterItem}>
            <TouchableOpacity
              style={styles.customCheckBox}
              onPress={() => handleToggleFilter(filter)}
            >
              {filters[filter] && <View style={styles.checkedBox} />}
            </TouchableOpacity>
            <Text style={styles.filterText}>
              {filter === 'mobilityHub' ? 'MOBILITY HUB' :
              filter === 'freeParking' ? 'Free Parking' :
              filter === 'fnbZones' ? 'F&B Zones' :
              filter === 'taxiStands' ? 'Taxi Stands' :
              filter === 'dropOffPickup' ? 'Drop off/ Pickup points' :
              filter === 'Violation' ? 'Violation' :
              'EV Zones'}
            </Text>
          </View>
        )).reduce((acc, curr, index) => {
          if (index % 2 === 0) acc.push([curr]);
          else acc[acc.length - 1].push(curr);
          return acc;
        }, []).map((row, index) => (
          <View key={index} style={styles.filterRow}>
            {row}
          </View>
        ))}
      </View>
      <TouchableOpacity style={styles.closeButton} onPress={() => setFilterModalVisible(false)}>
        <Text style={styles.closeButtonText}>Close</Text>
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
  radioButtonContainer: {
    marginTop: wp('4%'),
    marginBottom: wp('4%'),

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  radioButton2: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%', // Adjust the width to fit two items per row
    marginBottom: hp('2%'), // Add some margin to space out the rows
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedRadioCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#000',
  },
  radioText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp('4%'),
    backgroundColor: '#FFFFFF',
    width: '100%',
    marginBottom: hp('2%'),
  },
  filterButtonContainer: {
    position: 'absolute',
    right: wp('3%'),
  },
  filterButton: {
    width: wp('6%'),
    height: hp('4%'),
    resizeMode: 'contain',
  },
  dateTimeContainer: {
    width: '100%',
    paddingTop: hp('3%'),
  },
  label: {
    fontSize: hp('2%'),
    marginBottom: hp('1%'),
    color: '#000',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: hp('2%'),  // Adjust as needed
    alignItems: 'center',      // Optional, for vertical alignment
    gap: hp('2%'), 
  },
  datePickerButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
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
      marginBottom: hp('3%'),
      width: wp('65%'), // Ensure consistent width
      height: hp('6%'), // Ensure consistent height
      color: '#000',
    },
  dateText: {
    fontSize: hp('210%'),
    color: '#000',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalOverlayAdd: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    height: wp('100%'),
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    padding: hp('2%'),
    borderRadius: 10,
  },
  modalIcon: {
    width: '100%',
    backgroundColor: 'white',
    padding: hp('2%'),
    borderRadius: 10,
    alignItems: 'center',
  },
  closeButton: {
    alignItems: 'center',
    alignSelf: 'center',
    paddingVertical: hp('2%'),
    width: wp('40%'),
    borderRadius: wp('3%'),
    marginTop: hp('2%'),
    marginBottom: hp('2%'),
    backgroundColor: '#12587B',
 

  },
  closeButtonText: {
    color: '#fff',
    fontSize: wp('3%'),
    fontWeight: 'bold',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: hp('2%'),
  },
  timeLabel: {
    fontSize: hp('2%'),
    marginRight: wp('2%'),
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
  mapContainer: {
    height: hp('30%'),
    borderRadius: wp('2%'),
    overflow: 'hidden',
    marginBottom: hp('5%'),
  },
  map: {
    ...StyleSheet.absoluteFillObject,
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
  searchButton: {
    backgroundColor: '#12587B',
    alignItems: 'center',
    alignSelf: 'center',
    paddingVertical: hp('2%'),
    width: wp('50%'),
    borderRadius: wp('5%'),
    marginTop: hp('2%'),
    marginBottom: hp('15%'),
  },
  searchButtonText: {
    color: '#fff',
    fontSize: wp('4%'),
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContentAdd: {
    width: '100%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    paddingTop: hp('5%'),
    height: '100%',
  },
  containerSearch: {
    width: '100%',
    paddingHorizontal: wp('8%'),
    paddingTop: hp('3%'),
  },
  placeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    marginBottom: hp('3%'),
    width: wp('65%'), // Ensure consistent width
    height: hp('6%'), // Ensure consistent height
  },
  searchInput: {
    flex: 1,
    fontSize: wp('4%'),
    color: '#000',
    height: hp('5%'),  // Adjust the height
    paddingVertical: hp('1%'), // Adjust the padding
    lineHeight: hp('3%'),
  },
  modalTitle: {
    fontSize: wp('4%'),
    fontWeight: 'bold',
    marginBottom: 20,
  },
  lineStyleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  lineStyleButton: {
    padding: hp('1%'),
    borderRadius: wp('2%'),
    backgroundColor: '#007BFF',
  },
  lineStyleText: {
    color: '#fff',
    fontSize: wp('3.5%'),
    fontWeight: 'bold',
  },
  iconOption: {
    width: wp('10%'),
    height: hp('5%'),
    margin: wp('2%'),
    resizeMode: 'contain',
    
  },
  markerIcon: {
    width: wp('5%'),
    height: hp('5%'),
    resizeMode: 'contain',
  },
  buttonContainer: {
    marginVertical: 10,
    width: '90%',
    marginBottom: 20,
    alignSelf: 'center',
  },
  tabBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  filterAllContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  filterGroup: {
    width: '100%',
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  filterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '40%',
  },
  filterText: {
    fontSize: wp('3%'),
    color: '#000',
    marginLeft: 10,
  },
  customCheckBox: {
    width: wp('5%'),
    height: wp('5%'),
    borderWidth: 2,
    borderColor: 'gray',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkedBox: {
    width: wp('3%'),
    height: wp('3%'),
    backgroundColor: '#000',
  },
  dropdownContainer: {
    marginRight: wp('8%'),
    marginLeft: wp('8%'),
    marginBottom: hp('2%'),
    position: 'relative',
    zIndex: 1000, // Ensure the dropdown container is above other elements
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  },
  dropdownText: {
    fontSize: wp('3%'),
    color: '#2C2C54',
  },
  placeholderText: {
    color: '#AAAAAA', // Add the color for placeholder text here
  },
  dropdownIcon: {
    width: wp('5%'),
    height: hp('3%'),
    resizeMode: 'contain',
  },
  dropdownListContainer: {
    width: '100%',
    maxHeight: hp('20%'),
    borderColor: '#E0E0E0',
    borderWidth: 1,
    backgroundColor: '#fff',
    borderRadius: wp('2%'),
    elevation: 5,
  },
  dropdownList: {
    width: '100%',
    position: 'absolute',
    top: '100%',
    zIndex: 1000,
    backgroundColor: '#fff',
    borderRadius: wp('2%'),
    elevation: 5,
    maxHeight: hp('20%'),
    borderColor: '#E0E0E0',
    borderWidth: 1,
  },
  dropdownItem: {
    padding: wp('4%'),
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  dropdownItemText: {
    color: '#000',
    fontSize: wp('3%'),
  },
  iconButton: {
    backgroundColor: 'blue',
    alignItems: 'center',
    alignSelf: 'center',
    paddingVertical: hp('2%'),
    width: wp('40%'),
    borderRadius: wp('3%'),
    marginTop: hp('2%'),
    marginBottom: hp('2%'),
  },
  iconButtonText: {
    color: '#fff',
    fontSize: wp('3%'),
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: 'green',
    alignItems: 'center',
    alignSelf: 'center',
    paddingVertical: hp('2%'),
    width: wp('40%'),
    borderRadius: wp('3%'),
    marginTop: hp('2%'),
    marginBottom: hp('2%'),
  },
  saveButtonText: {
    color: '#fff',
    fontSize: wp('3%'),
    fontWeight: 'bold',
  },
  deleteOptionsButton: {
    backgroundColor: 'red',
    alignItems: 'center',
    alignSelf: 'center',
    paddingVertical: hp('2%'),
    width: wp('40%'),
    borderRadius: wp('3%'),
    marginTop: hp('2%'),
    marginBottom: hp('2%'),

  },
  deleteOptionsButtonText: {
    color: '#fff',
    fontSize: wp('3%'),
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
  savedPlaceItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: wp('20%'),
  },
  deleteButton: {
    backgroundColor: '#ff4d4d',
    padding: 5,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: '#fff',
  },
});

export default SearchScreen;
