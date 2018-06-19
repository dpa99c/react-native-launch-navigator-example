import React, { Component } from 'react';
import {Platform, StyleSheet, Text, SafeAreaView } from 'react-native';
import RNLaunchNavigator from 'react-native-launch-navigator';
//import ErrorHelper from 'helper/ErrorHelper';

// Make SafeAreaView work on iOS 10 and below
const OS_STATUSBAR_OFFSET = (Platform.OS === "ios" && parseInt(Platform.Version) < 11) ? 20 : 0;

const A_STRING = "foo";
const AN_ERROR = "error";

const PROMISE_SUCCESS = "promise - success";
const PROMISE_ERROR = "promise - error";

let initialState = {};
initialState[PROMISE_SUCCESS] = {};
initialState[PROMISE_ERROR] = {};


const styles = StyleSheet.create({
    paddingTop: OS_STATUSBAR_OFFSET,
    success:{
        color: 'blue'
    },
    error:{
        color: 'red'
    }
});

class Result extends Component {
    render() {
        let outcome = this.props.success ? "success" : "error";
        return (
            <Text style={styles[outcome]}>{this.props.name}: {this.props.value}</Text>
        );
    }
}

export default class LotsOfResults extends Component {
    state = initialState;


    setStateAsync(name, value) {
        return new Promise((resolve) => {
            let state = this.state;
            state[name] = value;
            this.setState(state, resolve)
        });
    }

    setAndGetStringWithPromise(name, message){
        RNLaunchNavigator.setAndGetStringWithPromise(message)
            .then((stringWithPromise) => {
                this.setStateAsync(name, {
                    success: true,
                    value: stringWithPromise
                });
            })
            .catch((error) => {
                // debugger;
                this.setStateAsync(name, {
                    success: false,
                    value: error.message
                });
            });
    }

    async componentDidMount() {
        this.setAndGetStringWithPromise(PROMISE_SUCCESS, A_STRING);
        this.setAndGetStringWithPromise(PROMISE_ERROR, AN_ERROR);
    }

    render() {
        return (
            <SafeAreaView style={{alignItems: 'center'}}>
                <Result name={PROMISE_SUCCESS} success={this.state[PROMISE_SUCCESS].success} value={this.state[PROMISE_SUCCESS].value} />
                <Result name={PROMISE_ERROR} success={this.state[PROMISE_ERROR].success} value={this.state[PROMISE_ERROR].value} />
            </SafeAreaView>
        );
    }
}