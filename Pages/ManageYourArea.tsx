import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Button, TextInput, FlatList, Modal, ScrollView, Alert, PermissionsAndroid, Platform } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import MapView, { Marker, Callout, Polyline, Polygon } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from 'react-native-geolocation-service';
import axios from 'axios';
import StatusModal from './StatusModal';
import FullAnalysisReport from './FullAnalysisReport';


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
    { label: 'MOBILITY HUB', value: 'mobilityHub', iconIndex: 13 }, // Example: Bicycle icon
    { label: 'Free Parking', value: 'freeParking', iconIndex: 0 },
    { label: 'Violation', value: 'Violation', iconIndex: 1 },
    { label: 'F&B Zones', value: 'fnbZones', iconIndex: 15 },
    { label: 'Taxi Stands', value: 'taxiStands', iconIndex: 11 },
    { label: 'Drop off/ Pickup points', value: 'dropOffPickup', iconIndex: 12 },
    { label: 'evZones', value: 'evZones', iconIndex: 3 },
  ];
  



const ManageYourArea = ({ navigation}) => {
 
  const [isDrawing, setIsDrawing] = useState('green');
  const [drawColor, setDrawColor] = useState('green');
  const [drawnPolygons, setDrawnPolygons] = useState([]);
  const [currentPolygon, setCurrentPolygon] = useState([]);
  const [startPoint, setStartPoint] = useState(null);
  const [endPoint, setEndPoint] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [areaPopupVisible, setAreaPopupVisible] = useState(false);
  const [mode, setMode] = useState('none'); // 'marker' or 'polyline'
  const [polylineName, setPolylineName] = useState('');
  const [popupVisible, setPopupVisible] = useState(true);
  const [lineStyleModalVisible, setLineStyleModalVisible] = useState(false);
  const [selectedMode, setSelectedMode] = useState('none');
  const [lineStyle, setLineStyle] = useState('dashedRed'); // default line style
  const [showLineStyleOptions, setShowLineStyleOptions] = useState(false);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [placeName, setPlaceName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleIcon, setModalVisibleIcon] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [savedPlaces, setSavedPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [searchCity, setSearchCity] = useState('');
  const [searchActivity, setSearchActivity] = useState('');
  const [polygonName, setPolygonName] = useState('');
  const [path, setPath] = useState([]);
  const [saveLocationModalVisible, setSaveLocationModalVisible] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(0); // Track the zoom level
  const [showLocationCount, setShowLocationCount] = useState(true); // Control visibility  
  const [selectedFilterCategory, setSelectedFilterCategory] = useState('');
  const [region, setRegion] = useState({
    latitude: 25.276987, // Doha's latitude
    longitude: 51.520008, // Doha's longitude
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [filters, setFilters] = useState({
    all: true,
    mobilityHub: true,
    freeParking: true,
    fnbZones: true,
    taxiStands: true,
    dropOffPickup: true,
    evZones: true,
    Violation: true,
  });
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showTraffic, setShowTraffic] = useState(true); // Enable traffic by default
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [showFullReport, setShowFullReport] = useState(false);
  const [defaultIcons, setDefaultIcons] = useState([]);
  const [allowedDays, setAllowedDays] = useState([]);
  const [daySelectionModalVisible, setDaySelectionModalVisible] = useState(false);
  const [statusModalVisible, setStatusModalVisible] = useState(false);


  
  const calculateZoomLevel = (latitudeDelta) => {
    if (latitudeDelta < 0.01) return 16;  // Very zoomed in
    if (latitudeDelta < 0.05) return 14;  // Moderately zoomed in
    if (latitudeDelta < 0.1) return 12;   // Zoomed out
    return 10;  // Fully zoomed out
  };

  const filterPlacesInRegion = (places, region) => {
    return places.filter((place) => {
      const { latitude, longitude } = place.location || place.start || {};
      if (!latitude || !longitude) return false;
  
      // Check if the place is within the current region (bounds)
      return (
        latitude >= region.latitude - region.latitudeDelta / 2 &&
        latitude <= region.latitude + region.latitudeDelta / 2 &&
        longitude >= region.longitude - region.longitudeDelta / 2 &&
        longitude <= region.longitude + region.longitudeDelta / 2
      );
    });
  };
  
  
  const showCustomAlert = (title, message, date) => {
    const dateMessage = date ? `\n\nDate Added: ${date}` : '';
    setAlertTitle(title);
    setAlertMessage(`${message}${dateMessage}`);
    setAlertVisible(true);
  };
  
  const categoryColors = {
    mobilityHub: 'green',
    freeParking: 'green',
    Violation: 'red',
    fnbZones: 'red',
    taxiStands: 'green',
    dropOffPickup: 'green',
    evZones: 'red',
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
  
  
  
  const handleCurrentLocation = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) return;
  
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setSelectedLocation({ latitude, longitude });
        setRegion({
          latitude,
          longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      },
      (error) => {
        console.error('Error getting current location', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      }
    );
  };
  
  const handleDrawStart = (event) => {
    if (mode === 'none') {
      return;
    }
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
  
  
  
  useEffect(() => {
    if (isDrawing && path.length > 2) {
      setSaveLocationModalVisible(true); // Trigger the modal when path length is sufficient
    }
  }, [path]);
  
  const handleDrawEnd = () => {
    if (isDrawing && path.length > 2) {
      const closedPolygon = [...path, path[0]]; // Closing the polygon
      setDrawnPolygons([...drawnPolygons, { coordinates: closedPolygon, color: drawColor }]);
      setPath([]);
    }
    setIsDrawing(false);
  };
  
  
  
  useEffect(() => {
    // Update zoom level for controlling the visibility of location count
    const zoom = calculateZoomLevel(region.latitudeDelta);
    setZoomLevel(zoom);
  
    // Filter places in the current visible region
    const placesInRegion = filterPlacesInRegion(savedPlaces, region);
    setFilteredPlaces(placesInRegion);
  
    // Show location count only if places exist in the current region
    if (placesInRegion.length > 0 && zoom <= 12) {
      setShowLocationCount(true);
    } else {
      setShowLocationCount(false);
    }
  }, [region, savedPlaces]);
  
  
  

  
  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: "Location Permission",
              message: "This app needs access to your location.",
              buttonNeutral: "Ask Me Later",
              buttonNegative: "Cancel",
              buttonPositive: "OK"
            }
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log("You can use the location");
            return true;
          } else {
            console.log("Location permission denied");
            return false;
          }
        } catch (err) {
          console.warn(err);
          return false;
        }
      }
      return true; // iOS permissions are handled by the library
    };
  
    // const getCurrentLocation = async () => {
    //   const hasPermission = await requestLocationPermission();
    //   if (!hasPermission) return;
  
    //   Geolocation.getCurrentPosition(
    //     (position) => {
    //       const { latitude, longitude } = position.coords;
    //       setSelectedLocation({ latitude, longitude });
    //       setRegion({
    //         latitude,
    //         longitude,
    //         latitudeDelta: 0.0922,
    //         longitudeDelta: 0.0421,
    //       });
    //     },
    //     (error) => {
    //       console.error('Error getting current location', error);
    //       // Optionally, set a default location here
    //     },
    //     {
    //       enableHighAccuracy: true,
    //       timeout: 15000,
    //       maximumAge: 10000,
    //     }
    //   );
    // };
  
    // getCurrentLocation();
  }, []);
  
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
    if (mode === 'none') {
      return;
    }
    const { coordinate } = event.nativeEvent;
    if (!coordinate) {
      console.error('Coordinate is undefined', event.nativeEvent);
      return;
    }
  
    const { latitude, longitude } = coordinate;
  
    if (mode === 'marker') {
      setSelectedLocation({ latitude, longitude });
      setSaveLocationModalVisible(true);
    } else if (mode === 'polyline') {
      if (!startPoint) {
        setStartPoint({ latitude, longitude });
      } else if (!endPoint) {
        setEndPoint({ latitude, longitude });
        setSaveLocationModalVisible(true); // Show the modal after selecting the end point
      }
    } else if (mode === 'area') {
      const newPath = [...path, { latitude, longitude }];
      setPath(newPath);
  
      // If path length is more than 2, allow closing the polygon
      if (newPath.length > 2) {
        setSaveLocationModalVisible(true); // Show the modal when the shape is about to be closed
      }
    }
  };
  
  
  
  
  
  
  
  
  
  


  const handleSaveLocation = async () => {
    const today = new Date().toLocaleString('en-us', { weekday: 'long' });
//   if (!allowedDays.includes(today)) {
//     alert(`You can only add locations on: ${allowedDays.join(', ')}`);
//     return;
//   }
    if (!loggedInUser) {
      alert('No logged-in user found. Please log in and try again.');
      return;
    }
  
    // Handling marker (point) saving
    if (mode === 'marker') {
      if (selectedLocation && placeName && selectedIcon !== null && selectedCategory) {
        const newPlace = {
          name: placeName,
          location: selectedLocation,
          iconIndex: selectedIcon,
          category: selectedCategory.value,
          dateAdded: new Date().toLocaleString(),
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
    }
  
    // Handling polyline (line) saving
    else if (mode === 'polyline' && startPoint && endPoint) {
      let autoLineStyle = 'straightGreen'; // Default to a straight green line
  
      if (selectedCategory.value === 'evZones') {
        autoLineStyle = 'dashedRed';
      } else if (selectedCategory.value === 'fnbZones') {
        autoLineStyle = 'dashedGreen';
      } else if (selectedCategory.value === 'Violation') {
        autoLineStyle = 'straightRed';
      } else if (selectedCategory.value === 'freeParking') {
        autoLineStyle = 'straightGreen';
      } else if (selectedCategory.value === 'mobilityHub') {
        autoLineStyle = 'straightGreen';
      } else if (selectedCategory.value === 'taxiStands') {
        autoLineStyle = 'straightGreen';
      } else if (selectedCategory.value === 'dropOffPickup') {
        autoLineStyle = 'straightGreen';
      }
  
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
        lineStyle: autoLineStyle,
        category: selectedCategory.value,
      };
  
      const updatedPolylines = [...savedPlaces, newPolyline];
      setSavedPlaces(updatedPolylines);
      setStartPoint(null); // Reset startPoint
      setEndPoint(null); // Reset endPoint
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
    }
  
    // Handling area (polygon) saving
    else if (isDrawing) {
      if (path.length > 0) {
        if (!selectedCategory) {
          alert('Please select a category.');
          return;
        }
  
        // Assign a color based on the selected category
        const color = categoryColors[selectedCategory.value] || 'green'; // Default to green if no category found
  
        const closedPolygon = [...path, path[0]]; // Close the polygon
        const newPolygon = {
          name: polygonName || 'Unnamed Polygon',
          coordinates: closedPolygon,
          color,  // Automatically set the color based on the category
          category: selectedCategory.value,
        };
  
        const updatedPolygons = [...drawnPolygons, newPolygon];
        setDrawnPolygons(updatedPolygons);
        setSavedPlaces([...savedPlaces, newPolygon]);
        setCurrentPolygon([]);
        setPath([]);
        setPolygonName('');
        setFilteredPlaces([...savedPlaces, newPolygon]);
  
        try {
          await AsyncStorage.setItem(`savedPlaces_${loggedInUser.email}`, JSON.stringify([...savedPlaces, newPolygon]));
          await AsyncStorage.setItem(`drawnPolygons_${loggedInUser.email}`, JSON.stringify(updatedPolygons));
          alert('Polygon saved successfully');
          setSelectedCategory('');
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
        setFilteredPlaces([]); // Clear the map if no filter is active and 'all' is not selected
      }
      

      return updatedFilters;
    });
  };

  const handleReportProblem = () => {
    navigation.navigate('AddViolation'); 
  };

  const handleContactUs = () => {
    navigation.navigate('ContactUs'); 
  };

  return (
<View>
<View >
<View >

<ScrollView contentContainerStyle={styles.modalScrollContent}>
  

<View style={styles.headerContainer}>
  <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
    <Image source={require('../Images/back.png')} style={styles.backIcon} />
  
  </TouchableOpacity>
  <Text style={styles.modalTitle}>Enter Location Details</Text>
</View>


<View style={styles.status}>
  <TouchableOpacity onPress={() => setStatusModalVisible(true)}>
    <Image source={require('../Images/status.png')} style={styles.icon} />
  </TouchableOpacity>
</View>

<Modal
  visible={statusModalVisible}
  transparent={true}
  animationType="slide"
  onRequestClose={() => setStatusModalVisible(false)}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>Saved Locations</Text>
      <FlatList
        data={savedPlaces}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.savedPlaceItem}>
            <Text style={styles.Place}>
              {item.name ||
                (item.start && item.end
                  ? `${item.start.latitude.toFixed(2)}, ${item.start.longitude.toFixed(2)} to ${item.end.latitude.toFixed(2)}, ${item.end.longitude.toFixed(2)}`
                  : 'Unnamed Location')}
            </Text>
            {item.dateAdded && (
              <Text style={styles.dateText}>Added on: {item.dateAdded}</Text>
            )}
          </View>
        )}
      />
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => setStatusModalVisible(false)}
      >
        <Text style={styles.closeButtonText}>Close</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>


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
    // Automatically set the form to visible since the icon is already selected
    setShowForm(true);
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
setSelectedMode('area');  // Enable drawing mode for areas
setMode('area');          // Set mode to 'area'
setIsDrawing(true);       // Automatically enable drawing
}}
>
<View style={[
styles.radioCircle,
selectedMode === 'area' && styles.selectedRadioCircle // Ensure the circle highlights when Area is selected
]}/>
<Text style={styles.radioText}>Area</Text>
</TouchableOpacity>



</View>



  {/* <Modal
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
</Modal> */}




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
<TouchableOpacity
  style={styles.placeContainer} // Use same style as TextInput
  onPress={() => setDaySelectionModalVisible(true)}
>
  <Text
    style={[
      styles.selectedDaysText,
      allowedDays.length === 0 && styles.placeholderTextColor, // Apply placeholder color if no days selected
    ]}
  >
    {allowedDays.length === 7
      ? 'Always' 
      : allowedDays.length > 0
      ? allowedDays.join(', ') 
      : 'Select Allowed Days'} 
  </Text>
</TouchableOpacity>



</View>


  
  {/* <View style={styles.dropdownContainer}>
    <TouchableOpacity
      style={styles.dropdown}
      onPress={() => setDropdownVisible(!dropdownVisible)}
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
                setSelectedIcon(category.iconIndex); 
                setDropdownVisible(false);
              }}
            >
              <Text style={styles.dropdownItemText}>{category.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    )}
  </View> */}
  
  <View style={styles.dropdownContainer}>
  <TouchableOpacity
    style={styles.dropdown}
    onPress={() => setCategoryModalVisible(true)} // Open the modal instead of toggling dropdown visibility
  >
    <Text style={selectedCategory ? styles.dropdownText : [styles.dropdownText, styles.placeholderText]}>
      {selectedCategory ? selectedCategory.label : 'Select a Category'}
    </Text>
  </TouchableOpacity>
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
              setSelectedCategory(item); // Set the selected category
              setSelectedIcon(item.iconIndex); // Automatically assign the corresponding icon
              setCategoryModalVisible(false); // Close the modal
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

  <TouchableOpacity style={styles.saveButton} onPress={() => {
  handleSaveLocation();
  setSaveLocationModalVisible(true);  // Hide the modal after saving
}}>
  <Text style={styles.saveButtonText}>Save Location</Text>
</TouchableOpacity>





<TouchableOpacity style={styles.deleteOptionsButton} onPress={() => { setShowForm(false); setDeleteModalVisible(true); }}>
<Text style={styles.deleteOptionsButtonText}>Delete Location</Text>
</TouchableOpacity>


</View>

<Modal
  visible={daySelectionModalVisible}
  transparent={true}
  animationType="slide"
  onRequestClose={() => setDaySelectionModalVisible(false)}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>Select Allowed Days</Text>

      {/* "All Days" Option */}
      <TouchableOpacity
        style={allowedDays.length === 7 ? styles.selectedDayButton : styles.dayButton}
        onPress={() => {
          setAllowedDays((prevDays) =>
            prevDays.length === 7
              ? [] // Clear all days if all are selected
              : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] // Select all days
          );
        }}
      >
        <Text style={styles.dayButtonText}>All Days</Text>
      </TouchableOpacity>

      {/* Individual Day Options */}
      {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, index) => (
        <TouchableOpacity
          key={index}
          style={allowedDays.includes(day) ? styles.selectedDayButton : styles.dayButton}
          onPress={() => {
            setAllowedDays((prevDays) =>
              prevDays.includes(day)
                ? prevDays.filter((d) => d !== day) // Remove the day if already selected
                : [...prevDays, day] // Add the day if not selected
            );
          }}
        >
          <Text style={styles.dayButtonText}>{day}</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => setDaySelectionModalVisible(false)}
      >
        <Text style={styles.closeButtonText}>Close</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>







  {/* <TouchableOpacity style={styles.closeButton} onPress={() => setShowForm(false)}>
    <Text style={styles.closeButtonText}>Close</Text>
  </TouchableOpacity> */}

  
</ScrollView>
</View>
</View>



    {/* <Modal
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
setSelectedMode('area');  // Enable drawing mode for areas
setMode('area');          // Set mode to 'area'
setIsDrawing(true);       // Automatically enable drawing
}}
>
<View style={[
styles.radioCircle,
selectedMode === 'area' && styles.selectedRadioCircle // Ensure the circle highlights when Area is selected
]}/>
<Text style={styles.radioText}>Area</Text>
</TouchableOpacity>



</View>






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
</Modal> */}



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
      <Text style={styles.Place}>
        {item.name || 
          (item.start && item.end 
            ? `${item.start.latitude.toFixed(2)}, ${item.start.longitude.toFixed(2)} to ${item.end.latitude.toFixed(2)}, ${item.end.longitude.toFixed(2)}`
            : '')
        }
      </Text>
      {item.dateAdded && (
        <Text style={styles.dateText}>Added on: {item.dateAdded}</Text> // Display the dateAdded field
      )}
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


{/* <Modal
visible={saveLocationModalVisible}
transparent={true}
animationType="slide"
onRequestClose={() => setSaveLocationModalVisible(false)}
>
<View style={styles.modalOverlay}>
<View style={styles.modalContent}>
<Text style={styles.modalTitle}>Save Location</Text>
<TouchableOpacity style={styles.saveButton} onPress={() => {
  handleSaveLocation();
  setSaveLocationModalVisible(false);  // Hide the modal after saving
}}>
  <Text style={styles.saveButtonText}>Save Location</Text>
</TouchableOpacity>
<TouchableOpacity style={styles.closeButton} onPress={() => setSaveLocationModalVisible(false)}>
  <Text style={styles.closeButtonText}>Close</Text>
</TouchableOpacity>
</View>
</View>
</Modal> */}
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
// Handle polyline (line) rendering
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
place.lineStyle === 'dashedRed' || place.lineStyle === 'dashedGreen' ? [5, 10] : null
}
onPress={() => showCustomAlert('Line', polylineName || 'Temporary Line', place.dateAdded)}
/>
);
}

// Handle marker (point) rendering
else if (place.location) {
return (
<Marker
key={index}
coordinate={place.location}
onPress={() => showCustomAlert('Drop', place.name, place.dateAdded)}
>
<Image source={icons[place.iconIndex]} style={styles.markerIcon} />
</Marker>
);
}

// Handle polygon (area) rendering
else if (place.coordinates) {
return (
<Polygon
key={index}
coordinates={place.coordinates}
fillColor={`rgba(${place.color === 'green' ? '0,255,0,0.3' : '255,0,0,0.3'})`}
strokeColor={place.color}
strokeWidth={2}
onPress={() => showCustomAlert('Area', polygon.name, polygon.dateAdded)}
/>
);
}

return null; // In case no matching condition is found
})}








{startPoint && endPoint && (
<Polyline
coordinates={[startPoint, endPoint]}
strokeColor={lineStyle === 'straightRed' ? 'red' : 'green'} // Red for straightRed, Green for straightGreen
strokeWidth={6} // Line width
lineDashPattern={lineStyle === 'dashedRed' || lineStyle === 'dashedGreen' ? [5, 10] : []} // Empty array for straight lines
onPress={() => showCustomAlert('Line', polylineName || 'Temporary Line')}
>
<Callout>
<Text>{polylineName || 'Temporary Line'}</Text>
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
{showLocationCount && filteredPlaces.length > 0 && (
<View style={styles.locationCountContainer}>
<Text style={styles.locationCountText}>
{filteredPlaces.length} 
</Text>
</View>
)}


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

</View>
  </View>


  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: '#fff',
    paddingBottom: wp('5%'),
  },
  scrollContainer: {
    flexGrow: 1,
  },
  scrollView: {
    width: '100%',
  },
  container: {
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp('4%'),
    backgroundColor: '#FFFFFF',
    width: '100%',
    marginBottom: hp('3%'),

  },
  signalButton: {
    position: 'absolute',
    left: wp('8%'),
  },
  settingsButton: {
    position: 'absolute',
    right: wp('8%'),
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    
  },
  modalStatus: {
    width: wp('100%'),
    backgroundColor: 'white',
    borderRadius: wp('5%'),
    padding: wp('5%'),
  },
  scrollContent: {
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: hp('2.5%'),
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: hp('1%'),
    marginTop: hp('3%'),
    color: '#000',
  },
  statusTitle: {
    fontSize: hp('2%'),
    textAlign: 'center',
    marginVertical: hp('1%'),
    color: '#000',
  },
  statusBox: {
    backgroundColor: 'green',
    paddingVertical: hp('1%'),
    paddingHorizontal: wp('10%'),
    borderRadius: wp('2%'),
    marginVertical: hp('1%'),
  },
  statusText: {
    color: '#fff',
    fontSize: hp('2.5%'),
    fontWeight: 'bold',
  },
  detailsContainer: {
    alignItems: 'center',
    marginVertical: hp('2%'),
  },
  detailText: {
    fontSize: hp('1.7%'),
    textAlign: 'center',
    marginVertical: hp('0.7%'),
    color: '#000',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '90%',
    backgroundColor: '#12587B',
    padding: hp('2%'),
    borderRadius: wp('2%'),
    marginVertical: hp('1%'),
  },
  buttonText: {
    color: '#fff',
    fontSize: hp('1.7%'),
    fontWeight: 'bold',
  },
  buttonIcon: {
    width: wp('8%'),
    height: hp('4%'),
    resizeMode: 'contain',
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
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
      // Adjust as needed
    alignItems: 'center',      // Optional, for vertical alignment
    gap: hp('2%'), 
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    width: wp('25%'),
    height: hp('25%'),
    // resizeMode: 'contain',
  },
  containerSearch: {
    width: '100%',
    paddingHorizontal: wp('8%'),
    paddingTop: hp('1%'),
    
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: wp('1.7%'),
    backgroundColor: '#FFFFFF',
    borderRadius: wp('2%'),
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
    marginBottom: hp('1%'),
    
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
    width: wp('80%'), // Ensure consistent width
    height: hp('6%'), // Ensure consistent height
    color: '#000',

  },
  
  searchInput: {
    flex: 1,
    fontSize: wp('4%'),
    color: '#000',
    height: hp('5%'),  // Adjust the height
    paddingVertical: hp('1%'), // Adjust the padding
    lineHeight: hp('3%'), // Adjust the line height
  },
  
  searchIcon: {
    width: wp('5%'),
    height: hp('3%'),
    resizeMode: 'contain',
  },
  breadcrumbText: {
    flex: 1,
    fontSize: wp('4%'),
    color: '#000',
    height: hp('5%'),  // Adjust the height
    paddingVertical: hp('1%'), // Adjust the padding
    lineHeight: hp('3%'), 
  },
  searchButton: {},
  mapContainer: {
    height: hp('30%'),
    borderRadius: wp('2%'),
    overflow: 'hidden',
    marginBottom: hp('2%'),
    marginTop: hp('2%'),
    width: wp('85%'),  // Changed from hp to wp to ensure consistent width
    alignSelf: 'center', // Center the map container horizontally
},
toggleContainer: {
  alignSelf: 'center',
  marginVertical: hp('2%'),
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
switchButton: {
  backgroundColor: '#007BFF',
  paddingVertical: hp('2%'),
  paddingHorizontal: wp('5%'),
  borderRadius: wp('2%'),
  alignItems: 'center',
  marginVertical: hp('2%'),
  alignSelf: 'center', // Center the button horizontally
},
switchButtonText: {
  color: '#FFFFFF',
  fontSize: wp('4%'),
  fontWeight: 'bold',
},

  map: {
    ...StyleSheet.absoluteFillObject,
  },
  customAlertContainer: {
    width: wp('80%'),
    padding: wp('5%'),
    backgroundColor: 'white',
    borderRadius: wp('2%'),
    alignItems: 'center',
  },
  customAlertTitle: {
    fontSize: wp('5%'),
    fontWeight: 'bold',
    marginBottom: wp('2%'),
    color: '#000',

  },
  customAlertMessage: {
    fontSize: wp('4%'),
    marginBottom: wp('5%'),
    color: '#000',
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
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    width: '90%',
    alignSelf: 'center',
  },
  iconButton: {
    backgroundColor: 'blue',
    alignItems: 'center',
    paddingVertical: hp('2%'),
    width: wp('25%'),
    borderRadius: wp('3%'),
    marginHorizontal: wp('1%'), // Add margin to space out the buttons
  },
  iconButtonText: {
    color: '#fff',
    fontSize: wp('3%'),
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: 'green',
    alignItems: 'center',
    paddingVertical: hp('2%'),
    width: wp('30%'),
    borderRadius: wp('3%'),
    marginHorizontal: wp('1%'),
    alignSelf: 'center',

  },
  saveButtonText: {
    color: '#fff',
    fontSize: wp('3%'),
    fontWeight: 'bold',
  },
  savedPlaceItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // gap: wp("20%"),
    
  },
  deleteButton: {
    backgroundColor: '#ff4d4d',
    padding: 5,
    borderRadius: 5,

  },
  Place:{
    color: '#000',
  },
  deleteButtonText: {
    color: '#fff',
  },
  deleteOptionsButton: {
    backgroundColor: 'red',
    alignItems: 'center',
    paddingVertical: hp('2%'),
    width: wp('30%'),
    borderRadius: wp('3%'),
    marginHorizontal: wp('1%'),
  },
  deleteOptionsButtonText: {
    color: '#fff',
    fontSize: wp('3%'),
    fontWeight: 'bold',
  },
  icon: {
    width: wp('6%'),
    height: hp('4%'),
    resizeMode: 'contain',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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

      
  radioButtonContainer: {
    marginTop: wp('4%'),
    marginBottom: wp('4%'),

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  status: {
marginStart: wp('4%'),
    alignItems: 'flex-start',
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
  selectedButton: {
    borderColor: 'blue', // or any color you prefer
    borderWidth: 2,
  },
  selectedButtonText: {
    color: 'blue', // or any color you prefer
  },
  iconOption: {
    width: wp('10%'),
    height: hp('5%'),
    margin: 10,
    resizeMode: 'contain',
  },
  markerIcon: {
    width: wp('5%'),
    height: hp('5%'),
    resizeMode: 'contain',
  },
  callout: {
    width: hp('15%'),
  },
  calloutText: {
    textAlign: 'center',
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
    marginBottom: hp('3%'),
    width: wp('80%'), // Ensure consistent width
    height: hp('6%'), // Ensure consistent height
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
  dropdownList: {
    width: '100%',
    position: 'absolute',
    top: '100%',
    zIndex: 1000,
    backgroundColor: '#fff',
    borderRadius: wp('2%'),
    elevation: 5,
    maxHeight: hp('20%'), // Ensure a fixed max height
    borderColor: '#E0E0E0',
    borderWidth: 1,
    overflow: 'hidden', // Add this to ensure the overflow is hidden
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
  locationCountContainer: {
    position: 'absolute',
    top: '50%',  // Center vertically
    left: '50%', // Center horizontally
    transform: [{ translateX: -50 }, { translateY: -50 }],  // Offset to perfectly center
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    width: 60,  // Circle's width
    height: 60,  // Circle's height (equal to width)
    borderRadius: 30,  // Half of the width/height to make it a circle
    justifyContent: 'center', // Center text vertically
    alignItems: 'center', // Center text horizontally
    zIndex: 10,  // Ensure it stays on top
},
locationCountText: {
    color: '#fff',
    fontSize: 14,  // Slightly reduced font for better fit
    fontWeight: 'bold',
    textAlign: 'center',
},
 contentContainer: {
    justifyContent: 'center', // Center everything vertically
    alignItems: 'center', // Center text and buttons horizontally
    width: '100%', // Take full width for alignment
  },
  title: {
    fontSize: wp('6%'),
    fontWeight: 'bold',
    marginBottom: hp('3%'), // Space between title and buttons
    color: '#333',
    textAlign: 'center', // Ensure text is centered
  },
  button1: {
    width: wp('85%'),
    padding: hp('2%'),
    borderRadius: wp('3%'),
    backgroundColor: '#12587B',
    alignItems: 'center',
    marginBottom: hp('2%'), // Space between buttons
  },
  buttonText1: {
    color: '#ffffff',
    fontSize: wp('4.5%'),
  },
  selectedDayButton: {
    padding: 10,
    backgroundColor: 'green',
    marginVertical: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
  dayButton: {
    padding: 10,
    backgroundColor: 'gray',
    marginVertical: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
  dayButtonText: {
    color: 'white',
    fontSize: 16,
  },
  selectDaysButton: {
    backgroundColor: '#007BFF',
    paddingVertical: hp('2%'),
    width: wp('30%'),
    borderRadius: wp('3%'),
    alignItems: 'center',
    marginHorizontal: wp('1%'),
  },
  selectDaysButtonText: {
    color: '#fff',
    fontSize: wp('3%'),
    fontWeight: 'bold',
  },
  selectedDaysText: {
    color: '#000',
    fontSize: wp('4%'),
    textAlign: 'left',
    
  },
  placeholderTextColor: {
    color: '#AAAAAA', // Matches the placeholderTextColor of TextInput
  },
  dateText: {
    fontSize: 10,
    color: '#666',
    marginTop: 5,
  },
  
});


export default ManageYourArea;
