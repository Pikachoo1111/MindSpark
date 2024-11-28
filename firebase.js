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
    const role = document.getElementById('role').value

    

    auth.createUserWithEmailAndPassword(email, password)
    .then((res) => {
        console.log(res.user)
            db.collection('users')
        .add({
            email: email,
            role: role
        })
        .then((docRef) => {
            console.log('Email:Role pair written with ID: ', docRef.id)
            if(role == 'teacher') {
                window.location.href = '../../teacher-dashboard/teacher-dashboard.html';
            } else {
                window.location.href = '../../student-dashboard/student-dashboard.html';
            }
        })
        .catch((error) => {
            console.error('Error adding document: ', error)
        })
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
        db.collection("users").where("email", "==", email)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    console.log(doc.id, " => ", doc.data());
                    if(doc.data().role == 'teacher') {
                        window.location.href = '../../teacher-dashboard/teacher-dashboard.html';
                    } else {
                        window.location.href = '../../student-dashboard/student-dashboard.html';
                    }
                });
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
            });
    })
    .catch((error) => {
        alert(error.message)
        console.log(error.code)
        console.log(error.message)
    })
}

const createClassroom = () => {
    const email = auth.currentUser.email;
    // const classCode = 
}
