import React, { Component } from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { apiPost } from '../../api/Api';

export default class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mobileNumber: '',
    };
  }

handleSendOTP = async () => {
  const { mobileNumber } = this.state;

  if (mobileNumber.length !== 10) {
    this.props.toastRef.show('Please enter a valid 10-digit mobile number', 2000);
    return;
  }

  try {
    const json = await apiPost('clientAuth/login', { phone: mobileNumber });
    console.log('API Response:', json);

    if (json.success) {
      this.props.toastRef.show('OTP sent successfully!', 2000);
      this.props.navigation.navigate('OTP', { mobile: mobileNumber });
    } else {
      this.props.toastRef.show(json.message || 'Something went wrong!', 2000);
    }
  } catch (error) {
    console.error(error);
    this.props.toastRef.show('Network error!', 2000);
  }
};



  handleNavigate = () => {
    this.props.navigation.navigate('Home');
  };

  render() {
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
              >
                <Text style={styles.buttonText}>Send OTP</Text>
              </TouchableOpacity>
            </View>
          </View>
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
});
