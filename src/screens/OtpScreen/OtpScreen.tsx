import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import { apiPost } from '../../api/Api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class OTPScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      otp: '',
      resendTimer: 48,
      loading: false,
    };
    this.timer = null;
  }

  componentDidMount() {
    this.startResendTimer();
  }

  componentWillUnmount() {
    if (this.timer) clearInterval(this.timer);
  }

  startResendTimer = () => {
    if (this.timer) clearInterval(this.timer);

    this.setState({ resendTimer: 48 });

    this.timer = setInterval(() => {
      this.setState((prev) => {
        if (prev.resendTimer > 1) {
          return { resendTimer: prev.resendTimer - 1 };
        } else {
          clearInterval(this.timer);
          return { resendTimer: 0 };
        }
      });
    }, 1000);
  };

  handleVerifyOTP = async () => {
    const { otp } = this.state;
    const mobile = this.props.route?.params?.mobile || '';

    if (otp.length !== 4) {
      this.props.toastRef.current.show('Please enter a valid 4-digit OTP', 2000);
      return;
    }

    this.setState({ loading: true });

    try {
      const json = await apiPost('clientAuth/validate-otp', {
        phone: mobile,
        otp: otp,
      });

      console.log('OTP Verify Response:', json);

      if (json.success && json.jwtToken) {
        await AsyncStorage.setItem('liveCustomerToken', json.jwtToken);

        this.props.toastRef.current.show('OTP Verified! Redirecting...', 1500);

        this.props.onLoginSuccess();
      } else {
        this.props.toastRef.current.show(json.message || 'Invalid OTP!', 2000);
      }
    } catch (error) {
      console.error(error);
      this.props.toastRef.current.show('Network error!', 2000);
    } finally {
      this.setState({ loading: false });
    }
  };

  handleBack = () => {
    this.props.navigation.goBack();
  };

  handleChangeNumber = () => {
    this.props.navigation.navigate('Login');
  };

  render() {
    const { resendTimer, otp, loading } = this.state;
    const mobile = this.props.route?.params?.mobile || 'XXXXXXXXXX';

    return (
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: '#F9F9F9' }}
        behavior={Platform.OS === 'ios' ? 'padding' : null}
      >
        <View style={styles.container}>
          {/* Back Button */}
          <TouchableOpacity style={styles.backBtn} onPress={this.handleBack}>
            <Text style={styles.backText}>{'< Back to dashboard'}</Text>
          </TouchableOpacity>

          {/* Center Content */}
          <View style={styles.centerContent}>
            <Text style={styles.title}>OTP Verification</Text>
            <Text style={styles.subtitle}>
              Enter the OTP sent to {mobile}
            </Text>

            <Text style={styles.label}>
              Enter OTP <Text style={{ color: 'red' }}>*</Text>
            </Text>

            <OTPInputView
              style={{ width: '80%', height: 60, alignSelf: 'center' }}
              pinCount={4}
              code={otp}
              autoFocusOnLoad
              codeInputFieldStyle={styles.underlineStyleBase}
              codeInputHighlightStyle={styles.underlineStyleHighLighted}
              onCodeChanged={(code) => {
                this.setState({ otp: code });
              }}
              onCodeFilled={(code) => {
                this.setState({ otp: code });
              }}
            />

            {resendTimer > 0 ? (
              <Text style={styles.resendText}>
                Resend OTP ({resendTimer}s)
              </Text>
            ) : (
              <TouchableOpacity onPress={this.startResendTimer}>
                <Text style={styles.resendButton}>Resend OTP</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity onPress={this.handleChangeNumber}>
              <Text style={styles.changeNumberText}>Change Mobile Number</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={this.handleVerifyOTP}
              disabled={loading}
            >
              <Text style={styles.buttonText}>Verify OTP</Text>
            </TouchableOpacity>
          </View>

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
    marginTop: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111',
    marginBottom: 5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
    marginBottom: 30,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    color: '#111',
    marginBottom: 8,
    textAlign: 'center',
  },
  underlineStyleBase: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    fontSize: 20,
    color: '#111',
    textAlign: 'center',
  },
  underlineStyleHighLighted: {
    borderColor: '#7B5CFA',
  },
  resendText: {
    marginTop: 20,
    color: '#555',
    fontSize: 14,
    textAlign: 'center',
  },
  resendButton: {
    marginTop: 20,
    color: '#7B5CFA',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
  changeNumberText: {
    marginTop: 10,
    color: '#7B5CFA',
    textAlign: 'center',
    fontSize: 14,
  },
  button: {
    backgroundColor: '#7B5CFA',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 30,
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
