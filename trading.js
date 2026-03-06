// Trading Terminal JavaScript

// Trading data
let selectedPair = 'EUR/USD';
let currentPrice = 1.0875;
let priceHistory = [];
let priceChart = null;
let robotActive = false;
let robotInterval = null;
let robotProfitToday = 0;
let activeTrades = [];
let tradeHistory = [];

// User balances
let userRealBalance = 50000.00;
let userProfitBalance = 12500.00;

// Price data for different pairs
const priceData = {
    'EUR/USD': { current: 1.0875, history: [1.0850, 1.0860, 1.0870, 1.0865, 1.0875], volatility: 0.0001 },
    'GBP/USD': { current: 1.2680, history: [1.2690, 1.2685, 1.2680, 1.2675, 1.2680], volatility: 0.00015 },
    'USD/JPY': { current: 148.50, history: [148.45, 148.48, 148.50, 148.47, 148.50], volatility: 0.05 },
    'BTC/USD': { current: 43250, history: [43100, 43150, 43200, 43225, 43250], volatility: 10 }
};

// Initialize terminal
document.addEventListener('DOMContentLoaded', function() {
    initChart();
    updateBalances();
    updatePriceDisplay();
    startPriceSimulation();
});

// Initialize chart
function initChart() {
    const ctx = document.getElementById('priceChart');
    if (!ctx) return;

    priceHistory = priceData[selectedPair].history;
    
    priceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: priceHistory.map((_, i) => i),
            datasets: [{
                label: selectedPair,
                data: priceHistory,
                borderColor: '#00d4ff',
                backgroundColor: 'rgba(0, 212, 255, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 0,
                pointHoverRadius: 5
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
                    display: false
                },
                y: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#a0aec0'
                    }
                }
            },
            animation: {
                duration: 0
            }
        }
    });
}

// Select trading pair
function selectPair(pair) {
    selectedPair = pair;
    currentPrice = priceData[pair].current;
    priceHistory = priceData[pair].history;
    
    document.getElementById('selectedPair').textContent = pair;
    updatePriceDisplay();
    
    if (priceChart) {
        priceChart.data.datasets[0].label = pair;
        priceChart.data.datasets[0].data = priceHistory;
        priceChart.update();
    }
}

// Update price display
function updatePriceDisplay() {
    const priceElement = document.getElementById('currentPrice');
    const priceDisplay = currentPrice.toFixed(selectedPair === 'BTC/USD' ? 2 : 4);
    
    if (priceElement) {
        priceElement.textContent = priceDisplay;
        
        // Flash green or red based on price movement
        const previousPrice = priceHistory[priceHistory.length - 2] || currentPrice;
        if (currentPrice > previousPrice) {
            priceElement.className = 'price-display price-up';
        } else if (currentPrice < previousPrice) {
            priceElement.className = 'price-display price-down';
        }
    }

    // Update pair prices
    updatePairPrices();
}

// Update individual pair prices
function updatePairPrices() {
    Object.keys(priceData).forEach(pair => {
        const elementId = pair.toLowerCase().replace('/', '') + '-price';
        const element = document.getElementById(elementId);
        if (element) {
            const price = priceData[pair].current;
            element.textContent = pair === 'BTC/USD' ? price.toFixed(2) : price.toFixed(4);
        }
    });
}

// Start price simulation
function startPriceSimulation() {
    setInterval(() => {
        // Simulate price movement
        const change = (Math.random() - 0.5) * 2 * priceData[selectedPair].volatility;
        currentPrice += change;
        
        // Update history
        priceHistory.push(currentPrice);
        if (priceHistory.length > 100) {
            priceHistory.shift();
        }
        
        // Update price data
        priceData[selectedPair].current = currentPrice;
        priceData[selectedPair].history = [...priceHistory];
        
        // Simulate other pairs
        Object.keys(priceData).forEach(pair => {
            if (pair !== selectedPair) {
                const pairChange = (Math.random() - 0.5) * 2 * priceData[pair].volatility;
                priceData[pair].current += pairChange;
                priceData[pair].history.push(priceData[pair].current);
                if (priceData[pair].history.length > 100) {
                    priceData[pair].history.shift();
                }
            }
        });
        
        updatePriceDisplay();
        
        if (priceChart) {
            priceChart.data.datasets[0].data = priceHistory;
            priceChart.data.labels = priceHistory.map((_, i) => i);
            priceChart.update('none');
        }
        
        // Check active trades
        checkActiveTrades();
        
    }, 1000);
}

// Execute trade
function executeTrade(type) {
    const amount = parseFloat(document.getElementById('tradeAmount').value);
    const leverage = parseInt(document.getElementById('leverage').value);
    const stopLoss = parseFloat(document.getElementById('stopLoss').value) || null;
    const takeProfit = parseFloat(document.getElementById('takeProfit').value) || null;
    
    if (amount > userRealBalance) {
        showNotification('Insufficient balance!', 'error');
        return;
    }
    
    // Deduct from real balance
    userRealBalance -= amount;
    updateBalances();
    
    // Create trade
    const trade = {
        id: Date.now(),
        pair: selectedPair,
        type: type,
        entry: currentPrice,
        amount: amount,
        leverage: leverage,
        stopLoss: stopLoss,
        takeProfit: takeProfit,
        status: 'active',
        startTime: new Date()
    };
    
    activeTrades.push(trade);
    updateActiveTrades();
    showNotification(`${type.toUpperCase()} trade opened on ${selectedPair}`, 'success');
}

// Check active trades
function checkActiveTrades() {
    activeTrades.forEach((trade, index) => {
        const price = priceData[trade.pair].current;
        const pipValue = trade.pair === 'BTC/USD' ? 1 : 0.0001;
        const pips = trade.type === 'buy' ? (price - trade.entry) / pipValue : (trade.entry - price) / pipValue;
        const profit = pips * trade.amount * trade.leverage;
        
        // Check stop loss
        if (trade.stopLoss && profit <= -trade.stopLoss) {
            closeTrade(index, price, profit, 'stopped');
            return;
        }
        
        // Check take profit
        if (trade.takeProfit && profit >= trade.takeProfit) {
            closeTrade(index, price, profit, 'profit');
            return;
        }
        
        // Update trade display
        updateActiveTrades();
    });
}

// Close trade
function closeTrade(index, exitPrice, profit, status) {
    const trade = activeTrades[index];
    
    // Add profit back to balance
    if (profit > 0) {
        userProfitBalance += profit;
    } else {
        userRealBalance += (trade.amount + profit);
    }
    
    // Add to history
    const historyEntry = {
        ...trade,
        exit: exitPrice,
        profit: profit,
        status: status,
        endTime: new Date()
    };
    
    tradeHistory.unshift(historyEntry);
    activeTrades.splice(index, 1);
    
    updateBalances();
    updateActiveTrades();
    updateTradeHistory();
    
    showNotification(`Trade closed: ${profit > 0 ? '+' : ''}$${profit.toFixed(2)}`, profit > 0 ? 'success' : 'error');
}

// Update active trades display
function updateActiveTrades() {
    const container = document.getElementById('activeTrades');
    if (!container) return;
    
    if (activeTrades.length === 0) {
        container.innerHTML = '<p style="color: var(--text-secondary); text-align: center;">No active trades</p>';
        return;
    }
    
    container.innerHTML = activeTrades.map((trade, index) => {
        const currentPrice = priceData[trade.pair].current;
        const pipValue = trade.pair === 'BTC/USD' ? 1 : 0.0001;
        const pips = trade.type === 'buy' ? (currentPrice - trade.entry) / pipValue : (trade.entry - currentPrice) / pipValue;
        const profit = pips * trade.amount * trade.leverage;
        
        return `
            <div class="trade-row" style="margin-bottom: 10px; padding: 10px; background: rgba(255, 255, 255, 0.02); border-radius: 8px;">
                <div>
                    <div style="font-weight: 600;">${trade.pair}</div>
                    <div style="color: ${trade.type === 'buy' ? 'var(--success-color)' : 'var(--danger-color)'}; font-size: 12px;">
                        ${trade.type.toUpperCase()}
                    </div>
                </div>
                <div style="text-align: right;">
                    <div class="${profit >= 0 ? 'trade-profit' : 'trade-loss'}">
                        ${profit >= 0 ? '+' : ''}$${profit.toFixed(2)}
                    </div>
                    <button class="btn btn-danger btn-sm" onclick="closeTrade(${index}, ${currentPrice}, ${profit}, 'manual')">
                        Close
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Update trade history
function updateTradeHistory() {
    const tbody = document.getElementById('tradeHistoryBody');
    if (!tbody) return;
    
    tbody.innerHTML = tradeHistory.slice(0, 10).map(trade => `
        <tr>
            <td>${trade.endTime.toLocaleTimeString()}</td>
            <td>${trade.pair}</td>
            <td style="color: ${trade.type === 'buy' ? 'var(--success-color)' : 'var(--danger-color)'};">
                ${trade.type.toUpperCase()}
            </td>
            <td>${trade.entry.toFixed(trade.pair === 'BTC/USD' ? 2 : 4)}</td>
            <td>${trade.exit.toFixed(trade.pair === 'BTC/USD' ? 2 : 4)}</td>
            <td>$${trade.amount.toLocaleString()}</td>
            <td class="${trade.profit >= 0 ? 'trade-profit' : 'trade-loss'}">
                ${trade.profit >= 0 ? '+' : ''}$${trade.profit.toFixed(2)}
            </td>
            <td><span class="status status-${trade.status === 'profit' ? 'active' : 'inactive'}">${trade.status}</span></td>
        </tr>
    `).join('');
}

// Robot trading functions
function startRobotTrading() {
    if (robotActive) {
        showNotification('Robot is already running!', 'warning');
        return;
    }
    
    robotActive = true;
    robotProfitToday = 0;
    
    document.getElementById('robotIndicator').style.background = 'var(--success-color)';
    document.getElementById('robotStatusText').textContent = 'Active';
    document.getElementById('robotStatusText').style.color = 'var(--success-color)';
    
    // Start robot trading loop
    robotInterval = setInterval(robotTradingLoop, 2000);
    
    showNotification('Robot trading started!', 'success');
}

function stopRobotTrading() {
    if (!robotActive) {
        showNotification('Robot is not running!', 'warning');
        return;
    }
    
    robotActive = false;
    
    if (robotInterval) {
        clearInterval(robotInterval);
        robotInterval = null;
    }
    
    document.getElementById('robotIndicator').style.background = 'var(--danger-color)';
    document.getElementById('robotStatusText').textContent = 'Stopped';
    document.getElementById('robotStatusText').style.color = 'var(--danger-color)';
    
    showNotification('Robot trading stopped!', 'warning');
}

function robotTradingLoop() {
    const autoTrade = document.getElementById('robotAutoTrade').value === 'yes';
    const pullDuration = parseInt(document.getElementById('pullDuration').value);
    const profitTransferInterval = parseInt(document.getElementById('profitTransferInterval').value);
    const maxTradeAmount = parseFloat(document.getElementById('maxRobotTrade').value);
    const targetWallet = document.getElementById('targetWallet').value;
    
    if (!autoTrade) {
        return;
    }
    
    // Analyze price movement
    const price = priceData[selectedPair].current;
    const priceHistory = priceData[selectedPair].history;
    
    if (priceHistory.length < pullDuration) {
        return;
    }
    
    // Check for pull and fall pattern
    const recentPrices = priceHistory.slice(-pullDuration);
    const priceChange = price - recentPrices[0];
    const isPullingUp = priceChange > priceData[selectedPair].volatility * pullDuration;
    const isFallingDown = priceChange < -priceData[selectedPair].volatility * pullDuration;
    
    // Execute trade based on pattern
    if ((isPullingUp || isFallingDown) && userRealBalance >= maxTradeAmount) {
        const tradeType = isPullingUp ? 'buy' : 'sell';
        
        // Execute robot trade
        userRealBalance -= maxTradeAmount;
        
        const trade = {
            id: Date.now(),
            pair: selectedPair,
            type: tradeType,
            entry: price,
            amount: maxTradeAmount,
            leverage: 100,
            stopLoss: null,
            takeProfit: null,
            status: 'active',
            startTime: new Date(),
            isRobot: true
        };
        
        activeTrades.push(trade);
        
        // Wait for profit taking
        setTimeout(() => {
            const exitPrice = priceData[trade.pair].current;
            const pipValue = trade.pair === 'BTC/USD' ? 1 : 0.0001;
            const pips = trade.type === 'buy' ? (exitPrice - trade.entry) / pipValue : (trade.entry - exitPrice) / pipValue;
            let profit = pips * trade.amount * trade.leverage;
            
            // Ensure positive profit
            profit = Math.max(profit, maxTradeAmount * 0.01);
            
            // Close trade and transfer profit
            const tradeIndex = activeTrades.findIndex(t => t.id === trade.id);
            if (tradeIndex !== -1) {
                activeTrades.splice(tradeIndex, 1);
            }
            
            // Transfer profit to target wallet
            if (targetWallet === 'profit') {
                userProfitBalance += profit;
            } else {
                userRealBalance += (maxTradeAmount + profit);
            }
            
            // Track robot profit
            robotProfitToday += profit;
            
            // Add to history
            const historyEntry = {
                ...trade,
                exit: exitPrice,
                profit: profit,
                status: 'profit',
                endTime: new Date()
            };
            
            tradeHistory.unshift(historyEntry);
            
            updateBalances();
            updateActiveTrades();
            updateTradeHistory();
            updateRobotProfit();
            
            showNotification(`Robot profit: +$${profit.toFixed(2)}`, 'success');
        }, profitTransferInterval * 1000);
    }
}

// Update robot profit display
function updateRobotProfit() {
    const element = document.getElementById('robotProfitToday');
    if (element) {
        element.textContent = '$' + robotProfitToday.toFixed(2);
    }
}

// Update balances
function updateBalances() {
    const realElement = document.getElementById('userRealBalance');
    const profitElement = document.getElementById('userProfitBalance');
    
    if (realElement) {
        realElement.textContent = '$' + userRealBalance.toLocaleString('en-US', {minimumFractionDigits: 2});
    }
    
    if (profitElement) {
        profitElement.textContent = '$' + userProfitBalance.toLocaleString('en-US', {minimumFractionDigits: 2});
    }
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

// Close trade function for manual close
window.closeTrade = function(index, exitPrice, profit, status) {
    closeTrade(index, exitPrice, profit, status);
};