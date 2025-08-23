// Auth page logic
document.addEventListener('DOMContentLoaded', function() {
    const params = new URLSearchParams(window.location.search);
    const role = params.get('role') || 'user';

    // If already logged in, redirect
    var savedRole = localStorage.getItem('userRole');
    if (savedRole) {
        window.location.href = savedRole + '-dashboard.html';
        return;
    }

    // Set role specific content
    var roleIcon = document.getElementById('roleIcon');
    var roleTitle = document.getElementById('roleTitle');

    if (role === 'admin') {
        roleIcon.textContent = 'A';
        roleIcon.style.background = 'var(--primary)';
        roleTitle.textContent = 'Administrator Portal';
    document.title = roleTitle.textContent + ' - SmartToll Connect';
    } else if (role === 'operator') {
        roleIcon.textContent = 'O';
        roleIcon.style.background = 'var(--secondary)';
        roleTitle.textContent = 'Toll Booth Operator';
    document.title = roleTitle.textContent + ' - SmartToll Connect';
    } else {
        roleIcon.textContent = 'U';
        roleIcon.style.background = 'var(--accent)';
        roleTitle.textContent = 'User Portal';
    document.title = roleTitle.textContent + ' - SmartToll Connect';
    }

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

    // Login handler
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        var email = document.getElementById('loginEmail').value;
        localStorage.setItem('userRole', role);
        localStorage.setItem('userEmail', email);
        var submitBtn = loginForm.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Signing in...';
        submitBtn.disabled = true;
        showToast('Login successful!');
        setTimeout(function() {
            window.location.href = role + '-dashboard.html';
        }, 1000);
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
        sendOtpBtn.textContent = 'Sending...';
        sendOtpBtn.disabled = true;
        showToast('OTP sent to your email and phone!');
        setTimeout(function() {
            sendOtpBtn.textContent = 'Send OTP';
            sendOtpBtn.disabled = false;
        }, 500);
    });

    changeDetailsBtn.addEventListener('click', function() {
        registerFields.style.display = 'flex';
        otpSection.style.display = 'none';
    });

    // Register handler
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        var email = document.getElementById('regEmail').value;
        localStorage.setItem('userRole', role);
        localStorage.setItem('userEmail', email);
        showToast('Registration successful!');
        setTimeout(function() {
            window.location.href = role + '-dashboard.html';
        }, 800);
    });

    // Hide vehicle field for non user roles
    if (role !== 'user') {
        var vehicleField = document.getElementById('vehicleField');
        if (vehicleField) vehicleField.style.display = 'none';
    }

    // Check if mode param says register
    var mode = params.get('mode');
    if (mode === 'register') {
        tabs.forEach(function(t) { t.classList.remove('active'); });
        tabs[1].classList.add('active');
        loginForm.style.display = 'none';
        registerForm.style.display = 'flex';
    }
});

// Toast notification
function showToast(message) {
    var existing = document.querySelector('.toast');
    if (existing) existing.remove();

    var toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(function() { toast.classList.add('show'); }, 10);
    setTimeout(function() {
        toast.classList.remove('show');
        setTimeout(function() { toast.remove(); }, 300);
    }, 2500);
}
