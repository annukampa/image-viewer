import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './common/header/header.css';
import Controller from './common/controller';

ReactDOM.render(
    <React.StrictMode>
        <div>
            <Controller />
        </div>
    </React.StrictMode>,
    document.getElementById('root')
);