// auth.js
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { app } from "./firebase-config.js";

const auth = getAuth(app);
const db = getFirestore(app);

// Handle login form submission
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Get user role from Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            redirectBasedOnRole(userData.role);
        } else {
            console.error("User document not found");
            // Handle error or redirect to profile setup
        }
    } catch (error) {
        console.error("Login error:", error);
        alert("Login failed: " + error.message);
    }
});

// Redirect based on user role
function redirectBasedOnRole(role) {
    switch(role) {
        case 'founder':
            window.location.href = 'founderdashboard.html';
            break;
        case 'investor':
            window.location.href = 'investordashboard.html';
            break;
        case 'mentor':
            window.location.href = 'mentordashboard.html';
            break;
        default:
            console.error("Unknown role:", role);
            // Redirect to default dashboard or profile setup
            window.location.href = 'dashboard.html';
    }
}

// Check auth state on page load
onAuthStateChanged(auth, async (user) => {
    if (user) {
        // User is signed in
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            
            // Prevent access to wrong dashboard
            const currentPage = window.location.pathname.split('/').pop();
            const allowedPages = {
                'founder': ['founderdashboard.html', 'profile.html'],
                'investor': ['investordashboard.html', 'profile.html'],
                'mentor': ['mentordashboard.html', 'profile.html']
            };
            
            if (!allowedPages[userData.role]?.includes(currentPage)) {
                redirectBasedOnRole(userData.role);
            }
            
            updateAuthUI(user, userData.role);
        }
    } else {
        // User is signed out
        updateAuthUI(null);
    }
});

// Update UI based on auth state and role
function updateAuthUI(user, role) {
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const profileBtn = document.getElementById('profileBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const dashboardLink = document.getElementById('dashboardLink');

    if (user) {
        // User is signed in
        if (loginBtn) loginBtn.style.display = 'none';
        if (registerBtn) registerBtn.style.display = 'none';
        if (profileBtn) profileBtn.style.display = 'block';
        if (logoutBtn) logoutBtn.style.display = 'block';
        
        // Update dashboard link based on role
        if (dashboardLink) {
            dashboardLink.href = `${role}dashboard.html`;
            dashboardLink.textContent = `${role.charAt(0).toUpperCase() + role.slice(1)} Dashboard`;
        }
        
        // Display role badge if available
        const roleBadge = document.getElementById('roleBadge');
        if (roleBadge) {
            roleBadge.textContent = role;
            roleBadge.style.display = 'inline-block';
        }
    } else {
        // User is signed out
        if (loginBtn) loginBtn.style.display = 'block';
        if (registerBtn) registerBtn.style.display = 'block';
        if (profileBtn) profileBtn.style.display = 'none';
        if (logoutBtn) logoutBtn.style.display = 'none';
        
        // Reset dashboard link
        if (dashboardLink) {
            dashboardLink.href = 'dashboard.html';
            dashboardLink.textContent = 'Dashboard';
        }
        
        // Hide role badge
        const roleBadge = document.getElementById('roleBadge');
        if (roleBadge) roleBadge.style.display = 'none';
    }
}

// Handle logout
window.handleLogout = function() {
    signOut(auth).then(() => {
        window.location.href = 'index.html';
    }).catch((error) => {
        console.error('Logout error:', error);
    });
};