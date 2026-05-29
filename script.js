'use strict';

/* =========================================
   UTILITY FUNCTIONS
   ========================================= */
const toggleClass = (element, className) => element.classList.toggle(className);
const addClass = (element, className) => element.classList.add(className);
const removeClass = (element, className) => element.classList.remove(className);

/* =========================================
   SIDEBAR TOGGLE (Mobile)
   ========================================= */
const sidebar = document.querySelector('[data-sidebar]');
const sidebarBtn = document.querySelector('[data-sidebar-btn]');

if (sidebarBtn && sidebar) {
    sidebarBtn.addEventListener('click', () => {
        toggleClass(sidebar, 'active');
        const isExpanded = sidebarBtn.getAttribute('aria-expanded') === 'true';
        sidebarBtn.setAttribute('aria-expanded', !isExpanded);
    });
}

/* =========================================
   TESTIMONIALS MODAL
   ========================================= */
const modalContainer = document.querySelector('[data-modal-container]');
const modalCloseBtn = document.querySelector('[data-modal-close-btn]');
const overlay = document.querySelector('[data-overlay]');
const testimonialsItems = document.querySelectorAll('[data-testimonials-item]');

const modalElements = {
    img: document.querySelector('[data-modal-img]'),
    title: document.querySelector('[data-modal-title]'),
    text: document.querySelector('[data-modal-text]')
};

function toggleModal() {
    modalContainer?.classList.toggle('active');
    overlay?.classList.toggle('active');
    
    // Update aria-hidden for accessibility
    const isActive = modalContainer?.classList.contains('active');
    modalContainer?.setAttribute('aria-hidden', !isActive);
    
    // Prevent body scroll when modal is open
    document.body.style.overflow = isActive ? 'hidden' : '';
}

// Open modal on testimonial click
testimonialsItems.forEach(item => {
    item.addEventListener('click', () => {
        if (!modalElements.img || !modalElements.title || !modalElements.text) return;
        
        modalElements.img.src = item.querySelector('[data-testimonials-avatar]')?.src;
        modalElements.img.alt = item.querySelector('[data-testimonials-avatar]')?.alt;
        modalElements.title.textContent = item.querySelector('[data-testimonials-title]')?.textContent;
        modalElements.text.innerHTML = item.querySelector('[data-testimonials-text]')?.innerHTML;
        
        toggleModal();
    });

    // Also allow keyboard activation
    item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            item.click();
        }
    });
});

// Close modal
modalCloseBtn?.addEventListener('click', toggleModal);
overlay?.addEventListener('click', toggleModal);

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalContainer?.classList.contains('active')) {
        toggleModal();
    }
});

/* =========================================
   PORTFOLIO FILTER
   ========================================= */
const selectBtn = document.querySelector('[data-select]');
const selectItems = document.querySelectorAll('[data-select-item]');
const selectValue = document.querySelector('[data-select-value]');
const filterBtns = document.querySelectorAll('[data-filter-btn]');
const filterItems = document.querySelectorAll('[data-filter-item]');

// Toggle mobile select dropdown
selectBtn?.addEventListener('click', () => {
    toggleClass(selectBtn, 'active');
    const isExpanded = selectBtn.getAttribute('aria-expanded') === 'true';
    selectBtn.setAttribute('aria-expanded', !isExpanded);
});

// Filter function
function filterProjects(category) {
    filterItems.forEach(item => {
        const itemCategory = item.dataset.category;
        if (category === 'all' || category === itemCategory) {
            addClass(item, 'active');
        } else {
            removeClass(item, 'active');
        }
    });
}

// Mobile select items
selectItems.forEach(item => {
    item.addEventListener('click', () => {
        const selectedValue = item.textContent.toLowerCase().trim();
        selectValue.textContent = item.textContent;
        toggleClass(selectBtn, 'active');
        selectBtn.setAttribute('aria-expanded', 'false');
        filterProjects(selectedValue);
    });
});

// Desktop filter buttons
let activeFilterBtn = filterBtns[0];

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const selectedValue = btn.textContent.toLowerCase().trim();
        
        // Update active state
        activeFilterBtn?.classList.remove('active');
        btn.classList.add('active');
        activeFilterBtn = btn;
        
        // Update mobile select value for consistency
        if (selectValue) selectValue.textContent = btn.textContent;
        
        // Apply filter
        filterProjects(selectedValue);
    });
});

/* =========================================
   CONTACT FORM
   ========================================= */
const form = document.querySelector('[data-form]');
const formInputs = document.querySelectorAll('[data-form-input]');
const formBtn = document.querySelector('[data-form-btn]');

function validateForm() {
    if (!form || !formBtn) return;
    
    const isValid = form.checkValidity();
    if (isValid) {
        formBtn.removeAttribute('disabled');
    } else {
        formBtn.setAttribute('disabled', '');
    }
}

formInputs.forEach(input => {
    input.addEventListener('input', validateForm);
    input.addEventListener('blur', validateForm);
});

// Form submission (prevent default for demo)
form?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Show success feedback (optional)
    if (formBtn) {
        const originalText = formBtn.querySelector('span')?.textContent;
        formBtn.querySelector('span').textContent = 'Sent!';
        formBtn.disabled = true;
        
        // Reset after 3 seconds
        setTimeout(() => {
            form.reset();
            formBtn.querySelector('span').textContent = originalText;
            validateForm();
        }, 3000);
    }
});

/* =========================================
   PAGE NAVIGATION
   ========================================= */
const navLinks = document.querySelectorAll('[data-nav-link]');
const pages = document.querySelectorAll('[data-page]');

function showPage(pageName) {
    // Hide all pages
    pages.forEach(page => {
        if (page.dataset.page === pageName) {
            addClass(page, 'active');
        } else {
            removeClass(page, 'active');
        }
    });
    
    // Update nav links active state
    navLinks.forEach(link => {
        const linkPage = link.textContent.toLowerCase().trim();
        if (linkPage === pageName) {
            addClass(link, 'active');
        } else {
            removeClass(link, 'active');
        }
    });
    
    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetPage = link.textContent.toLowerCase().trim();
        showPage(targetPage);
    });
});

/* =========================================
   INITIALIZATION
   ========================================= */
document.addEventListener('DOMContentLoaded', () => {
    // Ensure first page is active
    showPage('about');
    
    // Preload critical images (optional optimization)
    const criticalImages = document.querySelectorAll('img[loading="eager"], img:not([loading])');
    criticalImages.forEach(img => {
        if (img.complete) {
            img.classList.add('loaded');
        } else {
            img.addEventListener('load', () => img.classList.add('loaded'));
        }
    });
});