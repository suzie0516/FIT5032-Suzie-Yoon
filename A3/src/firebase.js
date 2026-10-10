
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyB-3fvS9DeYGQSzyJGZOiyUbWqgEZQ0YTg',
  authDomain: 'fit5032-67cf3.firebaseapp.com',
  projectId: 'fit5032-67cf3',
  storageBucket: 'fit5032-67cf3.firebasestorage.app',
  messagingSenderId: '847990876607',
  appId: '1:847990876607:web:a24bc030bcb8ee9106990a',
  measurementId: 'G-K8494YLL6E'
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

export { app, auth }
