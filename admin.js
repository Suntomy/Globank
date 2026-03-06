// Admin Dashboard JavaScript

// Initialize data
let users = [
    {
        id: 1,
        name: "Olawale Abdul-Ganiyu Adeshina",
        email: "adeganglobal@gmail.com",
        phone: "+2349030277275",
        realBalance: 50000.00,
        profitBalance: 12500.00,
        creditBalance: 5000.00,
        status: "active"
    },
    {
        id: 2,
        name: "John Smith",
        email: "john.smith@example.com",
        phone: "+447700900123",
        realBalance: 15000.00,
        profitBalance: 3200.00,
        creditBalance: 2000.00,
        status: "active"
    },
    {
        id: 3,
        name: "Sarah Johnson",
        email: "sarah.j@example.com",
        phone: "+447900800456",
        realBalance: 25000.00,
        profitBalance: 8900.00,
        creditBalance: 3000.00,
        status: "active"
    },
    {
        id: 4,
        name: "Michael Brown",
        email: "michael.b@example.com",
        phone: "+447800700789",
        realBalance: 10000.00,
        profitBalance: 2100.00,
        creditBalance: 1500.00,
        status: "inactive"
    }
];

let deposits = [
    { id: 1, userId: 1, userName: "Olawale Abdul", amount: 5000, method: "Bank Transfer", date: "2024-01-15", status: "completed" },
    { id: 2, userId: 2, userName: "John Smith", amount: 2000, method: "PayPal", date: "2024-01-14", status: "completed" },
    { id: 3, userId: 3, userName: "Sarah Johnson", amount: 10000, method: "Bank Transfer", date: "2024-01-13", status: "pending" }
];

let withdrawals = [
    { id: 1, userId: 1, userName: "Olawale Abdul", amount: 2500, method: "Bank Transfer", date: "2024-01-15", status: "completed" },
    { id: 2, userId: 2, userName: "John Smith", amount: 1500, method: "Crypto", date: "2024-01-14", status: "pending" }
];

let trades = [
    { id: 1, pair: "EUR/USD", type: "buy", entry: 1.0875, exit: 1.0890, profit: 150, status: "profit" },
    { id: 2, pair: "GBP/USD", type: "sell", entry: 1.2680, exit: 1.2665, profit: 120, status: "profit" },
    { id: 3, pair: "USD/JPY", type: "buy", entry: 148.50, exit: 148.40, profit: -80, status: "loss" },
    { id: 4, pair: "EUR/USD", type: "sell", entry: 1.0880, exit: 1.0870, profit: 100, status: "profit" }
];

let robotTrades = [
    { time: "10:00", profit: 450 },
    { time: "10:30", profit: 620 },
    { time: "11:00", profit: 380 },
    { time: "11:30", profit: 510 },
    { time: "12:00", profit: 780 },
    { time: "12:30", profit: 430 }
];

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    loadUsers();
    loadDeposits();
    loadWithdrawals();
    loadRecentTrades();
    updateUserDropdowns();
    initCharts();
    updateTime();
    
    // Auto-update time
    setInterval(updateTime, 1000);
    
    // Simulate robot trading
    setInterval(simulateRobotTrading, 5000);
});

// Update current time
function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleString();
    const timeElement = document.getElementById('currentTime');
    if (timeElement) {
        timeElement.textContent = timeString;
    }
}

// Load users table
function loadUsers() {
    const tbody = document.getElementById('usersTableBody');
    tbody.innerHTML = '';

    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>#${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>$${user.realBalance.toLocaleString('en-US', {minimumFractionDigits: 2})}</td>
            <td>$${user.profitBalance.toLocaleString('en-US', {minimumFractionDigits: 2})}</td>
            <td>$${user.creditBalance.toLocaleString('en-US', {minimumFractionDigits: 2})}</td>
            <td><span class="status status-${user.status}">${user.status}</span></td>
            <td>
                <button class="btn btn-outline btn-sm" onclick="editUser(${user.id})">Edit</button>
                <button class="btn btn-outline btn-sm" onclick="toggleUserStatus(${user.id})">
                    ${user.status === 'active' ? 'Deactivate' : 'Activate'}
                </button>
                <button class="btn btn-danger btn-sm" onclick="confirmDelete(${user.id})">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });

    updateStats();
}

// Update statistics
function updateStats() {
    const totalUsers = users.length;
    const activeUsers = users.filter(u => u.status === 'active').length;
    const totalBalance = users.reduce((sum, u) => sum + u.realBalance + u.profitBalance, 0);
    const totalProfit = users.reduce((sum, u) => sum + u.profitBalance, 0);

    if (document.getElementById('totalUsers')) {
        document.getElementById('totalUsers').textContent = totalUsers.toLocaleString();
    }
    if (document.getElementById('activeUsers')) {
        document.getElementById('activeUsers').textContent = activeUsers.toLocaleString();
    }
    if (document.getElementById('realBalance')) {
        document.getElementById('realBalance').textContent = '$' + users.reduce((sum, u) => sum + u.realBalance, 0).toLocaleString('en-US', {minimumFractionDigits: 2});
    }
    if (document.getElementById('profitBalance')) {
        document.getElementById('profitBalance').textContent = '$' + users.reduce((sum, u) => sum + u.profitBalance, 0).toLocaleString('en-US', {minimumFractionDigits: 2});
    }
    if (document.getElementById('creditBalance')) {
        document.getElementById('creditBalance').textContent = '$' + users.reduce((sum, u) => sum + u.creditBalance, 0).toLocaleString('en-US', {minimumFractionDigits: 2});
    }
}

// Load recent deposits
function loadDeposits() {
    const container = document.getElementById('recentDeposits');
    if (!container) return;

    container.innerHTML = deposits.map(deposit => `
        <div class="trade-row">
            <div>
                <div style="font-weight: 600;">${deposit.userName}</div>
                <div style="color: var(--text-secondary); font-size: 12px;">${deposit.date}</div>
            </div>
            <div style="text-align: right;">
                <div style="color: var(--success-color); font-weight: bold;">+$${deposit.amount.toLocaleString()}</div>
                <div style="font-size: 12px;">${deposit.method}</div>
            </div>
        </div>
    `).join('');
}

// Load recent withdrawals
function loadWithdrawals() {
    const container = document.getElementById('recentWithdrawals');
    if (!container) return;

    container.innerHTML = withdrawals.map(withdrawal => `
        <div class="trade-row">
            <div>
                <div style="font-weight: 600;">${withdrawal.userName}</div>
                <div style="color: var(--text-secondary); font-size: 12px;">${withdrawal.date}</div>
            </div>
            <div style="text-align: right;">
                <div style="color: var(--danger-color); font-weight: bold;">-$${withdrawal.amount.toLocaleString()}</div>
                <div style="font-size: 12px;">${withdrawal.method}</div>
            </div>
        </div>
    `).join('');
}

// Load recent trades
function loadRecentTrades() {
    const container = document.getElementById('recentTrades');
    if (!container) return;

    container.innerHTML = trades.slice(-5).map(trade => `
        <div class="trade-row">
            <div>
                <div style="font-weight: 600;">${trade.pair}</div>
                <div style="color: var(--text-secondary); font-size: 12px;">${trade.type.toUpperCase()}</div>
            </div>
            <div style="text-align: right;">
                <div class="${trade.status === 'profit' ? 'trade-profit' : 'trade-loss'}">
                    ${trade.profit > 0 ? '+' : ''}$${trade.profit}
                </div>
                <div style="font-size: 12px; color: var(--text-secondary);">${trade.entry} → ${trade.exit}</div>
            </div>
        </div>
    `).join('');
}

// Update user dropdowns
function updateUserDropdowns() {
    const selects = ['creditUser', 'debitUser'];
    selects.forEach(selectId => {
        const select = document.getElementById(selectId);
        if (select) {
            select.innerHTML = '<option value="">Select a user...</option>';
            users.forEach(user => {
                select.innerHTML += `<option value="${user.id}">${user.name} (${user.email})</option>`;
            });
        }
    });
}

// Modal functions
function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// Add user
document.getElementById('addUserForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const newUser = {
        id: users.length + 1,
        name: document.getElementById('newUserName').value,
        email: document.getElementById('newUserEmail').value,
        phone: document.getElementById('newUserPhone').value,
        realBalance: parseFloat(document.getElementById('newUserBalance').value) || 0,
        profitBalance: 0,
        creditBalance: 0,
        status: "active"
    };

    users.push(newUser);
    loadUsers();
    updateUserDropdowns();
    closeModal('addUserModal');
    showNotification('User created successfully!', 'success');
    this.reset();
});

// Edit user
function editUser(userId) {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    document.getElementById('editUserId').value = user.id;
    document.getElementById('editUserName').value = user.name;
    document.getElementById('editUserEmail').value = user.email;
    document.getElementById('editUserPhone').value = user.phone || '';
    document.getElementById('editRealBalance').value = user.realBalance;
    document.getElementById('editProfitBalance').value = user.profitBalance;
    document.getElementById('editCreditBalance').value = user.creditBalance;
    document.getElementById('editUserStatus').value = user.status;

    openModal('editUserModal');
}

// Update user
document.getElementById('editUserForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const userId = parseInt(document.getElementById('editUserId').value);
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex !== -1) {
        users[userIndex] = {
            ...users[userIndex],
            name: document.getElementById('editUserName').value,
            email: document.getElementById('editUserEmail').value,
            phone: document.getElementById('editUserPhone').value,
            realBalance: parseFloat(document.getElementById('editRealBalance').value),
            profitBalance: parseFloat(document.getElementById('editProfitBalance').value),
            creditBalance: parseFloat(document.getElementById('editCreditBalance').value),
            status: document.getElementById('editUserStatus').value
        };

        loadUsers();
        closeModal('editUserModal');
        showNotification('User updated successfully!', 'success');
    }
});

// Toggle user status
function toggleUserStatus(userId) {
    const user = users.find(u => u.id === userId);
    if (user) {
        user.status = user.status === 'active' ? 'inactive' : 'active';
        loadUsers();
        showNotification(`User ${user.status === 'active' ? 'activated' : 'deactivated'} successfully!`, 'success');
    }
}

// Delete user
function deleteUser() {
    const userId = parseInt(document.getElementById('editUserId').value);
    users = users.filter(u => u.id !== userId);
    loadUsers();
    updateUserDropdowns();
    closeModal('editUserModal');
    showNotification('User deleted successfully!', 'success');
}

function confirmDelete(userId) {
    if (confirm('Are you sure you want to delete this user?')) {
        deleteUser();
    }
}

// Credit balance
document.getElementById('creditForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const userId = parseInt(document.getElementById('creditUser').value);
    const amount = parseFloat(document.getElementById('creditAmount').value);
    const user = users.find(u => u.id === userId);

    if (user && amount > 0) {
        user.creditBalance += amount;
        loadUsers();
        showNotification(`$${amount.toLocaleString()} credited to ${user.name}!`, 'success');
        this.reset();
    }
});

// Debit balance
document.getElementById('debitForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const userId = parseInt(document.getElementById('debitUser').value);
    const amount = parseFloat(document.getElementById('debitAmount').value);
    const wallet = document.getElementById('debitWallet').value;
    const user = users.find(u => u.id === userId);

    if (user && amount > 0) {
        if (wallet === 'real' && user.realBalance >= amount) {
            user.realBalance -= amount;
        } else if (wallet === 'profit' && user.profitBalance >= amount) {
            user.profitBalance -= amount;
        } else if (wallet === 'credit' && user.creditBalance >= amount) {
            user.creditBalance -= amount;
        } else {
            showNotification('Insufficient balance!', 'error');
            return;
        }

        loadUsers();
        showNotification(`$${amount.toLocaleString()} debited from ${user.name}!`, 'success');
        this.reset();
    }
});

// Robot trading functions
let robotActive = true;
let robotInterval = null;

function startRobot() {
    robotActive = true;
    showNotification('Robot trading started!', 'success');
    simulateRobotTrading();
}

function stopRobot() {
    robotActive = false;
    showNotification('Robot trading stopped!', 'warning');
}

function simulateRobotTrading() {
    if (!robotActive) return;

    // Simulate random trade
    const profit = Math.random() * 200 - 50; // -50 to +150
    const profitAmount = Math.max(0, profit); // Only positive profits
    
    if (profitAmount > 0) {
        // Add to admin profit balance
        const admin = users.find(u => u.id === 1);
        if (admin) {
            admin.profitBalance += profitAmount;
            loadUsers();
            
            // Update robot profits display
            const robotProfitsElement = document.getElementById('robotProfits');
            if (robotProfitsElement) {
                const currentProfits = parseFloat(robotProfitsElement.textContent.replace(/[^0-9.]/g, '')) || 0;
                robotProfitsElement.textContent = '$' + (currentProfits + profitAmount).toLocaleString('en-US', {minimumFractionDigits: 2});
            }
        }
    }

    // Update robot trades chart
    updateRobotChart(profitAmount);
}

// Initialize charts
function initCharts() {
    // Market chart
    const marketCtx = document.getElementById('marketChart');
    if (marketCtx) {
        new Chart(marketCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'EUR/USD',
                    data: [1.08, 1.09, 1.07, 1.085, 1.09, 1.087],
                    borderColor: '#00d4ff',
                    backgroundColor: 'rgba(0, 212, 255, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
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

    // Robot performance chart
    const robotCtx = document.getElementById('robotChart');
    if (robotCtx) {
        window.robotChart = new Chart(robotCtx, {
            type: 'bar',
            data: {
                labels: robotTrades.map(t => t.time),
                datasets: [{
                    label: 'Profit ($)',
                    data: robotTrades.map(t => t.profit),
                    backgroundColor: 'rgba(0, 255, 136, 0.8)',
                    borderColor: '#00ff88',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
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
}

function updateRobotChart(profitAmount) {
    if (!window.robotChart) return;

    const now = new Date();
    const timeLabel = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    
    window.robotChart.data.labels.push(timeLabel);
    window.robotChart.data.datasets[0].data.push(profitAmount);
    
    // Keep only last 10 trades
    if (window.robotChart.data.labels.length > 10) {
        window.robotChart.data.labels.shift();
        window.robotChart.data.datasets[0].data.shift();
    }
    
    window.robotChart.update();
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