import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  ListView,
  Platform,
  RefreshControl,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import axios from 'axios';
import { withNavigation } from '@expo/ex-navigation';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { TMDB_URL, TMDB_API_KEY } from '../constants/Api';
import * as moviesActions from '../state/moviesActions';
import CardThree from '../components/CardThree';
import ProgressBar from '../components/ProgressBar';
import styles from './styles/MoviesList';
import CloseButton from '../navigation/CloseButton';

class MoviesList extends Component {
  static route = {
    navigationBar: {
      title(params) { return params.title },
    },
  }

  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      isRefreshing: false,
      currentPage: 1,
      list: {
        results: []
      }
    };

    this._viewMovie = this._viewMovie.bind(this);
    this._onRefresh = this._onRefresh.bind(this);
  }

  componentWillMount() {
    this._retrieveMoviesList();
  }

  _retrieveMoviesList(isRefreshed) {
    this.props.actions.retrieveMoviesList(this.props.type, this.state.currentPage)
      .then(() => {
        const ds = new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 });
        const dataSource = ds.cloneWithRows(this.props.list.results);
        this.setState({
          list: this.props.list,
          dataSource,
          isLoading: false
        });
      });
    if (isRefreshed && this.setState({ isRefreshing: false }));
  }

  _retrieveNextPage(type) {
    if (this.state.currentPage !== this.props.list.total_pages) {
      this.setState({
        currentPage: this.state.currentPage + 1
      });

      let page;
      if (this.state.currentPage === 1) {
        page = 2;
        this.setState({ currentPage: 2 });
      } else {
        page = this.state.currentPage + 1;
      }

      axios.get(`${TMDB_URL}/movie/${type}?api_key=${TMDB_API_KEY}&page=${page}`)
        .then(res => {
          const data = this.state.list.results;
          const newData = res.data.results;

          newData.map((item, index) => data.push(item));

          this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.state.list.results)
          });
        }).catch(err => {
          console.log('next page', err); // eslint-disable-line
        });
    }
  }

  _viewMovie(movieId) {
    this.props.navigation.showModal('movie', { movieId });
  }

  _onRefresh() {
    this.setState({ isRefreshing: true });
    this._retrieveMoviesList('isRefreshed');
  }

  render() {
    const topInset = this.props.route.getContentInsetsStyle().marginTop + 15;

    return (
      this.state.isLoading ? <View style={styles.progressBar}><ProgressBar /></View> :
      <View style={{flex: 1}}>
        <ListView
          style={styles.container}
          contentInset={{top: topInset}}
          contentOffset={{y: -topInset}}
          contentContainerStyle={{
            paddingTop: Platform.OS === 'android' ? 15 : 0
          }}
          enableEmptySections
          onEndReached={type => this._retrieveNextPage(this.props.type)}
          onEndReachedThreshold={1200}
          dataSource={this.state.dataSource}
          renderRow={rowData => <CardThree info={rowData} viewMovie={this._viewMovie} />}
          renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.seperator} />}
          renderFooter={() => <View style={{ height: 50 }}><ProgressBar /></View>}
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
        />

        <StatusBar
          showHideTransition="fade"
          hidden={false}
          barStyle="light-content"
          animated
        />
      </View>
    );
  }
}

MoviesList.propTypes = {
  actions: PropTypes.object.isRequired,
  list: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
  navigator: PropTypes.object,
  navigation: PropTypes.object,
};

function mapStateToProps(state, ownProps) {
  return {
    list: state.movies.list
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(moviesActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MoviesList);
