import React, { Component } from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { apiPost } from '../../api/Api';

export default class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mobileNumber: '',
      loading: false,
    };
  }

  handleSendOTP = async () => {
    const { mobileNumber } = this.state;

    if (mobileNumber.length !== 10) {
      this.props.toastRef.current.show('Please enter a valid 10-digit mobile number', 2000);
      return;
    }

    this.setState({ loading: true });

    try {
      const json = await apiPost('clientAuth/login', { phone: mobileNumber });
      console.log('API Response:', json);

      if (json.success) {
        this.props.toastRef.current.show('OTP sent successfully!', 2000);
        this.props.navigation.navigate('OTP', { mobile: mobileNumber });
      } else {
        this.props.toastRef.current.show(json.message || 'Something went wrong!', 2000);
      }
    } catch (error) {
      console.error(error);
      this.props.toastRef.current.show('Network error!', 2000);
    } finally {
      this.setState({ loading: false });
    }
  };

  handleNavigate = () => {
    this.props.navigation.navigate('Home');
  };

  render() {
    const { loading } = this.state;

    return (
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: '#F9F9F9' }}
        behavior={Platform.OS === 'ios' ? 'padding' : null}
      >
        <View style={styles.container}>
          {/* Back button */}
          <TouchableOpacity style={styles.backBtn} onPress={this.handleNavigate}>
            <Text style={styles.backText}>{'< Back to dashboard'}</Text>
          </TouchableOpacity>

          <View style={styles.centerContent}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>
              Enter your mobile number to receive OTP
            </Text>

            <View style={styles.formSection}>
              <Text style={styles.label}>
                Mobile Number <Text style={{ color: 'red' }}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your mobile number"
                keyboardType="phone-pad"
                maxLength={10}
                value={this.state.mobileNumber}
                onChangeText={(text) => this.setState({ mobileNumber: text })}
              />

              <TouchableOpacity
                style={styles.button}
                onPress={this.handleSendOTP}
                activeOpacity={0.8}
                disabled={loading}
              >
                <Text style={styles.buttonText}>Send OTP</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* ✅ Full-Screen Loader */}
          {loading && (
            <View style={styles.loaderOverlay}>
              <ActivityIndicator size="large" color="#7B5CFA" />
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  backBtn: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
  },
  backText: {
    color: '#7B5CFA',
    fontSize: 14,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
    marginBottom: 30,
  },
  formSection: {
    flex: 0,
  },
  label: {
    fontSize: 14,
    color: '#111',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 25,
  },
  button: {
    backgroundColor: '#7B5CFA',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loaderOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
