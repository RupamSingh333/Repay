import React, { Component } from 'react';
import { View, StatusBar, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import Dashboard from './src/screens/DashBoardScreen/DashBoardScreen';
import SplashScreen from './src/screens/SplashScreen';
import LoginScreen from './src/screens/LoginScreen/LoginScreen';
import OTPScreen from './src/screens/OtpScreen/OtpScreen';
import HomeScreen from './src/screens/HomeScreen/HomeScreen';
import Toast from './src/components/Toast';
import RewardScreen from './src/screens/RewardsScreen/RewardScreen';
import PaymentStatusScreen from './src/screens/PaymentStatusScreen/PaymentStatusScreen';
import HomeScreen2 from './src/screens/HomeScreen2/HomeScreen2';
import UploadPaymentScreenshot from './src/screens/UploadScreenShot/UplaodScreenshot';

const Stack = createNativeStackNavigator();
const Bottom = createBottomTabNavigator();

function BottomTab({ rootNavigation, setIsLoggedIn, toastRef }) {
  return (
    <Bottom.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconSource;

          if (route.name === 'Dashboard') {
            iconSource = require('./src/assets/icons/menu.png');
          } else if (route.name === 'Reward') {
            iconSource = require('./src/assets/icons/coin.png');
          } else if (route.name === 'Upload Screenshot') {
            iconSource = require('./src/assets/icons/down-arrow.png');
          } else if (route.name === 'Payment Status') {
            iconSource = require('./src/assets/icons/coin.png');
          }

          return (
            <Image
              source={iconSource}
              style={{ width: 24, height: 24, tintColor: color }}
              resizeMode="contain"
            />
          );
        },
        tabBarActiveTintColor: '#7B5CFA',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Bottom.Screen name="Dashboard">
        {(props) => (
          <Dashboard
            {...props}
            rootNavigation={rootNavigation}
            setIsLoggedIn={setIsLoggedIn}
          />
        )}
      </Bottom.Screen>

      <Bottom.Screen name="Reward" component={RewardScreen} />

      <Bottom.Screen name="Upload Screenshot">
        {(props) => (
          <UploadPaymentScreenshot {...props} toastRef={toastRef} />
        )}
      </Bottom.Screen>

      <Bottom.Screen name="Payment Status" component={PaymentStatusScreen} />
    </Bottom.Navigator>
  );
}

export default class Routes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: null,
      isFirstLaunch: null,
      splashDone: false,
    };
    this.toastRef = React.createRef();
    this.navigatorRef = React.createRef();
  }

  async componentDidMount() {
    const token = await AsyncStorage.getItem('liveCustomerToken');
    const isFirstLaunch = await AsyncStorage.getItem('isFirstLaunch');

    if (isFirstLaunch === null) {
      await AsyncStorage.setItem('isFirstLaunch', 'false');
      this.setState({ isFirstLaunch: true, isLoggedIn: !!token });
      setTimeout(() => {
        this.setState({ splashDone: true });
      }, 2000);
    } else {
      this.setState({ isFirstLaunch: false, isLoggedIn: !!token, splashDone: true });
    }
  }

  setIsLoggedIn = (status) => {
    this.setState({ isLoggedIn: status });
  };

  render() {
    const { isLoggedIn, isFirstLaunch, splashDone } = this.state;

    if (isLoggedIn === null || isFirstLaunch === null) return null;

    return (
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1 }} edges={['top']}>
          <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

          <NavigationContainer ref={(ref) => (this.navigatorRef = ref)}>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              {isFirstLaunch && !splashDone ? (
                <Stack.Screen name="Splash" component={SplashScreen} />
              ) : isLoggedIn ? (
                <>
                  <Stack.Screen name="BottomTab">
                    {(props) => (
                      <BottomTab
                        {...props}
                        rootNavigation={this.navigatorRef}
                        setIsLoggedIn={this.setIsLoggedIn}
                        toastRef={this.toastRef}
                      />
                    )}
                  </Stack.Screen>
                  <Stack.Screen name="Home2" component={HomeScreen2} />
                </>
              ) : (
                <>
                  <Stack.Screen name="Home">
                    {(props) => (
                      <HomeScreen {...props} toastRef={this.toastRef} />
                    )}
                  </Stack.Screen>
                  <Stack.Screen name="Login">
                    {(props) => (
                      <LoginScreen {...props} toastRef={this.toastRef} />
                    )}
                  </Stack.Screen>
                  <Stack.Screen name="OTP">
                    {(props) => (
                      <OTPScreen
                        {...props}
                        toastRef={this.toastRef}
                        onLoginSuccess={() => this.setIsLoggedIn(true)}
                      />
                    )}
                  </Stack.Screen>
                </>
              )}
            </Stack.Navigator>
          </NavigationContainer>

          {/* ✅ Toast should be here outside NavigationContainer */}
          <Toast ref={this.toastRef} />
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }
}
