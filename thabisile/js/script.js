document.addEventListener('DOMContentLoaded', function() {
    // Highlight menu item on scroll
    const sections = document.querySelectorAll('.page-section');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.querySelector('.navbar');

    // Show the corresponding menu link to the on page content
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= sectionTop - 150) { // Adjusted trigger point
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            window.scrollTo({
                top: targetSection.offsetTop - 60,
                behavior: 'smooth'
            });
            
            navLinks.forEach(link => link.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Experience timeline animation on scroll
    const timeline = document.querySelector('.timeline');
    const timelineItems = document.querySelectorAll('.timeline-item');

    function checkTimelineAnimation() {
        const triggerBottom = window.innerHeight / 5 * 4;
        const timelineTop = timeline.getBoundingClientRect().top;
        
        if (timelineTop < triggerBottom) {
            timeline.classList.add('in-view');
            
            timelineItems.forEach(item => {
                const itemTop = item.getBoundingClientRect().top;
                
                if (itemTop < triggerBottom) {
                    item.style.animationPlayState = 'running';
                }
            });
        }
    }

    // Calculate and set the line height based on item positions
    function setupTimeline() {
        const items = document.querySelectorAll('.timeline-item');
        if (items.length > 0) {
            const firstItem = items[0];
            const lastItem = items[items.length - 1];
            
            // Get item positions relative to document
            const firstItemPos = firstItem.getBoundingClientRect().top + window.pageYOffset;
            const lastItemPos = lastItem.getBoundingClientRect().top + window.pageYOffset;
            const timelinePos = timeline.getBoundingClientRect().top + window.pageYOffset;
            
            // Calculate item positions relative to timeline container
            const lineTop = firstItem.querySelector('.timeline-dot').getBoundingClientRect().top - timeline.getBoundingClientRect().top;
            const lineBottom = lastItem.querySelector('.timeline-dot').getBoundingClientRect().top - timeline.getBoundingClientRect().top;
            
            // Set CSS variables
            timeline.style.setProperty('--line-top', `${lineTop}px`);
            timeline.style.setProperty('--line-bottom', `${lineBottom}px`);
            
            // Update the line element
            let line = timeline.querySelector('.timeline-line');
            if (!line) {
                line = document.createElement('div');
                line.className = 'timeline-line';
                timeline.prepend(line);
            }
            
            // Set line styles
            line.style.position = 'absolute';
            line.style.left = '50px';
            line.style.width = '2px';
            line.style.backgroundColor = '#333';
            line.style.top = 'var(--line-top)';
            line.style.height = `calc(var(--line-bottom) - var(--line-top))`;
            line.style.marginLeft = '2px';
            line.style.zIndex = '0';
        }
    }

    // Initialize timeline on load and recalculate on resize
    window.addEventListener('load', function() {
        setupTimeline();
        checkTimelineAnimation();
    });
    
    window.addEventListener('resize', setupTimeline);
    window.addEventListener('scroll', checkTimelineAnimation);
});
