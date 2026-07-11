document.addEventListener('DOMContentLoaded', () => {
    // Hamburger menu toggle
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuBackdrop = document.getElementById('mobile-menu-backdrop');
    const mobileMenuLinks = mobileMenu.querySelectorAll('a');

    const toggleMenu = (forceOpen) => {
const shouldOpen = forceOpen ?? !mobileMenu.classList.contains('open');

hamburgerBtn.classList.toggle('open', shouldOpen);
hamburgerBtn.setAttribute('aria-expanded', String(shouldOpen));
mobileMenu.classList.toggle('open', shouldOpen);
mobileMenu.setAttribute('aria-hidden', String(!shouldOpen));
mobileMenuBackdrop.classList.toggle('open', shouldOpen);
document.body.classList.toggle('overflow-hidden', shouldOpen);
    };

    hamburgerBtn.addEventListener('click', () => {
toggleMenu();
    });

    mobileMenuBackdrop.addEventListener('click', () => toggleMenu(false));

    mobileMenuLinks.forEach(link => {
link.addEventListener('click', () => toggleMenu(false));
    });

    document.addEventListener('keydown', (event) => {
if (event.key === 'Escape' && mobileMenu.classList.contains('open')) {
    toggleMenu(false);
}
    });

    // Shared pop-out carousel functionality
    const getCircularOffset = (index, activeIndex, total) => {
let offset = index - activeIndex;
if (offset > total / 2) offset -= total;
if (offset < -total / 2) offset += total;
return offset;
    };

    const initPopCarousel = ({
viewportId,
trackId,
prevButtonId,
nextButtonId,
itemSelector,
mobileSpacingFactor,
mobileSpacingMax,
desktopSpacingFactor,
desktopSpacingMax,
activeScale,
nearScale,
farScale,
nearOpacity,
farOpacity,
sideYOffset,
heightPadding
    }) => {
const viewport = document.getElementById(viewportId);
const track = document.getElementById(trackId);
const prevButton = document.getElementById(prevButtonId);
const nextButton = document.getElementById(nextButtonId);
const allItems = Array.from(track.querySelectorAll(itemSelector));
let visibleItems = [...allItems];
let activeIndex = 0;
let touchStartX = 0;
let touchDeltaX = 0;
const currentOffsets = new Map();

const normalizeIndex = () => {
    if (!visibleItems.length) {
        activeIndex = 0;
        return;
    }

    activeIndex = (activeIndex + visibleItems.length) % visibleItems.length;
};

const applyTransforms = () => {
    if (!visibleItems.length) {
        allItems.forEach(item => {
            item.classList.remove('is-active');
            item.style.opacity = '0';
            item.style.pointerEvents = 'none';
            item.style.zIndex = '0';
            currentOffsets.set(item, null);
        });
        track.style.height = '0px';
        return;
    }

    const viewportWidth = viewport.clientWidth;
    const isMobile = window.innerWidth < 640;
    const spacing = isMobile
        ? Math.min(viewportWidth * mobileSpacingFactor, mobileSpacingMax)
        : Math.min(viewportWidth * desktopSpacingFactor, desktopSpacingMax);

    let tallestItem = 0;
    allItems.forEach(item => {
        tallestItem = Math.max(tallestItem, item.offsetHeight);
    });
    track.style.height = `${tallestItem + heightPadding}px`;

    const visibleSet = new Set(visibleItems);
    allItems.forEach(item => {
        if (visibleSet.has(item)) return;
        item.classList.remove('is-active');
        item.style.opacity = '0';
        item.style.pointerEvents = 'none';
        item.style.zIndex = '0';
        item.style.transform = 'translate3d(-50%, 0, 0) scale(0.78)';
        currentOffsets.set(item, null);
    });

    visibleItems.forEach((item, index) => {
        const offset = getCircularOffset(index, activeIndex, visibleItems.length);
        const absoluteOffset = Math.abs(offset);
        currentOffsets.set(item, offset);

        item.classList.toggle('is-active', offset === 0);

        if (absoluteOffset > 2) {
            item.style.opacity = '0';
            item.style.pointerEvents = 'none';
            item.style.zIndex = '0';
            item.style.transform = `translate3d(calc(-50% + ${offset * spacing}px), 0, 0) scale(0.78)`;
            return;
        }

        const scale = offset === 0 ? activeScale : absoluteOffset === 1 ? nearScale : farScale;
        const opacity = offset === 0 ? 1 : absoluteOffset === 1 ? nearOpacity : farOpacity;
        const yOffset = offset === 0 ? 0 : sideYOffset;

        item.style.opacity = String(opacity);
        item.style.pointerEvents = absoluteOffset <= 1 ? 'auto' : 'none';
        item.style.zIndex = String(30 - absoluteOffset);
        item.style.transform = `translate3d(calc(-50% + ${offset * spacing}px), ${yOffset}px, 0) scale(${scale})`;
    });
};

const goToNext = () => {
    if (!visibleItems.length) return;
    activeIndex += 1;
    normalizeIndex();
    applyTransforms();
};

const goToPrev = () => {
    if (!visibleItems.length) return;
    activeIndex -= 1;
    normalizeIndex();
    applyTransforms();
};

prevButton.addEventListener('click', goToPrev);
nextButton.addEventListener('click', goToNext);

allItems.forEach(item => {
    item.addEventListener('click', (event) => {
        const offset = currentOffsets.get(item);
        if (offset === null || offset === undefined || offset === 0) return;

        event.preventDefault();
        event.stopPropagation();

        if (offset < 0) {
            goToPrev();
        } else {
            goToNext();
        }
    });
});

viewport.addEventListener('touchstart', (event) => {
    touchStartX = event.touches[0].clientX;
    touchDeltaX = 0;
}, {
    passive: true
});

viewport.addEventListener('touchmove', (event) => {
    touchDeltaX = event.touches[0].clientX - touchStartX;
}, {
    passive: true
});

viewport.addEventListener('touchend', () => {
    const swipeThreshold = 45;
    if (touchDeltaX > swipeThreshold) {
        goToPrev();
    } else if (touchDeltaX < -swipeThreshold) {
        goToNext();
    }
});

const setFilter = (predicate) => {
    visibleItems = allItems.filter(predicate);
    visibleItems.forEach(item => {
        item.style.display = 'block';
    });

    allItems.forEach(item => {
        if (!visibleItems.includes(item)) {
            item.style.display = 'none';
        }
    });

    activeIndex = 0;
    normalizeIndex();
    applyTransforms();
};

normalizeIndex();
applyTransforms();

return {
    refresh: applyTransforms,
    setFilter
};
    };

    const programTeamsCarouselController = initPopCarousel({
viewportId: 'program-teams-viewport',
trackId: 'program-teams-carousel',
prevButtonId: 'program-teams-prev-btn',
nextButtonId: 'program-teams-next-btn',
itemSelector: '.program-team-card',
mobileSpacingFactor: 0.9,
mobileSpacingMax: 320,
desktopSpacingFactor: 0.48,
desktopSpacingMax: 430,
activeScale: 1.07,
nearScale: 0.9,
farScale: 0.82,
nearOpacity: 0.72,
farOpacity: 0.3,
sideYOffset: 14,
heightPadding: 28
    });

    const showcaseCarouselController = initPopCarousel({
viewportId: 'showcase-viewport',
trackId: 'carousel',
prevButtonId: 'prev-btn',
nextButtonId: 'next-btn',
itemSelector: '.showcase-card',
mobileSpacingFactor: 0.88,
mobileSpacingMax: 340,
desktopSpacingFactor: 0.44,
desktopSpacingMax: 420,
activeScale: 1.05,
nearScale: 0.9,
farScale: 0.84,
nearOpacity: 0.74,
farOpacity: 0.34,
sideYOffset: 12,
heightPadding: 26
    });

    const officersCarouselController = initPopCarousel({
viewportId: 'officer-viewport',
trackId: 'officer-carousel',
prevButtonId: 'officer-prev-btn',
nextButtonId: 'officer-next-btn',
itemSelector: '.officer-card',
mobileSpacingFactor: 0.9,
mobileSpacingMax: 320,
desktopSpacingFactor: 0.47,
desktopSpacingMax: 420,
activeScale: 1.06,
nearScale: 0.9,
farScale: 0.84,
nearOpacity: 0.74,
farOpacity: 0.34,
sideYOffset: 14,
heightPadding: 28
    });

    window.addEventListener('resize', () => {
programTeamsCarouselController.refresh();
showcaseCarouselController.refresh();
officersCarouselController.refresh();
    });

    // Statistics counter animation
    const counters = [{
id: 'projects-count',
target: 20
    }, {
id: 'members-count',
target: 60
    }, {
id: 'hours-count',
target: 200

    }, ];

    const animateCounter = (element, target) => {
let current = 0;
const increment = target / 200; // Adjust for speed
const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
        clearInterval(timer);
        element.textContent = target;
    } else {
        element.textContent = Math.ceil(current);
    }
}, 5);
    };


    // Officer filter menu
    const filterButtons = document.querySelectorAll('.officer-filter');
    const officerCards = document.querySelectorAll('.officer-card');

    filterButtons.forEach(button => {
    button.addEventListener('click', () => {
// Button styles
filterButtons.forEach(btn => {
btn.classList.remove('bg-sky-600', 'text-white');
btn.classList.add('bg-white', 'text-gray-700');
});

button.classList.add('bg-sky-600', 'text-white');
button.classList.remove('bg-white', 'text-gray-700');

const filter = button.dataset.filter;

officersCarouselController.setFilter(card => {
    return filter === 'all' || card.classList.contains(filter);
});
    });
    });


    // Intersection Observer for fade-in animation
    const fadeElements = document.querySelectorAll('.fade-in');

    const observer = new IntersectionObserver((entries, observer) => {
entries.forEach(entry => {
    if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        // Optional: stop observing once it's visible
        observer.unobserve(entry.target);
    }
});
    }, {
threshold: 0.2
    });

    fadeElements.forEach(el => observer.observe(el));


    // Intersection Observer for statistics counter
    const statsSection = document.querySelector('.section-padding.bg-sky-600');
    const statsObserver = new IntersectionObserver((entries, observer) => {
entries.forEach(entry => {
    if (entry.isIntersecting) {
        counters.forEach(counter => {
            const element = document.getElementById(counter.id);
            animateCounter(element, counter.target);
        });
        observer.unobserve(entry.target);
    }
});
    }, {
threshold: 0.5
    }); // Trigger when 50% of the section is visible

    statsObserver.observe(statsSection);
});


