document.addEventListener("DOMContentLoaded", function () {
    fetch('teachers.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Fetched JSON Data:", data);
            if (!Array.isArray(data)) {
                throw new Error('Parsed JSON is not an array');
            }

            initializeFilters(data);
            setupSearchButton(data);
            // Initialize Select2 for the location dropdown
            $('#location').select2({
                placeholder: 'Select or type a location',
                allowClear: true
            });
        })
        .catch(error => console.error('Error fetching teachers:', error));
});

function initializeFilters(teachers) {
    const locationDropdown = document.getElementById('location');
    const uniqueLocations = new Set();
    teachers.forEach(teacher => {
        teacher.locations.forEach(location => uniqueLocations.add(location.toLowerCase()));
    });

    // Add 'Virtual' location if the mode is online or both
    uniqueLocations.add('virtual');

    uniqueLocations.forEach(location => {
        const option = document.createElement('option');
        option.value = location.toLowerCase();
        option.textContent = location.charAt(0).toUpperCase() + location.slice(1); // Capitalize first letter
        locationDropdown.appendChild(option);
    });
}

function setupSearchButton(teachers) {
    document.getElementById('search').addEventListener('click', function () {
        const modeOfTeaching = document.getElementById('mode-of-teaching').value.toLowerCase();
        const location = document.getElementById('location').value.toLowerCase();
        const art = document.getElementById('art-taught').value.toLowerCase();

        const filteredTeachers = teachers.filter(teacher => {
            const teacherMode = teacher.mode.toLowerCase();
            const matchesMode = modeOfTeaching === 'both' || teacherMode === modeOfTeaching || teacherMode === 'both';

            const teacherLocations = teacher.locations.map(loc => loc.toLowerCase());
            const matchesLocation = location === 'both' || (location === 'virtual' && (teacherMode !== 'offline')) || teacherLocations.includes(location);

            const teacherArt = teacher.art.toLowerCase();
            const matchesArt = art === 'all' || art === teacherArt;

            return matchesMode && matchesLocation && matchesArt;
        });

        displayTeachers(filteredTeachers);
    });
}

function displayTeachers(teachers) {
    const resultsDiv = document.querySelector('.results');
    resultsDiv.innerHTML = '';

    if (teachers.length === 0) {
        resultsDiv.textContent = 'No teachers found';
        return;
    }

    teachers.forEach(teacher => {
        const teacherDiv = document.createElement('div');
        teacherDiv.className = 'teacher';
        
        const teacherPhoto = document.createElement('img');
        teacherPhoto.src = teacher.photo;
        teacherPhoto.alt = teacher.name;
        teacherDiv.appendChild(teacherPhoto);
        
        const teacherName = document.createElement('h3');
        teacherName.textContent = teacher.name;
        teacherDiv.appendChild(teacherName);
        
        const viewDetailsButton = document.createElement('button');
        viewDetailsButton.textContent = 'View Details';
        viewDetailsButton.addEventListener('click', () => showTeacherDetails(teacher));
        teacherDiv.appendChild(viewDetailsButton);
        
        resultsDiv.appendChild(teacherDiv);
    });
}

function showTeacherDetails(teacher) {
    const popup = document.getElementById('teacher-popup');
    const teacherPhoto = document.getElementById('teacher-photo');
    const teacherInfo = document.getElementById('teacher-info');
    const contactLink = document.getElementById('contact-link');

    teacherPhoto.src = teacher.photo;
    teacherInfo.innerHTML = `<strong>Name:</strong> ${teacher.name}<br>
                             <strong>Mode:</strong> ${teacher.mode.charAt(0).toUpperCase() + teacher.mode.slice(1)}<br>
                             <strong>Locations:</strong> ${teacher.locations.map(location => location.charAt(0).toUpperCase() + location.slice(1)).join(', ')}<br>
                             <strong>Art:</strong> ${teacher.art.charAt(0).toUpperCase() + teacher.art.slice(1)}`;
    contactLink.href = `https://wa.me/${teacher.contact}`;

    popup.style.display = 'flex'; // Changed from 'block' to 'flex' to align with CSS
}

document.querySelector('.popup .close').addEventListener('click', () => {
    document.getElementById('teacher-popup').style.display = 'none';
});

document.querySelector('.popup .back-arrow').addEventListener('click', () => {
    document.getElementById('teacher-popup').style.display = 'none';
});
