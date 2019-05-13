import React, { Component } from 'react';
import { Picker, Icon } from 'native-base';
import LaunchNavigator from 'react-native-launch-navigator';


export default class LNAppPicker extends Component {

    state = {};

    constructor(props) {
        super(props);
        this.state = {
            selected: this.props.defaultSelected
        };
    }

    onSelectChange(value: string) {
        this.setState({
            selected: value
        });
        this.props.onUpdate(this.props.name, value);
    }

    async getAvailableApps(): Promise<void>{
        LaunchNavigator.getAvailableApps()
            .then((apps) => {
                console.log("->getAvailableApps()");
                for(let app in apps){
                    apps[app] = {
                        name: LaunchNavigator.getAppDisplayName(app),
                        available:  apps[app]
                    };
                }
                this.setState({availableApps: apps});
            })
            .catch((error) => {
                console.error(error);
            });
    }

    async componentDidMount() {
        await this.getAvailableApps();
    }

    render() {
        let appName, app, pickerItems = [];
        for(appName in this.state.availableApps){
            app = this.state.availableApps[appName];
            if(app.available){
                pickerItems.push(<Picker.Item value={appName} label={app.name} key={appName} />);
            }
        }

        return (
            <Picker
                placeholder="Select navigator app"
                mode="dropdown"
                iosIcon={<Icon name="arrow-down" />}
                style={{ width: undefined }}
                placeholderStyle={{ color: "#cccccc" }}
                placeholderIconColor="#007aff"
                selectedValue={this.state.selected}
                onValueChange={this.onSelectChange.bind(this)}
            >
                {pickerItems}
            </Picker>
        );
    }
}

