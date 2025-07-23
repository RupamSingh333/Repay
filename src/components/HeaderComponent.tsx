import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { heightPercentageToDP, widthPercentageToDP } from "react-native-responsive-screen";
import { CommonActions } from '@react-navigation/native';

export default class HeaderComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showLogoutModal: false,
      loading: false,
    };
  }

  openLogoutModal = () => {
    this.setState({ showLogoutModal: true });
  };

  closeLogoutModal = () => {
    this.setState({ showLogoutModal: false });
  };

  handleLogout = async () => {
    this.setState({ loading: true, showLogoutModal: false });

    try {
      await AsyncStorage.clear();
      this.props.setIsLoggedIn(false);

      this.props.rootNavigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        })
      );

      // ✅ Toast message
      if (this.props.toastRef && this.props.toastRef.current) {
        this.props.toastRef.current.show("Logged out successfully", 2000);
      }

    } catch (error) {
      console.log("Error clearing app data.", error);
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    const { title, showBack, onBackPress, showLogo, showLogout, navigation } = this.props;
    const { showLogoutModal, loading } = this.state;

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
              <Image
                source={require('../assets/appIcon/rpkk.png')}
                style={{
                  width: widthPercentageToDP('25%'),
                  height: '100%',
                  resizeMode: 'contain',
                }}
              />
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.titleText}>{title}</Text>

        <View style={styles.rightContainer}>
          {showLogout && (
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={this.openLogoutModal}
            >
              <Image
                source={require('../assets/icons/logout.png')}
                style={{ aspectRatio: 1 / 1, height: 30, marginRight: widthPercentageToDP(-5) }}
              />
            </TouchableOpacity>
          )}
        </View>

        {/* ✅ Logout Confirm Modal */}
        <Modal
          transparent
          animationType="fade"
          visible={showLogoutModal}
          onRequestClose={this.closeLogoutModal}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>Logout</Text>
              <Text style={styles.modalMessage}>Are you sure you want to logout?</Text>

              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.cancelButton} onPress={this.closeLogoutModal}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.logoutConfirmButton} onPress={this.handleLogout}>
                  <Text style={styles.logoutConfirmText}>Yes, Logout</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* ✅ Fullscreen Center Loader */}
        {loading && (
          <View style={styles.loaderOverlay}>
            <ActivityIndicator size="large" color="#7B5CFA" />
          </View>
        )}
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
    borderRadius: 20,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  modalMessage: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
    color: "#555",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#ccc",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    marginRight: 10,
  },
  cancelButtonText: {
    color: "#333",
    fontWeight: "bold",
  },
  logoutConfirmButton: {
    flex: 1,
    backgroundColor: "#FF4D4D",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  logoutConfirmText: {
    color: "#fff",
    fontWeight: "bold",
  },
loaderOverlay: {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000, // same or higher
},

});
