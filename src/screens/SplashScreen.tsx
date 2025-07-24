import React, { Component } from "react";
import { View, StyleSheet, Image, Text, StatusBar } from "react-native";

export default class SplashScreen extends Component {
  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#7B5CFA" />

        <View style={styles.logoWrapper}>
          <Image
            source={require("../assets/appIcon/rpkk.png")}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.appName}>RepayKaro</Text>
        <Text style={styles.tagline}>Easy • Fast • Secure</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7B5CFA",
    justifyContent: "center",
    alignItems: "center",
  },
  logoWrapper: {
    backgroundColor: "#fff",
    borderRadius: 100,
    padding: 30,
    marginBottom: 20,
    elevation: 10, // ✅ Nice subtle shadow for Android
    shadowColor: "#000", // ✅ Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  logoImage: {
    width: 120,
    height: 120,
  },
  appName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 14,
    color: "#eee",
    letterSpacing: 1,
  },
});
