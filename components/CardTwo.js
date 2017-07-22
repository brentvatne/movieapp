import PropTypes from 'prop-types';
import React from 'react';
import {
  Image,
  Text,
  Platform,
  TouchableOpacity,
  View
} from 'react-native';
import FadeIn from '@expo/react-native-fade-in-image';

import styles from './styles/CardTwo';
import { TMDB_IMG_URL } from '../constants/Api';

const CardTwo = ({ info, viewMovie }) => (
  <TouchableOpacity activeOpacity={0.8} onPress={viewMovie.bind(this, info.id)}>
    <View style={styles.cardContainer}>
      <FadeIn placeholderStyle={{backgroundColor: Platform.OS === 'android' ? 'transparent' : '#eee'}}>
        <Image source={{ uri: `${TMDB_IMG_URL}/w185/${info.poster_path}` }} style={styles.cardImage} />
      </FadeIn>
      <View style={styles.cardTitleContainer}>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {info.original_title}
        </Text>
      </View>
    </View>
  </TouchableOpacity>
);

CardTwo.propTypes = {
  info: PropTypes.object.isRequired,
  viewMovie: PropTypes.func.isRequired
};

export default CardTwo;
