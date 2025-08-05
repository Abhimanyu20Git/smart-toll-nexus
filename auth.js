// Auth page logic
document.addEventListener('DOMContentLoaded', function() {
    const params = new URLSearchParams(window.location.search);
    const role = params.get('role') || 'user';

    console.log('Auth page loaded for role:', role);
});
