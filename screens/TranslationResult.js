import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

class TranslationResult extends React.Component {
  state = {
    sourceText: '',
    translatedText: '',
    language: ''
  }

  getSourceText = () => {
    this.setState({
      sourceText,
      language,
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