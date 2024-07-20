import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, FlatList, Modal, Button, Keyboard, TouchableWithoutFeedback  } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

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

const CategoryScreen = () => {
  const [categoryName, setCategoryName] = useState('');
  const [modalVisibleIcon, setModalVisibleIcon] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [categories, setCategories] = useState([
    { name: 'Parking', icon: require('../Images/add-spot.png') },
    { name: 'Handicap parking', icon: require('../Images/parking.png') },
    { name: 'Taxi stand', icon: require('../Images/taxi.png') },
    { name: 'EV zone', icon: require('../Images/ev.png') },
    { name: 'F&B zone', icon: require('../Images/restaurant.png') },
    { name: 'Parking', icon: require('../Images/parking-sign.png') },
  ]);

  const navigation = useNavigation();

  const handleAddCategory = () => {
    if (categoryName && selectedIcon !== null) {
      setCategories([...categories, { name: categoryName, icon: icons[selectedIcon] }]);
      setCategoryName('');
      setSelectedIcon(null); // Clear the selected icon after adding the category
    }
  };

  const handleDeleteCategory = (index) => {
    setCategories(categories.filter((_, i) => i !== index));
  };

  return (
    
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require('../Images/logo.png')} style={styles.logo} />
      </View>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButtonContainer}>
          <Image source={require('../Images/back.png')} style={styles.backButton} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Add and Get Categories</Text>
        </View>
      </View>
      <View style={styles.inputRow}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Category name</Text>
          <TextInput
            style={styles.input}
            value={categoryName}
            onChangeText={setCategoryName}
            placeholder="Category"
            placeholderTextColor="#AAAAAA"
          />
        </View>
        <View style={styles.uploadContainer}>
          <Text style={styles.label}>Upload image</Text>
          <TouchableOpacity style={styles.uploadButton} onPress={() => setModalVisibleIcon(true)}>
            <Text style={styles.uploadText}>Browse</Text>
            <Image source={require('../Images/upload.png')} style={styles.uploadIcon} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.addButton} onPress={handleAddCategory}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.divider} />
      <Text style={styles.sectionTitle}>All categories</Text>
      <FlatList
        data={categories}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.categoryRow}>
            <Text style={styles.categoryName}>{item.name}</Text>
            <Image source={item.icon} style={styles.categoryIcon} />
            <View style={styles.actions}>
              <TouchableOpacity>
                <Image source={require('../Images/edit.png')} style={styles.actionIcon} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteCategory(index)}>
                <Image source={require('../Images/delete.png')} style={styles.actionIcon} />
              </TouchableOpacity>
            </View>
          </View>
        )}
        contentContainerStyle={styles.listContent}
      />
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('4%'),
  },
  backIcon: {
    width: wp('5%'),
    height: hp('2%'),
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
  title: {
    fontSize: hp('3%'),
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: hp('4%'),
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp('2%'),
  },
  inputContainer: {
  },
  label: {
    fontSize: hp('1.5%'),
    color: '#333',
    marginBottom: hp('1%'),
  },
  input: {
    padding: wp('2%'),
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: wp('2%'),
    fontSize: wp('3%'),
    color: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  uploadContainer: {
    justifyContent: 'center',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: wp('3%'),
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: wp('2%'),
    justifyContent: 'center',
  },
  uploadIcon: {
    width: wp('5%'),
    height: wp('5%'),
    marginLeft: wp('2%'),
  },
  uploadText: {
    fontSize: wp('3%'),
    color: '#AAAAAA',
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp('1%'),
    marginBottom: hp('1%'),
  },
  addButton: {
    backgroundColor: '#12587B',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: hp('1.5%'),
    width: wp('40%'),
    borderRadius: wp('5%'),
  },
  addButtonText: {
    color: '#fff',
    fontSize: hp('2%'),
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: hp('2%'),
  },
  sectionTitle: {
    fontSize: hp('2.5%'),
    fontWeight: 'bold',
    marginBottom: hp('1%'),
    color: '#000',
  },
  listContent: {
    paddingBottom: hp('15%'), // Adjust as needed for bottom padding
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
    fontSize: wp('5%'),
    fontWeight: 'bold',
    marginBottom: 20,
  },
  iconOption: {
    width: wp('10%'),
    height: hp('5%'),
    margin: 10,
    resizeMode: 'contain',
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: hp('1%'),
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    color: '#000',
  },
  categoryName: {
    fontSize: hp('2%'),
    flex: 1,
    color: '#000',
  },
  categoryIcon: {
    width: wp('6%'),
    height: wp('6%'),
    resizeMode: 'contain',
    marginRight: wp('5%'),
  },
  actions: {
    flexDirection: 'row',
  },
  actionIcon: {
    width: wp('5%'),
    height: wp('5%'),
    resizeMode: 'contain',
    marginHorizontal: wp('2%'),
  },
});

export default CategoryScreen;
