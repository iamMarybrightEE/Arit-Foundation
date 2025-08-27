// Blog functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeBlogFilters();
    initializeBlogNewsletter();
    initializeLoadMore();
});

function initializeBlogFilters() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    const blogCards = document.querySelectorAll('.blog-card');
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.dataset.category;
            
            // Update active button
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter blog posts
            filterBlogPosts(category, blogCards);
        });
    });
}

function filterBlogPosts(category, blogCards) {
    blogCards.forEach(card => {
        const cardCategory = card.dataset.category;
        
        if (category === 'all' || cardCategory === category) {
            card.style.display = 'block';
            card.classList.add('animate-on-scroll');
            
            // Trigger animation
            setTimeout(() => {
                card.classList.add('animate');
            }, 100);
        } else {
            card.style.display = 'none';
            card.classList.remove('animate');
        }
    });
    
    // Update posts count
    updatePostsCount(category, blogCards);
}

function updatePostsCount(category, blogCards) {
    const visiblePosts = Array.from(blogCards).filter(card => 
        category === 'all' || card.dataset.category === category
    );
    
    // You can add a posts count display here if needed
    console.log(`Showing ${visiblePosts.length} posts for category: ${category}`);
}

function initializeBlogNewsletter() {
    const form = document.getElementById('blog-newsletter-form');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = form.querySelector('input[type="email"]').value;
            const button = form.querySelector('button');
            const originalText = button.textContent;
            
            // Simple validation
            if (!isValidEmail(email)) {
                showBlogNotification('Please enter a valid email address', 'error');
                return;
            }
            
            // Simulate API call
            button.textContent = 'Subscribing...';
            button.disabled = true;
            
            setTimeout(() => {
                showBlogNotification('Successfully subscribed to our blog newsletter!', 'success');
                form.reset();
                button.textContent = originalText;
                button.disabled = false;
            }, 2000);
        });
    }
}

function initializeLoadMore() {
    const loadMoreBtn = document.getElementById('load-more-btn');
    let postsLoaded = 8; // Initial number of posts shown
    const postsPerLoad = 4;
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            // Simulate loading more posts
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
            this.disabled = true;
            
            setTimeout(() => {
                loadMorePosts(postsPerLoad);
                postsLoaded += postsPerLoad;
                
                this.innerHTML = 'Load More Posts';
                this.disabled = false;
                
                // Hide button if all posts are loaded (simulate max 20 posts)
                if (postsLoaded >= 20) {
                    this.style.display = 'none';
                    showBlogNotification('All posts loaded!', 'info');
                }
            }, 1500);
        });
    }
}

function loadMorePosts(count) {
    const postsGrid = document.getElementById('posts-grid');
    
    // Sample additional posts data
    const additionalPosts = [
        {
            category: 'community',
            image: 'https://images.pexels.com/photos/6647019/pexels-photo-6647019.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
            date: 'November 20, 2024',
            author: 'Community Team',
            title: 'Solar Power Brings Light to Remote Villages',
            excerpt: 'Our solar energy project has brought electricity to 3 remote villages, improving quality of life and enabling evening study sessions for students.',
            tags: ['Solar Energy', 'Rural Development', 'Education']
        },
        {
            category: 'programs',
            image: 'https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
            date: 'November 18, 2024',
            author: 'Program Director',
            title: 'Expanding Our Microfinance Program',
            excerpt: 'Due to high demand and success rates, we\'re expanding our microfinance program to serve 200 more small business owners across Akwa Ibom state.',
            tags: ['Microfinance', 'Small Business', 'Economic Development']
        },
        {
            category: 'impact',
            image: 'https://images.pexels.com/photos/6647000/pexels-photo-6647000.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
            date: 'November 15, 2024',
            author: 'Field Reporter',
            title: 'Teacher Training Program Shows Remarkable Results',
            excerpt: 'Our teacher training program has improved learning outcomes by 40% in participating schools, with teachers reporting increased confidence and skills.',
            tags: ['Teacher Training', 'Education Quality', 'Capacity Building']
        },
        {
            category: 'insights',
            image: 'https://images.pexels.com/photos/6646915/pexels-photo-6646915.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
            date: 'November 12, 2024',
            author: 'Research Team',
            title: 'Measuring Social Impact: Our Methodology',
            excerpt: 'Learn about the tools and frameworks we use to measure the social impact of our programs and ensure accountability to our stakeholders.',
            tags: ['Impact Measurement', 'Research', 'Accountability']
        }
    ];
    
    // Add new posts to the grid
    for (let i = 0; i < Math.min(count, additionalPosts.length); i++) {
        const post = additionalPosts[i];
        const postElement = createBlogPostElement(post);
        postsGrid.appendChild(postElement);
        
        // Trigger animation
        setTimeout(() => {
            postElement.classList.add('animate');
        }, i * 100);
    }
}

function createBlogPostElement(post) {
    const article = document.createElement('article');
    article.className = 'blog-card animate-on-scroll';
    article.setAttribute('data-category', post.category);
    
    article.innerHTML = `
        <div class="blog-image">
            <img src="${post.image}" alt="${post.title}">
            <div class="blog-category">${capitalizeFirst(post.category)}</div>
        </div>
        <div class="blog-content">
            <div class="blog-meta">
                <span class="blog-date">${post.date}</span>
                <span class="blog-author">By ${post.author}</span>
            </div>
            <h3>${post.title}</h3>
            <p>${post.excerpt}</p>
            <div class="blog-tags">
                ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
            <a href="#" class="blog-link">Read More <i class="fas fa-arrow-right"></i></a>
        </div>
    `;
    
    return article;
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showBlogNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `blog-notification blog-notification-${type}`;
    
    const icon = getBlogNotificationIcon(type);
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
        background-color: ${getBlogNotificationColor(type)};
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
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notification.parentElement) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }
    }, 4000);
}

function getBlogNotificationIcon(type) {
    switch (type) {
        case 'success': return 'fas fa-check-circle';
        case 'error': return 'fas fa-exclamation-circle';
        case 'warning': return 'fas fa-exclamation-triangle';
        default: return 'fas fa-info-circle';
    }
}

function getBlogNotificationColor(type) {
    switch (type) {
        case 'success': return 'var(--color-4)';
        case 'error': return 'var(--color-5)';
        case 'warning': return '#ff9800';
        default: return 'var(--color-3)';
    }
}

// Add blog-specific styles
const blogStyles = document.createElement('style');
blogStyles.textContent = `
    .blog-categories {
        padding: 2rem 0;
        background-color: var(--gray-light);
        border-bottom: 1px solid rgba(123, 1, 60, 0.1);
    }
    
    .categories-nav {
        display: flex;
        justify-content: center;
        gap: 1rem;
        flex-wrap: wrap;
    }
    
    .category-btn {
        padding: 0.75rem 1.5rem;
        border: 2px solid var(--primary-color);
        background-color: transparent;
        color: var(--primary-color);
        border-radius: 25px;
        font-weight: 600;
        cursor: pointer;
        transition: var(--transition);
        text-transform: uppercase;
        letter-spacing: 0.5px;
        font-size: 0.9rem;
    }
    
    .category-btn:hover,
    .category-btn.active {
        background-color: var(--primary-color);
        color: white;
        transform: translateY(-2px);
        box-shadow: var(--shadow);
    }
    
    .featured-post {
        padding: 5rem 0;
        background-color: var(--white);
    }
    
    .featured-content {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 4rem;
        align-items: center;
    }
    
    .featured-image {
        position: relative;
        border-radius: var(--border-radius);
        overflow: hidden;
        box-shadow: var(--shadow-lg);
    }
    
    .featured-badge {
        position: absolute;
        top: 1rem;
        left: 1rem;
        background-color: var(--primary-color);
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
    
    .post-meta {
        display: flex;
        gap: 1rem;
        margin-bottom: 1rem;
        font-size: 0.9rem;
    }
    
    .post-category {
        color: var(--primary-color);
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
    
    .post-date {
        color: var(--gray-medium);
    }
    
    .featured-text h2 {
        color: var(--primary-color);
        margin-bottom: 1.5rem;
        font-size: 2.2rem;
        line-height: 1.2;
    }
    
    .featured-text p {
        font-size: 1.1rem;
        margin-bottom: 2rem;
        color: var(--gray-medium);
        line-height: 1.6;
    }
    
    .post-stats {
        display: flex;
        gap: 2rem;
        margin-bottom: 2rem;
        flex-wrap: wrap;
    }
    
    .stat-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.9rem;
        color: var(--gray-medium);
    }
    
    .stat-item i {
        color: var(--primary-color);
    }
    
    .blog-posts {
        padding: 5rem 0;
        background-color: var(--gray-light);
    }
    
    .posts-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
        gap: 2rem;
        margin-bottom: 3rem;
    }
    
    .blog-card {
        background-color: var(--white);
        border-radius: var(--border-radius);
        overflow: hidden;
        box-shadow: var(--shadow);
        transition: var(--transition);
        opacity: 0;
        transform: translateY(30px);
    }
    
    .blog-card.animate {
        opacity: 1;
        transform: translateY(0);
    }
    
    .blog-card:hover {
        transform: translateY(-5px);
        box-shadow: var(--shadow-lg);
    }
    
    .blog-image {
        position: relative;
        height: 250px;
        overflow: hidden;
    }
    
    .blog-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.5s ease;
    }
    
    .blog-card:hover .blog-image img {
        transform: scale(1.05);
    }
    
    .blog-category {
        position: absolute;
        top: 1rem;
        left: 1rem;
        background-color: var(--primary-color);
        color: white;
        padding: 0.25rem 0.75rem;
        border-radius: 15px;
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
    
    .blog-content {
        padding: 2rem;
    }
    
    .blog-meta {
        display: flex;
        gap: 1rem;
        margin-bottom: 1rem;
        font-size: 0.8rem;
        color: var(--gray-medium);
    }
    
    .blog-date::before {
        content: '📅 ';
        margin-right: 0.25rem;
    }
    
    .blog-author::before {
        content: '👤 ';
        margin-right: 0.25rem;
    }
    
    .blog-content h3 {
        color: var(--primary-color);
        margin-bottom: 1rem;
        font-size: 1.3rem;
        line-height: 1.3;
    }
    
    .blog-content p {
        color: var(--gray-medium);
        margin-bottom: 1.5rem;
        line-height: 1.6;
    }
    
    .blog-tags {
        display: flex;
        gap: 0.5rem;
        margin-bottom: 1.5rem;
        flex-wrap: wrap;
    }
    
    .tag {
        background-color: var(--gray-light);
        color: var(--text-dark);
        padding: 0.25rem 0.75rem;
        border-radius: 15px;
        font-size: 0.75rem;
        font-weight: 500;
    }
    
    .blog-link {
        color: var(--primary-color);
        font-weight: 600;
        text-decoration: none;
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        transition: var(--transition);
    }
    
    .blog-link:hover {
        color: var(--color-5);
        transform: translateX(5px);
    }
    
    .load-more-section {
        text-align: center;
        margin-top: 2rem;
    }
    
    .blog-newsletter {
        padding: 5rem 0;
        position: relative;
    }
    
    .blog-newsletter .newsletter-content {
        text-align: center;
        color: white;
        position: relative;
        z-index: 2;
    }
    
    .blog-newsletter .section-title {
        color: white;
        margin-bottom: 1rem;
    }
    
    .newsletter-description {
        font-size: 1.1rem;
        margin-bottom: 2rem;
        opacity: 0.9;
        max-width: 600px;
        margin-left: auto;
        margin-right: auto;
    }
    
    .blog-newsletter .newsletter-form {
        max-width: 500px;
        margin: 0 auto;
    }
    
    .blog-newsletter .form-group {
        display: flex;
        gap: 1rem;
    }
    
    .blog-newsletter input {
        flex: 1;
        padding: 1rem;
        border: none;
        border-radius: var(--border-radius);
        font-size: 1rem;
    }
    
    .blog-newsletter input:focus {
        outline: none;
        box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.3);
    }
    
    @media (max-width: 768px) {
        .categories-nav {
            gap: 0.5rem;
        }
        
        .category-btn {
            padding: 0.5rem 1rem;
            font-size: 0.8rem;
        }
        
        .featured-content {
            grid-template-columns: 1fr;
            gap: 2rem;
        }
        
        .featured-text h2 {
            font-size: 1.8rem;
        }
        
        .post-stats {
            gap: 1rem;
        }
        
        .posts-grid {
            grid-template-columns: 1fr;
        }
        
        .blog-newsletter .form-group {
            flex-direction: column;
        }
    }
    
    @media (max-width: 480px) {
        .categories-nav {
            justify-content: flex-start;
            overflow-x: auto;
            padding-bottom: 0.5rem;
        }
        
        .category-btn {
            white-space: nowrap;
            flex-shrink: 0;
        }
        
        .blog-content {
            padding: 1.5rem;
        }
        
        .post-stats {
            flex-direction: column;
            gap: 0.5rem;
        }
    }
`;
document.head.appendChild(blogStyles);