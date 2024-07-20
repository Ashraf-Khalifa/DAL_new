import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const LocationOffScreen = ({ navigate }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Location services are off. Please enable location services to continue.</Text>
      <Button title="Retry" onPress={() => navigate('Retry')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default LocationOffScreen;
