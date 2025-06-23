const AUTH_DATA = {
    username: 'admin',
    password: '123456'
};

function createStars() {
    const starsContainer = document.getElementById('stars');
    const numberOfStars = 50;

    for (let i = 0; i < numberOfStars; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.width = Math.random() * 3 + 1 + 'px';
        star.style.height = star.style.width;
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.animationDelay = Math.random() * 3 + 's';
        starsContainer.appendChild(star);
    }
}

$('#togglePassword').click(function () {
    const passwordField = $('#password');
    const icon = $(this).find('i');

    if (passwordField.attr('type') === 'password') {
        passwordField.attr('type', 'text');
        icon.removeClass('fa-eye').addClass('fa-eye-slash');
    } else {
        passwordField.attr('type', 'password');
        icon.removeClass('fa-eye-slash').addClass('fa-eye');
    }
});

function showError(message) {
    const errorDiv = $('#errorMessage');
    const errorText = $('#errorText');
    const loginContainer = $('.login-container');

    errorText.text(message);
    errorDiv.removeClass('hidden');
    loginContainer.addClass('error-shake');

    setTimeout(() => {
        loginContainer.removeClass('error-shake');
    }, 500);
}

function hideError() {
    $('#errorMessage').addClass('hidden');
}

function showLoading(show = true) {
    const btn = $('#loginBtn');
    const btnText = $('#loginBtnText');

    if (show) {
        btn.attr('disabled', true).addClass('opacity-75');
        btnText.html('<i class="fas fa-spinner fa-spin mr-2"></i>Entrando...');
    } else {
        btn.attr('disabled', false).removeClass('opacity-75');
        btnText.html('<i class="fas fa-sign-in-alt mr-2"></i>Entrar');
    }
}

function authenticate(username, password) {
    return username === AUTH_DATA.username && password === AUTH_DATA.password;
}

function saveSession(username) {
    const sessionData = {
        username: username,
        loginTime: new Date().toISOString(),
        isAuthenticated: true
    };
    localStorage.setItem('currentSession', JSON.stringify(sessionData));
}

function redirectToWishlist() {
    window.location.href = 'home.html';
}

$('#loginForm').submit(function (e) {
    e.preventDefault();
    hideError();

    const username = $('#username').val().trim();
    const password = $('#password').val();

    if (!username) {
        showError('Por favor, digite seu usuário.');
        return;
    }

    if (!password) {
        showError('Por favor, digite sua senha.');
        return;
    }

    showLoading(true);

    setTimeout(() => {
        if (authenticate(username, password)) {
            saveSession(username);
            showLoading(false);
            redirectToWishlist();
        } else {
            showLoading(false);
            showError('Usuário ou senha incorretos. Tente novamente.');
            $('#password').val('').focus();
        }
    }, 1500);
});

$('#username').focus();

$(document).ready(function () {
    createStars();
});

$('#username, #password').on('input', function () {
    hideError();
});