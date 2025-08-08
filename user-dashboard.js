// User Dashboard
document.addEventListener('DOMContentLoaded', function() {
    var role = localStorage.getItem('userRole');
    if (role !== 'user') {
        window.location.href = 'auth.html?role=user';
        return;
    }

    document.getElementById('logoutBtn').addEventListener('click', function() {
        localStorage.removeItem('userRole');
        localStorage.removeItem('userEmail');
        window.location.href = 'index.html';
    });
});
