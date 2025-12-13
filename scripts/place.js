// Static weather values (must match displayed values)
const temperature = 26.9; // °C
const windSpeed = 9.3;    // km/h

// Wind chill calculation function (metric)
function calculateWindChill(temp, speed) {
    return (
        13.12 +
        0.6215 * temp -
        11.37 * Math.pow(speed, 0.16) +
        0.3965 * temp * Math.pow(speed, 0.16)
    ).toFixed(1);
}

// Display wind chill only if conditions are met
function displayWindChill() {
    const windChillElement = document.querySelector(
        ".Weather h4:last-child"
    );

    if (temperature <= 10 && windSpeed > 4.8) {
        const windChill = calculateWindChill(temperature, windSpeed);
        windChillElement.innerHTML = `<b>Wind Chill</b>: ${windChill} °C`;
    } else {
        windChillElement.innerHTML = `<b>Wind Chill</b>: N/A`;
    }
}

// Footer year and last modified date
function updateFooterDates() {
    const footer = document.querySelector(".footer");

    const year = new Date().getFullYear();
    const lastModified = document.lastModified;

    footer.children[0].innerHTML = `&copy; ${year} Ifeanyi Oleforo`;
    footer.children[2].innerHTML = `Last Modification: ${lastModified}`;
}

// Run when page loads
displayWindChill();
updateFooterDates();
