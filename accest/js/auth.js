function checkAuth() {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser && window.location.pathname.includes('index.html')) {
        window.location.href = 'home.html';
    } else if (!currentUser && window.location.pathname.includes('home.html')) {
        window.location.href = 'index.html';
    }
}

// SIGNUP FORM
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById('signupForm');
    if (!form) return;

    form.addEventListener("submit", function(e) {
        e.preventDefault();

        const fullname = document.getElementById('fullname').value;
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        let users = JSON.parse(localStorage.getItem('users')) || [];

        if (users.some(u => u.username === username)) {
            Swal.fire({
                icon: 'error',
                title: 'Username Exists',
                text: 'This username is already taken!',
            });
            return;
        }

        users.push({
            fullname,
            username,
            email,
            password,
            createdAt: new Date().toISOString()
        });

        localStorage.setItem('users', JSON.stringify(users));

        Swal.fire({
            icon: 'success',
            title: 'Account Created!',
            text: 'You can now login with your credentials',
        }).then(() => {
            window.location.href = 'index.html';
        });
    });
});

// Login Form
if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.username === username && u.password === password);
        
        if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            
            Swal.fire({
                icon: 'success',
                title: 'Welcome Back!',
                text: `Hello ${user.fullname}`,
                confirmButtonColor: '#8b5cf6',
                timer: 1500
            }).then(() => {
                window.location.href = 'home.html';
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Login Failed',
                text: 'Invalid username or password',
                confirmButtonColor: '#8b5cf6'
            });
        }
    });
}

// Logout functionality
if (document.getElementById('logoutBtn')) {
    document.getElementById('logoutBtn').addEventListener('click', function() {
        Swal.fire({
            title: 'Are you sure?',
            text: 'Do you want to logout?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#8b5cf6',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, logout'
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem('currentUser');
                localStorage.removeItem('currentCart');
                window.location.href = 'index.html';
            }
        });
    });
}

// Initialize auth check
checkAuth();