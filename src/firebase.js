import firebase from 'firebase/app'
import 'firebase/app'
import 'firebase/database'
import 'firebase/auth'
import 'firebase/storage'

const config = {
    apiKey: "AIzaSyC0FH77OpfsS_mvjC9LE79Ho5hM6TX2QX8",
    authDomain: "m-city-34d36.firebaseapp.com",
    databaseURL: "https://m-city-34d36.firebaseio.com",
    projectId: "m-city-34d36",
    storageBucket: "m-city-34d36.appspot.com",
    messagingSenderId: "285766494647"
  };

  firebase.initializeApp(config);

  const firebaseDB = firebase.database();
  const firebaseMatches = firebaseDB.ref('matches');
  const firebasePromotions = firebaseDB.ref('promotions')
  const firebaseTeams = firebaseDB.ref('teams')
  const firebasePlayers = firebaseDB.ref('players')

  export {
      firebase,
      firebaseMatches,
      firebasePromotions,
      firebaseTeams,
      firebaseDB,
      firebasePlayers
      
  }