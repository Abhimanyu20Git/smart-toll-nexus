// Admin Dashboard
document.addEventListener('DOMContentLoaded', function() {
    var role = localStorage.getItem('userRole');
    if (role !== 'admin') {
        window.location.href = 'auth.html?role=admin';
        return;
    }

    var defaultBooths = [
        { id: 1, name: 'Plaza A', location: 'NH48 Mumbai-Pune Expressway', lanes: 4, operator: 'John Smith', rate: 15.50, lat: 19.0760, lng: 72.8777 },
        { id: 2, name: 'Plaza B', location: 'NH44 Bangalore Highway', lanes: 6, operator: 'Jane Doe', rate: 20.00, lat: 18.5204, lng: 73.8567 },
        { id: 3, name: 'Plaza C', location: 'NH60 Nashik Bypass', lanes: 5, operator: 'Mike Johnson', rate: 12.50, lat: 19.9975, lng: 73.7898 }
    ];

    var tollBooths = JSON.parse(localStorage.getItem('tollBooths')) || defaultBooths;
    var nextId = tollBooths.length > 0 ? Math.max.apply(null, tollBooths.map(function(b) { return b.id; })) + 1 : 1;

    function saveBooths() {
        localStorage.setItem('tollBooths', JSON.stringify(tollBooths));
    }

    var modal = document.getElementById('boothModal');
    var boothForm = document.getElementById('boothForm');

    document.getElementById('logoutBtn').addEventListener('click', function() {
        localStorage.removeItem('userRole');
        localStorage.removeItem('userEmail');
        window.location.href = 'index.html';
    });

    function renderBooths() {
        var list = document.getElementById('boothList');
        list.innerHTML = '';
        document.getElementById('boothCount').textContent = tollBooths.length;

        tollBooths.forEach(function(booth) {
            var div = document.createElement('div');
            div.className = 'booth-item';
            div.innerHTML =
                '<div class="booth-info">' +
                    '<h4>' + booth.name + '</h4>' +
                    '<p class="text-muted">' + booth.location + '</p>' +
                    '<div class="booth-meta">' +
                        '<span><strong>' + booth.lanes + '</strong> lanes</span>' +
                        '<span>Operator: <strong>' + booth.operator + '</strong></span>' +
                        '<span>Rate: <strong class="text-success">\u20B9' + booth.rate.toFixed(2) + '</strong></span>' +
                    '</div>' +
                '</div>' +
                '<div class="booth-actions">' +
                    '<button class="btn btn-sm btn-outline-dark edit-booth" data-id="' + booth.id + '">Edit</button>' +
                    '<button class="btn btn-sm btn-danger delete-booth" data-id="' + booth.id + '">Delete</button>' +
                '</div>';
            list.appendChild(div);
        });

        document.querySelectorAll('.delete-booth').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var id = parseInt(btn.dataset.id);
                if (!confirm('Are you sure you want to delete this toll booth?')) return;
                tollBooths = tollBooths.filter(function(b) { return b.id !== id; });
                renderBooths();
                renderMapMarkers();
                saveBooths();
                showToast('Toll booth removed');
            });
        });

        document.querySelectorAll('.edit-booth').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var id = parseInt(btn.dataset.id);
                var booth = tollBooths.find(function(b) { return b.id === id; });
                if (!booth) return;

                document.getElementById('boothModalTitle').textContent = 'Edit Toll Booth';
                document.getElementById('boothModalDesc').textContent = 'Update toll booth configuration';
                document.getElementById('boothSubmitBtn').textContent = 'Update Booth';
                document.getElementById('boothName').value = booth.name;
                document.getElementById('boothLocation').value = booth.location;
                document.getElementById('boothLanes').value = booth.lanes;
                document.getElementById('boothOperator').value = booth.operator;
                document.getElementById('boothRate').value = booth.rate;
                document.getElementById('boothLat').value = booth.lat || '';
                document.getElementById('boothLng').value = booth.lng || '';
                boothForm.dataset.editId = booth.id;
                modal.classList.add('active');
            });
        });
    }

    // Add booth
    document.getElementById('addBoothBtn').addEventListener('click', function() {
        document.getElementById('boothModalTitle').textContent = 'Add Toll Booth';
        document.getElementById('boothModalDesc').textContent = 'Create a new toll booth configuration';
        document.getElementById('boothSubmitBtn').textContent = 'Add Booth';
        boothForm.reset();
        boothForm.dataset.editId = '';
        modal.classList.add('active');
    });

    document.getElementById('closeBoothModal').addEventListener('click', function() {
        modal.classList.remove('active');
    });

    modal.addEventListener('click', function(e) {
        if (e.target === modal) modal.classList.remove('active');
    });

    boothForm.addEventListener('submit', function(e) {
        e.preventDefault();

        var boothData = {
            name: document.getElementById('boothName').value,
            location: document.getElementById('boothLocation').value,
            lanes: parseInt(document.getElementById('boothLanes').value),
            operator: document.getElementById('boothOperator').value,
            rate: parseFloat(document.getElementById('boothRate').value),
            lat: parseFloat(document.getElementById('boothLat').value) || null,
            lng: parseFloat(document.getElementById('boothLng').value) || null
        };

        var editId = boothForm.dataset.editId;
        if (editId) {
            // Editing
            var id = parseInt(editId);
            tollBooths = tollBooths.map(function(b) {
                if (b.id === id) {
                    return Object.assign({}, b, boothData);
                }
                return b;
            });
            saveBooths();
            showToast('Toll booth updated successfully');
        } else {
            // Adding
            boothData.id = nextId++;
            tollBooths.push(boothData);
            saveBooths();
            showToast('Toll booth added successfully');
        }

        renderBooths();
        renderMapMarkers();
        modal.classList.remove('active');
    });

    renderBooths();

    // Leaflet Map
    var map = L.map('boothMap').setView([19.0760, 73.5], 8);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    var markers = [];

    function renderMapMarkers() {
        markers.forEach(function(m) { map.removeLayer(m); });
        markers = [];
        tollBooths.forEach(function(booth) {
            if (booth.lat && booth.lng) {
                var marker = L.marker([booth.lat, booth.lng]).addTo(map);
                marker.bindPopup(
                    '<strong>' + booth.name + '</strong><br>' +
                    booth.location + '<br>' +
                    'Operator: ' + booth.operator + '<br>' +
                    'Rate: \u20B9' + booth.rate.toFixed(2) + '<br>' +
                    '<em>' + booth.lanes + ' lanes</em>'
                );
                markers.push(marker);
            }
        });
        if (markers.length > 0) {
            var group = L.featureGroup(markers);
            map.fitBounds(group.getBounds().pad(0.3));
        }
    }

    renderMapMarkers();

    // Revenue Chart
    var isDark = document.body.classList.contains('dark');
    var chartTextColor = isDark ? '#e2e8f0' : '#1c2833';
    var chartGridColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)';

    var revenueCtx = document.getElementById('revenueChart').getContext('2d');
    var revenueChart = new Chart(revenueCtx, {
        type: 'line',
        data: {
            labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
            datasets: [{
                label: 'Revenue (\u20B9)',
                data: [28500, 32100, 35600, 38200, 42800, 45231],
                borderColor: isDark ? '#60a5fa' : '#1a5276',
                backgroundColor: isDark ? 'rgba(96,165,250,0.1)' : 'rgba(26,82,118,0.1)',
                fill: true,
                tension: 0.3,
                pointRadius: 4,
                pointBackgroundColor: isDark ? '#60a5fa' : '#1a5276'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: {
                    beginAtZero: false,
                    ticks: {
                        color: chartTextColor,
                        callback: function(v) { return '\u20B9' + v.toLocaleString(); }
                    },
                    grid: { color: chartGridColor }
                },
                x: { ticks: { color: chartTextColor }, grid: { color: chartGridColor } }
            }
        }
    });

    // Vehicle Count Chart
    var vehicleCtx = document.getElementById('vehicleChart').getContext('2d');
    var vehicleChart = new Chart(vehicleCtx, {
        type: 'bar',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Vehicles',
                data: [420, 385, 450, 410, 520, 680, 590],
                backgroundColor: isDark ? '#34d399' : '#17a589',
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: true, ticks: { color: chartTextColor }, grid: { color: chartGridColor } },
                x: { ticks: { color: chartTextColor }, grid: { color: chartGridColor } }
            }
        }
    });

    // Update charts on dark mode toggle
    var dmToggle = document.getElementById('darkModeToggle');
    if (dmToggle) {
        dmToggle.addEventListener('click', function() {
            setTimeout(function() {
                var dark = document.body.classList.contains('dark');
                var tc = dark ? '#e2e8f0' : '#1c2833';
                var gc = dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)';

                revenueChart.data.datasets[0].borderColor = dark ? '#60a5fa' : '#1a5276';
                revenueChart.data.datasets[0].backgroundColor = dark ? 'rgba(96,165,250,0.1)' : 'rgba(26,82,118,0.1)';
                revenueChart.data.datasets[0].pointBackgroundColor = dark ? '#60a5fa' : '#1a5276';
                revenueChart.options.scales.y.ticks.color = tc;
                revenueChart.options.scales.x.ticks.color = tc;
                revenueChart.options.scales.y.grid.color = gc;
                revenueChart.options.scales.x.grid.color = gc;
                revenueChart.update();

                vehicleChart.data.datasets[0].backgroundColor = dark ? '#34d399' : '#17a589';
                vehicleChart.options.scales.y.ticks.color = tc;
                vehicleChart.options.scales.x.ticks.color = tc;
                vehicleChart.options.scales.y.grid.color = gc;
                vehicleChart.options.scales.x.grid.color = gc;
                vehicleChart.update();
            }, 50);
        });
    }

    // Revenue by Booth - Doughnut Chart
    var boothRevenueCtx = document.getElementById('boothRevenueChart').getContext('2d');
    var boothNames = tollBooths.map(function(b) { return b.name; });
    var boothRevenues = tollBooths.map(function(b) { return Math.round(b.rate * (300 + Math.random() * 200)); });
    var doughnutColors = ['#1a5276', '#17a589', '#e67e22', '#8e44ad', '#e74c3c'];

    new Chart(boothRevenueCtx, {
        type: 'doughnut',
        data: {
            labels: boothNames,
            datasets: [{
                data: boothRevenues,
                backgroundColor: doughnutColors.slice(0, boothNames.length),
                borderWidth: 2,
                borderColor: isDark ? '#1e293b' : '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: { color: chartTextColor, padding: 16, font: { size: 13 } }
                }
            }
        }
    });
});