import React, { Component } from "react";
import { Text, View } from "react-native";
import styles from "../screens/HomeScreen/styles";




export default class RepayWorkComp extends Component{
    render(){
        const {item}=this.props
        return(
              <View style={styles.workCard}>
                    <View style={styles.workCircle}>
                      <Text style={styles.workCircleText}>{item.id}</Text>
                    </View>
                    <Text style={styles.workCardTitle}>{item.title}</Text>
                    <Text style={styles.workCardDescription}>{item.description}</Text>
                  </View>
        )
    }
}