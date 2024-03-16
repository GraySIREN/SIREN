function updateTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const date = now.toDateString();

    const clockElement = document.getElementById('live-datetime');
    clockElement.textContent = `${date} ${hours}:${minutes}:${seconds}`;
}

// Update time every second
setInterval(updateTime, 1000);

// Initial call to display time immediately
updateTime();






// Trackm-item5 scrollable Icon Bank//
const iconBank = document.getElementById('trackm5'); // Corrected ID here
let isMouseDown = false;
let startX;
let startY;
let scrollLeft;
let scrollTop;

iconBank.addEventListener('mousedown', (e) => {
    isMouseDown = true;
    startX = e.pageX - iconBank.offsetLeft;
    startY = e.pageY - iconBank.offsetTop;
    scrollLeft = iconBank.scrollLeft;
    scrollTop = iconBank.scrollTop;
});

document.addEventListener('mouseup', () => {
    isMouseDown = false;
});

document.addEventListener('mousemove', (e) => {
    if (!isMouseDown) return;
    e.preventDefault();
    const x = e.pageX - iconBank.offsetLeft;
    const y = e.pageY - iconBank.offsetTop;
    const walkX = (x - startX) * 3; // Adjust the scrolling speed if needed
    const walkY = (y - startY) * 3;
    iconBank.scrollLeft = scrollLeft - walkX;
    iconBank.scrollTop = scrollTop - walkY;
});
