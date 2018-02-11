import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import RNTesseractOcr from 'react-native-tesseract-ocr';

export const convertImageToText = async (imagePath) => {
  const tessOptions = {
    whitelist: null,
    blacklist: '1234567890\'!"#$%&/()={}[]+*-_:;<>'
  };
  let text = '';
  console.log('Started Ocr:')
  RNTesseractOcr.recognize(imagePath, 'LANG_ENGLISH', tessOptions)
    .then(res => alert(res))
    .catch(err => console.log(err))
    .done();
}