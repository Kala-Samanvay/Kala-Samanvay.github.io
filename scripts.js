document.addEventListener('DOMContentLoaded', function() {
    fetch('teachers.json')
    .then(response => response.json())
    .then(teachers => {
        // Populate location options
            const locationSet = new Set();
            teachers.forEach(teacher => {
                teacher.locations.forEach(location => locationSet.add(location));
    })
    .catch(error => console.error('Error fetching teachers:', error));

            const locationSelect = document.getElementById('location');
            locationSet.forEach(location => {
                const option = document.createElement('option');
                option.value = location.toLowerCase();
                option.textContent = location;
                locationSelect.appendChild(option);
            });

            document.getElementById('search').addEventListener('click', function() {
                // Function to filter teachers based on selected options
                function filterTeachers() {
                    const modeOfTeaching = document.getElementById('mode-of-teaching').value;
                    const location = document.getElementById('location').value;
                    const art = Array.from(document.getElementById('art-taught').selectedOptions).map(option => option.value);

                    const filteredTeachers = teachers.filter(teacher => {
                        const teacherMode = teacher.mode.toLowerCase();
                        const matchesMode = modeOfTeaching === 'both' || teacherMode === modeOfTeaching || teacherMode === 'both';

                        const teacherLocations = teacher.locations.map(loc => loc.toLowerCase());
                        const matchesLocation = location === 'both' || location === 'virtual' && teacherMode !== 'offline' || teacherLocations.includes(location);

                        const teacherArt = teacher.art.toLowerCase();
                        const matchesArt = art.includes('both') || art.includes(teacherArt);

                        return matchesMode && matchesLocation && matchesArt;
                    });

                    // Display filtered teachers
                    displayTeachers(filteredTeachers);
                }

                // Function to display teachers
                function displayTeachers(teachers) {
                    const resultsDiv = document.querySelector('.results');
                    resultsDiv.innerHTML = '';
                    teachers.forEach(teacher => {
                        const teacherDiv = document.createElement('div');
                        teacherDiv.classList.add('teacher');
                        teacherDiv.innerHTML = `
                            <img src="${teacher.photo}" alt="Teacher Photo">
                            <p>${teacher.name}</p>
                            <button class="view-details">View Details</button>
                        `;
                        teacherDiv.querySelector('.view-details').addEventListener('click', function() {
                            showPopup(teacher);
                        });
                        resultsDiv.appendChild(teacherDiv);
                    });
                }

                // Show the popup with teacher details
                function showPopup(teacher) {
                    const popup = document.getElementById('teacher-popup');
                    document.getElementById('teacher-photo').src = teacher.photo;
                    document.getElementById('teacher-info').innerHTML = `
                        Name: ${teacher.name}<br>
                        Mode of Teaching: ${teacher.mode}<br>
                        Locations: ${teacher.locations.join(', ')}<br>
                        Art: ${teacher.art}
                    `;
                    document.getElementById('contact-link').href = teacher.contact;
                    popup.style.display = 'flex';
                }

                document.querySelector('.popup .close').addEventListener('click', function() {
                    document.getElementById('teacher-popup').style.display = 'none';
                });

                document.querySelector('.popup .back-arrow').addEventListener('click', function() {
                    document.getElementById('teacher-popup').style.display = 'none';
                });

                // Initial display
                filterTeachers();
            });
        })
        .catch(error => console.error('Error fetching teachers:', error));
});
