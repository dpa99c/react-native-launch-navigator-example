import React, {Component} from 'react';
import {Picker, Icon} from 'native-base';

export default class LNPicker extends Component {
  state = {};

  constructor(props) {
    super(props);
    this.state = {
      selected: this.props.defaultSelected,
    };
  }

  componentDidMount() {
    this.onSelectChange(this.props.defaultSelected);
  }

  onSelectChange(value: string) {
    this.setState({
      selected: value,
    });
    this.props.onUpdate(this.props.name, value);
  }

  render() {
    return (
      <Picker
        mode="dropdown"
        iosIcon={<Icon name="arrow-down" />}
        style={{width: undefined}}
        placeholderStyle={{color: '#cccccc'}}
        placeholderIconColor="#007aff"
        selectedValue={this.state.selected}
        onValueChange={this.onSelectChange.bind(this)}>
        {this.props.items}
      </Picker>
    );
  }
}
