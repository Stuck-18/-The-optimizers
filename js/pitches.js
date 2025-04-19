// DOM Elements
const pitchesGrid = document.getElementById('pitchesGrid');
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');
const filterSelect = document.getElementById('filterSelect');

// Extended sample data for the pitches page
const allPitches = [
    ...samplePitches,
    {
        id: 4,
        title: "FinTech Solutions - Digital Banking Revolution",
        description: "Next-generation digital banking platform for seamless financial transactions.",
        image: "https://via.placeholder.com/300x200",
        videoUrl: "https://www.youtube.com/embed/sample4",
        views: 2100,
        likes: 156,
        comments: 34,
        rating: 4.7,
        category: "tech"
    },
    {
        id: 5,
        title: "GreenEnergy - Renewable Power Solutions",
        description: "Innovative renewable energy solutions for residential and commercial use.",
        image: "https://via.placeholder.com/300x200",
        videoUrl: "https://www.youtube.com/embed/sample5",
        views: 1800,
        likes: 134,
        comments: 28,
        rating: 4.6,
        category: "sustainability"
    },
    {
        id: 6,
        title: "MedTech AI - Healthcare Innovation",
        description: "AI-powered diagnostic tools for early disease detection.",
        image: "https://via.placeholder.com/300x200",
        videoUrl: "https://www.youtube.com/embed/sample6",
        views: 1650,
        likes: 98,
        comments: 42,
        rating: 4.4,
        category: "health"
    }
];

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    displayPitches(allPitches);
    setupEventListeners();
});

// Display pitches in the grid
function displayPitches(pitches) {
    if (!pitchesGrid) return;

    pitchesGrid.innerHTML = pitches.map(pitch => `
        <div class="col-md-4 mb-4">
            <div class="card pitch-card fade-in">
                <img src="${pitch.image}" class="card-img-top" alt="${pitch.title}">
                <div class="card-body">
                    <h5 class="card-title">${pitch.title}</h5>
                    <p class="card-text">${pitch.description}</p>
                    <div class="pitch-stats d-flex justify-content-between">
                        <span><i class="fas fa-eye"></i> ${formatNumber(pitch.views)}</span>
                        <span><i class="fas fa-heart"></i> ${formatNumber(pitch.likes)}</span>
                        <span><i class="fas fa-comment"></i> ${formatNumber(pitch.comments)}</span>
                        <span><i class="fas fa-star"></i> ${pitch.rating}</span>
                    </div>
                    <a href="pitch-detail.html?id=${pitch.id}" class="btn btn-primary mt-3">View Details</a>
                </div>
            </div>
        </div>
    `).join('');
}

// Setup event listeners for search, sort, and filter
function setupEventListeners() {
    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('input', debounce(handleSearch, 300));
    }

    // Sort functionality
    if (sortSelect) {
        sortSelect.addEventListener('change', handleSort);
    }

    // Filter functionality
    if (filterSelect) {
        filterSelect.addEventListener('change', handleFilter);
    }
}

// Handle search
function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredPitches = allPitches.filter(pitch => 
        pitch.title.toLowerCase().includes(searchTerm) ||
        pitch.description.toLowerCase().includes(searchTerm)
    );
    displayPitches(filteredPitches);
}

// Handle sorting
function handleSort() {
    const sortValue = sortSelect.value;
    let sortedPitches = [...allPitches];

    switch (sortValue) {
        case 'newest':
            sortedPitches.sort((a, b) => b.id - a.id);
            break;
        case 'oldest':
            sortedPitches.sort((a, b) => a.id - b.id);
            break;
        case 'rating':
            sortedPitches.sort((a, b) => b.rating - a.rating);
            break;
        case 'views':
            sortedPitches.sort((a, b) => b.views - a.views);
            break;
    }

    displayPitches(sortedPitches);
}

// Handle filtering
function handleFilter() {
    const filterValue = filterSelect.value;
    const filteredPitches = filterValue === 'all' 
        ? allPitches 
        : allPitches.filter(pitch => pitch.category === filterValue);
    displayPitches(filteredPitches);
}

// Debounce function for search input
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add animation classes to elements as they come into view
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, {
    threshold: 0.1
});

// Observe all pitch cards
document.querySelectorAll('.pitch-card').forEach(card => {
    observer.observe(card);
});