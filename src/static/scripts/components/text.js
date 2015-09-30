import React from 'react';

class Copy extends React.Component {
  render() {
    return (
      <div>
        <p>I am rendered with React & ES6 magic</p>
        <p>{__('Basic Information')}</p>
      </div>
    );
  }
}

export default Copy;
