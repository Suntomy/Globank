// Global Pilgrim Bank - Admin Dashboard JavaScript

// ==================== CORE DATA ====================

// Bank accounts data
let accounts = [
    {
        id: 1,
        accountNumber: '00987654321',
        holder: 'Olawale Abdul-Ganiyu Adeshina',
        email: 'adeganglobal@gmail.com',
        phone: '+2349030277275',
        type: 'Premium',
        balance: 50000000.00,
        currency: 'USD',
        status: 'active'
    },
    {
        id: 2,
        accountNumber: '1122334455',
        holder: 'John Smith',
        email: 'john.smith@example.com',
        phone: '+447700900123',
        type: 'Business',
        balance: 150000.00,
        currency: 'USD',
        status: 'active'
    },
    {
        id: 3,
        accountNumber: '5566778899',
        holder: 'Sarah Johnson',
        email: 'sarah.j@example.com',
        phone: '+447900800456',
        type: 'Savings',
        balance: 75000.00,
        currency: 'USD',
        status: 'active'
    }
];

// Customers data
let customers = [
    {
        id: 1,
        name: 'Olawale Abdul-Ganiyu Adeshina',
        email: 'adeganglobal@gmail.com',
        phone: '+2349030277275',
        balance: 50000000.00,
        kycStatus: 'verified'
    },
    {
        id: 2,
        name: 'John Smith',
        email: 'john.smith@example.com',
        phone: '+447700900123',
        balance: 150000.00,
        kycStatus: 'verified'
    },
    {
        id: 3,
        name: 'Sarah Johnson',
        email: 'sarah.j@example.com',
        phone: '+447900800456',
        balance: 75000.00,
        kycStatus: 'pending'
    }
];

// Cards data
let cards = [
    {
        id: 1,
        cardNumber: '4532 •••• •••• 1234',
        holder: 'Olawale Abdul-Ganiyu',
        type: 'Virtual',
        network: 'Visa',
        limit: 100000,
        status: 'active'
    },
    {
        id: 2,
        cardNumber: '5412 •••• •••• 5678',
        holder: 'John Smith',
        type: 'Physical',
        network: 'Mastercard',
        limit: 50000,
        status: 'active'
    }
];

// KYC pending
let kycPending = [
    {
        id: 1,
        customer: 'Michael Brown',
        documentType: 'Passport',
        submitted: '2024-01-15',
        status: 'pending'
    },
    {
        id: 2,
        customer: 'Emma Wilson',
        documentType: 'Driver License',
        submitted: '2024-01-14',
        status: 'pending'
    }
];

// Robot trading data
let robotData = {
    active: true,
    tradesToday: 1247,
    profitToday: 1234567.00,
    winRate: 89.3
};

// FX rates
let fxRates = {
    'EUR/USD': { rate: 1.0875, change: 0.0025 },
    'GBP/USD': { rate: 1.2680, change: -0.0018 },
    'USD/JPY': { rate: 148.50, change: 0.35 },
    'USD/NGN': { rate: 1550.00, change: 5.20 }
};

// Transaction log
let transactionLog = [];

// Voice enabled
let voiceEnabled = true;

// ==================== INITIALIZATION ====================

document.addEventListener('DOMContentLoaded', function() {
    initDashboard();
    loadAccounts();
    loadCustomers();
    loadCards();
    loadKYC();
    initCharts();
    startRobotEngine();
    startTime();
    startNetworkMonitoring();
    startPriceSimulation();
});

function initDashboard() {
    updateTime();
    setInterval(updateTime, 1000);
    
    // Populate customer dropdowns
    populateCustomerDropdowns();
    
    // Add terminal message
    addTerminalMessage('[ADMIN] Dashboard initialized', 'success');
    speakMessage('Admin dashboard loaded. All systems operational.');
}

// ==================== TIME & UPDATES ====================

function startTime() {
    setInterval(updateTime, 1000);
}

function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleString();
    const timeElement = document.getElementById('currentTime');
    if (timeElement) {
        timeElement.textContent = timeString;
    }
}

// ==================== VOICE SYSTEM ====================

function speakMessage(message) {
    if (!voiceEnabled) return;
    
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(message);
        utterance.rate = 0.9;
        utterance.pitch = 1;
        window.speechSynthesis.speak(utterance);
    }
}

function toggleVoice() {
    voiceEnabled = !voiceEnabled;
    showNotification(voiceEnabled ? 'Voice enabled' : 'Voice disabled', 'success');
    speakMessage(voiceEnabled ? 'Voice prompts enabled' : 'Voice prompts disabled');
}

// ==================== TERMINAL SYSTEM ====================

function addTerminalMessage(message, type = 'info') {
    const terminal = document.getElementById('terminalOutput');
    if (!terminal) return;

    const line = document.createElement('div');
    line.className = 'terminal-line';
    
    const timestamp = new Date().toLocaleTimeString();
    
    switch(type) {
        case 'alarm':
            line.className += ' terminal-alarm';
            line.innerHTML = `[${timestamp}] ${message}`;
            triggerAlarm(message);
            break;
        case 'warning':
            line.className += ' terminal-warning';
            break;
        case 'success':
            line.className += ' terminal-success';
            break;
        default:
            line.innerHTML = `[${timestamp}] ${message}`;
    }
    
    line.innerHTML = `[${timestamp}] ${message}`;
    terminal.appendChild(line);
    terminal.scrollTop = terminal.scrollHeight;
}

function clearTerminal() {
    const terminal = document.getElementById('terminalOutput');
    if (terminal) {
        terminal.innerHTML = '<div class="terminal-line">[SYSTEM] Terminal cleared</div>';
    }
}

// ==================== ALARM SYSTEM ====================

function triggerAlarm(message) {
    const banner = document.getElementById('alarmBanner');
    const messageEl = document.getElementById('alarmMessage');
    
    if (banner && messageEl) {
        messageEl.textContent = message;
        banner.style.display = 'block';
        
        // Voice alert
        speakMessage('Security Alert! ' + message);
        
        // Play alarm sound (simulated)
        addAuditLog('ALARM TRIGGERED: ' + message);
    }
}

function dismissAlarm() {
    const banner = document.getElementById('alarmBanner');
    if (banner) {
        banner.style.display = 'none';
    }
    addTerminalMessage('[SECURITY] Alarm dismissed by admin', 'warning');
}

function testAlarm() {
    triggerAlarm('Test alarm triggered by administrator');
    addTerminalMessage('[TEST] Alarm system test', 'warning');
}

// ==================== DATA LOADING ====================

function loadAccounts() {
    const tbody = document.getElementById('accountsTable');
    if (!tbody) return;

    tbody.innerHTML = accounts.map(account => `
        <tr>
            <td>#${account.id}</td>
            <td style="font-family: monospace;">${account.accountNumber}</td>
            <td>${account.holder}</td>
            <td>${account.type}</td>
            <td style="color: var(--success-color);">$${account.balance.toLocaleString()}</td>
            <td><span class="status status-${account.status}">${account.status}</span></td>
            <td>
                <button class="btn btn-outline btn-sm" onclick="editAccount(${account.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-warning btn-sm" onclick="freezeAccount(${account.id})">
                    <i class="fas fa-snowflake"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function loadCustomers() {
    const tbody = document.getElementById('customersTable');
    if (!tbody) return;

    tbody.innerHTML = customers.map(customer => `
        <tr>
            <td>#${customer.id}</td>
            <td>${customer.name}</td>
            <td>${customer.email}</td>
            <td>${customer.phone}</td>
            <td style="color: var(--success-color);">$${customer.balance.toLocaleString()}</td>
            <td>
                <span class="status status-${customer.kycStatus === 'verified' ? 'active' : 'pending'}">
                    ${customer.kycStatus}
                </span>
            </td>
            <td>
                <button class="btn btn-outline btn-sm" onclick="viewCustomer(${customer.id})">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-danger btn-sm" onclick="freezeCustomer(${customer.id})">
                    <i class="fas fa-ban"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function loadCards() {
    const tbody = document.getElementById('cardsTable');
    if (!tbody) return;

    tbody.innerHTML = cards.map(card => `
        <tr>
            <td>#${card.id}</td>
            <td style="font-family: monospace;">${card.cardNumber}</td>
            <td>${card.holder}</td>
            <td>${card.type}</td>
            <td>
                <i class="fab fa-cc-${card.network.toLowerCase()}" style="font-size: 20px;"></i>
                ${card.network}
            </td>
            <td>$${card.limit.toLocaleString()}</td>
            <td><span class="status status-${card.status}">${card.status}</span></td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="freezeCard(${card.id})">
                    <i class="fas fa-snowflake"></i> Freeze
                </button>
            </td>
        </tr>
    `).join('');
}

function loadKYC() {
    const tbody = document.getElementById('kycTable');
    if (!tbody) return;

    tbody.innerHTML = kycPending.map(kyc => `
        <tr>
            <td>#${kyc.id}</td>
            <td>${kyc.customer}</td>
            <td>${kyc.documentType}</td>
            <td>${kyc.submitted}</td>
            <td><span class="status status-pending">${kyc.status}</span></td>
            <td>
                <button class="btn btn-success btn-sm" onclick="approveKYC(${kyc.id})">
                    <i class="fas fa-check"></i> Approve
                </button>
                <button class="btn btn-danger btn-sm" onclick="rejectKYC(${kyc.id})">
                    <i class="fas fa-times"></i> Reject
                </button>
            </td>
        </tr>
    `).join('');
}

function populateCustomerDropdowns() {
    const selects = ['creditCustomer', 'debitCustomer', 'cardCustomer'];
    selects.forEach(selectId => {
        const select = document.getElementById(selectId);
        if (select) {
            select.innerHTML = '<option value="">Select customer...</option>';
            customers.forEach(customer => {
                select.innerHTML += `<option value="${customer.id}">${customer.name} (${customer.email})</option>`;
            });
        }
    });
}

// ==================== CHARTS ====================

function initCharts() {
    // Robot Chart
    const robotCtx = document.getElementById('robotChart');
    if (robotCtx) {
        new Chart(robotCtx, {
            type: 'line',
            data: {
                labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
                datasets: [{
                    label: 'Profit ($)',
                    data: [45000, 89000, 156000, 234000, 345000, 456000],
                    borderColor: '#00ff88',
                    backgroundColor: 'rgba(0, 255, 136, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { grid: { color: 'rgba(255,255,255,0.1)' }, ticks: { color: '#a0aec0' } },
                    y: { grid: { color: 'rgba(255,255,255,0.1)' }, ticks: { color: '#a0aec0' } }
                }
            }
        });
    }

    // FX Chart
    const fxCtx = document.getElementById('fxChart');
    if (fxCtx) {
        new Chart(fxCtx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
                datasets: [{
                    label: 'EUR/USD',
                    data: [1.0850, 1.0865, 1.0870, 1.0860, 1.0875],
                    borderColor: '#0066cc',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { grid: { color: 'rgba(255,255,255,0.1)' }, ticks: { color: '#a0aec0' } },
                    y: { grid: { color: 'rgba(255,255,255,0.1)' }, ticks: { color: '#a0aec0' } }
                }
            }
        });
    }
}

// ==================== ROBOT ENGINE ====================

let robotInterval = null;

function startRobotEngine() {
    robotInterval = setInterval(() => {
        if (robotData.active) {
            // Simulate trading
            const profit = Math.random() * 5000;
            robotData.tradesToday++;
            robotData.profitToday += profit;
            
            // Update display
            const tradesEl = document.getElementById('robotTrades');
            if (tradesEl) {
                tradesEl.textContent = robotData.tradesToday.toLocaleString();
            }
            
            // Add terminal message occasionally
            if (Math.random() > 0.8) {
                addTerminalMessage(`[ROBOT] Trade #${robotData.tradesToday}: Profit +$${profit.toFixed(2)}`, 'success');
            }
        }
    }, 3000);
}

function startRobot() {
    robotData.active = true;
    document.getElementById('robotStatusDot').style.background = 'var(--success-color)';
    document.getElementById('robotStatusText').textContent = 'Active - Calculating...';
    addTerminalMessage('[ROBOT] Trading engine started', 'success');
    speakMessage('Robot trading engine started');
}

function stopRobot() {
    robotData.active = false;
    document.getElementById('robotStatusDot').style.background = 'var(--danger-color)';
    document.getElementById('robotStatusText').textContent = 'Stopped';
    addTerminalMessage('[ROBOT] Trading engine stopped', 'warning');
    speakMessage('Robot trading engine stopped');
}

// ==================== NETWORK MONITORING ====================

function startNetworkMonitoring() {
    setInterval(() => {
        // Simulate network status
        const networks = ['VISA', 'MASTERCARD', 'SWIFT', 'APPLE PAY'];
        networks.forEach(network => {
            if (Math.random() > 0.99) {
                addTerminalMessage(`[NETWORK] ${network} connection stable`, 'info');
            }
        });
        
        // Simulate random transactions
        if (Math.random() > 0.9) {
            const txTypes = ['Card Payment', 'Bank Transfer', 'Crypto Transaction', 'FX Trade'];
            const txType = txTypes[Math.floor(Math.random() * txTypes.length)];
            const amount = (Math.random() * 100000).toFixed(2);
            addTerminalMessage(`[TX] ${txType}: $${amount} processed`, 'success');
        }
    }, 5000);
}

// ==================== PRICE SIMULATION ====================

function startPriceSimulation() {
    setInterval(() => {
        // Update FX rates
        Object.keys(fxRates).forEach(pair => {
            const change = (Math.random() - 0.5) * 0.01;
            fxRates[pair].rate += change;
            fxRates[pair].change = change;
        });
        
        // Update display
        updateFXDisplay();
    }, 3000);
}

function updateFXDisplay() {
    const container = document.getElementById('fxRates');
    if (!container) return;

    container.innerHTML = Object.entries(fxRates).map(([pair, data]) => `
        <div class="fx-rate">
            <span class="fx-pair">${pair}</span>
            <span class="fx-rate-value">
                ${data.rate.toFixed(4)}
                <span class="fx-change" style="color: ${data.change >= 0 ? 'var(--success-color)' : 'var(--danger-color)'}">
                    ${data.change >= 0 ? '+' : ''}${data.change.toFixed(4)}
                </span>
            </span>
        </div>
    `).join('');
}

// ==================== ACCOUNT MANAGEMENT ====================

document.getElementById('createAccountForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const newAccount = {
        id: accounts.length + 1,
        accountNumber: generateAccountNumber(),
        holder: document.getElementById('newAccountName').value,
        email: document.getElementById('newAccountEmail').value,
        phone: document.getElementById('newAccountPhone').value,
        type: document.getElementById('newAccountType').value,
        balance: parseFloat(document.getElementById('newAccountDeposit').value) || 0,
        currency: document.getElementById('newAccountCurrency').value,
        status: 'active'
    };

    accounts.push(newAccount);
    loadAccounts();
    closeModal('createAccountModal');
    
    addTerminalMessage(`[ACCOUNT] New account created: ${newAccount.accountNumber}`, 'success');
    speakMessage(`Account created for ${newAccount.holder}`);
    showNotification('Account created successfully!', 'success');
    addAuditLog(`Account created: ${newAccount.accountNumber} for ${newAccount.holder}`);
});

function generateAccountNumber() {
    return Math.floor(1000000000 + Math.random() * 9000000000).toString();
}

function freezeAccount(accountId) {
    const account = accounts.find(a => a.id === accountId);
    if (account) {
        account.status = account.status === 'active' ? 'frozen' : 'active';
        loadAccounts();
        addTerminalMessage(`[ACCOUNT] Account ${account.accountNumber} ${account.status}`, 'warning');
        speakMessage(`Account ${account.status}`);
    }
}

// ==================== BALANCE MANAGEMENT ====================

document.getElementById('creditForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const customerId = parseInt(document.getElementById('creditCustomer').value);
    const amount = parseFloat(document.getElementById('creditAmount').value);
    const reason = document.getElementById('creditReason').value;
    
    const customer = customers.find(c => c.id === customerId);
    const account = accounts.find(a => a.email === customer?.email);
    
    if (customer && account && amount > 0) {
        customer.balance += amount;
        account.balance += amount;
        
        loadCustomers();
        loadAccounts();
        
        addTerminalMessage(`[CREDIT] $${amount.toLocaleString()} to ${customer.name}`, 'success');
        speakMessage(`Credit of ${amount} dollars processed`);
        showNotification(`$${amount.toLocaleString()} credited!`, 'success');
        addAuditLog(`CREDIT: $${amount} to ${customer.name} - Reason: ${reason}`);
        
        this.reset();
    }
});

document.getElementById('debitForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const customerId = parseInt(document.getElementById('debitCustomer').value);
    const amount = parseFloat(document.getElementById('debitAmount').value);
    const reason = document.getElementById('debitReason').value;
    
    const customer = customers.find(c => c.id === customerId);
    const account = accounts.find(a => a.email === customer?.email);
    
    if (customer && account && amount > 0) {
        if (account.balance >= amount) {
            customer.balance -= amount;
            account.balance -= amount;
            
            loadCustomers();
            loadAccounts();
            
            addTerminalMessage(`[DEBIT] $${amount.toLocaleString()} from ${customer.name}`, 'warning');
            speakMessage(`Debit of ${amount} dollars processed`);
            showNotification(`$${amount.toLocaleString()} debited!`, 'warning');
            addAuditLog(`DEBIT: $${amount} from ${customer.name} - Reason: ${reason}`);
        } else {
            showNotification('Insufficient balance!', 'error');
        }
        this.reset();
    }
});

// ==================== CARD ISSUING ====================

document.getElementById('issueCardForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const customerId = parseInt(document.getElementById('cardCustomer').value);
    const cardType = document.getElementById('cardType').value;
    const cardNetwork = document.getElementById('cardNetwork').value;
    const cardLimit = parseFloat(document.getElementById('cardLimit').value);
    
    const customer = customers.find(c => c.id === customerId);
    
    if (customer) {
        const newCard = {
            id: cards.length + 1,
            cardNumber: generateCardNumber(cardNetwork),
            holder: customer.name,
            type: cardType.charAt(0).toUpperCase() + cardType.slice(1),
            network: cardNetwork.charAt(0).toUpperCase() + cardNetwork.slice(1),
            limit: cardLimit,
            status: 'active'
        };

        cards.push(newCard);
        loadCards();
        closeModal('issueCardModal');
        
        addTerminalMessage(`[CARD] New ${cardNetwork} card issued for ${customer.name}`, 'success');
        speakMessage(`New ${cardNetwork} card issued`);
        showNotification('Card issued successfully!', 'success');
        addAuditLog(`CARD ISSUED: ${cardNetwork} ${cardType} for ${customer.name}`);
    }
});

function generateCardNumber(network) {
    const prefixes = {
        'visa': '4',
        'mastercard': '5',
        'verse': '3',
        'apple': '4'
    };
    const prefix = prefixes[network] || '4';
    const number = prefix + Math.floor(Math.random() * 1000000000000000).toString().padStart(15, '0');
    return `${number.slice(0,4)} •••• •••• ${number.slice(-4)}`;
}

function freezeCard(cardId) {
    const card = cards.find(c => c.id === cardId);
    if (card) {
        card.status = card.status === 'active' ? 'frozen' : 'active';
        loadCards();
        addTerminalMessage(`[CARD] Card ${card.cardNumber} ${card.status}`, 'warning');
        speakMessage(`Card ${card.status}`);
    }
}

// ==================== KYC MANAGEMENT ====================

function approveKYC(kycId) {
    const kyc = kycPending.find(k => k.id === kycId);
    if (kyc) {
        kyc.status = 'approved';
        loadKYC();
        addTerminalMessage(`[KYC] Approved: ${kyc.customer}`, 'success');
        speakMessage(`KYC approved for ${kyc.customer}`);
        addAuditLog(`KYC APPROVED: ${kyc.customer}`);
    }
}

function rejectKYC(kycId) {
    const kyc = kycPending.find(k => k.id === kycId);
    if (kyc) {
        kyc.status = 'rejected';
        loadKYC();
        addTerminalMessage(`[KYC] Rejected: ${kyc.customer}`, 'warning');
        speakMessage(`KYC rejected for ${kyc.customer}`);
        addAuditLog(`KYC REJECTED: ${kyc.customer}`);
    }
}

// ==================== AUDIT LOG ====================

function addAuditLog(message) {
    const log = document.getElementById('auditLog');
    if (!log) return;

    const entry = document.createElement('div');
    entry.className = 'audit-entry';
    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
    entry.textContent = `[${timestamp}] ${message}`;
    log.insertBefore(entry, log.firstChild);
}

// ==================== MODALS ====================

function openModal(modalId) {
    document.getElementById(modalId)?.classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId)?.classList.remove('active');
}

// ==================== NOTIFICATIONS ====================

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'exclamation-triangle'}"></i> ${message}`;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// ==================== LOGOUT ====================

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        addTerminalMessage('[ADMIN] Logout: adeganglobal@gmail.com', 'warning');
        speakMessage('Goodbye, Administrator');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    }
}

// ==================== UTILITY FUNCTIONS ====================

function editAccount(accountId) {
    showNotification('Edit account modal would open', 'success');
}

function viewCustomer(customerId) {
    showNotification('Customer details modal would open', 'success');
}

function freezeCustomer(customerId) {
    const customer = customers.find(c => c.id === customerId);
    if (customer) {
        showNotification(`Customer ${customer.name} frozen`, 'warning');
    }
}