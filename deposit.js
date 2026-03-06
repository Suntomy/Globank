// Deposit Page JavaScript

function updateDepositDetails() {
    const method = document.getElementById('depositMethod').value;
    const bankDetails = document.getElementById('bankDetails');
    const cryptoDetails = document.getElementById('cryptoDetails');
    const gatewayDetails = document.getElementById('gatewayDetails');
    
    // Hide all details
    bankDetails.style.display = 'none';
    cryptoDetails.style.display = 'none';
    gatewayDetails.style.display = 'none';
    
    // Show relevant details based on method
    if (method.includes('bank')) {
        bankDetails.style.display = 'block';
    } else if (method.includes('bitcoin') || method.includes('ethereum') || method.includes('usdt')) {
        cryptoDetails.style.display = 'block';
    } else if (method) {
        gatewayDetails.style.display = 'block';
    }
}

function processDeposit() {
    const method = document.getElementById('depositMethod').value;
    const amount = parseFloat(document.getElementById('depositAmount').value);
    const currency = document.getElementById('depositCurrency').value;
    const promoCode = document.getElementById('promoCode').value;
    
    // Validation
    if (!method) {
        showNotification('Please select a deposit method', 'error');
        return;
    }
    
    if (!amount || amount < 10) {
        showNotification('Minimum deposit amount is $10', 'error');
        return;
    }
    
    if (amount > 100000) {
        showNotification('Maximum deposit amount is $100,000 per transaction', 'error');
        return;
    }
    
    // Calculate bonus
    let bonus = 0;
    if (amount >= 5000) {
        bonus = amount * 0.25;
    } else if (amount >= 1000) {
        bonus = amount * 0.15;
    } else if (amount >= 500) {
        bonus = amount * 0.10;
    } else if (amount >= 100) {
        bonus = amount * 0.05;
    }
    
    // Show confirmation
    let message = `Deposit Amount: $${amount.toLocaleString()}\n`;
    if (bonus > 0) {
        message += `Bonus: $${bonus.toFixed(2)}\n`;
        message += `Total Credit: $${(amount + bonus).toFixed(2)}\n`;
    }
    message += `Method: ${method}\n`;
    message += `Currency: ${currency}\n`;
    
    if (promoCode) {
        message += `Promo Code: ${promoCode}\n`;
    }
    
    message += '\nProceed with deposit?';
    
    if (confirm(message)) {
        // Simulate deposit processing
        showNotification('Processing deposit...', 'warning');
        
        setTimeout(() => {
            // Add to deposit history
            addDepositToHistory(amount, method);
            
            // Show success
            showNotification(`Deposit of $${amount.toLocaleString()} successful!${bonus > 0 ? ' Bonus: $' + bonus.toFixed(2) : ''}`, 'success');
            
            // Clear form
            document.getElementById('depositAmount').value = '100';
            document.getElementById('promoCode').value = '';
            
        }, 2000);
    }
}

function addDepositToHistory(amount, method) {
    const tbody = document.getElementById('depositHistory');
    const now = new Date();
    const transactionId = 'TXN' + Date.now().toString().slice(-9);
    
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${now.toISOString().split('T')[0]}</td>
        <td>$${amount.toLocaleString('en-US', {minimumFractionDigits: 2})}</td>
        <td>${formatMethod(method)}</td>
        <td>${transactionId}</td>
        <td><span class="status status-active">Completed</span></td>
    `;
    
    tbody.insertBefore(row, tbody.firstChild);
}

function formatMethod(method) {
    const methodNames = {
        'bank_usd': 'International Bank Transfer',
        'bank_ngn': 'Nigerian Bank Transfer',
        'bank_uk': 'UK Bank Transfer',
        'paypal': 'PayPal',
        'stripe': 'Credit/Debit Card',
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

function copyAddress() {
    const address = 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh';
    navigator.clipboard.writeText(address).then(() => {
        showNotification('Wallet address copied to clipboard!', 'success');
    }).catch(() => {
        showNotification('Failed to copy address', 'error');
    });
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        window.location.href = 'index.html';
    }
}