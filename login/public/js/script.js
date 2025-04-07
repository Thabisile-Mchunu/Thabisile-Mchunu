/* show the registration page and hide login*/
function showRegister() {
    document.getElementById('login-form').classList.add('hidden');
    document.getElementById('register-form').classList.remove('hidden');
    clearMessages();
}

/* show the login page and hide registration */
function showLogin() {
    document.getElementById('register-form').classList.add('hidden');
    document.getElementById('login-form').classList.remove('hidden');
    clearMessages();
}

function clearMessages() {
    document.getElementById('login-message').classList.add('hidden');
    document.getElementById('register-message').classList.add('hidden');
}

/* submit login to the DB */
function submitLogin(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
    })
    .then(response => response.json())
    .then(data => {
        const message = document.getElementById('login-message');
        message.textContent = data.message;
        message.classList.remove('hidden');
        message.classList.remove('success', 'error');
        message.classList.add(data.success ? 'success' : 'error');
        
        if (data.success) {
            // Redirect or perform action on successful login
            console.log('Login successful');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

/* submit registration to the DB */
function submitRegister(event) {
    event.preventDefault();
    /* add all the fields that need to be updated on the DB */
    const firstname = document.getElementById('firstname').value;
    const lastname = document.getElementById('lastname').value;
    const dob = document.getElementById('dob').value;
    const address = document.getElementById('address').value;
    const city = document.getElementById('city').value;
    const code = document.getElementById('code').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;
    
    /* check that the passwords match */
    if (password !== confirmPassword) {
        const message = document.getElementById('register-message');
        message.textContent = "Passwords don't match!";
        message.classList.remove('hidden');
        message.classList.remove('success');
        message.classList.add('error');
        return;
    }
    
    fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firstname, lastname, dob, address, city, code, email, password })
    })
    .then(response => response.json())
    .then(data => {
        const message = document.getElementById('register-message');
        message.textContent = data.message;
        message.classList.remove('hidden');
        message.classList.remove('success', 'error');
        message.classList.add(data.success ? 'success' : 'error');
        
        if (data.success) {
            // Clear form on successful registration
            document.getElementById('firstname').value = '';
            document.getElementById('lastname').value = '';
            document.getElementById('register-password').value = '';
            document.getElementById('register-confirm-password').value = '';
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}