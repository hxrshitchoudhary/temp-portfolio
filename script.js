// 1. Optimized Live Age Counter
const birthDate = new Date(2003, 7, 5); 
const ageElement = document.getElementById('age-counter');
const msInYear = 1000 * 60 * 60 * 24 * 365.2425; 

function updateAge() {
    const now = new Date();
    const diff = now - birthDate;
    const years = diff / msInYear;
    ageElement.innerText = years.toFixed(9);
    requestAnimationFrame(updateAge);
}
requestAnimationFrame(updateAge);

// 2. Live Local Time (India)
function updateLocalTime() {
    const timeString = new Date().toLocaleTimeString('en-US', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
    document.getElementById('local-time').innerText = timeString + " (IST)";
}
updateLocalTime();
setInterval(updateLocalTime, 60000);

// 3. Improved 3D Tilt Effect
const tiltContainer = document.getElementById('tiltContainer');
const tiltImage = document.getElementById('tiltImage');

if (window.matchMedia("(min-width: 768px)").matches) {
    tiltContainer.addEventListener('mousemove', (e) => {
        const rect = tiltContainer.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const xRotation = -((y - rect.height/2) / rect.height * 15); 
        const yRotation = ((x - rect.width/2) / rect.width * 15);

        tiltImage.style.transition = 'none'; 
        tiltImage.style.transform = `rotateX(${xRotation}deg) rotateY(${yRotation}deg) scale(1.03)`;
        tiltImage.style.filter = 'grayscale(0%) contrast(105%)'; 
    });

    tiltContainer.addEventListener('mouseleave', () => {
        tiltImage.style.transition = 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1), filter 0.4s ease'; 
        tiltImage.style.transform = 'rotateX(0) rotateY(0) scale(1)';
        tiltImage.style.filter = 'grayscale(100%) contrast(90%)';
    });
}

// 4. CIRCULAR REVEAL THEME TOGGLE
const toggleBtn = document.getElementById('themeToggle');
const htmlEl = document.documentElement;
const icon = toggleBtn.querySelector('i');

const savedTheme = localStorage.getItem('theme') || 'light';
htmlEl.setAttribute('data-theme', savedTheme);
updateIcon(savedTheme);

function toggleThemeLogic() {
    const currentTheme = htmlEl.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    htmlEl.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateIcon(newTheme);
}

function updateIcon(theme) {
    if (theme === 'dark') {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
}

toggleBtn.addEventListener('click', async (event) => {
    if (!document.startViewTransition) {
        toggleThemeLogic();
        return;
    }

    const x = event.clientX;
    const y = event.clientY;

    const endRadius = Math.hypot(
        Math.max(x, innerWidth - x),
        Math.max(y, innerHeight - y)
    );

    const transition = document.startViewTransition(() => {
        toggleThemeLogic();
    });

    await transition.ready;

    document.documentElement.animate(
        {
            clipPath: [
                `circle(0px at ${x}px ${y}px)`,
                `circle(${endRadius}px at ${x}px ${y}px)`
            ],
        },
        {
            duration: 500,
            easing: 'ease-in-out',
            pseudoElement: '::view-transition-new(root)',
        }
    );
});

// 5. Visit Counter (UPDATED BASE COUNT TO 21)
const counterElement = document.getElementById('visit-count');

let localVisits = localStorage.getItem('portfolio_visits');
if (!localVisits) {
    localVisits = 1;
} else {
    localVisits = parseInt(localVisits) + 1;
}
localStorage.setItem('portfolio_visits', localVisits);

const baseCount = 21; 
const finalCount = baseCount + localVisits;

animateValue(counterElement, 0, finalCount, 2000);

function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const easeOutQuad = (t) => t * (2 - t);
        const currentVal = Math.floor(easeOutQuad(progress) * (end - start) + start);
        
        obj.innerHTML = currentVal;
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}