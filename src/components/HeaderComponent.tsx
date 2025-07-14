import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { heightPercentageToDP, widthPercentageToDP } from "react-native-responsive-screen";
import { CommonActions } from '@react-navigation/native';

export default class HeaderComponent extends Component {
  confirmLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Yes", onPress: this.handleLogout }
      ],
      { cancelable: true }
    );
  };

  handleLogout = async () => {
    try {
      await AsyncStorage.clear();

      // ✅ Update parent state too
      this.props.setIsLoggedIn(false);

      this.props.rootNavigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        })
      );

    } catch (error) {
      console.log("Error clearing app data.", error);
    }
  };

  render() {
    const { title, showBack, onBackPress, showLogo, showLogout, navigation } = this.props;

    return (
      <View style={styles.headerFixed}>
        <View style={styles.leftContainer}>
          {showBack && (
            <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
              <Image
                source={require('../assets/icons/back.png')}
                style={{ aspectRatio: 1 / 1, height: heightPercentageToDP(3) }}
              />
            </TouchableOpacity>
          )}

          {showLogo && (
            <TouchableOpacity
              onPress={() => navigation.navigate('Home2')}
            >
             <Image source={require('../assets/appIcon/rpkk.png')} style={{  width: widthPercentageToDP('25%'),   height: '100%', resizeMode: 'contain'}}/>
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.titleText}>{title}</Text>

        <View style={styles.rightContainer}>
          {showLogout && (
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={this.confirmLogout}
            >
              {/* <Text style={styles.logoutButtonText}>Logout</Text> */}
              <Image source={require('../assets/icons/logout.png')} style={{aspectRatio:1/1,height:30,marginRight:widthPercentageToDP(-5)}}/>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  headerFixed: {
    width: "100%",
    height: 60,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 2,
    zIndex: 999,
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    marginRight: 10,
  },
  logoText: {
    fontSize: 20,
    flexDirection: "row",
  },
  logoTextBold: {
    fontWeight: "bold",
    color: "#000",
  },
  logoTextPurple: {
    fontWeight: "bold",
    color: "#7B5CFA",
  },
  titleText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  rightContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoutButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    // backgroundColor: "#FF4D4D",
    borderRadius: 20,
  },
  logoutButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
