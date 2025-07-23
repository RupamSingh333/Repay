import React, { Component } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Linking,
  Dimensions,
  ScrollView,
  ActivityIndicator, // ✅ Import loader
} from 'react-native';
import HeaderComponent from '../../components/HeaderComponent';
import { apiGet } from '../../api/Api';
import { PieChart } from 'react-native-chart-kit';

export default class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      client: null,
      loading: true, // ✅ Add loading state
    };
  }

  componentDidMount() {
    this.fetchClientData();
  }

  fetchClientData = async () => {
    try {
      const result = await apiGet('clients/get-client');
      console.log('Client Data:', result);

      if (result && result.success && result.client) {
        this.setState({ client: result.client });
      } else {
        console.warn('Client not found in API response');
      }
    } catch (error) {
      console.error('Error fetching client data:', error);
    } finally {
      this.setState({ loading: false }); // ✅ Stop loader when done
    }
  };

  parseDecimal = (value) => {
    if (typeof value === 'object' && value.$numberDecimal) {
      return parseFloat(value.$numberDecimal);
    }
    return parseFloat(value);
  };

  makePaymentOptions = (client) => {
    return [
      {
        id: '1',
        title: 'Foreclosure Amount',
        amount: this.parseDecimal(client.fore_closure),
        reward: this.parseDecimal(client.foreclosure_reward),
        color: '#5B6CFF',
        payment_url: client.payment_url,
      },
      {
        id: '2',
        title: 'Settlement Amount',
        amount: this.parseDecimal(client.settlement),
        reward: this.parseDecimal(client.settlement_reward),
        color: '#7D5BA6',
        payment_url: client.payment_url,
      },
      {
        id: '3',
        title: 'Minimum Payment Amount',
        amount: this.parseDecimal(client.minimum_part_payment),
        reward: this.parseDecimal(client.minimum_part_payment_reward),
        color: '#F7C59F',
        payment_url: client.payment_url,
      },
    ];
  };

  handlePayment = (url) => {
    console.log('Payment URL:', url);
    if (url) {
      Linking.openURL(url).catch((err) =>
        console.error('Failed to open URL:', err)
      );
    }
  };

  renderItem = ({ item }) => (
    <View style={[styles.card, { backgroundColor: item.color }]}>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <View style={styles.amountRow}>
        <Text style={styles.amount}>₹ {item.amount}</Text>
        <Image
          source={require('../../assets/icons/wallet.png')}
          style={styles.walletIcon}
        />
      </View>
      <Text style={styles.reward}>₹ {item.reward} reward</Text>
      <TouchableOpacity
        style={styles.payButton}
        onPress={() => this.handlePayment(item.payment_url)}>
        <Text style={styles.payButtonText}>Proceed to Payment</Text>
      </TouchableOpacity>
    </View>
  );

  render() {
    const { client, loading } = this.state;

    return (
      <View style={{ flex: 1 }}>
        <HeaderComponent
          navigation={this.props.navigation}
          showBack={false}
          showLogo={true}
          showLogout={true}
          onBackPress={() => this.props.navigation.goBack()}
          setIsLoggedIn={this.props.setIsLoggedIn}
        />

        <ScrollView style={styles.container}>
          <Text style={styles.welcome}>
            🙏 Welcome {client?.customer || 'Customer'}!
          </Text>
          <Text style={styles.subtitle}>
            Your OK CREDIT loan outstanding is ₹
            {this.parseDecimal(client?.fore_closure) || '0.00'}
          </Text>

          {client && (
            <>
              <FlatList
                data={this.makePaymentOptions(client)}
                renderItem={this.renderItem}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                contentContainerStyle={{ paddingBottom: 20 }}
              />

              <View style={styles.chartContainer}>
                <Text style={styles.chartTitle}>Payment Breakdown</Text>

                <PieChart
                  data={[
                    {
                      name: 'Foreclosure',
                      amount: this.parseDecimal(client?.fore_closure) || 0,
                      color: '#5B6CFF',
                      legendFontColor: '#000',
                      legendFontSize: 12,
                    },
                    {
                      name: 'Settlement',
                      amount: this.parseDecimal(client?.settlement) || 0,
                      color: '#7D5BA6',
                      legendFontColor: '#000',
                      legendFontSize: 12,
                    },
                    {
                      name: 'Min Payment',
                      amount: this.parseDecimal(client?.minimum_part_payment) || 0,
                      color: '#F7C59F',
                      legendFontColor: '#000',
                      legendFontSize: 12,
                    },
                  ]}
                  width={Dimensions.get('window').width - 40}
                  height={220}
                  chartConfig={{
                    color: () => `rgba(0, 0, 0, 1)`,
                  }}
                  accessor={'amount'}
                  backgroundColor={'transparent'}
                  paddingLeft={'15'}
                  absolute
                />
              </View>
            </>
          )}
        </ScrollView>

        {/* ✅ Full-Screen Loader WITHOUT background */}
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
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F9F9F9',
  },
  welcome: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    marginTop: 2,
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
    marginBottom: 20,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    position: 'relative',
  },
  cardTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  amount: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  walletIcon: {
    width: 28,
    height: 28,
    tintColor: '#fff',
  },
  reward: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 40,
  },
  payButton: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 50,
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  payButtonText: {
    color: '#111',
    fontWeight: 'bold',
  },
  chartContainer: {
    marginTop: 20,
    alignItems: 'center',
    marginBottom: 10,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  loaderOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'auto',
  },
});
