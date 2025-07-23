import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ScratchView from "react-native-scratch";
import ConfettiCannon from "react-native-confetti-cannon";
import HeaderComponent from "../../components/HeaderComponent";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width / 2 - 30;

export default class ScratchCardList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      coupons: [],
      loading: true,
      scrollEnabled: true,
      refreshing: false,
      confettiVisible: false, // 🔑 Global confetti flag
    };
  }

  componentDidMount() {
    this.getCoupons();
  }

  async getCoupons() {
    this.setState({ loading: true });
    try {
      const token = await AsyncStorage.getItem("liveCustomerToken");
      if (!token) {
        Alert.alert("Token Error", "No token found");
        this.setState({ loading: false, refreshing: false });
        return;
      }

      const response = await fetch(
        "https://api.repaykaro.com/api/v1/clients/get-coupon",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const json = await response.json();
      if (json.success) {
        this.setState({
          coupons: json.coupon,
          loading: false,
          refreshing: false,
        });
      } else {
        Alert.alert("Error", "Failed to get coupons");
        this.setState({ loading: false, refreshing: false });
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", error.message);
      this.setState({ loading: false, refreshing: false });
    }
  }

  handleReveal = (id) => {
    console.log("Scratch revealed for ID:", id);
    this.setState(
      (prev) => ({
        coupons: prev.coupons.map((c) =>
          c._id === id ? { ...c, scratched: 1 } : c
        ),
        confettiVisible: true,
      }),
      () => {
        // Confetti visible 2 sec, then hide + refresh
        setTimeout(() => {
          this.setState({ confettiVisible: false });
          this.getCoupons();
        }, 2000);
      }
    );
  };

  onRefresh = () => {
    this.setState({ refreshing: true }, () => {
      this.getCoupons();
    });
  };

  setScrollEnabled = (enabled) => {
    this.setState({ scrollEnabled: enabled });
  };

  renderItem = ({ item }) => (
    <View style={styles.card}>
      {item.scratched === 1 ? (
        <RevealedCard item={item} />
      ) : (
        <ScratchCardItem
          item={item}
          onRevealed={() => this.handleReveal(item._id)}
          setScrollEnabled={this.setScrollEnabled}
        />
      )}
    </View>
  );

  render() {
    const { coupons, loading, scrollEnabled, refreshing, confettiVisible } =
      this.state;

    return (
      <>
        <HeaderComponent
          title="Rewards"
          showBack
          onBackPress={() => this.props.navigation.goBack()}
        />
        <View style={styles.container}>
          {loading ? (
            <ActivityIndicator size="large" color='#7B5CFA'/>
          ) : (
            <FlatList
              data={coupons}
              keyExtractor={(item) => item._id}
              renderItem={this.renderItem}
              numColumns={2}
              columnWrapperStyle={{ justifyContent: "space-between" }}
              contentContainerStyle={{ paddingHorizontal: 20 }}
              scrollEnabled={scrollEnabled}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={this.onRefresh}
                />
              }
            />
          )}

          {confettiVisible && (
            <ConfettiCannon
              count={120}
              origin={{ x: width / 2, y: 0 }}
              fadeOut
              autoStart
            />
          )}
        </View>
      </>
    );
  }
}

const RevealedCard = ({ item }) => (
  <View style={styles.revealContent}>
    <Text style={styles.amount}>₹{item.amount?.$numberDecimal || "0.00"}</Text>
    <View style={styles.badge}>
      <Text style={styles.badgeText}>Ready to Redeem</Text>
    </View>
    <TouchableOpacity style={styles.redeemBtn}>
      <Text style={styles.redeemText}>Redeem Now</Text>
    </TouchableOpacity>
    <Text style={styles.code}>Code: {item.coupon_code}</Text>
    <Text style={styles.infoText}>Valid for {item.validity || 10} days</Text>
    <Text style={styles.infoText}>
      Created: {new Date(item.createdAt).toLocaleDateString()}
    </Text>
  </View>
);

class ScratchCardItem extends Component {
  handleReveal = () => {
    console.log("Scratch done!");
    this.props.onRevealed();
  };

  render() {
    const { item, setScrollEnabled } = this.props;

    return (
      <View style={{ flex: 1, height: 200 }}>
        <ScratchView
          style={{ flex: 1 }}
          brushSize={50}
          threshold={30}
          fadeOut
          placeholderColor="#2C3345"
          onRevealScratch={this.handleReveal}
          renderPlaceholder={() => (
            <View style={styles.placeholder}>
              <View style={styles.circle}>
                <Text style={styles.cross}>×</Text>
              </View>
              <Text style={styles.placeholderText}>Scratch here to reveal</Text>
            </View>
          )}
          renderContent={() => <RevealedCard item={item} />}
          onTouchStart={() => setScrollEnabled(false)}
          onTouchEnd={() => setScrollEnabled(true)}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    paddingTop: 50,
  },
  card: {
    width: CARD_WIDTH,
    height: 250,
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 20,
    elevation: 4,
  },
  placeholder: {
    flex: 1,
    backgroundColor: "#2C3345",
    justifyContent: "center",
    alignItems: "center",
  },
  circle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  cross: {
    fontSize: 30,
    color: "#ccc",
    fontWeight: "bold",
  },
  placeholderText: {
    color: "#ddd",
    fontSize: 14,
  },
  revealContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  amount: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#3366FF",
  },
  badge: {
    marginTop: 8,
    backgroundColor: "#FDE68A",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 12,
    color: "#7C3AED",
    fontWeight: "bold",
  },
  redeemBtn: {
    marginTop: 8,
    backgroundColor: "#3B82F6",
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 4,
  },
  redeemText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  code: {
    fontSize: 12,
    marginTop: 8,
    color: "#333",
  },
  infoText: {
    fontSize: 10,
    color: "#666",
    marginTop: 2,
  },
});
