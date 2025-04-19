// Sample data for charts and tables
const engagementData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    views: [450, 520, 480, 590, 680, 750],
    likes: [35, 42, 38, 45, 52, 58],
    comments: [12, 15, 18, 20, 22, 25]
};

const categoryData = {
    labels: ['Technology', 'Healthcare', 'Education', 'Sustainability', 'Finance'],
    data: [35, 25, 20, 15, 5]
};

const recentActivity = [
    {
        date: '2024-03-15',
        activity: 'New Comment',
        user: 'John Doe',
        details: 'Commented on EcoSmart pitch'
    },
    {
        date: '2024-03-14',
        activity: 'New Rating',
        user: 'Jane Smith',
        details: 'Rated HealthTrack 5 stars'
    },
    {
        date: '2024-03-13',
        activity: 'New Pitch',
        user: 'Mike Johnson',
        details: 'Submitted FinTech Solutions pitch'
    },
    {
        date: '2024-03-12',
        activity: 'New Like',
        user: 'Sarah Wilson',
        details: 'Liked EduTech pitch'
    },
    {
        date: '2024-03-11',
        activity: 'New View',
        user: 'Alex Brown',
        details: 'Viewed GreenEnergy pitch'
    }
];

const topMentors = [
    {
        name: 'Dr. Emily Chen',
        expertise: 'Technology & Innovation',
        reviews: 45,
        rating: 4.9
    },
    {
        name: 'Mark Thompson',
        expertise: 'Healthcare & Biotech',
        reviews: 38,
        rating: 4.8
    },
    {
        name: 'Lisa Rodriguez',
        expertise: 'Education & EdTech',
        reviews: 32,
        rating: 4.7
    },
    {
        name: 'David Kim',
        expertise: 'Sustainability & Green Tech',
        reviews: 28,
        rating: 4.9
    }
];

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
    initializeCharts();
    displayRecentActivity();
    displayTopMentors();
});

// Initialize charts
function initializeCharts() {
    // Engagement Chart
    const engagementCtx = document.getElementById('engagementChart').getContext('2d');
    new Chart(engagementCtx, {
        type: 'line',
        data: {
            labels: engagementData.labels,
            datasets: [
                {
                    label: 'Views',
                    data: engagementData.views,
                    borderColor: 'rgb(13, 110, 253)',
                    tension: 0.1
                },
                {
                    label: 'Likes',
                    data: engagementData.likes,
                    borderColor: 'rgb(25, 135, 84)',
                    tension: 0.1
                },
                {
                    label: 'Comments',
                    data: engagementData.comments,
                    borderColor: 'rgb(13, 202, 240)',
                    tension: 0.1
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Category Distribution Chart
    const categoryCtx = document.getElementById('categoryChart').getContext('2d');
    new Chart(categoryCtx, {
        type: 'doughnut',
        data: {
            labels: categoryData.labels,
            datasets: [{
                data: categoryData.data,
                backgroundColor: [
                    'rgb(13, 110, 253)',
                    'rgb(25, 135, 84)',
                    'rgb(13, 202, 240)',
                    'rgb(255, 193, 7)',
                    'rgb(220, 53, 69)'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'right'
                }
            }
        }
    });
}

// Display recent activity
function displayRecentActivity() {
    const activityTable = document.getElementById('activityTable');
    if (!activityTable) return;

    activityTable.innerHTML = recentActivity.map(activity => `
        <tr>
            <td>${formatDate(activity.date)}</td>
            <td>${activity.activity}</td>
            <td>${activity.user}</td>
            <td>${activity.details}</td>
        </tr>
    `).join('');
}

// Display top mentors
function displayTopMentors() {
    const topMentorsList = document.getElementById('topMentors');
    if (!topMentorsList) return;

    topMentorsList.innerHTML = topMentors.map(mentor => `
        <div class="list-group-item">
            <div class="d-flex w-100 justify-content-between">
                <h6 class="mb-1">${mentor.name}</h6>
                <small class="text-muted">${mentor.rating} <i class="fas fa-star"></i></small>
            </div>
            <p class="mb-1">${mentor.expertise}</p>
            <small class="text-muted">${mentor.reviews} reviews</small>
        </div>
    `).join('');
}

// Format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Update stats periodically (simulated)
function updateStats() {
    // In a real application, this would fetch data from an API
    const stats = {
        views: Math.floor(Math.random() * 100) + 2400,
        likes: Math.floor(Math.random() * 20) + 140,
        comments: Math.floor(Math.random() * 10) + 80,
        rating: (Math.random() * 0.5 + 4.3).toFixed(1)
    };

    // Update DOM elements
    document.querySelector('.stat-card:nth-child(1) h3').textContent = formatNumber(stats.views);
    document.querySelector('.stat-card:nth-child(2) h3').textContent = formatNumber(stats.likes);
    document.querySelector('.stat-card:nth-child(3) h3').textContent = formatNumber(stats.comments);
    document.querySelector('.stat-card:nth-child(4) h3').textContent = stats.rating;
}

// Update stats every 30 seconds
setInterval(updateStats, 30000); 