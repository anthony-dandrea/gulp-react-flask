import React from 'react';
import Copy from './components/text';
import Pic from './components/panda';
import DisplayData from './components/data';

var json = JSON.parse(document.getElementById('data').getAttribute('data'));

React.render(
    <div>
        <Pic />
        <Copy />
        <DisplayData dataObj={json} />
    </div>,
    document.getElementById('app'));


console.log(json);
console.log(__('Newsroom'));