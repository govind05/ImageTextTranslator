import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  Picker,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import { showImagePicker } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import { convertImageToText, tesseractStop } from './components/tesseract';
import Translate from './screens/TranslationResult';
import { googleTranslateAPI, googleDetectionAPI } from './screens/apikey';

export default class App extends Component {
  static navigationOptions = {
    title: 'ImageTextTranslator',
  };

  state = {
    image: null,
    language: 'Hindi',
    path: null,
    langCode: 'hi',
    loading: false,
    loadingText: 'Extracting Text...',
    detectedLang: 'LANG_CUSTOM'
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
    this.setState({
      loading: true
    }, () => {
      setTimeout(() => {
        convertImageToText(this.state.path, this.state.detectedLang)
          .then(res => {
            this.setState({
              loadingText: "Translating Text..."
            })
            this.getTranslatedText(res)
          })
          .catch(err => {
            this.setState({
              loading: false
            })
            console.log(err)
          })
      }, 100)
    }
    )
  }

  getTranslatedText = (text) => {
    const { langCode, language, detectedLang } = this.state;
    const source = detectedLang == 'LANG_CUSTOM' ? 'kn' : 'en';

    let data = {
      q: text,
      source,
      target: langCode,
      format: 'text'
    }
    text = text.split(/\n| /).join(' ');
    encodedText = encodeURI(text);
    fetch(googleTranslateAPI, {
      method: 'POST',
      body: JSON.stringify(data),
    })
      // fetch(yandexTranslateAPI + "&text=" + encodedText + "&lang=en-" + langCode)
      .then(res => res.json())
      .then(dataGoogle => {
        console.log('Inside if response.', dataGoogle)
        this.resetState();
        this.props.navigation.navigate('Result', {
          // translatedText: dataYandex.text[0],
          translatedText: dataGoogle.data.translations[0].translatedText,
          translatedLanguage: language,
          sourceText: text,
          sourceLanguage: source == 'kn' ? 'Kannada' : 'English'
        })
      })
      .catch(err => {
        alert('Network Error! Please try again later.')
        this.resetState();
      })
  }


  resetState = () => {
    this.setState({
      image: null,
      language: 'Hindi',
      path: null,
      langCode: 'hi',
      loading: false,
      loadingText: 'Extracting Text...'
    })
  }
  render() {
    let languages = [{
      label: 'Hindi', value: 'hi'
    }, {
      label: 'English', value: 'en'
    }, {
      label: 'French', value: 'fr'
    }, {
      label: 'German', value: 'de'
    }, {
      label: 'Spanish', value: 'es'
    },];
    let inputLang = [{
      label: 'English', value: 'LANG_ENGLISH'
    }, {
      label: 'Kannada', value: 'LANG_CUSTOM'
    }];

    let pickerItem = languages.map(language => (
      <Picker.Item color='#333' key={language.value} label={language.label} value={language.value} />
    ));
    let pickerItemDetect = inputLang.map(language => (
      <Picker.Item color='#333' key={language.value} label={language.label} value={language.value} />
    ));
    let image = this.state.image === null ?
      <View style={styles.placeholderText}>
        <View style={{ width: 100 }} >
          <Text style={{
            fontSize: 25,
            textAlign: 'center'
          }}>
            Tap to add Image
          </Text>
        </View>
      </View> :
      <Image
        source={this.state.image}
        style={{
          borderColor: '#333',
          width: '100%',
          height: '85%',
          resizeMode: Image.resizeMode.contain,
          marginBottom: 10,
          zIndex: 100,
        }} />;
    // console.log(this.state);
    return (
      <View style={styles.container}>
        <Modal
          hardwareAccelerated={true}
          transparent={true}
          animationType='slide'
          visible={this.state.loading}
          onRequestClose={() => {
            if (this.state.loadingText = 'Extracting Text...') {
              tesseractStop()
                .then(() => {
                  this.resetState()
                })
                .catch(e => this.resetState())
            } else {
              this.resetState();
            }
          }}>
          <View style={styles.modal}>
            <View style={{ paddingBottom: 20, }} >
              <Text style={{
                color: '#999999',
                fontWeight: 'bold',
                textAlign: 'center',
                fontSize: 16,
              }}>
                {this.state.loadingText.toUpperCase()}
              </Text>
            </View>
            <ActivityIndicator size={65} />
          </View>
        </Modal>
        <View style={{ height: '100%', paddingTop: 15, width: '90%', flex: 2.4, alignItems: 'center', borderBottomColor: '#333', borderBottomWidth: 2 }}>
          <TouchableOpacity style={{ height: '100%', width: '100%' }} onPress={this.imagePickHandler} >
            {image}
          </TouchableOpacity>
        </View>
        <Text style={{ fontSize: 20, paddingTop: 10 }} >Image Language:</Text>
        <Picker
          selectedValue={this.state.detectedLang}
          prompt='Select input language'
          style={{ backgroundColor: '#fff', elevation: 5, width: '60%', marginLeft: 20 }}
          onValueChange={(itemValue, itemIndex) => this.setState({ detectedLang: itemValue })}>
          {pickerItemDetect}
        </Picker>
        <Text style={{ fontSize: 20, paddingTop: 10 }} >Translated Language:</Text>
        <Picker
          selectedValue={this.state.langCode}
          prompt='Select translation language'
          style={{ backgroundColor: '#fff', elevation: 5, width: '60%', marginLeft: 20 }}
          onValueChange={(itemValue, itemIndex) => this.setState({ langCode: itemValue, language: languages[itemIndex].label })}>
          {pickerItem}
        </Picker>
        <View style={{ flex: 0.5, paddingTop: 20 }}>
          <Icon.Button
            name='ios-arrow-dropright'
            size={30}
            style={{ width: 170 }}
            onPress={() => {
              if (this.state.image === null || this.state.path === null) {
                alert('Please select an image!');
                return;
              }
              this.translateHandler()
            }}
            disabled={this.state.loading}
          >
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
  modal: {
    display: 'flex',
    alignSelf: 'center',
    top: '40%',
    width: '80%',
    backgroundColor: 'white',
    padding: 30,
    elevation: 20,
  },
  placeholderText: {
    height: '95%',
    borderColor: '#333',
    borderWidth: 2,
    padding: 5,
    marginBottom: 8,
    backgroundColor: '#ccc',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
});
