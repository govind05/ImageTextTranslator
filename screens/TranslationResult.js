import React from 'react';
import { Text, View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const dimensions = Dimensions.get('window')
export default class TranslationResult extends React.Component {
  static navigationOptions = {
    title: 'Result',
  };
  render() {
    const { sourceText, translatedText, translatedLanguage, sourceLanguage } = this.props.navigation.state.params;
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Icon name='done' size={55} color='#4CAF50' />
        <Text style={{ fontSize: 25, textAlign: 'center', color: '#333333' }}>
          Translated Successfully!
        </Text>
        <View style={{ marginTop: 25 }} >
          <Text style={styles.textLabel} >
            {"From " + sourceLanguage + ":".toUpperCase()}
          </Text>
          <View style={styles.text} >
            <Text style={styles.textData}>
              {sourceText}
            </Text>
          </View>
        </View>
        <Icon name='arrow-downward' size={55} style={{ marginTop: 15 }} />
        <View style={{ marginTop: 15 }}>
          <Text style={styles.textLabel}>
            {`To ${translatedLanguage}:`.toUpperCase()}
          </Text>
          <View style={styles.text}>
            <Text style={styles.textData}>
              {translatedText}
            </Text>
          </View>
        </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5
  },
  text: {
    marginTop: 15,
    borderWidth: 2,
    padding: 10,
    width: dimensions.width,
    marginLeft: 10,
    marginRight: 10,
  },
  textData: {
    fontSize: 20,
    color: '#333333'
  },
  textLabel: {
    color: '#999999',
    fontWeight: 'bold',
    textAlign: 'center'
  }
})