
// Prevent dark mode flash
(function() {
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark');
    }
})();
// SmartToll Connect - Shared JS

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

// Dark mode
function initDarkMode() {
    var saved = localStorage.getItem('darkMode');
    if (saved === 'true') {
        document.body.classList.add('dark');
    }

    var toggle = document.getElementById('darkModeToggle');
    if (toggle) {
        toggle.addEventListener('click', function() {
            document.body.classList.toggle('dark');
            var isDark = document.body.classList.contains('dark');
            localStorage.setItem('darkMode', isDark);
            toggle.textContent = isDark ? '\u2600' : '\u263E';
        });

        // Set initial icon
        toggle.textContent = document.body.classList.contains('dark') ? '\u2600' : '\u263E';
    }
}

document.addEventListener('DOMContentLoaded', initDarkMode);


// Scroll detection for landing nav
function initNavScroll() {
    var nav = document.querySelector('.landing-nav');
    if (!nav) return;

    window.addEventListener('scroll', function() {
        if (window.scrollY > 60) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    initNavScroll();
});

// Notification helper
function sendNotification(title, body) {
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, { body: body, icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 32 32%22><text y=%2228%22 font-size=%2228%22>🛣</text></svg>' });
    }
}

function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
}

// Close modals on Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        var modals = document.querySelectorAll('.modal-overlay.active');
        modals.forEach(function(m) {
            m.classList.remove('active');
        });
    }
});