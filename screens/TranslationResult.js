import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

export default class TranslationResult extends React.Component {
  state = {
    sourceText: '',
    translatedText: '',
  }
  componentWillMount(){
    this.getSourceText();
  }

  getSourceText = () => {
    this.setState({
      sourceText: this.props.navigation.state.params.sourceText,
      translatedText: this.props.navigation.state.params.translatedText,
    })
  }



  render() {
   
    return (
      <View>
        <Text>
          Original Text: {this.state.sourceText}
        </Text>
        <Text>
          Translated Text: {this.state.translatedText}
        </Text>
      </View>
    )
  }
}