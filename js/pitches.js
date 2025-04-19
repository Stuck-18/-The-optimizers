// js/pitches.js

// Get Firebase instances
const auth = firebase.auth();
const db = firebase.firestore();

// Initialize variables for pagination and filtering
let lastVisiblePitch = null;
const PITCHES_PER_PAGE = 6;
let currentFilter = 'all';
let currentSort = 'newest';

// Function to format numbers (e.g., 1000 -> 1k)
function formatNumber(num) {
    if (!num) return '0';
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
}

// Function to create a pitch card
function createPitchCard(pitch) {
    const statusClass = pitch.status === 'approved' ? 'bg-success' : 
                       pitch.status === 'pending' ? 'bg-warning' : 'bg-secondary';
    
    return `
        <div class="col-md-4 mb-4">
            <div class="card h-100 shadow-sm">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <h5 class="card-title mb-0">${pitch.startupName || 'Unnamed Startup'}</h5>
                        <span class="badge ${statusClass}">${pitch.status || 'pending'}</span>
                    </div>
                    <h6 class="text-muted">${pitch.domain || pitch.category || 'Uncategorized'}</h6>
                    <p class="card-text">${pitch.summary ? (pitch.summary.length > 150 ? pitch.summary.substring(0, 150) + '...' : pitch.summary) : 'No description available'}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <div class="small text-muted">
                            <i class="fas fa-user"></i> ${pitch.founderName || 'Anonymous'}
                        </div>
                        <div class="small text-muted">
                            <i class="fas fa-users"></i> ${pitch.teamSize || 'N/A'}
                        </div>
                    </div>
                    <div class="d-flex justify-content-between align-items-center mt-2">
                        <div>
                            <span class="me-2"><i class="fas fa-eye"></i> ${formatNumber(pitch.views)}</span>
                            <span><i class="fas fa-heart"></i> ${formatNumber(pitch.likes)}</span>
                        </div>
                        <span class="badge bg-info">${pitch.stage || 'Early Stage'}</span>
                    </div>
                </div>
                <div class="card-footer bg-transparent">
                    <a href="pitch-details.html?id=${pitch.id}" class="btn btn-primary w-100">View Details</a>
                </div>
            </div>
        </div>
    `;
}

// Function to display loading state
function showLoading() {
    const pitchesGrid = document.getElementById('pitchesGrid');
    pitchesGrid.innerHTML = `
        <div class="col-12 text-center py-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
    `;
}

// Function to fetch pitches
async function fetchPitches() {
    try {
        console.log('Fetching pitches...'); // Debug log
        showLoading();
        
        let query = db.collection('pitches');

        // Apply filters
        if (currentFilter !== 'all') {
            query = query.where('category', '==', currentFilter);
        }

        // Apply sorting
        switch (currentSort) {
            case 'newest':
                query = query.orderBy('createdAt', 'desc');
                break;
            case 'oldest':
                query = query.orderBy('createdAt', 'asc');
                break;
            case 'rating':
                query = query.orderBy('likes', 'desc');
                break;
            case 'views':
                query = query.orderBy('views', 'desc');
                break;
        }

        // Apply pagination
        query = query.limit(PITCHES_PER_PAGE);
        if (lastVisiblePitch) {
            query = query.startAfter(lastVisiblePitch);
        }

        console.log('Executing query...'); // Debug log
        const snapshot = await query.get();
        console.log('Received snapshot with size:', snapshot.size); // Debug log

        const pitches = [];
        snapshot.forEach(doc => {
            console.log('Processing document:', doc.id); // Debug log
            pitches.push({
                id: doc.id,
                ...doc.data()
            });
        });

        // Update last visible pitch for pagination
        lastVisiblePitch = snapshot.docs[snapshot.docs.length - 1];

        // Display pitches
        const pitchesGrid = document.getElementById('pitchesGrid');
        if (pitches.length === 0) {
            pitchesGrid.innerHTML = `
                <div class="col-12 text-center py-5">
                    <h4>No pitches found</h4>
                    <p class="text-muted">Try adjusting your filters or search criteria</p>
                </div>
            `;
            return;
        }

        pitchesGrid.innerHTML = pitches.map(pitch => createPitchCard(pitch)).join('');

    } catch (error) {
        console.error('Error fetching pitches:', error);
        const pitchesGrid = document.getElementById('pitchesGrid');
        pitchesGrid.innerHTML = `
            <div class="col-12 text-center py-5">
                <div class="alert alert-danger" role="alert">
                    <h5>Error loading pitches</h5>
                    <p>${error.message}</p>
                </div>
            </div>
        `;
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded'); // Debug log
    
    // Initial load
    fetchPitches();

    // Search functionality
    const searchInput = document.getElementById('searchInput');
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            lastVisiblePitch = null;
            fetchPitches();
        }, 500);
    });

    // Sort functionality
    const sortSelect = document.getElementById('sortSelect');
    sortSelect.addEventListener('change', (e) => {
        currentSort = e.target.value;
        lastVisiblePitch = null;
        fetchPitches();
    });

    // Filter functionality
    const filterSelect = document.getElementById('filterSelect');
    filterSelect.addEventListener('change', (e) => {
        currentFilter = e.target.value;
        lastVisiblePitch = null;
        fetchPitches();
    });
});

// Update navigation based on auth state
auth.onAuthStateChanged(user => {
    const loginLink = document.querySelector('a[href="login.html"]');
    const signUpLink = document.querySelector('a[href="register.html"]');
    const dashboardLink = document.querySelector('a[href="dashboard.html"]');

    if (user) {
        // User is signed in
        loginLink.style.display = 'none';
        signUpLink.style.display = 'none';
        dashboardLink.style.display = 'block';
    } else {
        // User is signed out
        loginLink.style.display = 'block';
        signUpLink.style.display = 'block';
        dashboardLink.style.display = 'none';
    }
});