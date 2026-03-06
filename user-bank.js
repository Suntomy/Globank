// Global Pilgrim Bank - User Dashboard JavaScript
// User Interface and Functionality

// User Data
const userData = {
    name: 'Olawale Abdul-Ganiyu Adeshina',
    email: 'adeganglobal@gmail.com',
    phone: '+2349030277275',
    accountNumber: 'GPB-2024-8837492',
    totalBalance: 125850.00,
    savingsBalance: 85000.00,
    investmentBalance: 40850.00,
    accounts: [
        { type: 'Savings Account', number: 'GPB-SAV-8837', balance: 85000.00 },
        { type: 'Investment Account', number: 'GPB-INV-8838', balance: 40850.00 }
    ]
};

// Cards Data
const userCards = [
    {
        type: 'Visa',
        number: '4532 •••• •••• 7821',
        expiry: '09/28',
        cvv: '•••',
        balance: 25000.00,
        status: 'active',
        color: 'linear-gradient(135deg, #1a1a6e, #4169e1)'
    },
    {
        type: 'Mastercard',
        number: '5421 •••• •••• 3467',
        expiry: '12/27',
        cvv: '•••',
        balance: 35000.00,
        status: 'active',
        color: 'linear-gradient(135deg, #ff6b6b, #c92a2a)'
    },
    {
        type: 'Apple Card',
        number: '•••• •••• •••• 9214',
        expiry: '03/29',
        cvv: '•••',
        balance: 10850.00,
        status: 'active',
        color: 'linear-gradient(135deg, #f8f9fa, #e9ecef)'
    }
];

// Crypto Wallets
const cryptoWallets = [
    { symbol: 'BTC', name: 'Bitcoin', balance: 0.0523, value: 4500.00, change: '+2.34%' },
    { symbol: 'ETH', name: 'Ethereum', balance: 1.2450, value: 3200.00, change: '+1.87%' },
    { symbol: 'USDT', name: 'Tether', balance: 8200.00, value: 8200.00, change: '+0.02%' }
];

// Recent Transactions
const transactions = [
    { id: 1, type: 'deposit', description: 'Bank Transfer', amount: 5000.00, date: '2024-01-15', status: 'completed' },
    { id: 2, type: 'transfer', description: 'Transfer to Meta Forex', amount: 3000.00, date: '2024-01-14', status: 'completed' },
    { id: 3, type: 'withdrawal', description: 'ATM Withdrawal', amount: -500.00, date: '2024-01-13', status: 'completed' },
    { id: 4, type: 'payment', description: 'Netflix Subscription', amount: -15.99, date: '2024-01-12', status: 'completed' },
    { id: 5, type: 'deposit', description: 'Salary Deposit', amount: 15000.00, date: '2024-01-10', status: 'completed' },
    { id: 6, type: 'transfer', description: 'From Meta Forex', amount: 2500.00, date: '2024-01-09', status: 'completed' },
    { id: 7, type: 'crypto', description: 'Bitcoin Purchase', amount: -1000.00, date: '2024-01-08', status: 'completed' },
    { id: 8, type: 'fx', description: 'USD to EUR Exchange', amount: 0.00, date: '2024-01-07', status: 'completed' }
];

// FX Rates
const fxRates = {
    USD: 1.00,
    EUR: 0.92,
    GBP: 0.79,
    JPY: 149.50,
    CAD: 1.36,
    AUD: 1.53,
    CHF: 0.88,
    CNY: 7.24,
    NGN: 1550.00
};

// Initialize Dashboard
document.addEventListener('DOMContentLoaded', function() {
    loadUserData();
    initCharts();
    initFXCalculator();
    initModals();
    updateBalances();
    speakMessage('Welcome to Global Pilgrim Bank user dashboard, Olawale.');
});

// Voice Prompt System
function speakMessage(message) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(message);
        utterance.rate = 0.9;
        utterance.pitch = 1;
        speechSynthesis.speak(utterance);
    }
}

// Load User Data
function loadUserData() {
    document.getElementById('userName').textContent = userData.name;
    document.getElementById('userEmail').textContent = userData.email;
    document.getElementById('accountNumber').textContent = userData.accountNumber;
    
    // Load balance cards
    document.getElementById('totalBalance').textContent = formatCurrency(userData.totalBalance);
    document.getElementById('savingsBalance').textContent = formatCurrency(userData.savingsBalance);
    document.getElementById('investmentBalance').textContent = formatCurrency(userData.investmentBalance);
    
    // Load cards
    loadCards();
    
    // Load crypto wallets
    loadCryptoWallets();
    
    // Load transactions
    loadTransactions();
}

// Load Cards
function loadCards() {
    const cardsContainer = document.getElementById('cardsContainer');
    if (cardsContainer) {
        cardsContainer.innerHTML = '';
        userCards.forEach((card, index) => {
            const cardElement = document.createElement('div');
            cardElement.className = 'card-item';
            cardElement.innerHTML = `
                <div class="card-visual" style="background: ${card.color}">
                    <div class="card-chip"></div>
                    <div class="card-number">${card.number}</div>
                    <div class="card-details">
                        <div class="card-holder">${userData.name}</div>
                        <div class="card-expiry">${card.expiry}</div>
                    </div>
                    <div class="card-type">${card.type}</div>
                </div>
                <div class="card-info">
                    <h4>${card.type} Card</h4>
                    <p>Balance: ${formatCurrency(card.balance)}</p>
                    <span class="status ${card.status}">${card.status}</span>
                </div>
            `;
            cardsContainer.appendChild(cardElement);
        });
    }
}

// Load Crypto Wallets
function loadCryptoWallets() {
    const cryptoContainer = document.getElementById('cryptoContainer');
    if (cryptoContainer) {
        cryptoContainer.innerHTML = '';
        cryptoWallets.forEach(wallet => {
            const cryptoElement = document.createElement('div');
            cryptoElement.className = 'crypto-item';
            cryptoElement.innerHTML = `
                <div class="crypto-icon">
                    <i class="fab fa-bitcoin"></i>
                </div>
                <div class="crypto-details">
                    <h4>${wallet.name} (${wallet.symbol})</h4>
                    <p>${wallet.balance} ${wallet.symbol}</p>
                </div>
                <div class="crypto-value">
                    <h4>${formatCurrency(wallet.value)}</h4>
                    <span class="change ${wallet.change.includes('+') ? 'positive' : 'negative'}">${wallet.change}</span>
                </div>
            `;
            cryptoContainer.appendChild(cryptoElement);
        });
    }
}

// Load Transactions
function loadTransactions() {
    const transactionsContainer = document.getElementById('transactionsContainer');
    if (transactionsContainer) {
        transactionsContainer.innerHTML = '';
        transactions.slice(0, 5).forEach(transaction => {
            const transactionElement = document.createElement('div');
            transactionElement.className = 'transaction-item';
            const icon = getTransactionIcon(transaction.type);
            transactionElement.innerHTML = `
                <div class="transaction-icon ${transaction.type}">
                    <i class="fas ${icon}"></i>
                </div>
                <div class="transaction-details">
                    <h4>${transaction.description}</h4>
                    <p>${formatDate(transaction.date)}</p>
                </div>
                <div class="transaction-amount ${transaction.amount >= 0 ? 'positive' : 'negative'}">
                    ${transaction.amount >= 0 ? '+' : ''}${formatCurrency(transaction.amount)}
                </div>
            `;
            transactionsContainer.appendChild(transactionElement);
        });
    }
}

// Get Transaction Icon
function getTransactionIcon(type) {
    const icons = {
        deposit: 'fa-arrow-down',
        withdrawal: 'fa-arrow-up',
        transfer: 'fa-exchange-alt',
        payment: 'fa-credit-card',
        crypto: 'fa-coins',
        fx: 'fa-sync'
    };
    return icons[type] || 'fa-receipt';
}

// Initialize Charts
function initCharts() {
    // Spending Chart
    const spendingCtx = document.getElementById('spendingChart');
    if (spendingCtx) {
        new Chart(spendingCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Spending',
                    data: [4500, 5200, 4800, 6100, 5800, 6300],
                    borderColor: '#4169e1',
                    backgroundColor: 'rgba(65, 105, 225, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    }
                }
            }
        });
    }
}

// Initialize FX Calculator
function initFXCalculator() {
    const amountInput = document.getElementById('fxAmount');
    const fromCurrency = document.getElementById('fromCurrency');
    const toCurrency = document.getElementById('toCurrency');
    const exchangeBtn = document.getElementById('exchangeBtn');
    
    if (exchangeBtn) {
        exchangeBtn.addEventListener('click', function() {
            const amount = parseFloat(amountInput.value);
            const from = fromCurrency.value;
            const to = toCurrency.value;
            
            if (amount > 0) {
                const rate = fxRates[to] / fxRates[from];
                const result = amount * rate;
                document.getElementById('fxResult').textContent = 
                    `${amount.toFixed(2)} ${from} = ${result.toFixed(2)} ${to}`;
                document.getElementById('fxRate').textContent = 
                    `Rate: 1 ${from} = ${rate.toFixed(4)} ${to}`;
                speakMessage(`Exchange calculated. ${amount} ${from} equals ${result.toFixed(2)} ${to}`);
            } else {
                alert('Please enter a valid amount');
            }
        });
    }
}

// Initialize Modals
function initModals() {
    // Send Money Modal
    const sendMoneyBtn = document.getElementById('sendMoneyBtn');
    const sendMoneyModal = document.getElementById('sendMoneyModal');
    const closeSendModal = document.getElementById('closeSendModal');
    
    if (sendMoneyBtn && sendMoneyModal) {
        sendMoneyBtn.addEventListener('click', () => sendMoneyModal.style.display = 'block');
        if (closeSendModal) {
            closeSendModal.addEventListener('click', () => sendMoneyModal.style.display = 'none');
        }
    }
    
    // Deposit Modal
    const depositBtn = document.getElementById('depositBtn');
    const depositModal = document.getElementById('depositModal');
    const closeDepositModal = document.getElementById('closeDepositModal');
    
    if (depositBtn && depositModal) {
        depositBtn.addEventListener('click', () => depositModal.style.display = 'block');
        if (closeDepositModal) {
            closeDepositModal.addEventListener('click', () => depositModal.style.display = 'none');
        }
    }
    
    // Withdraw Modal
    const withdrawBtn = document.getElementById('withdrawBtn');
    const withdrawModal = document.getElementById('withdrawModal');
    const closeWithdrawModal = document.getElementById('closeWithdrawModal');
    
    if (withdrawBtn && withdrawModal) {
        withdrawBtn.addEventListener('click', () => withdrawModal.style.display = 'block');
        if (closeWithdrawModal) {
            closeWithdrawModal.addEventListener('click', () => withdrawModal.style.display = 'none');
        }
    }
    
    // Close modals on outside click
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
}

// Transfer to Forex
function transferToForex() {
    const amount = prompt('Enter amount to transfer to Meta Forex:');
    if (amount && !isNaN(amount)) {
        const transferAmount = parseFloat(amount);
        if (transferAmount > 0 && transferAmount <= userData.totalBalance) {
            userData.totalBalance -= transferAmount;
            updateBalances();
            
            // Add transaction record
            transactions.unshift({
                id: transactions.length + 1,
                type: 'transfer',
                description: 'Transfer to Meta Forex',
                amount: -transferAmount,
                date: new Date().toISOString().split('T')[0],
                status: 'completed'
            });
            
            loadTransactions();
            alert(`Successfully transferred ${formatCurrency(transferAmount)} to Meta Forex Trading Platform`);
            speakMessage(`Transfer successful. ${formatCurrency(transferAmount)} sent to Meta Forex.`);
        } else {
            alert('Invalid amount or insufficient balance');
        }
    }
}

// Update Balances
function updateBalances() {
    document.getElementById('totalBalance').textContent = formatCurrency(userData.totalBalance);
    document.getElementById('savingsBalance').textContent = formatCurrency(userData.savingsBalance);
    document.getElementById('investmentBalance').textContent = formatCurrency(userData.investmentBalance);
}

// Format Currency
function formatCurrency(amount) {
    return '$' + amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Format Date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Send Money
function sendMoney() {
    const recipient = document.getElementById('sendRecipient').value;
    const amount = parseFloat(document.getElementById('sendAmount').value);
    const currency = document.getElementById('sendCurrency').value;
    
    if (recipient && amount > 0 && amount <= userData.totalBalance) {
        userData.totalBalance -= amount;
        updateBalances();
        
        transactions.unshift({
            id: transactions.length + 1,
            type: 'transfer',
            description: `Transfer to ${recipient}`,
            amount: -amount,
            date: new Date().toISOString().split('T')[0],
            status: 'completed'
        });
        
        loadTransactions();
        document.getElementById('sendMoneyModal').style.display = 'none';
        alert(`Successfully sent ${formatCurrency(amount)} to ${recipient}`);
        speakMessage(`Money sent successfully to ${recipient}`);
    } else {
        alert('Please check your details and try again');
    }
}

// Deposit Funds
function depositFunds() {
    const amount = parseFloat(document.getElementById('depositAmount').value);
    const method = document.getElementById('depositMethod').value;
    
    if (amount > 0) {
        userData.totalBalance += amount;
        userData.savingsBalance += amount;
        updateBalances();
        
        transactions.unshift({
            id: transactions.length + 1,
            type: 'deposit',
            description: `Deposit via ${method}`,
            amount: amount,
            date: new Date().toISOString().split('T')[0],
            status: 'completed'
        });
        
        loadTransactions();
        document.getElementById('depositModal').style.display = 'none';
        alert(`Successfully deposited ${formatCurrency(amount)}`);
        speakMessage(`Deposit successful. ${formatCurrency(amount)} added to your account.`);
    } else {
        alert('Please enter a valid amount');
    }
}

// Withdraw Funds
function withdrawFunds() {
    const amount = parseFloat(document.getElementById('withdrawAmount').value);
    const method = document.getElementById('withdrawMethod').value;
    
    if (amount > 0 && amount <= userData.totalBalance) {
        userData.totalBalance -= amount;
        updateBalances();
        
        transactions.unshift({
            id: transactions.length + 1,
            type: 'withdrawal',
            description: `Withdrawal via ${method}`,
            amount: -amount,
            date: new Date().toISOString().split('T')[0],
            status: 'completed'
        });
        
        loadTransactions();
        document.getElementById('withdrawModal').style.display = 'none';
        alert(`Successfully withdrawn ${formatCurrency(amount)}`);
        speakMessage(`Withdrawal successful. ${formatCurrency(amount)} debited from your account.`);
    } else {
        alert('Please check your balance and try again');
    }
}

// Freeze Card
function freezeCard(cardId) {
    const card = userCards.find(c => c.id === cardId);
    if (card) {
        card.status = card.status === 'active' ? 'frozen' : 'active';
        loadCards();
        speakMessage(`Card ${card.status === 'active' ? 'activated' : 'frozen'} successfully`);
    }
}

// Purchase Crypto
function purchaseCrypto(symbol, amount) {
    const wallet = cryptoWallets.find(w => w.symbol === symbol);
    if (wallet && amount > 0 && amount <= userData.totalBalance) {
        userData.totalBalance -= amount;
        wallet.balance += amount / (wallet.value / wallet.balance);
        wallet.value += amount;
        updateBalances();
        loadCryptoWallets();
        
        transactions.unshift({
            id: transactions.length + 1,
            type: 'crypto',
            description: `${wallet.name} Purchase`,
            amount: -amount,
            date: new Date().toISOString().split('T')[0],
            status: 'completed'
        });
        
        loadTransactions();
        speakMessage(`Successfully purchased ${formatCurrency(amount)} worth of ${wallet.name}`);
    } else {
        alert('Insufficient balance or invalid amount');
    }
}

// Quick Action Functions
function quickDeposit() {
    document.getElementById('depositModal').style.display = 'block';
}

function quickTransfer() {
    document.getElementById('sendMoneyModal').style.display = 'block';
}

function quickWithdraw() {
    document.getElementById('withdrawModal').style.display = 'block';
}

function viewAllTransactions() {
    alert('Full transaction history feature coming soon!');
}

function manageCards() {
    alert('Card management feature coming soon!');
}

function settings() {
    alert('Settings feature coming soon!');
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        window.location.href = 'index.html';
    }
}