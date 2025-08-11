// Admin Dashboard
document.addEventListener('DOMContentLoaded', function() {
    var role = localStorage.getItem('userRole');
    if (role !== 'admin') {
        window.location.href = 'auth.html?role=admin';
        return;
    }

    var nextId = 4;
    var tollBooths = [
        { id: 1, name: 'Plaza A', location: 'Highway 101 North', lanes: 4, operator: 'John Smith', rate: 15.50 },
        { id: 2, name: 'Plaza B', location: 'Highway 101 South', lanes: 6, operator: 'Jane Doe', rate: 20.00 },
        { id: 3, name: 'Plaza C', location: 'Interstate 5', lanes: 5, operator: 'Mike Johnson', rate: 12.50 }
    ];

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
                        '<span>Rate: <strong class="text-success">$' + booth.rate.toFixed(2) + '</strong></span>' +
                    '</div>' +
                '</div>' +
                '<div class="booth-actions">' +
                    '<button class="btn btn-sm btn-danger delete-booth" data-id="' + booth.id + '">Delete</button>' +
                '</div>';
            list.appendChild(div);
        });

        document.querySelectorAll('.delete-booth').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var id = parseInt(btn.dataset.id);
                tollBooths = tollBooths.filter(function(b) { return b.id !== id; });
                renderBooths();
                showToast('Toll booth removed');
            });
        });
    }

    // Add booth modal
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
        var newBooth = {
            id: nextId++,
            name: document.getElementById('boothName').value,
            location: document.getElementById('boothLocation').value,
            lanes: parseInt(document.getElementById('boothLanes').value),
            operator: document.getElementById('boothOperator').value,
            rate: parseFloat(document.getElementById('boothRate').value)
        };
        tollBooths.push(newBooth);
        renderBooths();
        modal.classList.remove('active');
        showToast('Toll booth added successfully');
    });

    renderBooths();
});

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
