const preloader = document.getElementById("preloader");
let isLoaded = false; 

function removePreloader() {
    if (isLoaded) return; 
    isLoaded = true;
    setTimeout(() => {
        if (preloader) {
            preloader.style.transform = "translateY(-100%)";
            document.body.classList.remove("no-scroll");
            setTimeout(() => { preloader.remove(); }, 800);
        }
    }, 2000);
}
window.addEventListener("load", removePreloader);
setTimeout(removePreloader, 3500);

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

const mapElement = document.getElementById('leaflet-map');
if (mapElement) {
    const map = L.map('leaflet-map', {
        zoomControl: false,
        attributionControl: false,
        scrollWheelZoom: false,
        dragging: false,
        touchZoom: false,
        doubleClickZoom: false
    }).setView([28.4744, 77.5040], 13);
    
    // Using Esri World Imagery (Satellite)
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19,
        attribution: 'Tiles &copy; Esri'
    }).addTo(map);

    const icon = L.divIcon({
        className: 'custom-div-icon',
        html: "<div style='background-color:#ef4444; width:12px; height:12px; border-radius:50%; border:2px solid white; position:relative;'><div style='position:absolute; top:-4px; left:-4px; width:20px; height:20px; background:rgba(239, 68, 68, 0.4); border-radius:50%; animation:ping 1.5s infinite;'></div></div>",
        iconSize: [20, 20],
        iconAnchor: [10, 10]
    });
    L.marker([28.4744, 77.5040], { icon: icon }).addTo(map);

    // Force map resize calc after load to prevent black/grey box
    setTimeout(() => {
        map.invalidateSize();
    }, 500);

    const style = document.createElement('style');
    style.innerHTML = `@keyframes ping { 0% { transform: scale(0.5); opacity: 1; } 100% { transform: scale(2); opacity: 0; } }`;
    document.head.appendChild(style);
}

// REALTIME GITHUB CHART OPTIMIZATION
const ghChart = document.getElementById('gh-chart');
if (ghChart) {
    // Base URL for the graph
    const baseUrl = "https://ghchart.rshah.org/10b981/hxrshitchoudhary";
    // Inject source with Timestamp to bypass cache and force realtime update
    ghChart.src = `${baseUrl}?t=${new Date().getTime()}`;
}

function updateLocationTime() {
    const timeElement = document.getElementById('location-time');
    if (!timeElement) return;
    const now = new Date();
    const options = { 
        timeZone: 'Asia/Kolkata', 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: false 
    };
    timeElement.innerText = new Intl.DateTimeFormat('en-US', options).format(now);
}
setInterval(updateLocationTime, 1000);
updateLocationTime();

const tiltContainer = document.getElementById('tiltContainer');
const tiltImage = document.getElementById('tiltImage');
if (tiltContainer && tiltImage) {
    tiltContainer.addEventListener('mousemove', (e) => {
        if (window.innerWidth < 768) return;
        const rect = tiltContainer.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const xRotation = -((y - rect.height / 2) / rect.height * 20); 
        const yRotation = ((x - rect.width / 2) / rect.width * 20);
        tiltImage.style.transition = 'none'; 
        tiltImage.style.transform = `perspective(1000px) rotateX(${xRotation}deg) rotateY(${yRotation}deg) scale(1.05)`;
    });
    tiltContainer.addEventListener('mouseleave', () => {
        tiltImage.style.transition = 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
        tiltImage.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    });
}

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

const counterElement = document.getElementById('visit-count');
async function updateVisitCount() {
    if (!counterElement) return;
    try {
        const response = await fetch("https://api.counterapi.dev/v1/hxrshitchoudhary/portfolio/up");
        const data = await response.json();
        animateValue(counterElement, 0, data.count, 2000);
    } catch (error) {
        counterElement.innerText = "--"; 
    }
}
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
updateVisitCount();

const emailBtn = document.getElementById('copyEmailBtn');
const toast = document.getElementById('toast');
if (emailBtn) {
    emailBtn.addEventListener('click', () => {
        navigator.clipboard.writeText('hxrshitchoudhary@gmail.com');
        toast.classList.add('show');
        setTimeout(() => { toast.classList.remove('show'); }, 3000);
    });
}