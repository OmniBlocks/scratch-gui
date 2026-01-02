import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {createStore, combineReducers} from 'redux';
import {IntlProvider} from 'react-intl';

import GUI from './components/gui/gui.jsx';

// Create a basic Redux store
const initialState = {
    scratchGui: {
        vm: null // This would normally be the Scratch VM instance
    }
};

const rootReducer = combineReducers({
    scratchGui: (state = initialState.scratchGui, action) => state
});

const store = createStore(rootReducer);

// Render the application
ReactDOM.render(
    <Provider store={store}>
        <IntlProvider locale="en">
            <GUI />
        </IntlProvider>
    </Provider>,
    document.getElementById('app')
);

// Add some basic styling
document.body.style.margin = '0';
document.body.style.padding = '0';
document.body.style.fontFamily = '"Helvetica Neue", Helvetica, Arial, sans-serif';
