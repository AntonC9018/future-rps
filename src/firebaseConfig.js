import firebase from 'firebase'
import 'firebase/firestore'

const config = {
  apiKey: "AIzaSyAcH2YFC9m8eOM_MGZrA0e2Ujz1OkW4kG0",
  authDomain: "future-ec0de.firebaseapp.com",
  databaseURL: "https://future-ec0de.firebaseio.com",
  projectId: "future-ec0de",
  storageBucket: "future-ec0de.appspot.com",
  messagingSenderId: "636007588592",
  appId: "1:636007588592:web:36d2a643c76325b45a1835",
  measurementId: "G-BPEW4KYSRX"
}

// firebase utils
const db = firebase.firestore()
const auth = firebase.auth()
const currentUser = auth.currentUser

// date issue fix according to firebase
const settings = {
  timestampsInSnapshots: true
}
db.settings(settings)

// firebase collections
const usersCollection = db.collection('users')
const postsCollection = db.collection('posts')
const commentsCollection = db.collection('comments')
const likesCollection = db.collection('likes')

export {
  db,
  auth,
  currentUser,
  usersCollection,
  postsCollection,
  commentsCollection,
  likesCollection
}