import React from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View
} from 'react-native';
import {
  StackNavigation,
  DrawerNavigation,
  DrawerNavigationItem
} from '@expo/ex-navigation';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo';
import Colors from '../constants/Colors';
import defaultRouteConfig from '../navigation/defaultRouteConfig';

export default class DrawerNavigationScreen extends React.Component {
  render() {
    return (
      <DrawerNavigation
        drawerBackgroundColor="transparent"
        drawerWidth={Dimensions.get('window').width - 50}
        renderNavigationView={this._renderNavigationView}
        navigatorUID="drawer"
        id="drawer"
        initialItem="movies"
      >
        <DrawerNavigationItem id="search">
          <StackNavigation
            defaultRouteConfig={defaultRouteConfig}
            initialRoute="search"
          />
        </DrawerNavigationItem>

        <DrawerNavigationItem id="movies">
          <StackNavigation
            defaultRouteConfig={defaultRouteConfig}
            initialRoute="movies"
          />
        </DrawerNavigationItem>

        <DrawerNavigationItem id="tv">
          <StackNavigation
            defaultRouteConfig={defaultRouteConfig}
            initialRoute="blank"
          />
        </DrawerNavigationItem>
      </DrawerNavigation>
    );
  }

  _renderNavigationView = () => {
    const iconSearch = (
      <Ionicons
        name="md-search"
        size={26}
        color="#9F9F9F"
        style={[styles.drawerListIcon, { paddingLeft: 2 }]}
      />
    );
    const iconMovies = (
      <Ionicons
        name="md-film"
        size={26}
        color="#9F9F9F"
        style={[styles.drawerListIcon, { paddingLeft: 3 }]}
      />
    );
    const iconTV = (
      <Ionicons
        name="ios-desktop"
        size={26}
        color="#9F9F9F"
        style={styles.drawerListIcon}
      />
    );

    return (
      <LinearGradient
        colors={['rgba(0, 0, 0, 0.7)', 'rgba(0,0,0, 0.9)', 'rgba(0,0,0, 1)']}
        style={styles.linearGradient}
      >
        <View style={styles.container}>
          <View style={styles.drawerList}>
            <TouchableOpacity onPress={this._openSearch}>
              <View style={styles.drawerListItem}>
                {iconSearch}
                <Text style={styles.drawerListItemText}>Search</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={this._goToMovies}>
              <View style={styles.drawerListItem}>
                {iconMovies}
                <Text style={styles.drawerListItemText}>Movies</Text>
              </View>
            </TouchableOpacity>
            <View style={styles.drawerListItem}>
              {iconTV}
              <Text
                style={styles.drawerListItemText}
                onPress={() =>
                  ToastAndroid.show('Coming Soon!', ToastAndroid.SHORT)}
              >
                TV Shows
              </Text>
            </View>
          </View>
          <Text style={styles._version}>
            {/* 'v1.0.0' */}
          </Text>
        </View>
      </LinearGradient>
    );
  };

  _toggleDrawer = () => {
    this.props.navigation.getNavigatorByUID('drawer').toggleDrawer();
  };

  _openSearch = () => {
    this.props.navigation.showModal('search', { title: 'Search' });
    requestAnimationFrame(this._toggleDrawer);
  };

  _goToMovies = () => {
    this.props.navigation.performAction(({ drawer }) => {
      drawer('drawer').jumpToItem('movies');
    });
    requestAnimationFrame(this._toggleDrawer);
  };
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    flex: 1,
    paddingLeft: 25,
    justifyContent: 'center'
  },
  drawerList: {},
  drawerListIcon: {
    width: 27
  },
  drawerListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 23
  },
  drawerListItemText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 23,
    paddingLeft: 15,
    flex: 1
  },
  linearGradient: {
    flex: 1
  },
  _version: {
    color: '#3c3c3c',
    position: 'absolute',
    bottom: 25,
    marginLeft: 53
  }
});
