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
        { id: 4, number: 'TN-04-GH-3456', status: 'detected', amount: 15.50, time: '14:34:42', lane: 3 }
    ];

    document.getElementById('logoutBtn').addEventListener('click', function() {
        localStorage.removeItem('userRole');
        localStorage.removeItem('userEmail');
        window.location.href = 'index.html';
    });

    function getStatusIcon(status) {
        if (status === 'paid') return '&#10003;';
        if (status === 'failed') return '&#10007;';
        if (status === 'detected') return '&#9673;';
        return '&#8943;';
    }

    function getStatusLabel(status) {
        return status.charAt(0).toUpperCase() + status.slice(1);
    }

    function renderVehicles() {
        var list = document.getElementById('vehicleList');
        var html = '';

        vehicles.forEach(function(v) {
            var statusClass = 'v-status-' + v.status;

            html +=
                '<div class="vehicle-item">' +
                    '<div class="v-left">' +
                        '<div class="v-icon ' + statusClass + '">' + getStatusIcon(v.status) + '</div>' +
                        '<div>' +
                            '<div class="v-number">' + v.number + '</div>' +
                            '<div class="v-meta">Lane ' + v.lane + ' - ' + v.time + '</div>' +
                        '</div>' +
                    '</div>' +
                    '<div class="v-right">' +
                        '<div class="v-amount">\u20B9' + v.amount.toFixed(2) + '</div>' +
                        '<span class="v-badge ' + statusClass + '">' + getStatusLabel(v.status) + '</span>' +
                    '</div>' +
                '</div>';
        });

        list.innerHTML = html;
    }

    // Simulate status progression
    var simInterval = setInterval(function() {
        var changed = false;
        vehicles = vehicles.map(function(v) {
            if (v.status === 'detected') {
                v.status = 'processing';
                changed = true;
            } else if (v.status === 'processing') {
                v.status = Math.random() > 0.15 ? 'paid' : 'failed';
                changed = true;
            }
            return v;
        });
        if (changed) renderVehicles();
    }, 3000);

    renderVehicles();

    // Weather Widget - Open-Meteo API (no key needed)
    var boothLat = 19.0760;
    var boothLng = 72.8777;
    var weatherUrl = 'https://api.open-meteo.com/v1/forecast?latitude=' + boothLat + '&longitude=' + boothLng + '&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=Asia%2FKolkata';

    function getWeatherLabel(code) {
        if (code === 0) return 'Clear Sky';
        if (code <= 3) return 'Partly Cloudy';
        if (code <= 48) return 'Foggy';
        if (code <= 57) return 'Drizzle';
        if (code <= 65) return 'Rainy';
        if (code <= 77) return 'Snow';
        if (code <= 82) return 'Rain Showers';
        if (code <= 86) return 'Snow Showers';
        if (code >= 95) return 'Thunderstorm';
        return 'Unknown';
    }

    function getWeatherEmoji(code) {
        if (code === 0) return '\u2600';
        if (code <= 3) return '\u26C5';
        if (code <= 48) return '\uD83C\uDF2B';
        if (code <= 65) return '\uD83C\uDF27';
        if (code <= 77) return '\u2744';
        if (code >= 95) return '\u26A1';
        return '\uD83C\uDF24';
    }

    fetch(weatherUrl)
        .then(function(res) { return res.json(); })
        .then(function(data) {
            var c = data.current;
            var el = document.getElementById('weatherContent');
            el.innerHTML =
                '<div class="weather-main">' +
                    '<span class="weather-emoji">' + getWeatherEmoji(c.weather_code) + '</span>' +
                    '<span class="weather-temp">' + c.temperature_2m + '\u00B0C</span>' +
                '</div>' +
                '<div class="weather-label">' + getWeatherLabel(c.weather_code) + '</div>' +
                '<div class="weather-details">' +
                    '<span>Humidity: <strong>' + c.relative_humidity_2m + '%</strong></span>' +
                    '<span>Wind: <strong>' + c.wind_speed_10m + ' km/h</strong></span>' +
                '</div>';
        })
        .catch(function() {
            document.getElementById('weatherContent').innerHTML = '<p class="text-muted">Unable to load weather data</p>';
        });
});
