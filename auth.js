// Auth page logic
document.addEventListener('DOMContentLoaded', function() {
    const params = new URLSearchParams(window.location.search);
    const role = params.get('role') || 'user';

    // Tab switching
    const tabs = document.querySelectorAll('.auth-tab');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    tabs.forEach(function(tab) {
        tab.addEventListener('click', function() {
            tabs.forEach(function(t) { t.classList.remove('active'); });
            tab.classList.add('active');

            if (tab.dataset.tab === 'login') {
                loginForm.style.display = 'flex';
                registerForm.style.display = 'none';
            } else {
                loginForm.style.display = 'none';
                registerForm.style.display = 'flex';
            }
        });
    });

    // OTP flow
    var sendOtpBtn = document.getElementById('sendOtpBtn');
    var otpSection = document.getElementById('otpSection');
    var registerFields = document.getElementById('registerFields');
    var changeDetailsBtn = document.getElementById('changeDetailsBtn');

    sendOtpBtn.addEventListener('click', function() {
        registerFields.style.display = 'none';
        otpSection.style.display = 'flex';
        otpSection.style.flexDirection = 'column';
        otpSection.style.gap = '16px';
    });

    changeDetailsBtn.addEventListener('click', function() {
        registerFields.style.display = 'flex';
        otpSection.style.display = 'none';
    });

    // Hide vehicle field for non user roles
    if (role !== 'user') {
        var vehicleField = document.getElementById('vehicleField');
        if (vehicleField) vehicleField.style.display = 'none';
    }
});
