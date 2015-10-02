import React from 'react';

var MyComponent = React.createClass({
  render: function() {
    return <div>{'meow ' + this.props.name}</div>;
  }
});

// React.render(<MessageBox name="Rogers"/>, document.getElementById('app'));

module.exports = MyComponent;
