import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  Picker
} from 'react-native';
import { showImagePicker } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Ionicons';

import * as tesseract from './components/tesseract';
import Translate from './screens/TranslationResult';
import {Key} from './screens/apikey';

export default class App extends Component {
  static navigationOptions = {
    title: 'ImageTextTranslator',
  };

  state = {
    image: null,
    language: '',
    path: null
  }

  imagePickHandler = () => {
    const options = {
      title: 'Select Image',
      quality: 1.0,
      storageOptions: {
        skipBackup: true
      },
      maxHeight: 320,
      maxWidth: 240
    }

    showImagePicker(options, (response) => {
      if (response.didCancel) {
        return;
      } else if (response.error) {
        return;
      } else {
        let source = { uri: response.uri };
        console.log(source);
        this.setState({
          image: source,
          path: response.path
        });
      }
    })
  }

  translateHandler = () => {

    tesseract.convertImageToText(this.state.path)
      .then(res => this.getTranslatedText(res))
      .catch(err => console.log(err))
      .done();
      // console.log(text);
      // Translate.ge
      ;
  }

  getTranslatedText = (text) => {
    console.log(text);
    let data = {
      q: text,
      target: this.state.language
    }
    fetch('https://translation.googleapis.com/language/translate/v2?key=' + Key, {
      method: 'POST',
      body: JSON.stringify(data),
    })
      .then(res => res.json())
      .then(data => {
        console.log(data)
        this.props.navigation.navigate('Result', {
          translatedText: data.data.translations[0].translatedText,
          sourceText: text
        })
      })
      .catch(err => console.log(err));


  }

  render() {
    console.log(this.state.path)
    let languages = [{
      label: 'English', value: 'en'
    }, {
      label: 'Hindi', value: 'hi'
    }, {
      label: 'French', value: 'fr'
    }, {
      label: 'German', value: 'de'
    }];

    let pickerItem = languages.map(language => (
      <Picker.Item key={language.value} label={language.label} value={language.value} />
    ));

    let image = this.state.image === null
      ? <View style={{ height: '85%', borderColor: '#333', borderWidth: 2, padding: 5, marginBottom: 8, backgroundColor: '#ccc' }}><Text style={{ fontSize: 25 }}>Image Placeholder</Text></View>
      : <Image source={this.state.image} style={{
        borderColor: '#333',
        width: '100%',
        height: '85%',
        resizeMode: Image.resizeMode.contain,
        marginBottom: 10
      }} />;

    return (
      <View style={styles.container}>
        <View style={{ height: '100%', paddingTop: 15, width: '90%', flex: 2.4, alignItems: 'center', borderBottomColor: '#333', borderBottomWidth: 2 }}>
          {image}
          <Icon.Button name="md-image" size={30} style={{ width: 170 }} onPress={this.imagePickHandler}>
            <Text style={{ fontSize: 20 }}>Pick Image</Text>
          </Icon.Button>
        </View>
        <View style={{ flex: 0.3, flexDirection: 'row', height: '80%', width: '90%', paddingHorizontal: 20, paddingTop: 15, justifyContent: 'space-between', borderBottomWidth: 2, borderBottomColor: '#333', paddingBottom: 15 }}>
          <Text style={{ fontSize: 20, paddingTop: 10 }} >Language:</Text>
          <Picker
            selectedValue={this.state.language}
            prompt='Select translation language'
            style={{ backgroundColor: '#ccc', elevation: 5, width: '60%', }}
            onValueChange={(itemValue, itemIndex) => this.setState({ language: itemValue })}>
            {pickerItem}
          </Picker>
        </View>
        <View style={{ flex: 0.5, paddingTop: 20 }}>
          <Icon.Button name='ios-arrow-dropright' size={30} style={{ width: 170 }} onPress={this.translateHandler}>
            <Text style={{ fontSize: 20 }}>Translate</Text>
          </Icon.Button>
        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    zIndex: 1
  },

});
