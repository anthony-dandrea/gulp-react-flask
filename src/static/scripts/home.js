import React from 'react';
import Copy from './components/text';
import Pic from './components/panda';

React.render(
    <div>
        <Pic />
        <Copy />
    </div>, document.getElementById('app'));

console.log(__('Newsroom'));