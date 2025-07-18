import React, { Component } from "react";
import { View, StyleSheet, Image, Text } from "react-native";

export default class SplashScreen extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Image
          source={require("../assets/appIcon/rpkk.png")}
          style={styles.logoImage}
          resizeMode="contain"
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff", // Or your brand color
    justifyContent: "center",
    alignItems: "center",
  },
  logoImage: {
    width: 180,
    height: 180,
    marginBottom: 20,
  },
  appName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#7B5CFA", // Match your theme
  },
});
