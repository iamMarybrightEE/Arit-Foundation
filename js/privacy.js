// Privacy page functionality
document.addEventListener('DOMContentLoaded', function() {
    initializePrivacyPage();
});

function initializePrivacyPage() {
    setupSmoothScrolling();
    setupTableOfContents();
    setupPrivacyAnimations();
    setupCookieManagement();
}

function setupSmoothScrolling() {
    // Smooth scrolling for table of contents links
    const tocLinks = document.querySelectorAll('.toc-list a');
    
    tocLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerOffset = 100; // Account for fixed header
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Highlight the target section
                highlightSection(targetElement);
            }
        });
    });
}

function setupTableOfContents() {
    // Create floating TOC for better navigation
    const tocContent = document.querySelector('.toc-content');
    const floatingToc = createFloatingToc();
    
    if (tocContent && window.innerWidth > 1200) {
        document.body.appendChild(floatingToc);
        
        // Show/hide floating TOC based on scroll position
        window.addEventListener('scroll', function() {
            const tocSection = document.querySelector('.privacy-toc');
            const tocRect = tocSection.getBoundingClientRect();
            
            if (tocRect.bottom < 0) {
                floatingToc.classList.add('visible');
            } else {
                floatingToc.classList.remove('visible');
            }
        });
    }
    
    // Update active section in TOC
    updateActiveTocSection();
    window.addEventListener('scroll', updateActiveTocSection);
}

function createFloatingToc() {
    const floatingToc = document.createElement('div');
    floatingToc.className = 'floating-toc';
    floatingToc.innerHTML = `
        <div class="floating-toc-header">
            <h4><i class="fas fa-list"></i> Contents</h4>
            <button class="floating-toc-toggle">
                <i class="fas fa-chevron-up"></i>
            </button>
        </div>
        <div class="floating-toc-content">
            <ul class="floating-toc-list">
                <li><a href="#overview">Overview</a></li>
                <li><a href="#information-collection">Information Collection</a></li>
                <li><a href="#information-use">Information Use</a></li>
                <li><a href="#information-sharing">Information Sharing</a></li>
                <li><a href="#data-security">Data Security</a></li>
                <li><a href="#cookies">Cookie Policy</a></li>
                <li><a href="#your-rights">Your Rights</a></li>
                <li><a href="#data-retention">Data Retention</a></li>
                <li><a href="#children-privacy">Children's Privacy</a></li>
                <li><a href="#contact-privacy">Contact Us</a></li>
            </ul>
        </div>
    `;
    
    // Add toggle functionality
    const toggle = floatingToc.querySelector('.floating-toc-toggle');
    const content = floatingToc.querySelector('.floating-toc-content');
    
    toggle.addEventListener('click', function() {
        content.classList.toggle('collapsed');
        const icon = this.querySelector('i');
        icon.className = content.classList.contains('collapsed') ? 
            'fas fa-chevron-down' : 'fas fa-chevron-up';
    });
    
    // Add smooth scrolling to floating TOC links
    const floatingLinks = floatingToc.querySelectorAll('a');
    floatingLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerOffset = 100;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                highlightSection(targetElement);
            }
        });
    });
    
    return floatingToc;
}

function updateActiveTocSection() {
    const sections = document.querySelectorAll('.privacy-section[id]');
    const tocLinks = document.querySelectorAll('.toc-list a, .floating-toc-list a');
    
    let activeSection = null;
    const scrollPosition = window.scrollY + 150; // Offset for header
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            activeSection = section.id;
        }
    });
    
    // Update active states
    tocLinks.forEach(link => {
        const href = link.getAttribute('href').substring(1);
        if (href === activeSection) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

function highlightSection(element) {
    // Remove existing highlights
    document.querySelectorAll('.privacy-section.highlighted').forEach(section => {
        section.classList.remove('highlighted');
    });
    
    // Add highlight to target section
    element.classList.add('highlighted');
    
    // Remove highlight after animation
    setTimeout(() => {
        element.classList.remove('highlighted');
    }, 2000);
}

function setupPrivacyAnimations() {
    // Animate privacy sections on scroll
    const sections = document.querySelectorAll('.privacy-section');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                
                // Animate child elements with delay
                const childElements = entry.target.querySelectorAll('.info-type, .use-case, .sharing-scenarios .scenario, .security-category, .cookie-type, .right-item, .retention-item');
                childElements.forEach((child, index) => {
                    setTimeout(() => {
                        child.classList.add('animate-child');
                    }, index * 100);
                });
            }
        });
    }, { threshold: 0.1 });
    
    sections.forEach(section => {
        observer.observe(section);
    });
}

function setupCookieManagement() {
    // Add functionality to cookie management buttons
    const manageCookiesBtn = document.querySelector('button[onclick="showCookieBanner()"]');
    
    if (manageCookiesBtn) {
        manageCookiesBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showCookieBanner();
        });
    }
    
    // Add copy functionality for cookie names
    const cookieCodes = document.querySelectorAll('code');
    cookieCodes.forEach(code => {
        code.addEventListener('click', function() {
            copyToClipboard(this.textContent);
            showCopyNotification(this);
        });
        
        // Add copy cursor
        code.style.cursor = 'pointer';
        code.title = 'Click to copy';
    });
}

function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            console.log('Copied to clipboard:', text);
        });
    } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
    }
}

function showCopyNotification(element) {
    const notification = document.createElement('div');
    notification.className = 'copy-notification';
    notification.textContent = 'Copied!';
    
    const rect = element.getBoundingClientRect();
    notification.style.cssText = `
        position: fixed;
        top: ${rect.top - 30}px;
        left: ${rect.left + rect.width / 2}px;
        transform: translateX(-50%);
        background-color: var(--primary-color);
        color: white;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-size: 0.75rem;
        z-index: 10000;
        animation: fadeInOut 1.5s ease;
        pointer-events: none;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        document.body.removeChild(notification);
    }, 1500);
}

// Add privacy page specific styles
const privacyStyles = document.createElement('style');
privacyStyles.textContent = `
    .privacy-hero {
        padding: 8rem 0 4rem;
        background: linear-gradient(135deg, var(--primary-color), var(--color-3));
        color: white;
        text-align: center;
    }
    
    .privacy-title {
        font-size: 3rem;
        margin-bottom: 1rem;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
    }
    
    .privacy-subtitle {
        font-size: 1.2rem;
        margin-bottom: 2rem;
        opacity: 0.9;
        max-width: 600px;
        margin-left: auto;
        margin-right: auto;
    }
    
    .privacy-meta {
        display: flex;
        justify-content: center;
        gap: 2rem;
        font-size: 0.9rem;
        opacity: 0.8;
    }
    
    .privacy-meta span {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .privacy-toc {
        padding: 3rem 0;
        background-color: var(--gray-light);
        border-bottom: 1px solid rgba(123, 1, 60, 0.1);
    }
    
    .toc-content h2 {
        text-align: center;
        color: var(--primary-color);
        margin-bottom: 2rem;
    }
    
    .toc-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
        max-width: 800px;
        margin: 0 auto;
    }
    
    .toc-list {
        list-style: none;
        padding: 0;
    }
    
    .toc-list li {
        margin-bottom: 0.5rem;
    }
    
    .toc-list a {
        color: var(--text-dark);
        text-decoration: none;
        padding: 0.5rem 1rem;
        border-radius: var(--border-radius);
        display: block;
        transition: var(--transition);
        border-left: 3px solid transparent;
    }
    
    .toc-list a:hover,
    .toc-list a.active {
        background-color: var(--primary-color);
        color: white;
        border-left-color: var(--color-4);
        transform: translateX(5px);
    }
    
    .privacy-content {
        padding: 5rem 0;
    }
    
    .privacy-sections {
        max-width: 900px;
        margin: 0 auto;
    }
    
    .privacy-section {
        margin-bottom: 4rem;
        padding: 2rem;
        background-color: var(--white);
        border-radius: var(--border-radius);
        box-shadow: var(--shadow);
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.8s ease;
    }
    
    .privacy-section.animate {
        opacity: 1;
        transform: translateY(0);
    }
    
    .privacy-section.highlighted {
        box-shadow: 0 0 20px rgba(123, 1, 60, 0.3);
        border: 2px solid var(--primary-color);
    }
    
    .privacy-section h2 {
        color: var(--primary-color);
        margin-bottom: 2rem;
        padding-bottom: 1rem;
        border-bottom: 2px solid var(--gray-light);
        display: flex;
        align-items: center;
        gap: 1rem;
    }
    
    .privacy-section h2 i {
        font-size: 1.5rem;
    }
    
    .section-content h3 {
        color: var(--primary-color);
        margin: 2rem 0 1rem;
    }
    
    .section-content h4 {
        color: var(--text-dark);
        margin: 1.5rem 0 0.5rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .highlight-box {
        background-color: var(--color-4);
        color: white;
        padding: 1.5rem;
        border-radius: var(--border-radius);
        margin: 2rem 0;
    }
    
    .highlight-box h4 {
        color: white;
        margin-top: 0;
    }
    
    .info-types,
    .use-cases,
    .security-measures,
    .cookie-types,
    .rights-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 1.5rem;
        margin: 2rem 0;
    }
    
    .info-type,
    .use-case,
    .security-category,
    .cookie-type,
    .right-item {
        background-color: var(--gray-light);
        padding: 1.5rem;
        border-radius: var(--border-radius);
        border-left: 4px solid var(--primary-color);
        opacity: 0;
        transform: translateX(-20px);
        transition: all 0.6s ease;
    }
    
    .info-type.animate-child,
    .use-case.animate-child,
    .security-category.animate-child,
    .cookie-type.animate-child,
    .right-item.animate-child {
        opacity: 1;
        transform: translateX(0);
    }
    
    .sharing-policy {
        background-color: var(--color-4);
        color: white;
        padding: 2rem;
        border-radius: var(--border-radius);
        margin: 2rem 0;
        text-align: center;
    }
    
    .policy-statement h3 {
        color: white;
        margin-bottom: 1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;
    }
    
    .sharing-scenarios {
        display: grid;
        gap: 2rem;
        margin: 2rem 0;
    }
    
    .scenario {
        background-color: var(--gray-light);
        padding: 1.5rem;
        border-radius: var(--border-radius);
        border-left: 4px solid var(--color-3);
    }
    
    .security-notice,
    .cookie-notice,
    .retention-policy,
    .children-policy,
    .update-notification {
        background-color: var(--color-3);
        color: white;
        padding: 1.5rem;
        border-radius: var(--border-radius);
        margin: 2rem 0;
    }
    
    .security-notice h4,
    .cookie-notice h4,
    .retention-policy h3,
    .update-notification h4 {
        color: white;
        margin-top: 0;
    }
    
    .cookie-list {
        background-color: rgba(123, 1, 60, 0.1);
        padding: 1rem;
        border-radius: var(--border-radius);
        margin-top: 1rem;
    }
    
    .cookie-list code {
        background-color: var(--primary-color);
        color: white;
        padding: 0.2rem 0.5rem;
        border-radius: 4px;
        font-family: 'Courier New', monospace;
        cursor: pointer;
        transition: var(--transition);
    }
    
    .cookie-list code:hover {
        background-color: var(--color-5);
        transform: scale(1.05);
    }
    
    .cookie-management {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
        margin: 2rem 0;
    }
    
    .management-option {
        background-color: var(--gray-light);
        padding: 1.5rem;
        border-radius: var(--border-radius);
    }
    
    .rights-exercise {
        background-color: var(--gray-light);
        padding: 2rem;
        border-radius: var(--border-radius);
        margin: 2rem 0;
    }
    
    .contact-options {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
        margin-top: 1rem;
    }
    
    .contact-option {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        background-color: white;
        border-radius: var(--border-radius);
    }
    
    .contact-option i {
        color: var(--primary-color);
        font-size: 1.2rem;
    }
    
    .retention-periods {
        display: grid;
        gap: 1.5rem;
        margin: 2rem 0;
    }
    
    .retention-item {
        background-color: var(--gray-light);
        padding: 1.5rem;
        border-radius: var(--border-radius);
        border-left: 4px solid var(--color-4);
    }
    
    .contact-details {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 2rem;
        margin: 2rem 0;
    }
    
    .contact-method {
        background-color: var(--gray-light);
        padding: 1.5rem;
        border-radius: var(--border-radius);
        text-align: center;
    }
    
    .contact-method h4 {
        color: var(--primary-color);
        margin-bottom: 1rem;
        justify-content: center;
    }
    
    .response-time {
        background-color: var(--color-4);
        color: white;
        padding: 1.5rem;
        border-radius: var(--border-radius);
        margin: 2rem 0;
        text-align: center;
    }
    
    .response-time h4 {
        color: white;
        margin-bottom: 1rem;
        justify-content: center;
    }
    
    .floating-toc {
        position: fixed;
        top: 50%;
        right: 2rem;
        transform: translateY(-50%);
        background-color: var(--white);
        border-radius: var(--border-radius);
        box-shadow: var(--shadow-lg);
        z-index: 1000;
        max-width: 250px;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
    }
    
    .floating-toc.visible {
        opacity: 1;
        visibility: visible;
    }
    
    .floating-toc-header {
        padding: 1rem;
        background-color: var(--primary-color);
        color: white;
        border-radius: var(--border-radius) var(--border-radius) 0 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .floating-toc-header h4 {
        margin: 0;
        font-size: 0.9rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .floating-toc-toggle {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 0.25rem;
        border-radius: 4px;
        transition: var(--transition);
    }
    
    .floating-toc-toggle:hover {
        background-color: rgba(255, 255, 255, 0.2);
    }
    
    .floating-toc-content {
        max-height: 400px;
        overflow-y: auto;
        transition: max-height 0.3s ease;
    }
    
    .floating-toc-content.collapsed {
        max-height: 0;
        overflow: hidden;
    }
    
    .floating-toc-list {
        list-style: none;
        padding: 0;
        margin: 0;
    }
    
    .floating-toc-list a {
        display: block;
        padding: 0.75rem 1rem;
        color: var(--text-dark);
        text-decoration: none;
        font-size: 0.85rem;
        border-bottom: 1px solid var(--gray-light);
        transition: var(--transition);
    }
    
    .floating-toc-list a:hover,
    .floating-toc-list a.active {
        background-color: var(--primary-color);
        color: white;
    }
    
    .floating-toc-list a:last-child {
        border-bottom: none;
    }
    
    @keyframes fadeInOut {
        0%, 100% { opacity: 0; transform: translateX(-50%) translateY(-10px); }
        50% { opacity: 1; transform: translateX(-50%) translateY(0); }
    }
    
    @media (max-width: 1200px) {
        .floating-toc {
            display: none;
        }
    }
    
    @media (max-width: 768px) {
        .privacy-title {
            font-size: 2rem;
        }
        
        .privacy-meta {
            flex-direction: column;
            gap: 1rem;
        }
        
        .toc-grid {
            grid-template-columns: 1fr;
        }
        
        .info-types,
        .use-cases,
        .security-measures,
        .cookie-types,
        .rights-grid {
            grid-template-columns: 1fr;
        }
        
        .cookie-management {
            grid-template-columns: 1fr;
        }
        
        .contact-options {
            grid-template-columns: 1fr;
        }
        
        .contact-details {
            grid-template-columns: 1fr;
        }
        
        .privacy-section {
            padding: 1.5rem;
        }
    }
    
    @media (max-width: 480px) {
        .privacy-hero {
            padding: 6rem 0 3rem;
        }
        
        .privacy-title {
            font-size: 1.8rem;
        }
        
        .privacy-subtitle {
            font-size: 1rem;
        }
        
        .privacy-section {
            padding: 1rem;
        }
        
        .privacy-section h2 {
            font-size: 1.3rem;
            flex-direction: column;
            text-align: center;
            gap: 0.5rem;
        }
    }
`;
document.head.appendChild(privacyStyles);