const firebaseApp = firebase.initializeApp(firebaseConfig = {
    apiKey: "AIzaSyBl8fFe50U63T8ku-k98RvuZ8lmqSMrjos",
    authDomain: "impactx-project.firebaseapp.com",
    projectId: "impactx-project",
    storageBucket: "impactx-project.firebasestorage.app",
    messagingSenderId: "980840939930",
    appId: "1:980840939930:web:2b0e9a8528afac42c5fa23",
    measurementId: "G-0GMZZKJ8BS"
  })

const db = firebaseApp.firestore();
const auth = firebaseApp.auth();

const register = () => {
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value

    auth.createUserWithEmailAndPassword(email, password)
    .then((res) => {
        console.log(res.user)
    })
    .catch((error) => {
        alert(error.message)
        console.log(error.code)
        console.log(error.message)
    })
}
const login = () => {
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value
    auth.signInWithEmailAndPassword(email, password)
    .then((res) => {
        console.log(res.user)
    })
    .catch((error) => {
        alert(error.message)
        console.log(error.code)
        console.log(error.message)
    })
}
