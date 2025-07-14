import React, { Component } from "react";
import { Text, View } from "react-native";
import HeaderComponent from "../../components/HeaderComponent";



export default class PaymentStatusScreen extends Component{
    render(){
        return(
            <View>
                <HeaderComponent title="Payment Status"
                 showBack={true}
                onBackPress={() => this.props.navigation.goBack()}
                />
                
                <Text>PaymentStatus</Text>
            </View>
        )
    }
}