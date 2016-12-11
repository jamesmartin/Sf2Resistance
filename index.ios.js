/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  Button,
  StyleSheet,
  Text,
  ListView,
  View
} from 'react-native';

export default class Sf2Resistance extends Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      reloaded: false,
      dataSource: ds.cloneWithRows(this.fetchEvents())
    };
  }

  fetchEvents() {
    //fetch('https://api.github.com').
    fetch('http://www.politicaleventscalendar.org/pec/index.cfm').
    then((response) => {
      console.log("Hello");
      console.log(response);
    }).
    catch((err) => {
      console.log("Error loading feed");
      console.log(err);
    })

    return ['Foo', 'Bar', 'Baz', 'Quux'];
  }

  reloadFeed() {
    console.log("Refreshing feed");
    let newDataSource = ['A', 'B', 'C']
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(newDataSource)
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <ListView
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
      // show events from http://www.politicaleventscalendar.org/pec/index.cfm
      /**<View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to React Native!
        </Text>
        <Text style={styles.instructions}>
          To get started, edit index.ios.js
        </Text>
        <Text style={styles.instructions}>
          Press Cmd+R to reload,{'\n'}
          Cmd+D or shake for dev menu
        </Text>
      </View>
      **/
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
