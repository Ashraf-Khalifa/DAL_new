import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const ProfileScreen: React.FC = ({ navigation }) => {
  const handleProfileImageChange = () => {
    console.log('Change image clicked');
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require('../Images/logo.png')} style={styles.logo} />
      </View>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>
      <TouchableOpacity style={styles.profileContainer} onPress={handleProfileImageChange}>
        <Image source={require('../Images/profile.png')} style={styles.profileImage} />
        <Text style={styles.changeImageText}>Change image</Text>
      </TouchableOpacity>
      <View style={styles.divider} />
      <TouchableOpacity style={styles.settingItem} onPress={() => navigation.navigate('EditAccount')}>
        <View style={styles.settingTextContainer}>
          <Image source={require('../Images/edit.png')} style={styles.settingIcon} />
          <Text style={styles.settingText}>Edit account</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.settingItem} onPress={() => navigation.navigate('Documents')}>
        <View style={styles.settingTextContainer}>
          <Image source={require('../Images/documents.png')} style={styles.settingIcon} />
          <Text style={styles.settingText}>Documents</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.settingItem} onPress={() => navigation.navigate('Help')}>
        <View style={styles.settingTextContainer}>
          <Image source={require('../Images/help.png')} style={styles.settingIcon} />
          <Text style={styles.settingText}>Help</Text>
        </View>
      </TouchableOpacity>
      <View style={styles.socialIconsContainer}>
        <TouchableOpacity>
          <Image source={require('../Images/facebook.png')} style={styles.socialIcon} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image source={require('../Images/instagram.png')} style={styles.socialIcon} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image source={require('../Images/globalization.png')} style={styles.socialIcon} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image source={require('../Images/twitter.png')} style={styles.socialIcon} />
        </TouchableOpacity>
      </View>
    </View>
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
    width: wp('40%'),
    height: hp('25%'),
    resizeMode: 'cover',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'start',
    marginBottom: wp('5%'),
  },
  headerTitle: {
    fontSize: hp('2.5%'),
    fontWeight: 'bold',
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: hp('2%'),
  },
  profileImage: {
    width: wp('15%'),
    height: hp('8%'),
    borderRadius: hp('5%'),
    marginBottom: hp('1%'),
  },
  changeImageText: {
    color: '#007BFF',
    fontSize: hp('2%'),
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: hp('2%'),
    width: '100%',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('2%'),
    marginBottom: wp('3%'),
    borderRadius: 5,
    backgroundColor: '#f8f8f8',
  },
  settingTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    width: wp('6%'),
    height: hp('3%'),
    resizeMode: 'contain',
    marginRight: wp('2%'),
  },
  settingText: {
    fontSize: hp('2%'),
    color: '#333',
  },
  socialIconsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: hp('2%'),
    gap: hp('3%'),
  },
  socialIcon: {
    width: wp('10%'),
    height: hp('5%'),
    resizeMode: 'contain',
  },
});

export default ProfileScreen;
