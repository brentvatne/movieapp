import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  Animated,
  Image,
  Linking,
  Platform,
  RefreshControl,
  ScrollView,
  StatusBar,
  NativeModules,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View
} from 'react-native';
import FadeIn from '@expo/react-native-fade-in-image';
import Icon from 'react-native-vector-icons/Ionicons';
import expo, { Constants } from 'expo';
const { LinearGradient } = expo;
import ScrollableTabView from 'react-native-scrollable-tab-view';
import Swiper from 'react-native-swiper';
import axios from 'axios';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';

import * as moviesActions from '../state/moviesActions';
import MovieInfoTabBar from '../components/MovieInfoTabBar';
import ProgressBar from '../components/ProgressBar';
import styles from './styles/Movie';
import { TMDB_IMG_URL, YOUTUBE_API_KEY, YOUTUBE_URL } from '../constants/Api';
import BackButton from '../navigation/BackButton';

import Casts from '../components/tabs/Casts';
import Info from '../components/tabs/Info';
import Trailers from '../components/tabs/Trailers';

class Movie extends Component {
  static route = {
    navigationBar: {
      visible: false
    }
  };

  constructor(props) {
    super(props);

    this.state = {
      dismissButtonVisibility: new Animated.Value(1),
      castsTabHeight: null,
      heightAnim: null,
      infoTabHeight: null,
      isLoading: true,
      isRefreshing: false,
      showSimilarMovies: true,
      trailersTabHeight: null,
      tab: 0,
      youtubeVideos: []
    };

    this._getTabHeight = this._getTabHeight.bind(this);
    this._onChangeTab = this._onChangeTab.bind(this);
    this._onContentSizeChange = this._onContentSizeChange.bind(this);
    this._onRefresh = this._onRefresh.bind(this);
    this._onScroll = this._onScroll.bind(this);
    this._openYoutube = this._openYoutube.bind(this);
  }

  componentWillMount() {
    this._retrieveDetails();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.details) {
      this.setState({ isLoading: false });
    }
  }

  _retrieveDetails(isRefreshed) {
    this.props.actions
      .retrieveMovieDetails(this.props.route.params.movieId)
      .then(() => {
        this._retrieveYoutubeDetails();
      });
    if (isRefreshed && this.setState({ isRefreshing: false }));
  }

  _retrieveSimilarMovies() {
    this.props.actions.retrieveSimilarMovies(
      this.props.route.params.movieId,
      1
    );
  }

  _onRefresh() {
    this.setState({ isRefreshing: true });
    this._retrieveDetails('isRefreshed');
  }

  _onScroll(event) {
    const contentOffsetY = event.nativeEvent.contentOffset.y.toFixed();

    if (contentOffsetY > 130) {
      this._toggleNavbar('hidden');
    } else {
      this._toggleNavbar('shown');
    }
  }

  _toggleNavbar(status) {
    if (status === 'hidden') {
      if (this.state.dismissButtonVisibility.__getValue() === 0) {
        return;
      }
      Animated.spring(this.state.dismissButtonVisibility, {
        toValue: 0,
        speed: 20,
        bounciness: 0
      }).start();
    } else {
      if (this.state.dismissButtonVisibility.__getValue() === 1) {
        return;
      }
      Animated.spring(this.state.dismissButtonVisibility, {
        toValue: 1,
        speed: 20,
        bounciness: 0
      }).start();
    }
  }

  _onChangeTab({ i, ref }) {
    this.setState({ tab: i });
  }

  // ScrollView onContentSizeChange prop
  _onContentSizeChange(width, height) {
    if (
      this.state.tab === 0 &&
      this.state.infoTabHeight === this.state.castsTabHeight
    ) {
      this.setState({ infoTabHeight: height });
    }
  }

  _getTabHeight(tabName, height) {
    if (tabName === 'casts') this.setState({ castsTabHeight: height });
    if (tabName === 'trailers') this.setState({ trailersTabHeight: height });
  }

  _retrieveYoutubeDetails() {
    this.props.details.videos.results.map(item => {
      const request = axios
        .get(
          `${YOUTUBE_URL}/?id=${item.key}&key=${YOUTUBE_API_KEY}&part=snippet`
        )
        .then(res => {
          const data = this.state.youtubeVideos;
          data.push(res.data.items[0]);
        })
        .catch(error => {
          console.log(error); //eslint-disable-line
        });
      return request;
    });
  }

  _openYoutube(youtubeUrl) {
    Linking.canOpenURL(youtubeUrl).then(supported => {
      if (supported) {
        Linking.openURL(youtubeUrl);
      } else {
        ToastAndroid.show(
          `RN Don't know how to handle this url ${youtubeUrl}`,
          ToastAndroid.SHORT
        );
      }
    });
  }

  _dismissModal = () => {
    this.props.navigation.dismissModal();

    if (Platform.OS === 'ios') {
      NativeModules.StatusBarManager.setHidden(false, 'slide');
    }
  };

  _renderDismissButton() {
    let translateY = this.state.dismissButtonVisibility.interpolate({
      inputRange: [0, 1],
      outputRange: [-75, 0]
    });

    if (Platform.OS === 'ios') {
      return (
        <Animated.View
          style={[styles.dismissButton, { transform: [{ translateY }] }]}
        >
          <TouchableOpacity
            onPress={this._dismissModal}
            hitSlop={{ top: 20, left: 20, right: 20, bottom: 20 }}
          >
            <Ionicons name="ios-arrow-down" size={35} color="#fff" />
          </TouchableOpacity>
        </Animated.View>
      );
    } else {
      return (
        <Animated.View
          style={[styles.dismissButton, { transform: [{ translateY }] }]}
        >
          <BackButton onPress={this._dismissModal} />
        </Animated.View>
      );
    }
  }

  render() {
    const iconStar = <Icon name="md-star" size={16} color="#F5B642" />;
    const { details } = this.props;
    const info = details;

    let height;
    if (this.state.tab === 0) height = this.state.infoTabHeight;
    if (this.state.tab === 1) height = this.state.castsTabHeight;
    if (this.state.tab === 2) height = this.state.trailersTabHeight;

    return this.state.isLoading
      ? <View style={styles.progressBar}>
          <ProgressBar />
        </View>
      : <View style={{ flex: 1 }}>
          {Platform.OS === 'android' &&
            <View
              style={{
                height: Constants.statusBarHeight,
                backgroundColor: '#0a0a0a'
              }}
            />}
          <ScrollView
            style={styles.container}
            onScroll={this._onScroll.bind(this)}
            scrollEventThrottle={100}
            onContentSizeChange={this._onContentSizeChange}
            refreshControl={
              <RefreshControl
                refreshing={this.state.isRefreshing}
                onRefresh={this._onRefresh}
                colors={['#EA0000']}
                tintColor="white"
                title="loading..."
                titleColor="white"
                progressBackgroundColor="white"
              />
            }
          >
            <View style={{ height }}>
              <Swiper
                style={styles.swiper}
                autoplay
                autoplayTimeout={4}
                showsPagination={false}
                height={248}
                loop
                index={5}
              >
                {info.images.backdrops.map((item, index) =>
                  <View key={index}>
                    <FadeIn
                      placeholderStyle={{
                        backgroundColor:
                          Platform.OS === 'android' ? 'transparent' : 'black'
                      }}
                    >
                      <Image
                        source={{
                          uri: `${TMDB_IMG_URL}/w780/${item.file_path}`
                        }}
                        style={styles.imageBackdrop}
                      />
                    </FadeIn>
                    <LinearGradient
                      colors={[
                        'rgba(0, 0, 0, 0.2)',
                        'rgba(0,0,0, 0.5)',
                        'rgba(0,0,0, 0.99)'
                      ]}
                      style={styles.linearGradient}
                    />
                  </View>
                )}
              </Swiper>
              <View style={styles.cardContainer}>
                <FadeIn
                  placeholderStyle={{
                    backgroundColor:
                      Platform.OS === 'android' ? 'transparent' : 'black'
                  }}
                >
                  <Image
                    source={{ uri: `${TMDB_IMG_URL}/w185/${info.poster_path}` }}
                    style={styles.cardImage}
                  />
                </FadeIn>
                <View style={styles.cardDetails}>
                  <Text style={styles.cardTitle}>
                    {info.original_title}
                  </Text>
                  <Text style={styles.cardTagline}>
                    {info.tagline}
                  </Text>
                  <View style={styles.cardGenre}>
                    {info.genres.map(item =>
                      <Text key={item.id} style={styles.cardGenreItem}>
                        {item.name}
                      </Text>
                    )}
                  </View>
                  <View style={styles.cardNumbers}>
                    <View style={styles.cardStar}>
                      {iconStar}
                      <Text style={styles.cardStarRatings}>8.9</Text>
                    </View>
                    <Text style={styles.cardRunningHours} />
                  </View>
                </View>
              </View>
              <View style={styles.contentContainer}>
                <ScrollableTabView
                  onChangeTab={this._onChangeTab}
                  renderTabBar={() =>
                    <MovieInfoTabBar
                      textStyle={styles.textStyle}
                      underlineStyle={styles.underlineStyle}
                      style={styles.tabBar}
                    />}
                >
                  <Info tabLabel="INFO" info={info} />
                  <Casts
                    tabLabel="CASTS"
                    info={info}
                    getTabHeight={this._getTabHeight}
                  />
                  <Trailers
                    tabLabel="TRAILERS"
                    youtubeVideos={this.state.youtubeVideos}
                    openYoutube={this._openYoutube}
                    getTabHeight={this._getTabHeight}
                  />
                </ScrollableTabView>
              </View>
            </View>
          </ScrollView>

          {this._renderDismissButton()}
          <StatusBar
            hidden={Platform.OS === 'ios'}
            animated
            showHideTransition="slide"
          />
        </View>;
  }
}

Movie.propTypes = {
  actions: PropTypes.object.isRequired,
  details: PropTypes.object.isRequired,
  navigator: PropTypes.object,
  route: PropTypes.object
};

function mapStateToProps(state, ownProps) {
  return {
    details: state.movies.details,
    similarMovies: state.movies.similarMovies
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(moviesActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Movie);
