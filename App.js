/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Fragment, Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Moment from 'moment';
import {
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import {Dimensions, Platform, PixelRatio} from 'react-native';
const {width: viewportWidth} = Dimensions.get('window');
export const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get(
  'window',
);
export const widthScale = SCREEN_WIDTH / 10;
export const heightScale = SCREEN_HEIGHT / 10;
const scale = SCREEN_WIDTH / 320;

function normalize(size) {
  let newSize = size * scale;
  if (viewportWidth > 450) {
    newSize = size * 1.7;
  } else if (viewportWidth < 330) {
    newSize = size * 0.9;
  }
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: '',
      arr: [],
    };
  }
  componentDidMount() {
    console.log('componentDidUpdate');
    return firestore()
      .collection('dashboard')
      .doc('total')
      .get()
      .then((doc) => {
        console.log(doc.data().arr);
        this.setState({
          data: doc.data(),
          arr: doc.data().arr,
        });
      });
  }

  render() {
    return (
      <Fragment>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={styles.scrollView}>
            <View style={styles.body}>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Global</Text>
                <Text style={styles.sectionDescription}>
                  Confirmed{' : '}
                  <Text style={styles.highlight}>
                    {this.state.data.confirmed}
                  </Text>{' '}
                  Death{' : '}
                  <Text style={styles.highlight}>
                    {this.state.data.death}
                  </Text>{' '}
                  Released{' : '}
                  <Text style={styles.highlight}>
                    {this.state.data.released}
                  </Text>
                </Text>
              </View>
              {this.state.arr.map((item, index) => {
                return (
                  <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>{item.nation}</Text>
                    <Text style={styles.sectionDescription}>
                      Confirmed{' : '}
                      <Text style={styles.highlight}>
                        {item.confirmed}
                      </Text>{' '}
                      Death{' : '}
                      <Text style={styles.highlight}>{item.death}</Text>{' '}
                      Released{' : '}
                      <Text style={styles.highlight}>{item.released}</Text>
                    </Text>
                  </View>
                );
              })}
            </View>
          </ScrollView>
        </SafeAreaView>
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: normalize(13),
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
