document.addEventListener("DOMContentLoaded", function () {
    fetch('teachers.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();  // Read response as text
        })
        .then(text => {
            console.log("Raw JSON Text:", text);  // Log the raw text to the console
            return JSON.parse(text);  // Parse the text as JSON
        })
        .then(teachers => {
            console.log("Parsed JSON Data:", teachers);  // Log the parsed JSON data to the console
            if (!Array.isArray(teachers)) {
                throw new Error('Parsed JSON is not an array');
            }

            // Initialize the location dropdown
            const locationDropdown = document.getElementById('location');
            const uniqueLocations = new Set();
            teachers.forEach(teacher => {
                teacher.locations.forEach(location => uniqueLocations.add(location));
            });
            uniqueLocations.forEach(location => {
                const option = document.createElement('option');
                option.value = location.toLowerCase();
                option.textContent = location;
                locationDropdown.appendChild(option);
            });

            // Add event listener for the search button
            document.getElementById('search').addEventListener('click', function () {
                const modeOfTeaching = document.getElementById('mode-of-teaching').value;
                const location = document.getElementById('location').value.toLowerCase();
                const art = document.getElementById('art-taught').value.toLowerCase();

                const filteredTeachers = teachers.filter(teacher => {
                    const teacherMode = teacher.mode.toLowerCase();
                    const matchesMode = modeOfTeaching === 'both' || teacherMode === modeOfTeaching || teacherMode === 'both';

                    const teacherLocations = teacher.locations.map(loc => loc.toLowerCase());
                    const matchesLocation = location === 'both' || location === 'virtual' && teacherMode !== 'offline' || teacherLocations.includes(location);

                    const teacherArt = teacher.art.toLowerCase();
                    const matchesArt = art === 'both' || art === teacherArt;

                    return matchesMode && matchesLocation && matchesArt;
                });

                displayTeachers(filteredTeachers);
            });
        })
        .catch(error => console.error('Error fetching teachers:', error));
});

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
    teacherInfo.textContent = `Name: ${teacher.name}\nMode: ${teacher.mode}\nLocations: ${teacher.locations.join(', ')}\nArt: ${teacher.art}`;
    contactLink.href = teacher.contact;
    
    popup.style.display = 'block';
}

document.querySelector('.popup .close').addEventListener('click', () => {
    document.getElementById('teacher-popup').style.display = 'none';
});

document.querySelector('.popup .back-arrow').addEventListener('click', () => {
    document.getElementById('teacher-popup').style.display = 'none';
});
