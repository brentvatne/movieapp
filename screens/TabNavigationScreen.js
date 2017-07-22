import React from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  StackNavigation,
  TabNavigation,
  TabNavigationItem,
} from '@expo/ex-navigation';
import {
  Ionicons,
} from '@expo/vector-icons';
import Colors from '../constants/Colors';
import defaultRouteConfig from '../navigation/defaultRouteConfig';

export default class TabNavigationScreen extends React.Component {
  render() {
    return (
      <View style={{flex: 1}}>
        <TabNavigation
          tabBarHeight={56}
          tabBarColor={Colors.tabBar}
          tabBarStyle={{borderTopWidth: 0, borderBottomWidth: 0}}
          initialTab="movies">
          <TabNavigationItem
            id="movies"
            renderIcon={isSelected => this._renderIcon('Movies', 'ios-film-outline', 'ios-film', isSelected)}>
            <StackNavigation defaultRouteConfig={defaultRouteConfig} initialRoute="movies" />
          </TabNavigationItem>

          <TabNavigationItem
            id="tv-shows"
            renderIcon={isSelected => this._renderIcon('TV Shows', 'ios-desktop-outline', 'ios-desktop', isSelected)}>
            <StackNavigation defaultRouteConfig={defaultRouteConfig}  initialRoute="blank" />
          </TabNavigationItem>
        </TabNavigation>

        <StatusBar
          showHideTransition="slide"
          hidden={false}
          barStyle="light-content"
          animated
        />
      </View>
    );
  }

  _renderIcon(title, defaultIcon, selectedIcon, isSelected) {
    return (
      <View style={styles.tabItemContainer}>
        <Ionicons
          name={isSelected ? selectedIcon : defaultIcon}
          size={32}
          color={isSelected ? Colors.tabIconSelected : Colors.tabIconDefault}
        />

        <Text style={styles.tabTitleText} numberOfLines={1}>
          {title}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  tabItemContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabTitleText: {
    fontSize: 11,
    color: '#fff',
  },
});
