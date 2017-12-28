import App from './components/App'
import React from 'react';
import ReactDOM from 'react-dom'
import firebase from 'firebase'

require("../sass/style.scss");

function initFirebase() {
  var config = {
    apiKey: "AIzaSyC_txshXQF3h4Q3e1nZYqQJna1iFNzWUaU",
    authDomain: "nmn-test.firebaseapp.com",
    databaseURL: "https://nmn-test.firebaseio.com",
    projectId: "nmn-test",
    storageBucket: "nmn-test.appspot.com",
    messagingSenderId: "223988406369"
  };
  firebase.initializeApp(config);
}

function initReact() {
  if (process.env.NODE_ENV === 'development') {
    const { AppContainer } = require('react-hot-loader');
    const surveyDataRef = firebase.storage().ref('/data/survey-data-2017-12-13.json');
    const render = Component => {
      ReactDOM.render((
        <AppContainer>
          <Component surveyDataRef={surveyDataRef}/>
        </AppContainer>
      ), document.getElementById('root'));
    }

    render(App);

    // Hot Module Replacement API
    if (module.hot) {
      module.hot.accept('./components/App', () => { render(App) });
    }
  } else {
    const devicesDbRef = firebase.database().ref('/devices');
    ReactDOM.render((
      <App devicesDbRef={devicesDbRef}/>
    ), document.getElementById('root'));
  }
}

function init() {
  initFirebase();

  // Ensure login.
  firebase.auth().onAuthStateChanged(function(user) {
    // No user is signed in.
    if (!user) {
	 const provider = new firebase.auth.GoogleAuthProvider();
	 firebase.auth().signInWithRedirect(provider);
    }
  });

  initReact();
}

document.addEventListener('DOMContentLoaded', init);
