import React, { Component } from "react";
import { View, Text, StyleSheet, Animated, Easing, Image, StatusBar } from "react-native";

export default class SplashScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scaleValue: new Animated.Value(1),
    };
  }

  componentDidMount() {
    this.startAnimation();

    // 2 second baad navigate karega
    setTimeout(() => {
      this.props.navigation.navigate("BottomTab");
    }, 2000);
  }

  startAnimation() {
    Animated.loop(
      Animated.sequence([
        Animated.timing(this.state.scaleValue, {
          toValue: 1.15,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(this.state.scaleValue, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#7B5CFA" />
        <View style={styles.logoWrapper}>
          <Animated.Image
            source={require("../assets/appIcon/rpkk.png")}
            style={[
              styles.logoImage,
              { transform: [{ scale: this.state.scaleValue }] },
            ]}
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
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    marginBottom: 20,
  },
  logoImage: {
    width: 120,
    height: 120,
  },
  appName: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    letterSpacing: 1,
    marginBottom: 5,
  },
  tagline: {
    fontSize: 14,
    color: "#eee",
    letterSpacing: 1,
  },
});
