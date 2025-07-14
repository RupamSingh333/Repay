import React, { Component } from "react";
import { View, StyleSheet, Animated, Easing, Image } from "react-native";

export default class SplashScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scaleValue: new Animated.Value(1),
    };
  }

  componentDidMount() {
    this.startAnimation();
    // 👉 Navigation हट गया है — अब ये सिर्फ animation चलाएगा
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
          source={require("../assets/appIcon/rpkk.png")}
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
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  logoImage: {
    width: 150,
    height: 150,
  },
});
