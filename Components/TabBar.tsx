import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import HomeStackNavigator from './HomeStackNavigator';
import ContactUs from '../Pages/ContactUs';
import SearchScreen from '../Pages/SearchScreen';
import AddViolationScreen from '../Pages/AddViolationScreen';
import AdminStackNavigator from './AdminStackNavigator';
import ProfileStackNavigator from './ProfileStackNavigator'; 
import SettingsStackNavigator from './SettingsStackNavigator'; 
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const Tab = createBottomTabNavigator();

const icons = { 
  Settings: require('../Images/settings.png'),
  Home: require('../Images/home.png'),
  Profile: require('../Images/user.png'),
  SearchScreen: require('../Images/search-date.png'),
  ContactUs: require('../Images/customer-service.png'),
  AddViolation: require('../Images/add.png'),
  Admin: require('../Images/admin.png'),
};

const TabBar = ({ state, descriptors, navigation }) => {
  return (
    <View style={styles.tabBarContainer}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={index}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            style={styles.tabItem}
          >
            <Image
              source={icons[route.name]}
              style={isFocused ? styles.iconFocused : styles.icon}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const MyTabs = ({ route }) => {
  const { user } = route.params;

  return (
    <Tab.Navigator
      initialRouteName="Home"
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'transparent',
          borderTopWidth: 0,        
          elevation: 0,
          height: hp('8%'),
        },
      }}
    >
      <Tab.Screen name="Settings" component={SettingsStackNavigator} />
      {/* <Tab.Screen name="SearchScreen" component={SearchScreen} /> */}
      <Tab.Screen name="ContactUs" component={ContactUs} />
      <Tab.Screen name="Home" component={HomeStackNavigator} />
      <Tab.Screen name="AddViolation" component={AddViolationScreen} />
     
      {/* {(user.role === 'admin' || user.role === 'superadmin') && (
        
      )} */}
      {(user.role === 'superadmin') && (
        <Tab.Screen name="Admin" component={AdminStackNavigator} />
      )}
      <Tab.Screen name="Profile" component={ProfileStackNavigator} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row',
    height: hp('8%'),
    backgroundColor: '#12587B',
    borderTopLeftRadius: wp('8%'),
    borderTopRightRadius: wp('8%'),
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  icon: {
    width: wp('6%'),
    height: hp('4%'),
    resizeMode: 'contain',
    tintColor: '#FFFFFF',
    opacity: 0.6,
  },
  iconFocused: {
    width: wp('8%'),
    height: hp('6%'),
    resizeMode: 'contain',
    tintColor: '#FFFFFF',
    opacity: 1,
  },
});

export default MyTabs;
