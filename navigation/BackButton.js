import React from 'react';
import { Image, Platform, StyleSheet, TouchableOpacity } from 'react-native';
import { withNavigation } from '@expo/ex-navigation';
import ExNavigationAssets from '@expo/ex-navigation/src/ExNavigationAssets';

const BACK_BUTTON_HIT_SLOP = { top: 0, bottom: 0, left: 0, right: 30 };

@withNavigation
export default class BackButton extends React.Component {
  render() {
    return (
      <TouchableOpacity
        onPress={this._onPress}
        hitSlop={BACK_BUTTON_HIT_SLOP}
        style={buttonStyles.buttonContainer}
      >
        <Image
          style={[buttonStyles.button, { tintColor: '#fff' }, this.props.style]}
          source={ExNavigationAssets.backIcon}
        />
      </TouchableOpacity>
    );
  }

  _onPress = () => {
    if (this.props.onPress) {
      return this.props.onPress();
    }

    if (this.props.isModal) {
      this.props.navigation.dismissModal();
    } else {
      this.props.navigator.pop();
    }
  };
}

const buttonStyles = StyleSheet.create({
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  button: {
    resizeMode: 'contain',
    ...Platform.select({
      ios: {
        height: 21,
        width: 13,
        marginLeft: 8,
        marginRight: 6
      },
      android: {
        height: 30,
        width: 30
      }
    })
  }
});
