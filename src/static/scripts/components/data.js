import React from 'react';

class DisplayData extends React.Component {

    render() {
        return (
            <p>{this.props.dataObj.data}</p>
        );
    }
}

export default DisplayData;
