import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Modal, Image } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const SettingsScreen: React.FC = ({ navigation }) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [isModalVisible, setIsModalVisible] = useState(false);

  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "OK",
          onPress: () => {
            // Perform logout actions here, for example:
            // clearAsyncStorage, reset navigation state, etc.
            navigation.navigate('Login'); // Ensure 'Login' matches the screen name used in the Stack.Navigator
          }
        }
      ]
    );
  };
  const openLanguageModal = () => {
    setIsModalVisible(true);
  };

  const closeLanguageModal = () => {
    setIsModalVisible(false);
  };

  const changeLanguage = (language) => {
    setSelectedLanguage(language);
    closeLanguageModal();
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require('../Images/logo1.png')} style={styles.logo} />
      </View>
      <View style={styles.header}>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Settings</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.settingItem} onPress={openLanguageModal}>
        <View style={styles.settingTextContainer}>
          <Image source={require('../Images/language.png')} style={styles.settingIcon} />
          <Text style={styles.settingText}>Language</Text>
        </View>
        <Text style={styles.settingLabel}>{selectedLanguage}</Text>
      </TouchableOpacity>
      <View style={styles.divider} />
      <TouchableOpacity style={styles.settingItem} onPress={() => navigation.navigate('About')}>
        <View style={styles.settingTextContainer}>
          <Image source={require('../Images/info.png')} style={styles.settingIcon} />
          <Text style={styles.settingText}>About</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.settingItem} onPress={() => navigation.navigate('TermsAndConditions')}>
        <View style={styles.settingTextContainer}>
          <Image source={require('../Images/terms-and-conditions.png')} style={styles.settingIcon} />
          <Text style={styles.settingText}>Terms and condition</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.settingItem} onPress={() => navigation.navigate('PrivacyPolicy')}>
        <View style={styles.settingTextContainer}>
          <Image source={require('../Images/insurance.png')} style={styles.settingIcon} />
          <Text style={styles.settingText}>Privacy policy</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.settingItem} onPress={handleLogout}>
        <View style={styles.settingTextContainer}>
          <Image source={require('../Images/exit.png')} style={styles.settingIcon} />
          <Text style={styles.settingText}>Logout</Text>
        </View>
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeLanguageModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Language</Text>
            <TouchableOpacity onPress={() => changeLanguage('English')} style={styles.modalOption}>
              <Text style={styles.modalOptionText}>English</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => changeLanguage('Arabic')} style={styles.modalOption}>
              <Text style={styles.modalOptionText}>Arabic</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={closeLanguageModal} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: wp('5%'),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: wp('10%'),
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: hp('2.5%'),
    fontWeight: 'bold',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    width: wp('25%'),
    height: hp('25%'),
    resizeMode: 'contain',
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
  settingLabel: {
    fontSize: hp('2%'),
    color: '#666',
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: hp('2%'),
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: wp('80%'),
    padding: hp('3%'),
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: hp('2.5%'),
    fontWeight: 'bold',
    marginBottom: hp('3%'),
    color: '#000',
  },
  modalOption: {
    paddingVertical: hp('2%'),
    width: '100%',
    alignItems: 'center',
    marginVertical: hp('1%'),
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  modalOptionText: {
    fontSize: hp('2%'),
    color: '#333',
  },
  closeButton: {
    marginTop: hp('3%'),
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('5%'),
    backgroundColor: '#20135B',
    borderRadius: 5,
    width: '50%',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: hp('2%'),
  },
});

export default SettingsScreen;
