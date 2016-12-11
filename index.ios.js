/**
 * Sf2Resistance
 * @flow
 */

import React, { Component } from 'react'
import {
  AppRegistry,
  Button,
  Dimensions,
  Image,
  ListView,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View
} from 'react-native';

import FitImage from 'react-native-fit-image'

const Environment = require('./environment.js')

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
  },
  row: {
    borderColor: 'grey',
    borderWidth: 1,
    padding: 20,
    backgroundColor: '#fff',
    margin: 5,
  },
  text: {
    color: 'grey',
  },
  scrollview: {
  },
});

class Row extends React.Component {
  _onClick = () => {
    this.props.onClick(this.props.data)
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={this._onClick} >
        <View style={styles.row}>
          <Text style={styles.text}>
            {this.props.data}
          </Text>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

class HeaderImage extends React.Component {

  render() {
    return (
      <FitImage
        source={{uri: 'https://placekitten.com/g/400/100'}}
        originalWidth={400}
        originalHeight={100}
       />
    )
  }
}

export default class Sf2Resistance extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isRefreshing: false,
      loaded: 0,
      rowData: [],
    }
  }

  _onClick = (row) => {
    console.log('Clicked: ' + row)
  }

  componentDidMount() {
    this.fetchEvents().then((events) => {
      this.setState({
        loadingText: "",
        rowData: events,
      })
    })
  }

  fetchEvents() {
    return fetch('https://api.meetup.com/find/events?fields=group_category&key=' + Environment.meetupApiKey + '&sign=true').
      then((response) => { return response.json() }).
      then((json) => {
        console.log("Loaded events")
        const events = (json || []).reduce((all, event) => {
          if (event.group.category.shortname === "Social") {
            all.push(event.group.name)
          }
          return all
        }, [])
        return events
      }).
      catch((err) => {
        console.log("Error loading feed");
        console.log(err)
      })
  }

  render() {
    const rows = this.state.rowData.map((row, ii) => {
      return [<HeaderImage/>, <Row key={ii} data={row} onClick={this._onClick} />]
    })
    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefreshing}
              onRefresh={this._onRefresh}
              tintColor="#ff0000"
              title="Loading..."
              titleColor="#00ff00"
              colors={['#ff0000', '#00ff00', '#0000ff']}
              progressBackgroundColor="#ffff00"
            />
        }>
        {rows}
      </ScrollView>
      </View>
    )
  }

  _onRefresh = () => {
    this.setState({isRefreshing: true})
    this.fetchEvents().then((events) => {
      this.setState({
        loaded: this.state.loaded + 10,
        isRefreshing: false,
        rowData: events,
      })
    })
  }
}

AppRegistry.registerComponent('Sf2Resistance', () => Sf2Resistance);
