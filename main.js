/* eslint-disable no-unused-vars */
import React from 'react';
import Expo from 'expo';
import { Platform, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Provider } from 'react-redux';
import store from './state/store';

import navigationContext from './navigation/CustomNavigationContext';
import { NavigationProvider, StackNavigation } from '@expo/ex-navigation';

export default class App extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#000' }}>
        <Provider store={store}>
          <NavigationProvider context={navigationContext}>
            <StackNavigation
              id="root"
              navigatorUID="root"
              initialRoute={
                Platform.OS === 'android' ? 'drawerNavigation' : 'tabNavigation'
              }
            />
          </NavigationProvider>
        </Provider>
      </View>
    );
  }
}

class AppContainer extends React.Component {
  state = {
    isLoaded: false
  };

  async componentWillMount() {
    await Expo.Font.loadAsync(Ionicons.font);
    this.setState({ isLoaded: true });
  }

  render() {
    if (!this.state.isLoaded) {
      return <Expo.AppLoading />;
    }

    return <App />;
  }
}

Expo.registerRootComponent(AppContainer);
