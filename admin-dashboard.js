// Admin Dashboard
document.addEventListener('DOMContentLoaded', function() {
    var role = localStorage.getItem('userRole');
    if (role !== 'admin') {
        window.location.href = 'auth.html?role=admin';
        return;
    }

    var defaultBooths = [
        { id: 1, name: 'Plaza A', location: 'Highway 101 North', lanes: 4, operator: 'John Smith', rate: 15.50 },
        { id: 2, name: 'Plaza B', location: 'Highway 101 South', lanes: 6, operator: 'Jane Doe', rate: 20.00 },
        { id: 3, name: 'Plaza C', location: 'Interstate 5', lanes: 5, operator: 'Mike Johnson', rate: 12.50 }
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
                        '<span>Rate: <strong class="text-success">$' + booth.rate.toFixed(2) + '</strong></span>' +
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
                tollBooths = tollBooths.filter(function(b) { return b.id !== id; });
                renderBooths();
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
            rate: parseFloat(document.getElementById('boothRate').value)
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
        modal.classList.remove('active');
    });

    renderBooths();
});