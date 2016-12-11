/**
 * Sf2Resistance
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  Button,
  ListView,
  StyleSheet,
  Text,
  View
} from 'react-native';

const Environment = require('./environment.js')

export default class Sf2Resistance extends Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      loadingText: "Loading...",
      dataSource: ds.cloneWithRows([])
    };
  }

  componentDidMount() {
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.fetchEvents().then((events) => {
      this.setState({
        loadingText: "",
        dataSource: ds.cloneWithRows(events)
      })
    })
  }

  fetchEvents() {
    return fetch('https://api.meetup.com/find/events?fields=group_category&key=' + Environment.meetupApiKey + '&sign=true').
      then((response) => { return response.json() }).
      then((json) => {
        console.log("Loaded events")
        const events = (json || []).reduce((all, event) => {
          console.log(event.group.category)
          if (event.group.category.shortname === "Social") {
            all.push(event.group.name)
          }
          return all
        }, [])
        return events
      }).
      catch((err) => {
        console.log("Error loading feed");
        console.log(err);
      })
  }

  reloadFeed() {
    console.log("Refreshing feed");
    this.fetchEvents().then((events) => {
      this.setState({
        loadingText: "",
        dataSource: this.state.dataSource.cloneWithRows(events)
      })
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>{this.state.loadingText}</Text>
        <ListView
          enableEmptySections={true} //https://github.com/FaridSafi/react-native-gifted-listview/issues/39
          dataSource={this.state.dataSource}
          renderRow={(rowData) => <Text>{rowData}</Text>}
        />

        <Button
          onPress={this.reloadFeed.bind(this)}
          title="Refresh"
          color="#65B9D5"
          accessibilityLabel="Tap to refresh the feed"
        />

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('Sf2Resistance', () => Sf2Resistance);
