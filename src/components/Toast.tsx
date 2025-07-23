import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

export default class Toast extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      message: '',
      fadeAnim: new Animated.Value(0),
    };
  }

  show = (message = '', duration = 2000) => {
    this.setState({ visible: true, message }, () => {
      Animated.timing(this.state.fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setTimeout(this.hide, duration);
      });
    });
  };

  hide = () => {
    Animated.timing(this.state.fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      this.setState({ visible: false, message: '' });
    });
  };

  render() {
    if (!this.state.visible) return null;

    return (
      <Animated.View style={[styles.toastContainer, { opacity: this.state.fadeAnim }]}>
        <Text style={styles.toastText}>{this.state.message}</Text>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    backgroundColor: '#333',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
    zIndex: 9999,
  },
  toastText: {
    color: '#fff',
    fontSize: 14,
  },
});
