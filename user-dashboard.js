// User Dashboard JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initPerformanceChart();
    loadProfileData();
});

// Initialize performance chart
function initPerformanceChart() {
    const ctx = document.getElementById('performanceChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Profit ($)',
                data: [1250, 1890, 1560, 2100, 1750, 2400, 2890],
                borderColor: '#00ff88',
                backgroundColor: 'rgba(0, 255, 136, 0.1)',
                fill: true,
                tension: 0.4
            }, {
                label: 'Loss ($)',
                data: [320, 180, 450, 220, 380, 150, 210],
                borderColor: '#ff4444',
                backgroundColor: 'rgba(255, 68, 68, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: '#a0aec0'
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#a0aec0'
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#a0aec0'
                    }
                }
            }
        }
    });
}

// Load profile data
function loadProfileData() {
    const userData = {
        fullName: 'Olawale Abdul-Ganiyu Adeshina',
        email: 'adeganglobal@gmail.com',
        phone: '+2349030277275',
        country: 'NG',
        dob: '1990-01-01',
        accountType: 'Premium'
    };

    // Populate form fields
    document.getElementById('fullName').value = userData.fullName;
    document.getElementById('email').value = userData.email;
    document.getElementById('phone').value = userData.phone;
    document.getElementById('country').value = userData.country;
    document.getElementById('dob').value = userData.dob;
    document.getElementById('accountType').value = userData.accountType;
}

// Update profile
document.getElementById('profileForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const userData = {
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        country: document.getElementById('country').value,
        dob: document.getElementById('dob').value
    };

    // Simulate saving
    showNotification('Profile updated successfully!', 'success');
});

// Change password
function changePassword() {
    const currentPassword = prompt('Enter current password:');
    if (!currentPassword) return;

    const newPassword = prompt('Enter new password:');
    if (!newPassword) return;

    const confirmPassword = prompt('Confirm new password:');
    if (newPassword !== confirmPassword) {
        showNotification('Passwords do not match!', 'error');
        return;
    }

    showNotification('Password changed successfully!', 'success');
}

// Show notification
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Logout
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        window.location.href = 'index.html';
    }
}