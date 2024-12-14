// Cookie Management
function setCookie(name, value) {
    document.cookie = name + "=" + value;
    return value;
}

function getCookie(name, defaultValue = null) {
    const cookie = document.cookie
        .split(';')
        .find(c => c.trim().startsWith(name + "="));

    if (cookie) {
        return cookie.split("=")[1]; // Extract and return the cookie's value
    } else {
        setCookie(name, defaultValue); // Set the default value as the cookie
        return defaultValue;
    }
}

// Fetch Data from API
async function getData() {
    const url = "https://data.gov.bh/api/explore/v2.1/catalog/datasets/01-statistics-of-students-nationalities_updated/records?where=colleges%20like%20%22IT%22%20AND%20the_programs%20like%20%22bachelor%22&limit=100";
    try {
        const responce = await fetch(url); // Fetch data from the API
        const data = await responce.json(); // Parse JSON response
        const results = await data.results; // Extract results from the response
        return results;
    } catch (error) {
        console.error("Error fetching data:", error); // Log fetch errors
        return [];
    }
}

// Update the DOM based on language and fetched data
async function createDOM(dLang = null) {
    const results = await getData(); // Fetch data from the API

    // Select DOM elements for manipulation
    const h1 = document.querySelector("header h1");
    const h6 = document.querySelector("header h6");
    const trThead = document.querySelector("main thead tr");
    const tbody = document.querySelector("main tbody");

    // Get language from parameter or cookie
    const lang = dLang || getCookie('dlang', 'en');

    if (lang === "ar") {
        // Update content for Arabic language
        h1.innerHTML = "طلبة جامعة البحرين المقيدين بحسب جنسياتهم";
        h6.innerHTML = '<a>English</a>';

        // Arabic table headers
        trThead.innerHTML = "<th>عدد الطلبة</th><th>الكليات</th><th>الجنسية</th><th>البرامج</th><th>الفصل الدراسي</th><th>السنة</th>";

        // Generate Arabic table rows
        let tdString = '';
        for (let row of results) {
            tdString += `
            <tr>
                <td>${row.number_of_students}</td>
                <td>${row.lklyt}</td>
                <td>${row.ljnsy}</td>
                <td>${row.lbrmj}</td>
                <td>${row.lfsl_ldrsy}</td>
                <td>${row.year}</td>
            </tr>`;
        }
        tbody.innerHTML = tdString;

    } else {
        // Update content for English language
        h1.innerHTML = 'University of Bahrain Students Enrollment by Nationality';
        h6.innerHTML = '<a>العربية</a>';

        // English table headers
        trThead.innerHTML = "<th>Year</th><th>Semester</th><th>The Programs</th><th>Nationality</th><th>Colleges</th><th>Number of Students</th>";

        // Generate English table rows
        let tdString = '';
        for (let row of results) {
            tdString += `
            <tr>
                <td>${row.year}</td>
                <td>${row.semester}</td>
                <td>${row.the_programs}</td>
                <td>${row.nationality}</td>
                <td>${row.colleges}</td>
                <td>${row.number_of_students}</td>
            </tr>`;
        }
        tbody.innerHTML = tdString;
    }
}

// Initialize the DOM with default language settings
createDOM();

// Add event listener to language toggle link
const h6 = document.querySelector('h6');
h6.addEventListener('click', function() {
    const currentLang = getCookie('dlang', 'en'); // Get the current language from cookie
    const newLang = currentLang === 'en' ? 'ar' : 'en'; // Toggle between 'en' and 'ar'

    // Update the language in the cookies and re-render the DOM
    createDOM(setCookie('dlang', newLang));
});

