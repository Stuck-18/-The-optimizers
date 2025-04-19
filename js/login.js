// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC2C2dq3RwYQeUGGA8MzLgxtudcnL_dKuo",
    authDomain: "launchpad-2ab08.firebaseapp.com",
    projectId: "launchpad-2ab08",
    storageBucket: "launchpad-2ab08.firebasestorage.app",
    messagingSenderId: "974657612108",
    appId: "1:974657612108:web:adbc2eb0183ca5996687e9",
    measurementId: "G-Y3B565L6E0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// DOM Elements
const loginForm = document.getElementById('loginForm');
const errorMessage = document.getElementById('errorMessage');

// Function to redirect based on user role
async function redirectBasedOnRole(user) {
    try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            switch(userData.role) {
                case 'startup':
                    window.location.href = 'founderdashboard.html';
                    break;
                case 'investor':
                    window.location.href = 'investordashboard.html';
                    break;
                case 'mentor':
                    window.location.href = 'mentordashboard.html';
                    break;
                default:
                    window.location.href = 'index.html';
            }
        }
    } catch (error) {
        console.error('Error getting user role:', error);
        window.location.href = 'index.html';
    }
}

// Handle form submission
loginForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    errorMessage.style.display = 'none';

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        await redirectBasedOnRole(user);
    } catch (error) {
        console.error('Login error:', error);
        errorMessage.textContent = error.message;
        errorMessage.style.display = 'block';
    }
});

// Check auth state
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log('User already signed in:', user.email);
    }
});

// ... existing code ...