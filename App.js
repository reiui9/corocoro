/* eslint-disable react-native/no-inline-styles */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {
  Container,
  Header,
  Grid,
  Col,
  Item,
  Icon,
  Input,
  Button,
} from 'native-base';
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
import {Colors} from 'react-native/Libraries/NewAppScreen';
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

function numberWithCommas(x) {
  if (!x) {
    return '';
  }
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
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
      <Container>
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
              <Grid>
                <Col style={styles.grid}>
                  <Text style={styles.highlight}>
                    {numberWithCommas(this.state.data.confirmed)}
                    {this.state.data.confirmed_prev && (
                      <Text style={styles.blue}>
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
                      <Text style={styles.blue}>
                        {' '}
                        (+{this.state.data.death - this.state.data.death_prev})
                      </Text>
                    )}
                  </Text>
                </Col>
                <Col style={styles.grid}>
                  <Text style={styles.highlight}>
                    {numberWithCommas(this.state.data.released)}
                    {this.state.data.released_prev && (
                      <Text style={styles.blue}>
                        {' '}
                        (+
                        {this.state.data.released -
                          this.state.data.released_prev}
                        )
                      </Text>
                    )}
                  </Text>
                </Col>
              </Grid>
            </View>
            {this.state.arr.map((item, index) => {
              return (
                (!this.state.search ||
                item.nation.includes(this.state.search)) && (
                  <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>
                      {item.number}. {item.flag} {item.nation}
                    </Text>
                    <Grid>
                      <Col style={styles.grid}>
                        <Text style={styles.highlight}>
                          {numberWithCommas(item.confirmed)}
                          {item.confirmed_prev && (
                            <Text style={styles.blue}>
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
                            <Text style={styles.blue}>
                              {' '}
                              (+{item.death - item.death_prev})
                            </Text>
                          )}
                        </Text>
                      </Col>
                      <Col style={styles.grid}>
                        <Text style={styles.highlight}>
                          {numberWithCommas(item.released)}
                          {item.released_prev && (
                            <Text style={styles.blue}>
                              {' '}
                              (+{item.released - item.released_prev})
                            </Text>
                          )}
                        </Text>
                      </Col>
                    </Grid>
                  </View>
                )
              );
            })}
          </View>
        </ScrollView>
        <Header searchBar rounded style={[styles.headerTheme]}>
          <Item style={{marginTop: 5, borderRadius: 15, height: normalize(30)}}>
            <Input
              onChangeText={(text) => {
                this.setState({search: text});
              }}
            />
              <Text style={{color: 'black', paddingRight: 15}}>Search</Text>
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
    paddingHorizontal: 24,
  },
  Title: {
    fontSize: normalize(15),
    fontWeight: '600',
    color: 'white',
  },
  sectionTitle: {
    fontSize: normalize(15),
    fontWeight: '600',
    color: '#eee',
    marginBottom: normalize(10),
    backgroundColor: '#555',
    borderRadius: 8,
    paddingLeft: 10,
  },
  sectionDescription: {
    fontSize: normalize(13),
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  blue: {
    color: 'blue',
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
    margin: 5,
    padding: 5,
    height: Platform.OS === 'ios' ? normalize(40) : normalize(25),
    backgroundColor: colors.label4,
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
