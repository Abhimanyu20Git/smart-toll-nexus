// Operator Dashboard
document.addEventListener('DOMContentLoaded', function() {
    var role = localStorage.getItem('userRole');
    if (role !== 'operator') {
        window.location.href = 'auth.html?role=operator';
        return;
    }

    var vehicles = [
        { id: 1, number: 'MH-01-AB-1234', status: 'paid', amount: 15.50, time: '14:35:20', lane: 3 },
        { id: 2, number: 'DL-02-CD-5678', status: 'processing', amount: 15.50, time: '14:35:15', lane: 3 },
        { id: 3, number: 'KA-03-EF-9012', status: 'paid', amount: 15.50, time: '14:34:58', lane: 3 },
        { id: 4, number: 'TN-04-GH-3456', status: 'paid', amount: 15.50, time: '14:34:42', lane: 3 }
    ];

    document.getElementById('logoutBtn').addEventListener('click', function() {
        localStorage.removeItem('userRole');
        localStorage.removeItem('userEmail');
        window.location.href = 'index.html';
    });

    function renderVehicles() {
        var list = document.getElementById('vehicleList');
        list.innerHTML = '';

        vehicles.forEach(function(v) {
            var div = document.createElement('div');
            div.className = 'vehicle-item';

            var statusClass = 'v-status-' + v.status;
            var statusIcon = v.status === 'paid' ? 'âœ“' : v.status === 'failed' ? 'âœ—' : '...';

            div.innerHTML =
                '<div class="v-left">' +
                    '<div class="v-icon ' + statusClass + '">' + statusIcon + '</div>' +
                    '<div>' +
                        '<div class="v-number">' + v.number + '</div>' +
                        '<div class="v-meta">Lane ' + v.lane + ' - ' + v.time + '</div>' +
                    '</div>' +
                '</div>' +
                '<div class="v-right">' +
                    '<div class="v-amount">$' + v.amount.toFixed(2) + '</div>' +
                    '<span class="v-badge ' + statusClass + '">' + v.status.charAt(0).toUpperCase() + v.status.slice(1) + '</span>' +
                '</div>';

            list.appendChild(div);
        });
    }

    // Simulate status changes every 3 seconds
    setInterval(function() {
        vehicles = vehicles.map(function(v) {
            if (v.status === 'processing') {
                v.status = Math.random() > 0.15 ? 'paid' : 'failed';
            }
            return v;
        });
        renderVehicles();
    }, 3000);

    renderVehicles();
});
