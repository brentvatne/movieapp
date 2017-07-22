/* eslint-disable import/prefer-default-export */

import { createRouter } from '@expo/ex-navigation';

import BlankScreen from '../screens/BlankScreen';
import DrawerNavigationScreen from '../screens/DrawerNavigationScreen';
import ModalScreen from '../screens/ModalScreen';
import MovieScreen from '../screens/MovieScreen';
import MoviesListScreen from '../screens/MoviesListScreen';
import MoviesScreen from '../screens/MoviesScreen';
import SearchScreen from '../screens/SearchScreen';
import TabNavigationScreen from '../screens/TabNavigationScreen';

export default createRouter(
  () => ({
    blank: () => BlankScreen,
    drawerNavigation: () => DrawerNavigationScreen,
    modal: () => ModalScreen,
    movie: () => MovieScreen,
    movies: () => MoviesScreen,
    moviesList: () => MoviesListScreen,
    search: () => SearchScreen,
    tabNavigation: () => TabNavigationScreen
  }),
  { ignoreSerializableWarnings: true }
);
