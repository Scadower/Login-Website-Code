// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('theme') || 'dark';

const setTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    themeToggle.innerHTML = theme === 'dark' 
        ? '<i class="fas fa-moon"></i>' 
        : '<i class="fas fa-sun"></i>';
};

themeToggle.addEventListener('click', () => 
    setTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark')
);
setTheme(savedTheme);

// Enhanced Form Validation
const form = document.getElementById('loginForm');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const submitBtn = document.getElementById('submitBtn');
const formInputs = [usernameInput, passwordInput];

// Validation Rules
const validationRules = {
    username: {
        pattern: /^[A-Za-z0-9]{3,20}$/,
        message: 'Username must be 3-20 alphanumeric characters'
    },
    password: {
        minLength: 8,
        requireUppercase: true,
        requireNumber: true,
        requireSymbol: true,
        message: 'Password must be at least 8 characters with uppercase, number, and symbol'
    }
};

// Real-time Validation
const validateField = (input) => {
    const errorElement = input.parentElement.querySelector('.validation-error');
    const fieldName = input.id;
    let isValid = true;
    
    if (!input.value) {
        errorElement.textContent = `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
        errorElement.classList.add('show');
        input.classList.add('invalid');
        input.classList.remove('valid');
        return false;
    }
    
    if (fieldName === 'username') {
        if (!validationRules.username.pattern.test(input.value)) {
            errorElement.textContent = validationRules.username.message;
            errorElement.classList.add('show');
            input.classList.add('invalid');
            input.classList.remove('valid');
            return false;
        }
    } else if (fieldName === 'password') {
        const minLength = validationRules.password.minLength;
        const hasUppercase = /[A-Z]/.test(input.value);
        const hasNumber = /\d/.test(input.value);
        const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(input.value);
        
        if (input.value.length < minLength || !hasUppercase || !hasNumber || !hasSymbol) {
            errorElement.textContent = validationRules.password.message;
            errorElement.classList.add('show');
            input.classList.add('invalid');
            input.classList.remove('valid');
            return false;
        }
    }
    
    // Field is valid
    errorElement.textContent = '';
    errorElement.classList.remove('show');
    input.classList.remove('invalid');
    input.classList.add('valid');
    return true;
};

// Attach validation to inputs
formInputs.forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
        if (input.classList.contains('invalid')) {
            validateField(input);
        }
    });
});

// Password Strength Visualization
const calculateStrength = (password) => {
    if (!password) return 0;
    
    const checks = [
        password.length >= 8,                   // Length
        /[A-Z]/.test(password),                 // Uppercase
        /[a-z]/.test(password),                 // Lowercase
        /\d/.test(password),                    // Number
        /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) // Symbol
    ];
    
    return checks.filter(Boolean).length;
};

const updateStrengthIndicator = (strength) => {
    const strengthBar = document.querySelector('.strength-bar');
    const strengthText = document.querySelector('.strength-text');
    
    strengthBar.style.width = `${(strength / 5) * 100}%`;
    
    if (strength === 0) {
        strengthBar.style.backgroundColor = 'transparent';
        strengthText.textContent = '';
    } else if (strength <= 2) {
        strengthBar.style.backgroundColor = 'var(--color-error)';
        strengthText.textContent = 'Weak';
        strengthText.style.color = 'var(--color-error)';
    } else if (strength <= 4) {
        strengthBar.style.backgroundColor = 'var(--color-warning)';
        strengthText.textContent = 'Medium';
        strengthText.style.color = 'var(--color-warning)';
    } else {
        strengthBar.style.backgroundColor = 'var(--color-success)';
        strengthText.textContent = 'Strong';
        strengthText.style.color = 'var(--color-success)';
    }
};

passwordInput.addEventListener('input', (e) => {
    const strength = calculateStrength(e.target.value);
    updateStrengthIndicator(strength);
});

// Form Submission
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Validate all fields
    const isFormValid = formInputs.map(input => validateField(input)).every(Boolean);
    
    if (!isFormValid) {
        // Focus first invalid field
        form.querySelector('.invalid')?.focus();
        return;
    }
    
    // Show loading state
    submitBtn.disabled = true;
    submitBtn.querySelector('.spinner').classList.remove('hidden');
    
    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Success - redirect or show success message
        console.log('Login successful!');
        // Redirect example: window.location.href = '/dashboard';
        
        // For demo purposes, show success in UI
        const loginCard = document.querySelector('.login-card');
        loginCard.innerHTML = `
            <div class="login-header">
                <h1>Welcome Back!</h1>
                <p>You've successfully logged in.</p>
            </div>
            <div style="text-align: center; margin: 2rem 0;">
                <i class="fas fa-check-circle" style="font-size: 4rem; color: var(--color-success);"></i>
            </div>
            <p style="text-align: center; margin-bottom: 1.5rem;">Redirecting to your dashboard...</p>
        `;
        
    } catch (error) {
        // Error handling
        console.error('Login failed:', error);
        
        // Show error message
        const errorMsg = document.createElement('div');
        errorMsg.className = 'validation-error show';
        errorMsg.style.textAlign = 'center';
        errorMsg.style.marginBottom = '1rem';
        errorMsg.innerHTML = '<i class="fas fa-exclamation-circle"></i> Login failed. Please check your credentials and try again.';
        
        form.insertBefore(errorMsg, submitBtn);
        
    } finally {
        // Reset button state
        submitBtn.disabled = false;
        submitBtn.querySelector('.spinner').classList.add('hidden');
    }
});

// Social Login Buttons
document.querySelectorAll('.btn-social').forEach(button => {
    button.addEventListener('click', async (e) => {
        const provider = e.currentTarget.dataset.provider;
        
        // Show loading state
        button.disabled = true;
        button.innerHTML = '<div class="spinner"></div>';
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            console.log(`Login with ${provider} initiated`);
            
            // For demo purposes - redirect would happen here
            // window.location.href = `/auth/${provider}`;
            
        } catch (error) {
            console.error(`${provider} login failed:`, error);
        } finally {
            // Reset button state
            button.disabled = false;
            button.innerHTML = `<i class="fab fa-${provider}"></i>`;
        }
    });
});

// DOM ready - run initial checks
document.addEventListener('DOMContentLoaded', () => {
    // Initialize password strength if value exists
    if (passwordInput.value) {
        updateStrengthIndicator(calculateStrength(passwordInput.value));
    }
});