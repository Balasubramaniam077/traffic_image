import {StyleSheet} from 'react-native';
import {Dimensions} from 'react-native';

const {width, height} = Dimensions.get('screen');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '50%',
    alignSelf: 'center',
    top: '130%',
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    width: 150,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  imageWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  PredictBtn: {
    borderRadius: 10,
    width: 300,
    height: 40,
    backgroundColor: '#34B27B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  LogoutBtn: {
    borderRadius: 10,
    width: '20%',
    height: 40,
    backgroundColor: 'red',
    minuMidth: 70,
    position: 'absolute',
    top: 20,
    right: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectArea: {
    width: width / 1.2,
    height: height / 5,
    borderWidth: 2,
    borderStyle: 'dotted',
    borderColor: '#000',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imgcontainer: {
    width: '90%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
