/* ============================================
   Local Storage Management
   ============================================ */

// Theme Management
const ThemeManager = {
    init: function() {
        const savedTheme = localStorage.getItem('vairasia_theme') || 'light';
        this.applyTheme(savedTheme);
    },
    
    saveTheme: function(theme) {
        localStorage.setItem('vairasia_theme', theme);
        this.applyTheme(theme);
    },
    
    getTheme: function() {
        return localStorage.getItem('vairasia_theme') || 'light';
    },
    
    applyTheme: function(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        // Additional theme application logic can be added here
    },
    
    toggleTheme: function() {
        const currentTheme = this.getTheme();
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        this.saveTheme(newTheme);
        return newTheme;
    }
};

// Pilot Info Management
const PilotInfoManager = {
    init: function() {
        // Initialize with saved data or defaults
        const pilotInfo = this.getPilotInfo();
        return pilotInfo;
    },
    
    savePilotInfo: function(info) {
        const pilotData = {
            simbriefId: info.simbriefId || '',
            hoppieLogon: info.hoppieLogon || '',
            name: info.name || ''
        };
        localStorage.setItem('vairasia_pilot_info', JSON.stringify(pilotData));
        return pilotData;
    },
    
    getPilotInfo: function() {
        const saved = localStorage.getItem('vairasia_pilot_info');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error('Error parsing pilot info:', e);
                return this.getDefaultPilotInfo();
            }
        }
        return this.getDefaultPilotInfo();
    },
    
    getDefaultPilotInfo: function() {
        return {
            simbriefId: '',
            hoppieLogon: '',
            name: ''
        };
    },
    
    updatePilotInfo: function(field, value) {
        const currentInfo = this.getPilotInfo();
        currentInfo[field] = value;
        this.savePilotInfo(currentInfo);
        return currentInfo;
    },
    
    clearPilotInfo: function() {
        localStorage.removeItem('vairasia_pilot_info');
    }
};

/* ============================================
   Swiper Initialization
   ============================================ */
function initSwiper() {
    const strategySwiper = new Swiper('.strategy-swiper', {
        slidesPerView: 1,
        spaceBetween: 30,
        autoplay: {
            delay: 2000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.strategy-swiper .swiper-pagination',
            clickable: true,
            renderBullet: function (index, className) {
                const num = String(index + 1).padStart(2, '0');
                return '<span class="' + className + '">' + num + '</span>';
            },
        },
        loop: true,
        effect: 'fade',
        fadeEffect: {
            crossFade: true
        },
        speed: 800,
        longSwipes: false,
        threshold: 5,
    });
}

/* ============================================
   Navbar Scroll Effect
   ============================================ */
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
}

/* ============================================
   Dropdown Menu Enhancement
   ============================================ */
function initDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const button = dropdown.querySelector('.dropdown-btn');
        const content = dropdown.querySelector('.dropdown-content');
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(event) {
            if (!dropdown.contains(event.target)) {
                // Keep hover functionality, but add click for mobile
                if (window.innerWidth <= 768) {
                    content.style.display = 'none';
                }
            }
        });
        
        // Mobile click handler
        if (window.innerWidth <= 768) {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                const isOpen = content.style.display === 'block';
                document.querySelectorAll('.dropdown-content').forEach(dd => {
                    dd.style.display = 'none';
                });
                content.style.display = isOpen ? 'none' : 'block';
            });
        }
    });
}

/* ============================================
   Smooth Scrolling
   ============================================ */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.length > 1) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

/* ============================================
   Utility Functions
   ============================================ */

// Export functions for external use (e.g., from browser console)
window.vAirAsia = {
    ThemeManager: ThemeManager,
    PilotInfoManager: PilotInfoManager,
    // Example usage:
    // vAirAsia.PilotInfoManager.savePilotInfo({ simbriefId: '12345', hoppieLogon: 'ABC123', name: 'John Doe' })
    // vAirAsia.PilotInfoManager.getPilotInfo()
    // vAirAsia.ThemeManager.toggleTheme()
};

/* ============================================
   Logo Image Protection
   ============================================ */
function initLogoProtection() {
    // Select all logo images
    const logoImages = document.querySelectorAll('.logo-img, .footer-logo, .strategy-logo, .hero-cta-logo, .logo-allstars');
    
    // Function to prevent all image saving methods
    function preventImageSave(e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        return false;
    }
    
    logoImages.forEach(function(img) {
        // Prevent right-click context menu (use capture phase to catch early)
        img.addEventListener('contextmenu', preventImageSave, true);
        img.addEventListener('contextmenu', preventImageSave, false);
        
        // Prevent drag start
        img.addEventListener('dragstart', preventImageSave, true);
        img.addEventListener('dragstart', preventImageSave, false);
        
        // Prevent select start
        img.addEventListener('selectstart', preventImageSave, true);
        img.addEventListener('selectstart', preventImageSave, false);
        
        // Prevent mouse down that might trigger save
        img.addEventListener('mousedown', function(e) {
            if (e.button === 2) { // Right mouse button
                preventImageSave(e);
            }
        }, true);
        
        // Add inline event handlers for additional protection
        img.setAttribute('oncontextmenu', 'return false;');
        img.setAttribute('ondragstart', 'return false;');
        img.setAttribute('onselectstart', 'return false;');
        img.setAttribute('onmousedown', 'if(event.button==2) return false;');
        
        // Make image non-draggable via attribute
        img.draggable = false;
    });
    
    // Prevent right-click on logo container links (entire area)
    const logoLinks = document.querySelectorAll('.logo-link');
    logoLinks.forEach(function(link) {
        link.addEventListener('contextmenu', function(e) {
            // Prevent right-click anywhere in the logo link area
            preventImageSave(e);
        }, true);
        
        link.addEventListener('dragstart', preventImageSave, true);
        link.setAttribute('oncontextmenu', 'return false;');
        link.setAttribute('ondragstart', 'return false;');
    });
    
    // Also protect logo container divs
    const logoContainers = document.querySelectorAll('.logo, .footer-brand');
    logoContainers.forEach(function(container) {
        container.addEventListener('contextmenu', function(e) {
            // If clicking on an image inside, prevent it
            if (e.target.tagName === 'IMG' || e.target.closest('img')) {
                preventImageSave(e);
            }
        }, true);
    });
    
    // Global protection: prevent right-click on any image with logo in src
    document.addEventListener('contextmenu', function(e) {
        const target = e.target;
        if (target.tagName === 'IMG') {
            const src = target.src || target.getAttribute('src') || '';
            const className = target.className || '';
            // Check if it's a logo image
            if (src.includes('logo') || 
                className.includes('logo-img') || 
                className.includes('footer-logo') || 
                className.includes('strategy-logo') || 
                className.includes('hero-cta-logo') ||
                className.includes('logo-allstars')) {
                preventImageSave(e);
            }
        }
    }, true);
}

/* ============================================
   Initialization
   ============================================ */
document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme
    ThemeManager.init();
    
    // Initialize pilot info
    PilotInfoManager.init();
    
    // Initialize Swiper
    initSwiper();
    
    // Initialize navbar scroll effect
    initNavbarScroll();
    
    // Initialize dropdowns
    initDropdowns();
    
    // Initialize smooth scrolling
    initSmoothScroll();
    
    // Initialize logo protection
    initLogoProtection();
    
    // Handle window resize for dropdowns
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            initDropdowns();
        }, 250);
    });
});

/* ============================================
   Performance Optimization
   ============================================ */

// Lazy loading for images (if needed in future)
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// Initialize lazy loading if needed
// initLazyLoading();
