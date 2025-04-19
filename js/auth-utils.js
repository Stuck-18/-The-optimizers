// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
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

// Page access configuration
const pageAccess = {
    'index.html': ['public'],
    'login.html': ['public'],
    'register.html': ['public'],
    'founderdashboard.html': ['startup'],
    'investordashboard.html': ['investor'],
    'mentordashboard.html': ['mentor'],
    'submit-pitch.html': ['startup'],
    'view-pitches.html': ['investor', 'mentor'],
    'profile.html': ['startup', 'investor', 'mentor'],
    'aboutus.html': ['public'],
    'contactus.html': ['public']
};

// Role-specific redirects
const roleDefaultPages = {
    'startup': 'founderdashboard.html',
    'investor': 'investordashboard.html',
    'mentor': 'mentordashboard.html'
};

// Function to get current page name
function getCurrentPage() {
    return window.location.pathname.split('/').pop() || 'index.html';
}

// Function to check if page is public
function isPublicPage(pageName) {
    return pageAccess[pageName]?.includes('public') || false;
}

// Function to check if user has access to page
async function checkPageAccess(user, pageName) {
    if (isPublicPage(pageName)) return true;
    
    if (!user) return false;
    
    try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (!userDoc.exists()) return false;
        
        const userRole = userDoc.data().role;
        return pageAccess[pageName]?.includes(userRole) || false;
    } catch (error) {
        console.error('Error checking page access:', error);
        return false;
    }
}

// Function to redirect user based on role
async function redirectToDefaultPage(user) {
    try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (!userDoc.exists()) return;
        
        const userRole = userDoc.data().role;
        const defaultPage = roleDefaultPages[userRole];
        
        if (defaultPage) {
            window.location.href = defaultPage;
        }
    } catch (error) {
        console.error('Error redirecting user:', error);
    }
}

// Main function to check authorization
export function initializeAuthCheck() {
    const currentPage = getCurrentPage();
    
    onAuthStateChanged(auth, async (user) => {
        const hasAccess = await checkPageAccess(user, currentPage);
        
        if (!hasAccess) {
            if (user && !isPublicPage(currentPage)) {
                // User is logged in but doesn't have access - redirect to their default page
                await redirectToDefaultPage(user);
            } else if (!user && !isPublicPage(currentPage)) {
                // User is not logged in and page is not public - redirect to login
                window.location.href = 'login.html';
            }
        }
    });
}

// Function to get user role
export async function getUserRole(user) {
    if (!user) return null;
    
    try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        return userDoc.exists() ? userDoc.data().role : null;
    } catch (error) {
        console.error('Error getting user role:', error);
        return null;
    }
} 