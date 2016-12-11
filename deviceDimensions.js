import {Dimensions} from 'react-native';

const _DeviceDimensions = {
  vw: (percentageWidth) => {
    return Dimensions.get('window').width * (percentageWidth / 100);
  },
  vh: (percentageHeight) => {
    return Dimensions.get('window').height * (percentageHeight / 100);
  }
}

module.exports = _DeviceDimensions
