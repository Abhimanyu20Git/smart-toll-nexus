// User Dashboard
document.addEventListener('DOMContentLoaded', function() {
    var role = localStorage.getItem('userRole');
    if (role !== 'user') {
        window.location.href = 'auth.html?role=user';
        return;
    }

    var defaultTransactions = [
        { id: 1, date: '2025-08-07', time: '14:30', booth: 'Plaza A - Lane 3', amount: 15.50, type: 'toll' },
        { id: 2, date: '2025-08-06', time: '09:15', booth: 'Wallet Recharge', amount: 100.00, type: 'recharge' },
        { id: 3, date: '2025-08-05', time: '18:45', booth: 'Plaza B - Lane 1', amount: 20.00, type: 'toll' },
        { id: 4, date: '2025-08-04', time: '11:20', booth: 'Plaza C - Lane 2', amount: 12.50, type: 'toll' }
    ];

    var walletBalance = parseFloat(localStorage.getItem('walletBalance')) || 250.50;
    var transactions = JSON.parse(localStorage.getItem('transactions')) || defaultTransactions;

    function saveData() {
        localStorage.setItem('walletBalance', walletBalance.toString());
        localStorage.setItem('transactions', JSON.stringify(transactions));
    }

    document.getElementById('logoutBtn').addEventListener('click', function() {
        localStorage.removeItem('userRole');
        localStorage.removeItem('userEmail');
        window.location.href = 'index.html';
    });

    function updateWalletDisplay() {
        document.getElementById('walletAmount').textContent = '$' + walletBalance.toFixed(2);
    }

    function renderTransactions() {
        var list = document.getElementById('transactionList');
        list.innerHTML = '';

        transactions.forEach(function(tx) {
            var div = document.createElement('div');
            div.className = 'transaction-item';

            var iconClass = tx.type === 'recharge' ? 'tx-icon-recharge' : 'tx-icon-toll';
            var sign = tx.type === 'recharge' ? '+' : '-';
            var amountClass = tx.type === 'recharge' ? 'tx-amount-green' : '';

            div.innerHTML =
                '<div class="tx-left">' +
                    '<div class="tx-icon ' + iconClass + '">' + (tx.type === 'recharge' ? 'R' : 'T') + '</div>' +
                    '<div>' +
                        '<div class="tx-booth">' + tx.booth + '</div>' +
                        '<div class="tx-date">' + tx.date + ' at ' + tx.time + '</div>' +
                    '</div>' +
                '</div>' +
                '<div class="tx-amount ' + amountClass + '">' + sign + '$' + tx.amount.toFixed(2) + '</div>';

            list.appendChild(div);
        });
    }

    // Recharge modal
    var modal = document.getElementById('rechargeModal');
    var rechargeInput = document.getElementById('rechargeAmount');

    document.getElementById('rechargeBtn').addEventListener('click', function() {
        modal.classList.add('active');
        rechargeInput.value = '';
    });

    document.getElementById('closeModal').addEventListener('click', function() {
        modal.classList.remove('active');
    });

    modal.addEventListener('click', function(e) {
        if (e.target === modal) modal.classList.remove('active');
    });

    document.querySelectorAll('.preset-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            rechargeInput.value = btn.dataset.amount;
        });
    });

    document.getElementById('payNowBtn').addEventListener('click', function() {
        var amount = parseFloat(parseFloat(rechargeInput.value).toFixed(2));
        if (isNaN(amount) || amount <= 0) {
            showToast('Please enter a valid amount');
            return;
        }

        walletBalance += amount;
        updateWalletDisplay();

        var now = new Date();
        var dateStr = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0');
        var timeStr = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');

        transactions.unshift({
            id: transactions.length + 1,
            date: dateStr,
            time: timeStr,
            booth: 'Wallet Recharge',
            amount: amount,
            type: 'recharge'
        });

        saveData();
        renderTransactions();
        modal.classList.remove('active');
        showToast('Wallet recharged with $' + amount.toFixed(2));
    });

    updateWalletDisplay();
    renderTransactions();
});
