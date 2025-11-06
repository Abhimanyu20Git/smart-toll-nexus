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

    requestNotificationPermission();

    // Traffic Alert based on weather
    function checkTrafficAlert(weatherCode) {
        var alert = document.getElementById('trafficAlert');
        var msg = document.getElementById('alertMessage');
        if (weatherCode >= 61 && weatherCode <= 67) {
            msg.textContent = 'Heavy rain expected. Expect slower traffic and reduced visibility.';
            alert.style.display = 'flex';
            alert.className = 'alert-banner alert-warning';
        } else if (weatherCode >= 95) {
            msg.textContent = 'Thunderstorm warning. Be cautious of vehicles stopping suddenly.';
            alert.style.display = 'flex';
            alert.className = 'alert-banner alert-danger';
        } else if (weatherCode >= 45 && weatherCode <= 48) {
            msg.textContent = 'Foggy conditions. Vehicles may be moving slower than usual.';
            alert.style.display = 'flex';
            alert.className = 'alert-banner alert-warning';
        }
    }

    document.getElementById('dismissAlert').addEventListener('click', function() {
        document.getElementById('trafficAlert').style.display = 'none';
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
                var paid = Math.random() > 0.15;
                v.status = paid ? 'paid' : 'failed';
                changed = true;
                if (paid) {
                    sendNotification('Toll Paid', v.number + ' - \u20B9' + v.amount.toFixed(2) + ' collected');
                } else {
                    sendNotification('Payment Failed', v.number + ' - toll payment failed');
                }
            }
            return v;
        });
        if (changed) renderVehicles();
    }, 3000);

    renderVehicles();

    // Weather Widget - Open-Meteo API (no key needed)
    var storedBooths = JSON.parse(localStorage.getItem('tollBooths')) || [];
    var assignedBooth = storedBooths.length > 0 ? storedBooths[0] : null;
    var boothLat = assignedBooth && assignedBooth.lat ? assignedBooth.lat : 19.0760;
    var boothLng = assignedBooth && assignedBooth.lng ? assignedBooth.lng : 72.8777;
    var weatherUrl = 'https://api.open-meteo.com/v1/forecast?latitude=' + boothLat + '&longitude=' + boothLng + '&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,apparent_temperature&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=Asia%2FKolkata&forecast_days=3';

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

    function loadWeather() {
        document.getElementById('weatherContent').innerHTML = '<p class="text-muted">Loading weather data...</p>';
        fetch(weatherUrl)
            .then(function(res) { return res.json(); })
            .then(function(data) {
                var c = data.current;
                var d = data.daily;
                var el = document.getElementById('weatherContent');
                var forecastHtml = '';
                if (d && d.time) {
                    forecastHtml = '<div class="weather-forecast">';
                    for (var i = 1; i < d.time.length; i++) {
                        var dayName = new Date(d.time[i]).toLocaleDateString('en-IN', { weekday: 'short' });
                        forecastHtml += '<div class="forecast-day">' +
                            '<span class="forecast-name">' + dayName + '</span>' +
                            '<span class="forecast-icon">' + getWeatherEmoji(d.weather_code[i]) + '</span>' +
                            '<span class="forecast-range">' + Math.round(d.temperature_2m_min[i]) + '-' + Math.round(d.temperature_2m_max[i]) + '\u00B0</span>' +
                        '</div>';
                    }
                    forecastHtml += '</div>';
                }
                el.innerHTML =
                    '<div class="weather-main">' +
                        '<span class="weather-emoji">' + getWeatherEmoji(c.weather_code) + '</span>' +
                        '<span class="weather-temp">' + c.temperature_2m + '\u00B0C</span>' +
                    '</div>' +
                    '<div class="weather-label">' + getWeatherLabel(c.weather_code) + ' &middot; Feels like ' + c.apparent_temperature + '\u00B0C</div>' +
                    '<div class="weather-details">' +
                        '<span>Humidity: <strong>' + c.relative_humidity_2m + '%</strong></span>' +
                        '<span>Wind: <strong>' + c.wind_speed_10m + ' km/h</strong></span>' +
                    '</div>' +
                    forecastHtml +
                    '<button class="btn btn-ghost btn-sm" id="refreshWeather">Refresh</button>';
                document.getElementById('refreshWeather').addEventListener('click', loadWeather);
                checkTrafficAlert(c.weather_code);
            })
            .catch(function() {
                document.getElementById('weatherContent').innerHTML =
                    '<p class="text-muted">Unable to load weather data</p>' +
                    '<button class="btn btn-ghost btn-sm" id="retryWeather">Retry</button>';
                document.getElementById('retryWeather').addEventListener('click', loadWeather);
            });
    }

    loadWeather();

    // Hourly Traffic Chart
    var hours = ['6AM','7AM','8AM','9AM','10AM','11AM','12PM','1PM','2PM'];
    var hourlyData = hours.map(function() { return Math.floor(10 + Math.random() * 30); });
    var isDark = document.body.classList.contains('dark');
    var trafficCtx = document.getElementById('trafficChart').getContext('2d');
    new Chart(trafficCtx, {
        type: 'line',
        data: {
            labels: hours,
            datasets: [{
                label: 'Vehicles',
                data: hourlyData,
                borderColor: isDark ? '#34d399' : '#17a589',
                backgroundColor: isDark ? 'rgba(52,211,153,0.1)' : 'rgba(23,165,137,0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: true, ticks: { color: isDark ? '#94a3b8' : '#5d6d7e' } },
                x: { ticks: { color: isDark ? '#94a3b8' : '#5d6d7e' } }
            }
        }
    });
});
