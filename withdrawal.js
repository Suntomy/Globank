// Withdrawal Page JavaScript

// User balances
let userBalances = {
    real: 50000.00,
    profit: 12500.00,
    credit: 5000.00
};

// Update withdrawal details based on method
function updateWithdrawalDetails() {
    const method = document.getElementById('withdrawalMethod').value;
    const bankDetails = document.getElementById('bankWithdrawalDetails');
    const cryptoDetails = document.getElementById('cryptoWithdrawalDetails');
    const paypalDetails = document.getElementById('paypalWithdrawalDetails');
    
    // Hide all details
    bankDetails.style.display = 'none';
    cryptoDetails.style.display = 'none';
    paypalDetails.style.display = 'none';
    
    // Show relevant details based on method
    if (method.includes('bank')) {
        bankDetails.style.display = 'block';
    } else if (method.includes('bitcoin') || method.includes('ethereum') || method.includes('usdt')) {
        cryptoDetails.style.display = 'block';
    } else if (method === 'paypal') {
        paypalDetails.style.display = 'block';
    }
    
    // Update fee display
    updateFee();
}

// Update withdrawal fee
function updateFee() {
    const amount = parseFloat(document.getElementById('withdrawalAmount').value) || 0;
    const feeInput = document.getElementById('withdrawalFee');
    
    // No fees for withdrawals over $500
    let fee = 0;
    if (amount < 500 && amount > 0) {
        fee = amount * 0.02; // 2% fee for small withdrawals
    }
    
    feeInput.value = '$' + fee.toFixed(2);
}

// Process withdrawal
function processWithdrawal() {
    const withdrawalType = document.getElementById('withdrawalType').value;
    const method = document.getElementById('withdrawalMethod').value;
    const amount = parseFloat(document.getElementById('withdrawalAmount').value);
    
    // Validation
    if (!method) {
        showNotification('Please select a withdrawal method', 'error');
        return;
    }
    
    if (!amount || amount < 10) {
        showNotification('Minimum withdrawal amount is $10', 'error');
        return;
    }
    
    // Check balance
    const availableBalance = userBalances[withdrawalType];
    if (amount > availableBalance) {
        showNotification('Insufficient balance', 'error');
        return;
    }
    
    // Calculate fee
    let fee = 0;
    if (amount < 500) {
        fee = amount * 0.02;
    }
    
    const netAmount = amount - fee;
    
    // Collect additional details based on method
    let withdrawalDetails = {};
    
    if (method.includes('bank')) {
        withdrawalDetails = {
            bankName: document.getElementById('bankName').value,
            accountNumber: document.getElementById('accountNumber').value,
            accountHolderName: document.getElementById('accountHolderName').value,
            swiftCode: document.getElementById('swiftCode').value
        };
        
        if (!withdrawalDetails.bankName || !withdrawalDetails.accountNumber || !withdrawalDetails.accountHolderName) {
            showNotification('Please fill in all bank details', 'error');
            return;
        }
    } else if (method.includes('bitcoin') || method.includes('ethereum') || method.includes('usdt')) {
        withdrawalDetails = {
            walletAddress: document.getElementById('walletAddress').value
        };
        
        if (!withdrawalDetails.walletAddress) {
            showNotification('Please enter your wallet address', 'error');
            return;
        }
    } else if (method === 'paypal') {
        withdrawalDetails = {
            paypalEmail: document.getElementById('paypalEmail').value
        };
        
        if (!withdrawalDetails.paypalEmail) {
            showNotification('Please enter your PayPal email', 'error');
            return;
        }
    }
    
    // Show confirmation
    let message = `Withdrawal Request:\n\n`;
    message += `Type: ${withdrawalType.charAt(0).toUpperCase() + withdrawalType.slice(1)} Balance\n`;
    message += `Amount: $${amount.toFixed(2)}\n`;
    message += `Fee: $${fee.toFixed(2)}\n`;
    message += `Net Amount: $${netAmount.toFixed(2)}\n`;
    message += `Method: ${formatMethod(method)}\n\n`;
    message += `Proceed with withdrawal?`;
    
    if (confirm(message)) {
        // Deduct balance
        userBalances[withdrawalType] -= amount;
        
        // Update display
        updateBalanceDisplay();
        
        // Simulate processing
        showNotification('Processing withdrawal request...', 'warning');
        
        setTimeout(() => {
            // Add to withdrawal history
            addWithdrawalToHistory(amount, method);
            
            // Show success
            showNotification(`Withdrawal of $${amount.toFixed(2)} requested! Net amount: $${netAmount.toFixed(2)}`, 'success');
            
            // Clear form
            document.getElementById('withdrawalAmount').value = '100';
            
        }, 2000);
    }
}

// Update balance display
function updateBalanceDisplay() {
    document.getElementById('realBalance').textContent = '$' + userBalances.real.toLocaleString('en-US', {minimumFractionDigits: 2});
    document.getElementById('profitBalance').textContent = '$' + userBalances.profit.toLocaleString('en-US', {minimumFractionDigits: 2});
    document.getElementById('creditBalance').textContent = '$' + userBalances.credit.toLocaleString('en-US', {minimumFractionDigits: 2});
    
    // Update withdrawal type dropdown
    const select = document.getElementById('withdrawalType');
    select.innerHTML = `
        <option value="profit">Profit Balance (Available: $${userBalances.profit.toLocaleString('en-US', {minimumFractionDigits: 2})})</option>
        <option value="real">Real Balance (Available: $${userBalances.real.toLocaleString('en-US', {minimumFractionDigits: 2})})</option>
        <option value="credit">Credit Balance (Available: $${userBalances.credit.toLocaleString('en-US', {minimumFractionDigits: 2})})</option>
    `;
}

// Add withdrawal to history
function addWithdrawalToHistory(amount, method) {
    const tbody = document.getElementById('withdrawalHistory');
    const now = new Date();
    const transactionId = 'WTH' + Date.now().toString().slice(-9);
    
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${now.toISOString().split('T')[0]}</td>
        <td>$${amount.toLocaleString('en-US', {minimumFractionDigits: 2})}</td>
        <td>${formatMethod(method)}</td>
        <td>${transactionId}</td>
        <td><span class="status status-inactive">Pending</span></td>
    `;
    
    tbody.insertBefore(row, tbody.firstChild);
}

// Format method name
function formatMethod(method) {
    const methodNames = {
        'bank_usd': 'International Bank Transfer',
        'bank_ngn': 'Nigerian Bank Transfer',
        'bank_uk': 'UK Bank Transfer',
        'paypal': 'PayPal',
        'flutterwave': 'Flutterwave',
        'paystack': 'Paystack',
        'bitcoin': 'Bitcoin',
        'ethereum': 'Ethereum',
        'usdt': 'USDT',
        'opay': 'OPay',
        'palmpay': 'PalmPay'
    };
    
    return methodNames[method] || method;
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

// Update fee on amount change
document.getElementById('withdrawalAmount').addEventListener('input', updateFee);