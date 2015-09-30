import React from 'react';
import _img from '../lib/images';

class Pic extends React.Component {
  render() {
    return (
      <img src={_img('panda.jpg')} alt={__('panda')}/>
    );
  }
}

export default Pic;
