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
const form = document.getElementById('signupForm');
const firstNameInput = document.getElementById('firstName');
const lastNameInput = document.getElementById('lastName');
const emailInput = document.getElementById('email');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');
const submitBtn = document.getElementById('submitBtn');
const formInputs = [firstNameInput, lastNameInput, emailInput, usernameInput, passwordInput, confirmPasswordInput];

// Validation Rules
const validationRules = {
    firstName: {
        pattern: /^[A-Za-z]{2,30}$/,
        message: 'First name must be 2-30 letters only'
    },
    lastName: {
        pattern: /^[A-Za-z]{2,30}$/,
        message: 'Last name must be 2-30 letters only'
    },
    email: {
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: 'Please enter a valid email address'
    },
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
    },
    confirmPassword: {
        message: 'Passwords do not match'
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
    
    if (fieldName === 'firstName' || fieldName === 'lastName') {
        if (!validationRules[fieldName].pattern.test(input.value)) {
            errorElement.textContent = validationRules[fieldName].message;
            errorElement.classList.add('show');
            input.classList.add('invalid');
            input.classList.remove('valid');
            return false;
        }
    } else if (fieldName === 'email') {
        if (!validationRules.email.pattern.test(input.value)) {
            errorElement.textContent = validationRules.email.message;
            errorElement.classList.add('show');
            input.classList.add('invalid');
            input.classList.remove('valid');
            return false;
        }
    } else if (fieldName === 'username') {
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
    } else if (fieldName === 'confirmPassword') {
        if (input.value !== passwordInput.value) {
            errorElement.textContent = validationRules.confirmPassword.message;
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

// Check username availability (simulated)
const checkUsernameAvailability = async (username) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Simulate some taken usernames
    const takenUsernames = ['admin', 'user', 'test', 'demo', 'root'];
    return !takenUsernames.includes(username.toLowerCase());
};

// Username availability check
let usernameCheckTimeout;
usernameInput.addEventListener('input', () => {
    clearTimeout(usernameCheckTimeout);
    
    if (usernameInput.value.length >= 3 && validationRules.username.pattern.test(usernameInput.value)) {
        usernameCheckTimeout = setTimeout(async () => {
            const errorElement = usernameInput.parentElement.querySelector('.validation-error');
            const isAvailable = await checkUsernameAvailability(usernameInput.value);
            
            if (!isAvailable) {
                errorElement.textContent = 'Username is already taken';
                errorElement.classList.add('show');
                usernameInput.classList.add('invalid');
                usernameInput.classList.remove('valid');
            } else if (usernameInput.classList.contains('invalid')) {
                validateField(usernameInput);
            }
        }, 800);
    }
});

// Attach validation to inputs
formInputs.forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
        if (input.classList.contains('invalid')) {
            validateField(input);
        }
        
        // Special case for confirm password
        if (input.id === 'password' && confirmPasswordInput.value) {
            validateField(confirmPasswordInput);
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
    
    // Check terms agreement
    const termsCheckbox = document.querySelector('input[name="terms"]');
    if (!termsCheckbox.checked) {
        const errorMsg = document.createElement('div');
        errorMsg.className = 'validation-error show';
        errorMsg.style.textAlign = 'center';
        errorMsg.style.marginBottom = '1rem';
        errorMsg.innerHTML = '<i class="fas fa-exclamation-circle"></i> You must agree to the Terms of Service';
        
        form.insertBefore(errorMsg, submitBtn);
        
        setTimeout(() => {
            errorMsg.remove();
        }, 5000);
        
        return;
    }
    
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
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Success - show success message
        console.log('Registration successful!');
        
        // For demo purposes, show success in UI
        const signupCard = document.querySelector('.signup-card');
        signupCard.innerHTML = `
            <div class="signup-header">
                <h1>Welcome Aboard!</h1>
                <p>Your account has been created successfully.</p>
            </div>
            <div style="text-align: center; margin: 2rem 0;">
                <i class="fas fa-check-circle" style="font-size: 4rem; color: var(--color-success);"></i>
            </div>
            <div style="text-align: center; margin-bottom: 1.5rem;">
                <p style="margin-bottom: 1rem;">Please check your email to verify your account.</p>
                <a href="index.html" class="btn-primary" style="display: inline-block; text-decoration: none; padding: 0.75rem 2rem;">
                    Go to Login
                </a>
            </div>
        `;
        
    } catch (error) {
        // Error handling
        console.error('Registration failed:', error);
        
        // Show error message
        const errorMsg = document.createElement('div');
        errorMsg.className = 'validation-error show';
        errorMsg.style.textAlign = 'center';
        errorMsg.style.marginBottom = '1rem';
        errorMsg.innerHTML = '<i class="fas fa-exclamation-circle"></i> Registration failed. Please try again.';
        
        form.insertBefore(errorMsg, submitBtn);
        
        setTimeout(() => {
            errorMsg.remove();
        }, 5000);
        
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
            console.log(`Sign up with ${provider} initiated`);
            
            // For demo purposes - redirect would happen here
            // window.location.href = `/auth/${provider}`;
            
        } catch (error) {
            console.error(`${provider} signup failed:`, error);
        } finally {
            // Reset button state
            button.disabled = false;
            const iconClass = provider === 'linkedin' ? 'linkedin-in' : provider;
            button.innerHTML = `<i class="fab fa-${iconClass}"></i>`;
        }
    });
});

// Email validation enhancement
const validateEmail = async (email) => {
    // Basic pattern check first
    if (!validationRules.email.pattern.test(email)) {
        return false;
    }
    
    // Simulate checking if email is already registered
    await new Promise(resolve => setTimeout(resolve, 300));
    const registeredEmails = ['test@example.com', 'admin@example.com', 'user@demo.com'];
    return !registeredEmails.includes(email.toLowerCase());
};

// Enhanced email validation
let emailCheckTimeout;
emailInput.addEventListener('input', () => {
    clearTimeout(emailCheckTimeout);
    
    if (emailInput.value && validationRules.email.pattern.test(emailInput.value)) {
        emailCheckTimeout = setTimeout(async () => {
            const errorElement = emailInput.parentElement.querySelector('.validation-error');
            const isAvailable = await validateEmail(emailInput.value);
            
            if (!isAvailable) {
                errorElement.textContent = 'Email is already registered';
                errorElement.classList.add('show');
                emailInput.classList.add('invalid');
                emailInput.classList.remove('valid');
            } else if (emailInput.classList.contains('invalid')) {
                validateField(emailInput);
            }
        }, 1000);
    }
});

// DOM ready - run initial checks
document.addEventListener('DOMContentLoaded', () => {
    // Initialize password strength if value exists
    if (passwordInput.value) {
        updateStrengthIndicator(calculateStrength(passwordInput.value));
    }
    
    // Auto-focus first field
    firstNameInput.focus();
});