import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Modal,
} from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import HeaderComponent from "../../components/HeaderComponent";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { heightPercentageToDP } from "react-native-responsive-screen";

export default class UploadPaymentScreenshot extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedImage: null,
      screenshots: [],
      loading: false,
      showDeleteModal: false,
      deleteId: null,
    };
  }

  componentDidMount() {
    this.fetchUploadedScreenshots();
  }

  pickImage = () => {
    const options = {
      mediaType: "photo",
      quality: 0.8,
    };
    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.errorCode) {
        console.log("ImagePicker Error: ", response.errorMessage);
      } else {
        const uri = response.assets[0].uri;
        this.setState({ selectedImage: uri });
      }
    });
  };

  uploadScreenshot = async () => {
    if (!this.state.selectedImage) {
      this.props.toastRef.current.show("Please select an image first.", 2000);
      return;
    }

    const token = await AsyncStorage.getItem("liveCustomerToken");
    if (!token) {
      this.props.toastRef.current.show("Auth token not found", 2000);
      return;
    }

    this.setState({ loading: true });

    const formData = new FormData();
    formData.append("screenshot", {
      uri: this.state.selectedImage,
      type: "image/jpeg",
      name: "screenshot.jpg",
    });

    try {
      const response = await fetch(
        "https://api.repaykaro.com/api/v1/clients/upload-payment-screenshot",
        {
          method: "POST",
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const result = await response.json();

      if (result.success) {
        this.props.toastRef.current.show("Screenshot uploaded successfully!", 2000);
        this.setState({ selectedImage: null });
        this.fetchUploadedScreenshots();
      } else {
        this.props.toastRef.current.show("Upload failed. Please try again.", 2000);
      }
    } catch (error) {
      console.error("Upload Error:", error);
      this.props.toastRef.current.show("Something went wrong!", 2000);
    } finally {
      this.setState({ loading: false });
    }
  };

  fetchUploadedScreenshots = async () => {
    const token = await AsyncStorage.getItem("liveCustomerToken");
    if (!token) {
      this.props.toastRef.current.show("Auth token not found", 2000);
      return;
    }

    try {
      const response = await fetch(
        "https://api.repaykaro.com/api/v1/clients/get-screenshot",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();
      if (result?.screen_shot?.length > 0) {
        this.setState({ screenshots: result.screen_shot });
      } else {
        this.setState({ screenshots: [] });
      }
    } catch (error) {
      console.error("Fetch Screenshot Error:", error);
      this.props.toastRef.current.show("Error fetching uploaded screenshots.", 2000);
    }
  };

  openDeleteModal = (_id) => {
    this.setState({ showDeleteModal: true, deleteId: _id });
  };

  closeDeleteModal = () => {
    this.setState({ showDeleteModal: false, deleteId: null });
  };

  confirmDelete = async () => {
    const { deleteId } = this.state;
    const token = await AsyncStorage.getItem("liveCustomerToken");
    if (!token) {
      this.props.toastRef.current.show("Auth token not found", 2000);
      return;
    }

    this.setState({ showDeleteModal: false, loading: true });

    try {
      const response = await fetch(
        `https://api.repaykaro.com/api/v1/clients/delete-screenshot/${deleteId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (result.success) {
        this.props.toastRef.current.show("Screenshot deleted successfully!", 2000);
        this.fetchUploadedScreenshots();
      } else {
        this.props.toastRef.current.show("Failed to delete. Please try again.", 2000);
      }
    } catch (error) {
      console.error("Delete Screenshot Error:", error);
      this.props.toastRef.current.show("Something went wrong while deleting.", 2000);
    } finally {
      this.setState({ loading: false, deleteId: null });
    }
  };

  render() {
    const { selectedImage, screenshots, loading, showDeleteModal } = this.state;

    return (
      <View style={{ flex: 1 }}>
        <HeaderComponent
          title="Upload Screenshot"
          showBack={true}
          onBackPress={() => this.props.navigation.goBack()}
        />
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.uploadContainer}>
            <TouchableOpacity style={styles.dropBox} onPress={this.pickImage}>
              {selectedImage ? (
                <Image source={{ uri: selectedImage }} style={styles.previewImage} />
              ) : (
                <>
                  <Text style={styles.selectText}>Select a file</Text>
                  <Text style={styles.orText}>or pick from gallery</Text>
                  <Text style={styles.limitText}>PNG, JPG, GIF up to 10MB</Text>
                </>
              )}
            </TouchableOpacity>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => this.setState({ selectedImage: null })}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.uploadButton}
                onPress={this.uploadScreenshot}
              >
                <Text style={styles.uploadText}>Upload</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.uploadedContainer}>
            <Text style={styles.uploadedTitle}>Uploaded Screenshots</Text>
            {screenshots.length === 0 ? (
              <Text style={styles.noScreenshots}>No screenshots uploaded yet</Text>
            ) : (
              <View style={styles.gridContainer}>
                {screenshots.map((item) => (
                  <View key={item._id} style={styles.imageWrapper}>
                    <Image
                      source={{ uri: item.screen_shot }}
                      style={styles.uploadedImage}
                    />
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => this.openDeleteModal(item._id)}
                    >
                      <Image
                        source={require("../../assets/icons/delete.png")}
                        style={{
                          aspectRatio: 1 / 1,
                          height: heightPercentageToDP(2),
                          tintColor: "#fff",
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>
        </ScrollView>

        <Modal transparent visible={showDeleteModal} animationType="fade">
          <View style={styles.modalBackdrop}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>Delete Screenshot</Text>
              <Text style={styles.modalMessage}>
                Are you sure you want to delete this screenshot?
              </Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.modalCancel}
                  onPress={this.closeDeleteModal}
                >
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalDelete}
                  onPress={this.confirmDelete}
                >
                  <Text style={styles.modalDeleteText}>Yes, Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {loading && (
          <View style={styles.loaderOverlay}>
            <ActivityIndicator size="large" color="#fff" />
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  // 🧩 Same styles as before
  container: {
    padding: 20,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  uploadContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 20,
    alignItems: "center",
    width: "100%",
    maxWidth: 400,
  },
  dropBox: {
    borderWidth: 2,
    borderColor: "#ccc",
    borderStyle: "dashed",
    borderRadius: 8,
    width: "100%",
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  selectText: {
    color: "#7B5CFA",
    fontWeight: "bold",
    fontSize: 16,
  },
  orText: {
    marginTop: 5,
    color: "#999",
  },
  limitText: {
    marginTop: 5,
    color: "#999",
    fontSize: 12,
  },
  previewImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  buttonRow: {
    flexDirection: "row",
    marginTop: 20,
    width: "100%",
    justifyContent: "space-between",
  },
  cancelButton: {
    backgroundColor: "#eee",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  uploadButton: {
    backgroundColor: "#7B5CFA",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  cancelText: {
    color: "#333",
    fontWeight: "bold",
  },
  uploadText: {
    color: "#fff",
    fontWeight: "bold",
  },
  uploadedContainer: {
    marginTop: 30,
    width: "100%",
    alignItems: "center",
  },
  uploadedTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  noScreenshots: {
    color: "#999",
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  imageWrapper: {
    position: "relative",
    margin: 5,
  },
  uploadedImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  deleteButton: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  loaderOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
    zIndex: 9999,
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
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalCancel: {
    flex: 1,
    backgroundColor: "#ccc",
    padding: 12,
    borderRadius: 6,
    marginRight: 10,
    alignItems: "center",
  },
  modalDelete: {
    flex: 1,
    backgroundColor: "#ff4444",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  modalCancelText: {
    color: "#333",
    fontWeight: "bold",
  },
  modalDeleteText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
