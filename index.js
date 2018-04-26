import { AppRegistry } from 'react-native';
import { StackNavigator } from 'react-navigation';

import App from './App';
import TranslationResult from './screens/TranslationResult';

const RootStack = StackNavigator({
  Home:{
    screen: App,
  },
  Result: {
    screen: TranslationResult
  }
})

AppRegistry.registerComponent('ImageTextTranslator', () => RootStack);
