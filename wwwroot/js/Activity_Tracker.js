function updateTime() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const date = now.toDateString();

    // Convert hours to 12-hour format and determine AM/PM
    const amPm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;

    const clockElement = document.getElementById('live-datetime');
    clockElement.textContent = `${date} ${hours}:${minutes}:${seconds} ${amPm}`;
}
setInterval(updateTime, 1000);
updateTime();
