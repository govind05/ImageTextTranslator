import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  Picker,
  TouchableOpacity,
  Modal
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import { showImagePicker } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import * as RNFS from 'react-native-fs';

import { convertImageToText } from './components/tesseract';
import Translate from './screens/TranslationResult';
import { yandexTranslateAPI } from './screens/apikey';

export default class App extends Component {
  static navigationOptions = {
    title: 'ImageTextTranslator',
  };

  state = {
    image: null,
    language: 'Hindi',
    path: null,
    langCode: 'hi',
  }

  imagePickHandler = () => {
    const options = {
      title: 'Select Image',
      quality: 1.0,
      storageOptions: {
        skipBackup: true
      },
      maxHeight: 1000,
      maxWidth: 1000,
    }
    showImagePicker(options, (response) => {
      if (response.didCancel) {
        return;
      } else if (response.error) {
        return;
      } else {
        let source = { uri: response.uri };
        ImagePicker.openCropper({
          path: response.uri,
          freeStyleCropEnabled: true,
          hideBottomControls: true,
          showCropGuidelines: false,
          height: 1000,
          width: 1000,
        }).then(image => {
          const path = image.path.replace('file://', '')
          this.setState({
            image: { uri: image.path },
            path
          })
        })
          .catch(e => {
            this.setState({
              image: source,
              path: response.path
            })
          })
      }
    })

  }

  translateHandler = () => {

    convertImageToText(this.state.path)
      .then(res => this.getTranslatedText(res))
      .catch(err => console.log(err))

  }

  getTranslatedText = (text) => {
    let data = {
      q: text,
      target: this.state.langCode
    }
    text = text.split(/\n| /).join(' ');
    encodedText = encodeURI(text);
    fetch(yandexTranslateAPI + "&text=" + encodedText + "&lang=en-" + this.state.langCode)
      .then(res => res.json())
      .then(data => {
        console.log(data)
        this.props.navigation.navigate('Result', {
          translatedText: data.text[0],
          translatedLanguage: this.state.language,
          sourceText: text
        })
      })
      .catch(err => console.log(err));
    // this.props.navigation.navigate('Result', {
    //   translatedText: 'data.text[0]',
    //   translatedLanguage: this.state.language,
    //   sourceText: text,
    // })
  }

  render() {
    let languages = [{
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
      ? <View style={{ height: '95%', borderColor: '#333', borderWidth: 2, padding: 5, marginBottom: 8, backgroundColor: '#ccc' }}><Text style={{ fontSize: 25 }}>Image Placeholder</Text></View>
      : <Image source={this.state.image} style={{
        borderColor: '#333',
        width: '100%',
        height: '85%',
        resizeMode: Image.resizeMode.contain,
        marginBottom: 10,
        zIndex: 100,
      }} />;
    console.log(this.state);
    return (
      <View style={styles.container}>
        <View style={{ height: '100%', paddingTop: 15, width: '90%', flex: 2.4, alignItems: 'center', borderBottomColor: '#333', borderBottomWidth: 2 }}>
          <TouchableOpacity style={{ height: '100%', width: '100%' }} onPress={this.imagePickHandler} >
            {image}
          </TouchableOpacity>
        </View>
        <View style={{ flex: 0.3, flexDirection: 'row', height: '80%', width: '90%', paddingHorizontal: 20, paddingTop: 15, justifyContent: 'space-between', borderBottomWidth: 2, borderBottomColor: '#333', paddingBottom: 15 }}>
          <Text style={{ fontSize: 20, paddingTop: 10 }} >Language:</Text>
          <Picker
            selectedValue={this.state.langCode}
            prompt='Select translation language'
            style={{ backgroundColor: '#ccc', elevation: 5, width: '60%', }}
            onValueChange={(itemValue, itemIndex) => this.setState({ langCode: itemValue, language: languages[itemIndex].label })}>
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
