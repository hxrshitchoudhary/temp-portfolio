// 0. ROBUST PRELOADER LOGIC
const preloader = document.getElementById("preloader");
let isLoaded = false; 

function removePreloader() {
    if (isLoaded) return; 
    isLoaded = true;

    // Wait 2 seconds for "Hello." text
    setTimeout(() => {
        if (preloader) {
            preloader.style.transform = "translateY(-100%)";
            document.body.classList.remove("no-scroll");
            setTimeout(() => { preloader.remove(); }, 800);
        }
    }, 2000);
}

// Failsafe logic
window.addEventListener("load", removePreloader);
setTimeout(removePreloader, 3500);


// 1. Optimized Live Age Counter
const birthDate = new Date(2003, 7, 5); 
const ageElement = document.getElementById('age-counter');
const msInYear = 1000 * 60 * 60 * 24 * 365.2425; 

function updateAge() {
    const now = new Date();
    const diff = now - birthDate;
    const years = diff / msInYear;
    if (ageElement) ageElement.innerText = years.toFixed(9);
    requestAnimationFrame(updateAge);
}
requestAnimationFrame(updateAge);


// 2. Live Local Time
function updateLocalTime() {
    const timeElement = document.getElementById('local-time');
    if (!timeElement) return;
    const timeString = new Date().toLocaleTimeString('en-US', {
        timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: true
    });
    timeElement.innerText = timeString + " (IST)";
}
updateLocalTime();
setInterval(updateLocalTime, 60000);


// 3. ROBUST 3D TILT EFFECT
const tiltContainer = document.getElementById('tiltContainer');
const tiltImage = document.getElementById('tiltImage');

if (tiltContainer && tiltImage) {
    // Mouse Move Event
    tiltContainer.addEventListener('mousemove', (e) => {
        // Only run on desktop (> 768px)
        if (window.innerWidth < 768) return;

        const rect = tiltContainer.getBoundingClientRect();
        
        // Calculate mouse position relative to the element
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Calculate rotation (Limit to 20 degrees)
        const xRotation = -((y - rect.height / 2) / rect.height * 20); 
        const yRotation = ((x - rect.width / 2) / rect.width * 20);
        
        // Apply transform directly
        // We remove transition temporarily so the movement follows the mouse instantly
        tiltImage.style.transition = 'none'; 
        tiltImage.style.transform = `perspective(1000px) rotateX(${xRotation}deg) rotateY(${yRotation}deg) scale(1.05)`;
    });

    // Mouse Leave Event (Reset)
    tiltContainer.addEventListener('mouseleave', () => {
        // Add transition back for a smooth reset
        tiltImage.style.transition = 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
        tiltImage.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    });
}


// 4. Theme Toggle
const toggleBtn = document.getElementById('themeToggle');
const htmlEl = document.documentElement;
if (toggleBtn) {
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
            icon.classList.remove('fa-moon'); icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun'); icon.classList.add('fa-moon');
        }
    }
    toggleBtn.addEventListener('click', async (event) => {
        if (!document.startViewTransition) { toggleThemeLogic(); return; }
        const x = event.clientX;
        const y = event.clientY;
        const endRadius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
        const transition = document.startViewTransition(() => { toggleThemeLogic(); });
        await transition.ready;
        document.documentElement.animate(
            { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`] },
            { duration: 500, easing: 'ease-in-out', pseudoElement: '::view-transition-new(root)' }
        );
    });
}


// 5. Visit Counter
const counterElement = document.getElementById('visit-count');
if (counterElement) {
    let localVisits = localStorage.getItem('portfolio_visits');
    if (!localVisits) { localVisits = 1; } 
    else { localVisits = parseInt(localVisits) + 1; }
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
            if (progress < 1) { window.requestAnimationFrame(step); }
        };
        window.requestAnimationFrame(step);
    }
}


// 6. EMAIL COPY
const emailBtn = document.getElementById('copyEmailBtn');
const toast = document.getElementById('toast');
if (emailBtn) {
    emailBtn.addEventListener('click', () => {
        navigator.clipboard.writeText('hxrshitchoudhary@gmail.com'); // REPLACE THIS
        toast.classList.add('show');
        setTimeout(() => { toast.classList.remove('show'); }, 3000);
    });
}


// 7. KONAMI CODE (Hacker Mode)
const konamiCode = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
let konamiIndex = 0;
document.addEventListener("keydown", (e) => {
    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            activateHackerMode();
            konamiIndex = 0;
        }
    } else { konamiIndex = 0; }
});
function activateHackerMode() {
    const current = htmlEl.getAttribute('data-theme');
    if (current === 'hacker') {
        htmlEl.setAttribute('data-theme', localStorage.getItem('theme') || 'light');
        alert("System restored.");
    } else {
        htmlEl.setAttribute('data-theme', 'hacker');
        alert("ACCESS GRANTED: HACKER MODE ACTIVATED 🕶️");
    }
}