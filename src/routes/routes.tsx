import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Dashboard from '../screens/DashBoardScreen/DashBoardScreen';

import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen/LoginScreen';
import OTPScreen from '../screens/OtpScreen/OtpScreen';
import HomeScreen from '../screens/HomeScreen/HomeScreen';
import Toast from '../components/Toast';
import HeaderComponent from '../components/HeaderComponent';

const Stack = createNativeStackNavigator();
const SCREEN_WIDTH = Dimensions.get('window').width;

export default class Routes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: null,
      isDrawerOpen: false,
      drawerAnim: new Animated.Value(-SCREEN_WIDTH * 0.75),
      activeScreen: 'Dashboard',
    };
    this.toastRef = React.createRef();
  }

  async componentDidMount() {
    const token = await AsyncStorage.getItem('liveCustomerToken');
    this.setState({ isLoggedIn: !!token });
  }

  toggleDrawer = () => {
    const { isDrawerOpen, drawerAnim } = this.state;
    Animated.timing(drawerAnim, {
      toValue: isDrawerOpen ? -SCREEN_WIDTH * 0.75 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      this.setState({ isDrawerOpen: !isDrawerOpen });
    });
  };

  navigateTo = (screen) => {
    this.setState({ activeScreen: screen });
    this.toggleDrawer();
    this.navigatorRef?.navigate(screen);
  };

  renderDrawer() {
    const { drawerAnim, activeScreen } = this.state;
    return (
      <Animated.View
        style={[
          styles.drawerContainer,
          { transform: [{ translateX: drawerAnim }] },
        ]}
      >
        {/* Logo */}
        <Text style={styles.drawerLogo}>RepayKaro</Text>

        {/* Dashboard */}
        <TouchableOpacity
          style={[
            styles.drawerItem,
            activeScreen === 'Dashboard' && styles.drawerActiveItem,
          ]}
          onPress={() => this.navigateTo('Dashboard')}
        >
          <Text style={styles.drawerItemIcon}>🏠</Text>
          <Text
            style={[
              styles.drawerItemText,
              activeScreen === 'Dashboard' && styles.drawerItemTextActive,
            ]}
          >
            Dashboard
          </Text>
        </TouchableOpacity>

        {/* Rewards */}
        <TouchableOpacity
          style={[
            styles.drawerItem,
            activeScreen === 'Rewards' && styles.drawerActiveItem,
          ]}
          onPress={() => this.navigateTo('Rewards')}
        >
          <Text style={styles.drawerItemIcon}>💲</Text>
          <Text
            style={[
              styles.drawerItemText,
              activeScreen === 'Rewards' && styles.drawerItemTextActive,
            ]}
          >
            Rewards
          </Text>
        </TouchableOpacity>

        {/* Upload Screenshot */}
        <TouchableOpacity
          style={[
            styles.drawerItem,
            activeScreen === 'UploadScreenshot' && styles.drawerActiveItem,
          ]}
          onPress={() => this.navigateTo('UploadScreenshot')}
        >
          <Text style={styles.drawerItemIcon}>⬆️</Text>
          <Text
            style={[
              styles.drawerItemText,
              activeScreen === 'UploadScreenshot' && styles.drawerItemTextActive,
            ]}
          >
            Upload Screenshot
          </Text>
        </TouchableOpacity>

        {/* Payment Status */}
        <TouchableOpacity
          style={[
            styles.drawerItem,
            activeScreen === 'PaymentStatus' && styles.drawerActiveItem,
          ]}
          onPress={() => this.navigateTo('PaymentStatus')}
        >
          <Text style={styles.drawerItemIcon}>💳</Text>
          <Text
            style={[
              styles.drawerItemText,
              activeScreen === 'PaymentStatus' && styles.drawerItemTextActive,
            ]}
          >
            Payment Status
          </Text>
        </TouchableOpacity>

        {/* Logout */}
        <TouchableOpacity
          style={styles.drawerItem}
          onPress={async () => {
            await AsyncStorage.removeItem('liveCustomerToken');
            this.setState({ isLoggedIn: false });
            this.toggleDrawer();
          }}
        >
          <Text style={styles.drawerItemIcon}>🔓</Text>
          <Text style={styles.drawerItemText}>Logout</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  renderScreenWithHeader = (ScreenComponent) => (props) => (
    <View style={{ flex: 1 }}>
      <HeaderComponent toggleDrawer={this.toggleDrawer} />
      <ScreenComponent {...props} />
    </View>
  );

  render() {
    const { isLoggedIn } = this.state;

    if (isLoggedIn === null) return null;

    return (
      <View style={{ flex: 1 }}>
        <NavigationContainer
          ref={(ref) => {
            this.navigatorRef = ref;
          }}
        >
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            {isLoggedIn ? (
              <>
                <Stack.Screen
                  name="Dashboard"
                  children={this.renderScreenWithHeader(Dashboard)}
                />
                <Stack.Screen
                  name="Rewards"
                  children={this.renderScreenWithHeader(Dashboard)}
                />
                <Stack.Screen
                  name="UploadScreenshot"
                  children={this.renderScreenWithHeader(Dashboard)}
                />
                <Stack.Screen
                  name="PaymentStatus"
                  children={this.renderScreenWithHeader(Dashboard)}
                />
              </>
            ) : (
              <>
                <Stack.Screen name="Splash" component={SplashScreen} />
                <Stack.Screen
                  name="Login"
                  children={(props) => (
                    <LoginScreen {...props} toastRef={this.toastRef} />
                  )}
                />
                <Stack.Screen
                  name="OTP"
                  children={(props) => (
                    <OTPScreen {...props} toastRef={this.toastRef} />
                  )}
                />
                <Stack.Screen
                  name="Home"
                  children={(props) => (
                    <HomeScreen {...props} toastRef={this.toastRef} />
                  )}
                />
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>

        {isLoggedIn && this.renderDrawer()}

        <Toast ref={(ref) => (this.toastRef = ref)} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  drawerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: SCREEN_WIDTH * 0.75,
    backgroundColor: '#fff',
    elevation: 10,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  drawerLogo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#7B5CFA',
    marginBottom: 30,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 15,
  },
  drawerActiveItem: {
    backgroundColor: '#EAD9FF',
    elevation: 2,
  },
  drawerItemIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  drawerItemText: {
    fontSize: 16,
    color: '#333',
  },
  drawerItemTextActive: {
    fontSize: 16,
    color: '#7B5CFA',
    fontWeight: 'bold',
  },
});
