import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import HeaderComponent from "../../components/HeaderComponent";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default class UploadPaymentScreenshot extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedImage: null,
      screenshots: [],
    };
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
        console.log("Selected Image URI:", uri);
        this.setState({
          selectedImage: uri,
        });
      }
    });
  };

  uploadScreenshot = async () => {
    if (!this.state.selectedImage) {
      Alert.alert("Please select an image first.");
      return;
    }

    const token = await AsyncStorage.getItem("liveCustomerToken");
    if (!token) {
      Alert.alert("Auth token not found");
      return;
    }

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
      console.log("Upload Response:", result);

      if (result.success) {
        Alert.alert("Success", "Screenshot uploaded successfully!");
        this.setState({ selectedImage: null });
        this.fetchUploadedScreenshots();
      } else {
        Alert.alert("Failed", "Upload failed. Please try again.");
      }
    } catch (error) {
      console.error("Upload Error:", error);
      Alert.alert("Error", "Something went wrong!");
    }
  };

  fetchUploadedScreenshots = async () => {
    const token = await AsyncStorage.getItem("liveCustomerToken");
    if (!token) {
      Alert.alert("Auth token not found");
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
      console.log("Fetched Screenshots:", result);

      if (result?.screen_shot?.length > 0) {
        this.setState({ screenshots: result.screen_shot });
      } else {
        this.setState({ screenshots: [] });
      }
    } catch (error) {
      console.error("Fetch Screenshot Error:", error);
      Alert.alert("Error fetching uploaded screenshots.");
    }
  };

deleteScreenshot = async (_id) => {
  const token = await AsyncStorage.getItem("liveCustomerToken");
  if (!token) {
    Alert.alert("Auth token not found");
    return;
  }

  try {
    const response = await fetch(
      `https://api.repaykaro.com/api/v1/clients/delete-screenshot/${_id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = await response.json();
    console.log("Delete Response:", result);

    if (result.success) {
      Alert.alert("Deleted", "Screenshot deleted successfully!");
      this.fetchUploadedScreenshots();
    } else {
      Alert.alert("Failed", "Failed to delete. Please try again.");
    }
  } catch (error) {
    console.error("Delete Screenshot Error:", error);
    Alert.alert("Error", "Something went wrong while deleting.");
  }
};


  componentDidMount() {
    this.fetchUploadedScreenshots();
  }

  render() {
    const { selectedImage, screenshots } = this.state;

    return (
      <View style={{ flex: 1 }}>
        <HeaderComponent
          title="Upload Screenshot"
          showBack={true}
          onBackPress={() => this.props.navigation.goBack()}
        />
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.uploadContainer}>
            <TouchableOpacity
              style={styles.dropBox}
              onPress={this.pickImage}
            >
              {selectedImage ? (
                <Image
                  source={{ uri: selectedImage }}
                  style={styles.previewImage}
                />
              ) : (
                <>
                  <Text style={styles.selectText}>Select a file</Text>
                  <Text style={styles.orText}>or pick from gallery</Text>
                  <Text style={styles.limitText}>
                    PNG, JPG, GIF up to 10MB
                  </Text>
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
              <Text style={styles.noScreenshots}>
                No screenshots uploaded yet
              </Text>
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
                      onPress={() => this.deleteScreenshot(item._id)}
                    >
                      <Text style={styles.deleteText}>X</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
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
    gap: 10,
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
  deleteText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
});
