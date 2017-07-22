import React from 'react';
import { withNavigation } from '@expo/ex-navigation';
import { TouchableOpacity, Text } from 'react-native';

@withNavigation
export default class CloseButton extends React.Component {
  render() {
    return (
      <TouchableOpacity
        onPress={() => this.props.navigation.dismissModal()}
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          paddingRight: 15
        }}
      >
        <Text style={{ color: '#fff', fontSize: 16 }}>Close</Text>
      </TouchableOpacity>
    );
  }
}
