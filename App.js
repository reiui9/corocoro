/* eslint-disable react-native/no-inline-styles */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component, useEffect, useState} from 'react';
import {
  Container,
  Header,
  Grid,
  Col,
  Item,
  Input,
  Spinner,
  Button,
} from 'native-base';
import {StyleSheet, ScrollView, View, Text} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {
  BannerAd,
  BannerAdSize,
  InterstitialAd,
  AdEventType,
} from '@react-native-firebase/admob';
import moment from 'moment';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {Dimensions, Platform, PixelRatio} from 'react-native';
const {width: viewportWidth} = Dimensions.get('window');
export const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get(
  'window',
);
export const widthScale = SCREEN_WIDTH / 10;
export const heightScale = SCREEN_HEIGHT / 10;
const scale = SCREEN_WIDTH / 320;

import firebase from '@react-native-firebase/app';

// pluck values from your `GoogleService-Info.plist` you created on the firebase console
const iosConfig = {
  clientId:
    '941393088324-v0ldd5894hg2tcbl5k1rgs4nn932hf8v.apps.googleusercontent.com',
  persistence: true,
  apiKey: 'AIzaSyBIxaq4-1XkoPnOSYoU1vWMl6y2Apm2Mco',
  authDomain: 'corocoro-5302f.firebaseapp.com',
  databaseURL: 'https://corocoro-5302f.firebaseio.com',
  projectId: 'corocoro-5302f',
  storageBucket: 'corocoro-5302f.appspot.com',
  messagingSenderId: '941393088324',
  appId: '1:941393088324:web:5afc947bf2c4aa8f59d111',
  measurementId: 'G-294LF9PFW0',
};

if (Platform.OS === 'ios') {
  firebase.initializeApp(iosConfig);
}

const unitId =
  Platform.OS === 'ios'
    ? 'ca-app-pub-4432414803296210/8609448458'
    : 'ca-app-pub-4432414803296210/2103749852';

// const interstitial = InterstitialAd.createForAdRequest(unitId, {
//   requestNonPersonalizedAdsOnly: true,
//   keywords: ['fashion', 'clothing'],
// });

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
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 1;
  }
}

function numberWithCommas(x) {
  if (!x) {
    return '';
  }
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function refresh(self) {
  self.setState({
    arr: [],
    arr2: [],
    loading: true,
  });
  self.setState({
    moment: moment().format('YYYY-MM-DD H:mm:ss'),
  });
  return firestore()
    .collection('dashboard')
    .doc('total')
    .get()
    .then((doc) => {
      self.setState({
        data: doc.data(),
        arr: doc.data().arr,
        loading: false,
      });
    });
}

function refresh2(self) {
  self.setState({
    arr2: [],
    loading: true,
    more: true,
  });
  return firestore()
    .collection('dashboard')
    .doc('total2')
    .get()
    .then((doc) => {
      self.setState({
        arr2: doc.data().arr,
        loading: false,
      });
    });
}

// function Ad() {
//   const [loaded, setLoaded] = useState(false);

//   useEffect(() => {
//     const eventListener = interstitial.onAdEvent((type) => {
//       if (type === AdEventType.LOADED) {
//         setLoaded(true);
//       }
//     });

//     // Start loading the interstitial straight away
//     interstitial.load();

//     // Unsubscribe from events on unmount
//     return () => {
//       eventListener();
//     };
//   }, []);

//   // No advert ready to show yet
//   if (!loaded) {
//     return null;
//   }

//   return (
//     <Button
//       title="Show Interstitial"
//       onPress={() => {
//         interstitial.show();
//       }}
//     />
//   );
// }

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: '',
      arr: [],
      more: true,
      load: false,
      moment: moment().format('YYYY-MM-DD H:mm:ss'),
    };
  }
  componentDidMount() {
    refresh(this);
    // interstitial.onAdEvent((type) => {
    //   if (type === AdEventType.LOADED) {
    //     this.setState({load: true});
    //     console.log("loading complete")
    //   }
    // });
    // interstitial.load();
  }

  render() {
    return (
      <Container>
        <Header
          style={[
            styles.headerTheme,
            {height: Platform.OS === 'ios' ? normalize(30) : normalize(20)},
          ]}>
          <Text style={{color: 'white', fontSize: normalize(10)}}>
            Updated at {this.state.moment} GTC
          </Text>
        </Header>
        <Header style={styles.headerTheme}>
          <Grid style={styles.gridContainer}>
            <Col style={styles.gridTop}>
              <Text style={styles.Title}>Confirmed</Text>
            </Col>
            <Col style={styles.gridTop}>
              <Text style={styles.Title}>Death</Text>
            </Col>
            <Col style={styles.gridTop}>
              <Text style={styles.Title}>Released</Text>
            </Col>
          </Grid>
        </Header>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <View style={styles.body}>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Global</Text>
              <Grid style={styles.girdDescription}>
                <Col style={styles.grid}>
                  <Text style={styles.highlight}>
                    {numberWithCommas(this.state.data.confirmed)}
                    {this.state.data.confirmed_prev && (
                      <Text style={[styles.blue, styles.sub]}>
                        {' '}
                        (+
                        {this.state.data.confirmed -
                          this.state.data.confirmed_prev}
                        )
                      </Text>
                    )}
                  </Text>
                </Col>
                <Col style={styles.grid}>
                  <Text style={styles.highlight}>
                    {numberWithCommas(this.state.data.death)}
                    {this.state.data.death_prev && (
                      <Text style={[styles.blue, styles.sub]}>
                        {' '}
                        (+{this.state.data.death - this.state.data.death_prev})
                      </Text>
                    )}
                    <Text style={[{color: 'gray'}, styles.sub]}>
                      {' '}
                      {(
                        (this.state.data.death * 100) /
                        this.state.data.confirmed
                      ).toPrecision(2)}
                      %
                    </Text>
                  </Text>
                </Col>
                <Col style={styles.grid}>
                  <Text style={styles.highlight}>
                    {numberWithCommas(this.state.data.released)}
                    {this.state.data.released_prev && (
                      <Text style={[styles.blue, styles.sub]}>
                        {' '}
                        (+
                        {this.state.data.released -
                          this.state.data.released_prev}
                        )
                      </Text>
                    )}
                    <Text style={[{color: 'gray'}, styles.sub]}>
                      {' '}
                      {(
                        (this.state.data.released * 100) /
                        this.state.data.confirmed
                      ).toPrecision(2)}
                      %
                    </Text>
                  </Text>
                </Col>
              </Grid>
            </View>
            {this.state.arr &&
              this.state.arr.map((item, index) => {
                return (
                  (!this.state.search ||
                    item.nation.includes(this.state.search)) && (
                    <View style={styles.sectionContainer}>
                      <Text style={styles.sectionTitle}>
                        {item.number}. {item.flag} {item.nation}
                      </Text>
                      <Grid style={styles.girdDescription}>
                        <Col style={styles.grid}>
                          <Text style={styles.highlight}>
                            {numberWithCommas(item.confirmed)}
                            {item.confirmed_prev && (
                              <Text style={[styles.blue, styles.sub]}>
                                {' '}
                                (+{item.confirmed - item.confirmed_prev})
                              </Text>
                            )}
                          </Text>
                        </Col>
                        <Col style={styles.grid}>
                          <Text style={styles.highlight}>
                            {numberWithCommas(item.death)}
                            {item.death_prev && (
                              <Text style={[styles.blue, styles.sub]}>
                                {' '}
                                (+{item.death - item.death_prev})
                              </Text>
                            )}
                            <Text style={[{color: 'gray'}, styles.sub]}>
                              {' '}
                              {(
                                (item.death * 100) /
                                item.confirmed
                              ).toPrecision(2)}
                              %
                            </Text>
                          </Text>
                        </Col>
                        <Col style={styles.grid}>
                          <Text style={styles.highlight}>
                            {numberWithCommas(item.released)}
                            {item.released_prev && (
                              <Text style={[styles.blue, styles.sub]}>
                                {' '}
                                (+{item.released - item.released_prev})
                              </Text>
                            )}
                            <Text style={[{color: 'gray'}, styles.sub]}>
                              {' '}
                              {(
                                (item.released * 100) /
                                item.confirmed
                              ).toPrecision(2)}
                              %
                            </Text>
                          </Text>
                        </Col>
                      </Grid>
                      {(index + 1) % 10 === 0 && (
                        <BannerAd
                          unitId={unitId}
                          size={BannerAdSize.FULL_BANNER}
                          requestOptions={{
                            requestNonPersonalizedAdsOnly: true,
                          }}
                          onAdLoaded={() => {
                            console.log('Advert loaded');
                          }}
                          onAdFailedToLoad={(error) => {
                            console.error('Advert failed to load: ', error);
                          }}
                        />
                      )}
                    </View>
                  )
                );
              })}
            {this.state.arr2 &&
              this.state.arr2.map((item, index) => {
                return (
                  (!this.state.search ||
                    item.nation.includes(this.state.search)) && (
                    <View style={styles.sectionContainer}>
                      <Text style={styles.sectionTitle}>
                        {item.number}. {item.flag} {item.nation}
                      </Text>
                      <Grid style={styles.girdDescription}>
                        <Col style={styles.grid}>
                          <Text style={styles.highlight}>
                            {numberWithCommas(item.confirmed)}
                            {item.confirmed_prev && (
                              <Text style={[styles.blue, styles.sub]}>
                                {' '}
                                (+{item.confirmed - item.confirmed_prev})
                              </Text>
                            )}
                          </Text>
                        </Col>
                        <Col style={styles.grid}>
                          <Text style={styles.highlight}>
                            {numberWithCommas(item.death)}
                            {item.death_prev && (
                              <Text style={[styles.blue, styles.sub]}>
                                {' '}
                                (+{item.death - item.death_prev})
                              </Text>
                            )}
                            <Text style={[{color: 'gray'}, styles.sub]}>
                              {' '}
                              {(
                                (item.death * 100) /
                                item.confirmed
                              ).toPrecision(2)}
                              %
                            </Text>
                          </Text>
                        </Col>
                        <Col style={styles.grid}>
                          <Text style={styles.highlight}>
                            {numberWithCommas(item.released)}
                            {item.released_prev && (
                              <Text style={[styles.blue, styles.sub]}>
                                {' '}
                                (+{item.released - item.released_prev})
                              </Text>
                            )}
                            <Text style={[{color: 'gray'}, styles.sub]}>
                              {' '}
                              {(
                                (item.released * 100) /
                                item.confirmed
                              ).toPrecision(2)}
                              %
                            </Text>
                          </Text>
                        </Col>
                      </Grid>
                      {(index + 1) % 10 === 0 && (
                        <BannerAd
                          unitId={unitId}
                          size={BannerAdSize.FULL_BANNER}
                          requestOptions={{
                            requestNonPersonalizedAdsOnly: true,
                          }}
                          onAdLoaded={() => {
                            console.log('Advert loaded');
                          }}
                          onAdFailedToLoad={(error) => {
                            console.error('Advert failed to load: ', error);
                          }}
                        />
                      )}
                    </View>
                  )
                );
              })}
            {this.state.more && !this.state.loading && (
              <View style={{margin: 10, alignItems: 'center'}}>
                <Button
                  rounded
                  style={{
                    justifyContent: 'center',
                    width: 170,
                    margin: 10,
                    backgroundColor: 'gray',
                  }}
                  onPress={() => {
                    this.setState({more: false});
                    refresh2(this);
                  }}>
                  <Text
                    adjustsFontSizeToFit
                    style={{
                      fontSize: 15,
                      fontWeight: 'bold',
                      color: 'white',
                    }}>
                    More
                  </Text>
                </Button>
              </View>
            )}
            {this.state.loading && <Spinner color="gray" />}
            <View style={styles.sectionContainer} />
          </View>
        </ScrollView>
        <Header
          searchBar
          rounded
          style={[styles.headerTheme, {height: normalize(35)}]}>
          <Item style={{borderRadius: 15, height: normalize(25)}}>
            <Input
              onChangeText={(text) => {
                this.setState({search: text});
              }}
            />
            <Button
              transparent
              onPress={() => {
                refresh(this);
                // interstitial.show();
              }}>
              <Text style={{color: 'black', paddingRight: 15}}>Refresh</Text>
            </Button>
          </Item>
        </Header>
      </Container>
    );
  }
}

const colors = {
  background: '#f5f5f5',
  background2: '#fff',
  background3: 'white',
  background4: '#d27d4f',
  label: '#000',
  label2: '#111',
  label3: 'black',
  label4: '#222',
  point: '#d27d4f',
};

const styles = StyleSheet.create({
  scrollView: {},
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {},
  sectionContainer: {
    marginTop: normalize(10),
  },
  Title: {
    fontSize: normalize(15),
    fontWeight: '600',
    color: 'white',
  },
  sectionTitle: {
    marginLeft: normalize(15),
    marginRight: normalize(15),
    fontSize: normalize(15),
    fontWeight: '600',
    color: '#eee',
    marginBottom: normalize(10),
    backgroundColor: '#555',
    borderRadius: 8,
    paddingLeft: 10,
  },
  girdDescription: {
    marginBottom: 2,
  },
  sectionDescription: {
    fontSize: normalize(14),
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
    fontSize: normalize(11),
  },
  sub: {
    fontSize: normalize(9),
  },
  blue: {
    color: 'blue',
  },
  red: {
    color: 'red',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
  headerTheme: {
    height: Platform.OS === 'ios' ? normalize(40) : normalize(25),
    backgroundColor: colors.label4,
    marginTop: -3,
  },
  gridTop: {
    fontSize: normalize(14),
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.label4,
  },
  grid: {
    fontSize: normalize(14),
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
