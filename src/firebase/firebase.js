import firebase from 'firebase';
import 'firebase/storage';


var firebaseConfig = {
  apiKey: 'AIzaSyCbPnZw-kQq42zuCPEyuHMlWg34wJXFwUI',
  authDomain: 'mft-app-946c4.firebaseapp.com',
  projectId: 'mft-app-946c4',
  storageBucket: 'mft-app-946c4.appspot.com',
  messagingSenderId: '856505605435',
  appId: '1:856505605435:web:7021e7e18c5d85c064ab1e',
  measurementId: 'G-8N39BY4NPF'
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

export default firebase;
