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

    requestNotificationPermission();

    function updateWalletDisplay() {
        document.getElementById('walletAmount').textContent = '\u20B9' + walletBalance.toFixed(2);
    }

    function renderTransactions() {
        var list = document.getElementById('transactionList');
        list.innerHTML = '';

        if (transactions.length === 0) {
            list.innerHTML = '<div class="empty-state"><p>No transactions yet</p></div>';
            return;
        }

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
                '<div class="tx-right">' +
                    '<div class="tx-amount ' + amountClass + '">' + sign + '\u20B9' + tx.amount.toFixed(2) + '</div>' +
                    (navigator.share ? '<button class="btn btn-ghost btn-sm share-tx" data-id="' + tx.id + '">Share</button>' : '') +
                '</div>';

            list.appendChild(div);
        });

        // Share transaction
        list.querySelectorAll('.share-tx').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var txId = parseInt(btn.dataset.id);
                var tx = transactions.find(function(t) { return t.id === txId; });
                if (!tx) return;
                var sign = tx.type === 'recharge' ? '+' : '-';
                navigator.share({
                    title: 'SmartToll Receipt',
                    text: tx.booth + '\n' + tx.date + ' at ' + tx.time + '\nAmount: ' + sign + '\u20B9' + tx.amount.toFixed(2)
                }).catch(function() {});
            });
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
        showToast('Wallet recharged with \u20B9' + amount.toFixed(2));
        if (walletBalance < 50) {
            sendNotification('Low Balance', 'Your wallet balance is \u20B9' + walletBalance.toFixed(2) + '. Please recharge.');
        }
    });

    updateWalletDisplay();
    renderTransactions();

    // Export CSV
    document.getElementById('exportCsvBtn').addEventListener('click', function() {
        if (transactions.length === 0) {
            showToast('No transactions to export');
            return;
        }
        var csv = 'Date,Time,Description,Type,Amount\n';
        transactions.forEach(function(tx) {
            csv += tx.date + ',' + tx.time + ',"' + tx.booth + '",' + tx.type + ',' + tx.amount.toFixed(2) + '\n';
        });
        var blob = new Blob([csv], { type: 'text/csv' });
        var link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'smarttoll-transactions.csv';
        link.click();
        URL.revokeObjectURL(link.href);
        showToast('Transactions exported');
    });

    // QR Toll Pass
    var vehicleNum = 'MH-01-AB-1234';
    var qrUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=' + encodeURIComponent('SMARTTOLL:' + vehicleNum + ':RFID_ACTIVE');
    var qrImg = document.createElement('img');
    qrImg.src = qrUrl;
    qrImg.alt = 'Toll Pass QR Code';
    document.getElementById('qrCode').appendChild(qrImg);
    document.getElementById('qrVehicle').textContent = vehicleNum;

    document.getElementById('downloadQrBtn').addEventListener('click', function() {
        var link = document.createElement('a');
        link.href = qrUrl;
        link.download = 'smarttoll-pass-' + vehicleNum + '.png';
        link.click();
        showToast('Downloading toll pass');
    });

    // Share QR pass via Web Share API
    var shareBtn = document.getElementById('shareQrBtn');
    if (shareBtn) {
        if (navigator.share) {
            shareBtn.style.display = 'inline-flex';
            shareBtn.addEventListener('click', function() {
                navigator.share({
                    title: 'SmartToll Pass - ' + vehicleNum,
                    text: 'My SmartToll digital toll pass for vehicle ' + vehicleNum,
                    url: qrUrl
                }).catch(function() {});
            });
        } else {
            shareBtn.style.display = 'none';
        }
    }

    // Nearest Booth - Geolocation
    var boothLocations = JSON.parse(localStorage.getItem('tollBooths')) || [
        { name: 'Plaza A', location: 'NH48 Mumbai-Pune Expressway', rate: 15.50, lat: 19.0760, lng: 72.8777 },
        { name: 'Plaza B', location: 'NH44 Bangalore Highway', rate: 20.00, lat: 18.5204, lng: 73.8567 },
        { name: 'Plaza C', location: 'NH60 Nashik Bypass', rate: 12.50, lat: 19.9975, lng: 73.7898 }
    ];

    function haversineDistance(lat1, lng1, lat2, lng2) {
        var R = 6371;
        var dLat = (lat2 - lat1) * Math.PI / 180;
        var dLng = (lng2 - lng1) * Math.PI / 180;
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLng / 2) * Math.sin(dLng / 2);
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }

    document.getElementById('findNearestBtn').addEventListener('click', function() {
        var content = document.getElementById('nearestBoothContent');
        content.innerHTML = '<p class="text-muted">Locating you...</p>';

        if (!navigator.geolocation) {
            content.innerHTML = '<p class="text-muted">Geolocation is not supported by your browser</p>';
            return;
        }

        navigator.geolocation.getCurrentPosition(function(pos) {
            var userLat = pos.coords.latitude;
            var userLng = pos.coords.longitude;
            var nearest = null;
            var minDist = Infinity;

            boothLocations.forEach(function(booth) {
                if (!booth.lat || !booth.lng) return;
                var dist = haversineDistance(userLat, userLng, booth.lat, booth.lng);
                if (dist < minDist) {
                    minDist = dist;
                    nearest = booth;
                }
            });

            if (nearest) {
                var eta = Math.round(minDist / 60 * 60);
                content.innerHTML =
                    '<div class="nearest-result">' +
                        '<div class="nearest-name">' + nearest.name + '</div>' +
                        '<div class="nearest-location">' + nearest.location + '</div>' +
                        '<div class="nearest-stats">' +
                            '<span><strong>' + minDist.toFixed(1) + '</strong> km away</span>' +
                            '<span><strong>~' + eta + '</strong> min drive</span>' +
                            '<span>Rate: <strong>\u20B9' + nearest.rate.toFixed(2) + '</strong></span>' +
                        '</div>' +
                    '</div>';
            }
        }, function() {
            content.innerHTML = '<p class="text-muted">Unable to get your location. Please allow location access.</p>';
        });
    });
});
