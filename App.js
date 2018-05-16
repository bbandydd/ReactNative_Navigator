import React, { Component } from 'react';
import { View, Text, NativeModules, Platform, Button, ScrollView } from 'react-native';

import {
  StackNavigator,
} from 'react-navigation';
import getSlideFromRightTransition from 'react-navigation-slide-from-right-transition';
import Icon from 'react-native-vector-icons/dist/FontAwesome';

const getLanguageCode = () => {
  let systemLanguage = 'en';
  if (Platform.OS === 'android') {
    systemLanguage = NativeModules.I18nManager.localeIdentifier;
  } else {
    systemLanguage = NativeModules.SettingsManager.settings.AppleLocale;
  }
  const languageCode = systemLanguage.substring(0, 2);
  return languageCode;
}

class MainScreen extends React.Component {
  static navigationOptions = ({navigation}) => ({
    title: 'Layer1'
  })

  render() {
    const { navigate } = this.props.navigation;
    return (
      <ScrollView style={{ flex: 1 }}>
        <View style={{ backgroundColor: 'red', height: 200 }}>
          <Text>System Locale: {getLanguageCode()}</Text>
        </View>
        <View style={{ backgroundColor: 'green', height: 200 }}></View>
        <View style={{ backgroundColor: 'blue', height: 200 }}></View>
        <View style={{ backgroundColor: 'yellow', height: 200 }}></View>
        <Button
          title="Go to profile"
          onPress={() =>
            navigate('Profile', { name: 'Jane' })
          }
        >
        </Button>
        <View style={{ backgroundColor: 'pink', height: 200 }}></View>
      </ScrollView>
    );
  }
}

class ProfileScreen extends React.Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: 'Layer2',
      headerLeft: <View />,
      headerRight: <Icon name="close" size={30} onPress={() => navigation.goBack()} />,
    }
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <Button
        title="Go to Test"
        onPress={() =>
          navigate('Test', { name: 'Jane' })
        }
      />
    );
  }
}

class TestScreen extends React.Component {
  static navigationOptions = ({navigation}) => ({
    title: 'Layer3',
  })

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View>
        <Text>Hello</Text>
      </View>
    );
  }
}

let preRoute = '';
let curRoute = '';

const App = StackNavigator({
  Main: { screen: MainScreen },
  Profile: { screen: ProfileScreen },
  Test: { screen: TestScreen },
}, {
  transitionConfig: (props) => {
    const Layer3 = ['Test'];

    if (!preRoute) preRoute = props.scene.route.routeName;
    if (!curRoute) curRoute = props.scene.route.routeName;

    if (curRoute !== props.scene.route.routeName) {
      preRoute = curRoute;
      curRoute = props.scene.route.routeName;
    }

    if (
      Layer3.includes(curRoute) ||  // layer2 -> layer3
      Layer3.includes(preRoute)  // layer3 -> layer2
    ) return getSlideFromRightTransition();

    return;
  }
});

export default App;
