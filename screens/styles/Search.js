import { Platform, StyleSheet } from 'react-native';
import { NavigationBar } from '@expo/ex-navigation';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    paddingTop: Platform.OS === 'ios' ? NavigationBar.DEFAULT_HEIGHT : 0,
  },
  textInput: {
    backgroundColor: 'white',
    ...Platform.select({
      ios: {
        height: 35
      },
      android: {
        height: 48
      }
    })
  },
  searchboxBorder: {
    borderRadius: 3,
    backgroundColor: 'white',
    paddingHorizontal: 3
  },
  searchbox: {
    backgroundColor: '#191919',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 16
  },
  seperator: {
    marginTop: 10,
    backgroundColor: '#8E8E8E'
  }
});

export default styles;
