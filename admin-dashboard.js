// Admin Dashboard
document.addEventListener('DOMContentLoaded', function() {
    var role = localStorage.getItem('userRole');
    if (role !== 'admin') {
        window.location.href = 'auth.html?role=admin';
        return;
    }

    document.getElementById('logoutBtn').addEventListener('click', function() {
        localStorage.removeItem('userRole');
        localStorage.removeItem('userEmail');
        window.location.href = 'index.html';
    });
});
