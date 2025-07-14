import React, { Component } from "react";
import { View, Text, StyleSheet, Animated, Easing, Image } from "react-native";

export default class SplashScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scaleValue: new Animated.Value(1),
    };
  }

  componentDidMount() {
    this.startAnimation();

    // 5 second baad HomeScreen pr navigate karega
    setTimeout(() => {
      this.props.navigation.navigate("BottomTab");
    }, 1000);
  }

  startAnimation() {
    Animated.loop(
      Animated.sequence([
        Animated.timing(this.state.scaleValue, {
          toValue: 1.2,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(this.state.scaleValue, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }

  render() {
    return (
      <View style={styles.container}>
        <Animated.Image
        source={require('../assets/appIcon/rpkk.png')}
        style={[
          styles.logoImage,
          { transform: [{ scale: this.state.scaleValue }] },
        ]}
        resizeMode="contain"
      />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff", // Optional: Splash bg color
    justifyContent: "center",
    alignItems: "center",
  },
  logoText: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#fff",
  },
   logoImage: {
    width: 150,   // set your desired width
    height: 150,  // set your desired height
  },
});
