import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  PanResponder,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import HeaderComponent from "../../components/HeaderComponent";

const { width, height } = Dimensions.get("window");

// ✅ Scratch Card Component
class ScratchCardPure extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scratches: [],
      cleared: false,
    };

    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        this.setState((prev) => ({
          scratches: [...prev.scratches, { x: locationX, y: locationY }],
        }));
      },
      onPanResponderRelease: () => {
        if (!this.state.cleared && this.state.scratches.length > 50) {
          this.setState({ cleared: true });
          this.props.onScratchDone();
        }
      },
    });
  }

  render() {
    return (
      <View style={{ width: "100%", height: "100%" }}>


        {/* Scratch layer */}
        {!this.state.cleared && (
          <View
            style={styles.scratchLayer}
            {...this.panResponder.panHandlers}
          >
            {this.state.scratches.map((s, i) => (
              <View
                key={i}
                style={{
                  position: "absolute",
                  left: s.x - 20,
                  top: s.y - 20,
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: "#999",
                  opacity: 0,
                  shadowColor: "#999",
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 1,
                  shadowRadius: 20,
                }}
              />
            ))}
          </View>
        )}
      </View>
    );
  }
}

// ✅ Main Screen
export default class RewardScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      coupons: [],
      loading: true,
    };
  }

  componentDidMount() {
    this.getCoupons();
  }

  // ✅ GET Coupons
  getCoupons = async () => {
    try {
      const token = await AsyncStorage.getItem("liveCustomerToken");
      const response = await fetch(
        "https://api.repaykaro.com/api/v1/clients/get-coupon",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const json = await response.json();
      console.log("Coupons:", json);
      this.setState({ coupons: json.coupon, loading: false });
    } catch (error) {
      console.error("GetCoupons Error:", error);
    }
  };

  // ✅ POST Scratch
  markScratched = async (couponId, index) => {
    console.log("Scratching Coupon ID:", couponId);

    try {
      const token = await AsyncStorage.getItem("liveCustomerToken");

      const response = await fetch(
        "https://api.repaykaro.com/api/v1/clients/coupon-scratch",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            _id: couponId,
          }),
        }
      );

      console.log("Scratch API status:", response.status);

      const json = await response.json();
      console.log("Scratch API Response:", json);

      if (response.ok && json.success) {
        const updated = [...this.state.coupons];
        updated[index].scratched = 1;
        this.setState({ coupons: updated });
      } else {
        console.error("Scratch API Failed:", json);
      }
    } catch (error) {
      console.error("Scratch API Error:", error);
    }
  };

  renderCoupon = ({ item, index }) => (
    <View style={styles.card}>
      {item.scratched ? (
        <View style={styles.revealed}>
          <Text style={styles.amount}>₹{item.amount.$numberDecimal}</Text>
          <Text style={styles.status}>Ready to Redeem</Text>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Redeem Now</Text>
          </TouchableOpacity>
          <Text style={styles.code}>Code: {item.coupon_code}</Text>
          <Text style={styles.validity}>Valid for {item.validity} days</Text>
        </View>
      ) : (
        <ScratchCardPure
          amount={item.amount.$numberDecimal}
          validity={item.validity}
          scratched={item.scratched}
          onScratchDone={() => this.markScratched(item._id, index)}
        />
      )}
    </View>
  );

  render() {
    return (
      <View style={styles.container}>
        <HeaderComponent
          title="Rewards"
          showBack={true}
          onBackPress={() => this.props.navigation.goBack()}
        />
        {this.state.loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <FlatList
            data={this.state.coupons}
            keyExtractor={(item) => item._id}
            renderItem={this.renderCoupon}
            contentContainerStyle={styles.list}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f2f2f2" },
  list: { paddingBottom: 40 },
  card: {
    width: width * 0.9,
    height: height * 0.3,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 20,
    overflow: "hidden",
    alignSelf: "center",
  },
  rewardContent: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  scratchLayer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "#999",
    zIndex: 2,
  },
  revealed: { alignItems: "center", padding: 20 },
  amount: { fontSize: 30, fontWeight: "bold", color: "#333" },
  status: {
    backgroundColor: "#f0c420",
    color: "#333",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginTop: 10,
  },
  button: {
    backgroundColor: "#3366FF",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 15,
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
  code: { marginTop: 10, fontSize: 14, color: "#666" },
  validity: { fontSize: 12, color: "#999", marginTop: 4 },
});
