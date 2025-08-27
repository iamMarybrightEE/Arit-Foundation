// Contact Form Handler
document.addEventListener('DOMContentLoaded', function() {
    initializeContactForm();
});

function initializeContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactFormSubmit);
        
        // Add real-time validation
        const inputs = contactForm.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', clearFieldError);
        });
    }
}

function handleContactFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const submitButton = form.querySelector('button[type="submit"]');
    const buttonText = submitButton.querySelector('.btn-text');
    const buttonLoading = submitButton.querySelector('.btn-loading');
    
    // Validate form
    if (!validateContactForm(form)) {
        showNotification('Please fill in all required fields correctly.', 'error');
        return;
    }
    
    // Show loading state
    buttonText.style.display = 'none';
    buttonLoading.style.display = 'inline-flex';
    submitButton.disabled = true;
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        // Reset button state
        buttonText.style.display = 'inline';
        buttonLoading.style.display = 'none';
        submitButton.disabled = false;
        
        // Show success message
        showNotification('Thank you for your message! We\'ll get back to you within 24 hours.', 'success');
        
        // Reset form
        form.reset();
        
        // If newsletter checkbox was checked, add to newsletter
        if (formData.get('newsletter')) {
            showNotification('You\'ve been subscribed to our newsletter!', 'info');
        }
        
    }, 2000);
}

function validateContactForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!validateField({ target: field })) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';
    
    // Remove existing error
    clearFieldError(e);
    
    // Check if required field is empty
    if (field.hasAttribute('required') && !value) {
        errorMessage = 'This field is required.';
        isValid = false;
    }
    
    // Specific validations
    switch (fieldName) {
        case 'email':
            if (value && !isValidEmail(value)) {
                errorMessage = 'Please enter a valid email address.';
                isValid = false;
            }
            break;
            
        case 'phone':
            if (value && !isValidPhone(value)) {
                errorMessage = 'Please enter a valid phone number.';
                isValid = false;
            }
            break;
            
        case 'firstName':
        case 'lastName':
            if (value && value.length < 2) {
                errorMessage = 'Name must be at least 2 characters long.';
                isValid = false;
            }
            break;
            
        case 'message':
            if (value && value.length < 10) {
                errorMessage = 'Message must be at least 10 characters long.';
                isValid = false;
            }
            break;
    }
    
    if (!isValid) {
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

function clearFieldError(e) {
    const field = e.target;
    const formGroup = field.closest('.form-group');
    const existingError = formGroup.querySelector('.field-error');
    
    if (existingError) {
        existingError.remove();
    }
    
    field.classList.remove('error');
}

function showFieldError(field, message) {
    const formGroup = field.closest('.form-group');
    
    // Add error class to field
    field.classList.add('error');
    
    // Create error message element
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    
    // Insert error message
    formGroup.appendChild(errorElement);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    // Simple phone validation - adjust regex based on your requirements
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const icon = getNotificationIcon(type);
    notification.innerHTML = `
        <i class="${icon}"></i>
        <span>${message}</span>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background-color: ${getNotificationColor(type)};
        color: white;
        border-radius: var(--border-radius);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        box-shadow: var(--shadow-lg);
        display: flex;
        align-items: center;
        gap: 0.5rem;
        max-width: 400px;
        word-wrap: break-word;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notification.parentElement) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }
    }, 5000);
}

function getNotificationIcon(type) {
    switch (type) {
        case 'success': return 'fas fa-check-circle';
        case 'error': return 'fas fa-exclamation-circle';
        case 'warning': return 'fas fa-exclamation-triangle';
        default: return 'fas fa-info-circle';
    }
}

function getNotificationColor(type) {
    switch (type) {
        case 'success': return 'var(--color-4)';
        case 'error': return 'var(--color-5)';
        case 'warning': return '#ff9800';
        default: return 'var(--color-3)';
    }
}

// Add CSS for form validation styles
const contactFormStyles = document.createElement('style');
contactFormStyles.textContent = `
    .contact-form .form-group {
        position: relative;
        margin-bottom: 1.5rem;
    }
    
    .contact-form label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 600;
        color: var(--text-dark);
    }
    
    .contact-form input,
    .contact-form select,
    .contact-form textarea {
        width: 100%;
        padding: 1rem;
        border: 2px solid var(--gray-light);
        border-radius: var(--border-radius);
        font-size: 1rem;
        transition: var(--transition);
        background-color: var(--bg-light);
        color: var(--text-dark);
    }
    
    .contact-form input:focus,
    .contact-form select:focus,
    .contact-form textarea:focus {
        outline: none;
        border-color: var(--primary-color);
        box-shadow: 0 0 0 3px rgba(123, 1, 60, 0.1);
    }
    
    .contact-form input.error,
    .contact-form select.error,
    .contact-form textarea.error {
        border-color: var(--color-5);
        box-shadow: 0 0 0 3px rgba(201, 0, 52, 0.1);
    }
    
    .field-error {
        color: var(--color-5);
        font-size: 0.875rem;
        margin-top: 0.25rem;
        display: flex;
        align-items: center;
        gap: 0.25rem;
    }
    
    .field-error::before {
        content: '⚠';
        font-size: 0.75rem;
    }
    
    .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
    }
    
    .checkbox-group {
        display: flex;
        align-items: flex-start;
        gap: 0.5rem;
    }
    
    .checkbox-label {
        display: flex;
        align-items: flex-start;
        gap: 0.5rem;
        cursor: pointer;
        font-size: 0.9rem;
        line-height: 1.4;
    }
    
    .checkbox-label input[type="checkbox"] {
        width: auto;
        margin: 0;
    }
    
    .checkmark {
        width: 20px;
        height: 20px;
        border: 2px solid var(--gray-medium);
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: var(--transition);
        flex-shrink: 0;
        margin-top: 2px;
    }
    
    .checkbox-label input[type="checkbox"]:checked + .checkmark {
        background-color: var(--primary-color);
        border-color: var(--primary-color);
    }
    
    .checkbox-label input[type="checkbox"]:checked + .checkmark::after {
        content: '✓';
        color: white;
        font-size: 12px;
        font-weight: bold;
    }
    
    .checkbox-label input[type="checkbox"] {
        display: none;
    }
    
    .contact-info-section {
        padding: 5rem 0;
        background-color: var(--gray-light);
    }
    
    .contact-info-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 2rem;
    }
    
    .contact-card {
        background-color: var(--white);
        padding: 2rem;
        border-radius: var(--border-radius);
        text-align: center;
        box-shadow: var(--shadow);
        transition: var(--transition);
    }
    
    .contact-card:hover {
        transform: translateY(-5px);
        box-shadow: var(--shadow-lg);
    }
    
    .contact-icon {
        width: 60px;
        height: 60px;
        background-color: var(--primary-color);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 1rem;
        color: white;
        font-size: 1.5rem;
    }
    
    .contact-card h3 {
        color: var(--primary-color);
        margin-bottom: 1rem;
    }
    
    .contact-form-section {
        padding: 8rem 0;
    }
    
    .contact-form-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 4rem;
        align-items: start;
    }
    
    .contact-image {
        position: relative;
        border-radius: var(--border-radius);
        overflow: hidden;
        box-shadow: var(--shadow-lg);
    }
    
    .contact-highlights {
        position: absolute;
        bottom: 2rem;
        left: 2rem;
        right: 2rem;
        background-color: rgba(255, 255, 255, 0.95);
        padding: 1.5rem;
        border-radius: var(--border-radius);
        backdrop-filter: blur(10px);
    }
    
    .highlight-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 0.5rem;
        font-size: 0.9rem;
    }
    
    .highlight-item:last-child {
        margin-bottom: 0;
    }
    
    .highlight-item i {
        color: var(--primary-color);
        width: 16px;
    }
    
    .involvement-section {
        padding: 8rem 0;
        position: relative;
    }
    
    .involvement-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 2rem;
        margin-top: 3rem;
    }
    
    .involvement-card {
        background-color: rgba(255, 255, 255, 0.95);
        padding: 2rem;
        border-radius: var(--border-radius);
        backdrop-filter: blur(10px);
        box-shadow: var(--shadow);
        transition: var(--transition);
    }
    
    .involvement-card:hover {
        transform: translateY(-5px);
        box-shadow: var(--shadow-lg);
    }
    
    .involvement-icon {
        width: 60px;
        height: 60px;
        background-color: var(--primary-color);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 1.5rem;
        color: white;
        font-size: 1.5rem;
    }
    
    .involvement-card h3 {
        color: var(--primary-color);
        margin-bottom: 1rem;
    }
    
    .involvement-card ul {
        list-style: none;
        margin: 1rem 0;
    }
    
    .involvement-card li {
        padding: 0.25rem 0;
        position: relative;
        padding-left: 1rem;
    }
    
    .involvement-card li::before {
        content: '•';
        color: var(--primary-color);
        position: absolute;
        left: 0;
    }
    
    .involvement-link {
        color: var(--primary-color);
        font-weight: 600;
        text-decoration: none;
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        transition: var(--transition);
    }
    
    .involvement-link:hover {
        color: var(--color-5);
    }
    
    .map-section {
        padding: 5rem 0;
        background-color: var(--gray-light);
    }
    
    .map-container {
        margin-top: 3rem;
    }
    
    .map-placeholder {
        height: 400px;
        background-color: var(--white);
        border-radius: var(--border-radius);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: var(--shadow);
        position: relative;
        overflow: hidden;
    }
    
    .map-placeholder::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(45deg, var(--primary-color), var(--color-3));
        opacity: 0.1;
    }
    
    .map-content {
        text-align: center;
        z-index: 1;
    }
    
    .map-content i {
        font-size: 3rem;
        color: var(--primary-color);
        margin-bottom: 1rem;
    }
    
    .map-content h3 {
        color: var(--primary-color);
        margin-bottom: 1rem;
    }
    
    .map-directions {
        margin-top: 2rem;
    }
    
    @media (max-width: 768px) {
        .form-row {
            grid-template-columns: 1fr;
        }
        
        .contact-form-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
        }
        
        .contact-info-grid {
            grid-template-columns: repeat(2, 1fr);
        }
        
        .involvement-grid {
            grid-template-columns: 1fr;
        }
    }
    
    @media (max-width: 480px) {
        .contact-info-grid {
            grid-template-columns: 1fr;
        }
        
        .contact-highlights {
            left: 1rem;
            right: 1rem;
            bottom: 1rem;
            padding: 1rem;
        }
    }
`;
document.head.appendChild(contactFormStyles);