import React, {useEffect} from 'react';
import {
  Dimensions,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import Navigation from './Screens/Navigation';
import { UserProvider } from './context/Context';

const windowWidth = Dimensions.get('window').width;
const App = () => {
  useEffect(() => {
    // StatusBar.setBarStyle('dark-content');
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor('rgba(0,0,0,0)');
      StatusBar.setTranslucent(true);
    }
    SplashScreen.hide();
  }, []);

  return (
    <UserProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar />
        <Navigation />
      </SafeAreaView>
    </UserProvider>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: '#ECF0F1',
  },
  container1: {
    width: windowWidth,
    height: 400,
  },
});

export default App;
