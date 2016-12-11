/**
 * Sf2Resistance
 * @flow
 */

import React, { Component } from 'react'
import {
  Alert,
  AppRegistry,
  Button,
  Image,
  ListView,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View
} from 'react-native';

import FitImage from 'react-native-fit-image'

const DeviceDimensions = require('./deviceDimensions.js')
const Environment = require('./environment.js')

const colors = {
  navyBlue: '#1B303F',
  skyBlue: '#65B9D5',
  slate: '#B9B7BC',
  red: '#BC4640',
  pink: '#C96F6D',
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
  },
  row: {
    borderBottomColor: 'grey',
    borderRightColor: 'grey',
    borderLeftColor: 'grey',
    borderWidth: 1,
    borderTopColor: colors.pink,
    borderTopWidth: 3,
    padding: 20,
    backgroundColor: '#fff',
    marginLeft: 5,
    marginRight: 5,
    marginBottom: 5,
  },
  headingText: {
    fontSize: 15,
    color: 'black',
  },
  text: {
    color: 'grey',
  },
  headerImage: {
    marginLeft: 5,
    marginRight: 5,
  },
  searchView: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'flex-start',
    margin: 5,
    paddingTop: 10,
    paddingBottom: 10,
  }
});

const eventsFeedUrl = Environment.eventsHostUrl + '/events.json'

class Row extends React.Component {
  _onClick = () => {
    this.props.onClick(this.props.data)
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={this._onClick} >
        <View style={styles.row}>
          <Text style={styles.headingText}>
            {this.props.data.name}
          </Text>
          <Text style={styles.text}>
            {this.props.data.startsAtDate}
          </Text>
          <Text style={styles.text}>
            {this.props.data.startsAtTime}
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
        source={{uri: this.props.data.imageUrl}}
        originalWidth={400}
        originalHeight={100}
        style={styles.headerImage}
       />
    )
  }
}

class TitleBar extends React.Component {
  render() {
    return(
      <Image
        source={require('./images/find-the-fight-logo-text.png')}
      />
    )
  }
}

class SearchBar extends React.Component {
  constructor(props) {
    super(props)
    this.state = { text: 'San Francisco, CA' }
  }

  _handleSearch = () => {
    Alert.alert('TODO: Handle search')
  }

  render() {
    return(
      <View style={styles.searchView}>
        <TextInput
          style={{height: 40, width: DeviceDimensions.vw(75), borderColor: 'grey', borderWidth: 1, padding: 5}}
          onChangeText={(text) => this.setState({text})}
          value={this.state.text}
        />
        <Button
          onPress={this._handleSearch}
          style={{ backgroundColor: colors.skyBlue }}
          title='Search'
          accessibilityLabel='Search for events'
        />
      </View>
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

  _parseDate = (dateString) => {
    const timeOptions = {
      hour : "numeric",
      minute : "numeric",
      timeZoneName : "short",
    }
    const dateOptions = {
      weekday : "short",
      month : "short",
      year : "numeric",
    }
    const parsed = new Date(dateString)
    const date = new Intl.DateTimeFormat('en-US', dateOptions).format(parsed)
    const time = new Intl.DateTimeFormat('en-US', timeOptions).format(parsed)
    return { date: date, time: time }
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
    return fetch(eventsFeedUrl).
      then((response) => { return response.json() }).
      then((json) => {
        console.log("Loaded events")
        if (!json) {
          return []
        } else {
          return (json.events || []).reduce((all, event) => {
            const startsAt = this._parseDate(event.starts_at)
            all.push(
              {
                name: event.name,
                imageUrl: event.image_url,
                startsAtDate: startsAt.date,
                startsAtTime: startsAt.time,
                cityName: event.city_name
              }
            )
            return all
          }, [])
        }
      }).
      catch((err) => {
        console.log("Error loading feed");
        console.log(err)
        return []
      })
  }

  render() {
    const rows = this.state.rowData.map((row, ii) => {
      return [
        <HeaderImage data={row} />,
        <Row key={ii} data={row} onClick={this._onClick} />
      ]
    })
    return (
      <View style={styles.container}>
        <TitleBar/>
        <SearchBar/>
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
