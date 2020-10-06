import React, {Component} from 'react';
import {Platform, StyleSheet, Switch} from 'react-native';
import {
  Container,
  Header,
  Title,
  Content,
  Body,
  Form,
  Item,
  Input,
  Button,
  Text,
  Picker,
} from 'native-base';
import LaunchNavigator from 'react-native-launch-navigator';

import LNAppPicker from './components/LNAppPicker';
import LNPicker from './components/LNPicker';

const googleApiKey = 'your_api_key';

const styles = StyleSheet.create({
  button: {
    alignSelf: 'center',
    marginTop: 20,
  },
});

let instance, defaultSelectedApp, defaultLaunchMode, launchModes;

if (Platform.OS === 'ios') {
  defaultSelectedApp = LaunchNavigator.APP.APPLE_MAPS;
  launchModes = {
    [LaunchNavigator.LAUNCH_MODE.URI_SCHEME]: 'URI scheme',
    [LaunchNavigator.LAUNCH_MODE.MAPKIT]: 'MapKit class',
  };
  defaultLaunchMode = LaunchNavigator.LAUNCH_MODE.URI_SCHEME;
} else {
  LaunchNavigator.setGoogleApiKey(googleApiKey);
  defaultSelectedApp = LaunchNavigator.APP.GOOGLE_MAPS;
  launchModes = {
    [LaunchNavigator.LAUNCH_MODE.MAPS]: 'Maps',
    [LaunchNavigator.LAUNCH_MODE.TURN_BY_TURN]: 'Turn-by-turn',
    [LaunchNavigator.LAUNCH_MODE.GEO]: 'geo: protocol',
  };
  defaultLaunchMode = LaunchNavigator.LAUNCH_MODE.MAPS;
}

let launchModePickerItems = [];
for (let mode in launchModes) {
  launchModePickerItems.push(
    <Picker.Item value={mode} label={launchModes[mode]} key={mode} />,
  );
}

export default class App extends Component {
  state = {};

  constructor(props) {
    super(props);
    instance = this;

    this.state = {
      app: defaultSelectedApp,
      start: '',
      destination: '',
      destinationName: '',
      startName: '',
      launchMode: defaultLaunchMode,
      transportMode: '',
      extras: '',
      enableGeocoding: true,
    };
  }

  componentDidMount() {
    LaunchNavigator.enableDebug(true);
  }

  setStateAsync(state) {
    return new Promise((resolve) => {
      instance.setState(state, resolve);
    });
  }

  async handleFieldChange(name, value) {
    await instance.setStateAsync({[name]: value});
  }

  handleInputChange(e) {
    instance.handleFieldChange(this.name, e.nativeEvent.text);
  }

  getStateTrimmed(name) {
    return instance.state[name].trim();
  }

  supportsTransportMode() {
    return LaunchNavigator.supportsTransportMode(
      instance.state.app,
      Platform.OS,
      instance.state.launchMode,
    );
  }

  supportsStart() {
    return LaunchNavigator.supportsStart(
      instance.state.app,
      Platform.OS,
      instance.state.launchMode,
    );
  }

  supportsStartName() {
    return LaunchNavigator.supportsStartName(
      instance.state.app,
      Platform.OS,
      instance.state.launchMode,
    );
  }

  supportsDestName() {
    return LaunchNavigator.supportsDestName(
      instance.state.app,
      Platform.OS,
      instance.state.launchMode,
    );
  }

  supportsLaunchMode() {
    return LaunchNavigator.supportsLaunchMode(instance.state.app, Platform.OS);
  }

  /**
   * Render
   */

  renderStartItem() {
    let startItem = null;
    if (this.supportsStart()) {
      startItem = (
        <Item>
          <Input
            name="start"
            onChange={this.handleInputChange}
            placeholder="Start location (default is current location)"
            placeholderTextColor="#cccccc"
          />
        </Item>
      );
    }
    return startItem;
  }

  renderStartNameItem() {
    let startNameItem = null;
    if (this.supportsStartName()) {
      startNameItem = (
        <Item>
          <Input
            name="startName"
            onChange={this.handleInputChange}
            placeholder="Start nickname"
            placeholderTextColor="#cccccc"
          />
        </Item>
      );
    }
    return startNameItem;
  }

  renderDestNameItem() {
    let destNameItem = null;
    if (this.supportsDestName()) {
      destNameItem = (
        <Item>
          <Input
            name="destinationName"
            onChange={this.handleInputChange}
            placeholder="Destination nickname"
            placeholderTextColor="#cccccc"
          />
        </Item>
      );
    }
    return destNameItem;
  }

  renderLaunchModeItem() {
    let launchModeItem = null;
    if (this.supportsLaunchMode()) {
      launchModeItem = (
        <Item style={{paddingLeft: 10}} picker>
          <Text>Launch mode:</Text>
          <LNPicker
            name="launchMode"
            placeholder="Select launch mode"
            defaultSelected={defaultLaunchMode}
            onUpdate={this.handleFieldChange}
            items={launchModePickerItems}
          />
        </Item>
      );
    }
    return launchModeItem;
  }

  renderTransportModeItem() {
    let transportModeItem = null;
    if (this.supportsTransportMode()) {
      let transportModes = LaunchNavigator.getTransportModes(
        instance.state.app,
        Platform.OS,
        instance.state.launchMode,
      );
      let transportModePickerItems = [];
      transportModes.forEach((transportMode) => {
        transportModePickerItems.push(
          <Picker.Item
            value={transportMode}
            label={transportMode}
            key={transportMode}
          />,
        );
      });
      let selectedMode = transportModes[0];

      transportModeItem = (
        <Item style={{paddingLeft: 10}} picker>
          <Text>Transport mode:</Text>
          <LNPicker
            name="transportMode"
            placeholder="Select transport mode"
            onUpdate={this.handleFieldChange}
            items={transportModePickerItems}
            defaultSelected={selectedMode}
          />
        </Item>
      );
    }
    return transportModeItem;
  }

  render() {
    return (
      <Container>
        <Header>
          <Body>
            <Title>LaunchNavigator Example</Title>
          </Body>
        </Header>
        <Content>
          <Form>
            <Item>
              <Input
                name="destination"
                onChange={this.handleInputChange}
                placeholder="Destination location"
                placeholderTextColor="#cccccc"
              />
            </Item>
            <Item style={{paddingLeft: 10}} picker>
              <Text>App:</Text>
              <LNAppPicker
                name="app"
                defaultSelected={defaultSelectedApp}
                onUpdate={this.handleFieldChange}
              />
            </Item>
            <Button
              onPress={this.navigate}
              disabled={
                !this.getStateTrimmed('destination') ||
                this.getStateTrimmed('destination') ===
                  this.getStateTrimmed('start')
              }
              style={styles.button}>
              <Text>Navigate</Text>
            </Button>
            <Item>
              <Text style={{marginTop: 10, marginBottom: 10, fontSize: 20}}>
                More options
              </Text>
            </Item>
            {this.renderDestNameItem()}
            {this.renderStartItem()}
            {this.renderStartNameItem()}
            {this.renderTransportModeItem()}
            {this.renderLaunchModeItem()}
            <Item>
              <Input
                name="extras"
                onChange={this.handleInputChange}
                placeholder="App-specific params as: a=b&c=d"
                placeholderTextColor="#cccccc"
              />
            </Item>
            <Item>
              <Text style={{marginTop: 10, marginBottom: 10, marginRight: 20}}>
                Enable geocoding
              </Text>
              <Switch
                name="enableGeocoding"
                onValueChange={this.handleFieldChange.bind(
                  this,
                  'enableGeocoding',
                )}
                value={this.state.enableGeocoding}
              />
            </Item>
          </Form>
        </Content>
      </Container>
    );
  }

  navigate() {
    let params = {
      app: instance.state.app,
      enableGeocoding: instance.state.enableGeocoding,
    };
    if (instance.supportsStart()) {
      params.start = instance.getStateTrimmed('start');
    }
    if (instance.supportsStartName()) {
      params.startName = instance.getStateTrimmed('startName');
    }
    if (instance.supportsDestName()) {
      params.destinationName = instance.getStateTrimmed('destinationName');
    }
    if (instance.supportsTransportMode()) {
      params.transportMode = instance.getStateTrimmed('transportMode');
    }
    if (instance.supportsLaunchMode()) {
      params.launchMode = instance.getStateTrimmed('launchMode');
    }
    if (instance.state.extras) {
      let sExtras = instance.state.extras;
      let oExtras = {};
      try {
        sExtras = sExtras.replace(';', '&');
        let extras = sExtras.split('&');
        let hasExtras = false;
        for (let i = 0; i < extras.length; i++) {
          let parts = extras[i].split('=');
          if (parts[0] && parts[1]) {
            oExtras[parts[0]] = parts[1];
            hasExtras = true;
          }
        }
        if (hasExtras) {
          params.extras = oExtras;
        }
      } catch (e) {
        console.error(
          "Failed to parse 'App-specific params' as URI querystring - please check the syntax",
        );
      }
    }

    console.log('navigate()');
    //console.dir(params);
    LaunchNavigator.navigate(instance.getStateTrimmed('destination'), params)
      .then(() => console.log('Launched ' + instance.state.app))
      .catch((err) =>
        console.error('Error launching ' + instance.state.app + ': ' + err),
      );
  }
}
