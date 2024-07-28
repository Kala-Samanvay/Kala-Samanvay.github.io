document.addEventListener("DOMContentLoaded", () => {
    fetch("teachers.json")
        .then(response => response.json())
        .then(teachers => {
            console.log("Fetched JSON Data: ", teachers);
            const locationSelect = document.getElementById('location');
            const artSelect = document.getElementById('art-taught');
            const searchButton = document.getElementById('search');
            const resultsDiv = document.querySelector('.results');

            // Populate location options
            const locations = new Set();
            teachers.forEach(teacher => {
                teacher.locations.forEach(location => {
                    locations.add(location);
                });
            });
            locations.forEach(location => {
                const option = document.createElement('option');
                option.value = location.toLowerCase();
                option.textContent = location;
                locationSelect.appendChild(option);
            });

            // Search functionality
            searchButton.addEventListener('click', () => {
                const modeOfTeaching = document.getElementById('mode-of-teaching').value.toLowerCase();
                const location = locationSelect.value.toLowerCase();
                const art = artSelect.value.toLowerCase();

                const filteredTeachers = teachers.filter(teacher => {
                    const teacherMode = teacher.mode.toLowerCase();
                    const matchesMode = modeOfTeaching === 'both' || teacherMode === modeOfTeaching || teacherMode === 'both';

                    const teacherLocations = teacher.locations.map(loc => loc.toLowerCase());
                    const matchesLocation = location === 'both' || location === 'virtual' && teacherMode !== 'offline' || teacherLocations.includes(location);

                    const teacherArt = teacher.art.toLowerCase();
                    const matchesArt = art === teacherArt;

                    return matchesMode && matchesLocation && matchesArt;
                });

                resultsDiv.innerHTML = '';
                if (filteredTeachers.length > 0) {
                    filteredTeachers.forEach(teacher => {
                        const teacherDiv = document.createElement('div');
                        teacherDiv.classList.add('teacher');
                        teacherDiv.innerHTML = `
                            <img src="${teacher.photo}" alt="${teacher.name}">
                            <h3>${teacher.name}</h3>
                            <button class="view-details" data-teacher='${JSON.stringify(teacher)}'>View Details</button>
                        `;
                        resultsDiv.appendChild(teacherDiv);
                    });

                    // Attach event listeners to "View Details" buttons
                    document.querySelectorAll('.view-details').forEach(button => {
                        button.addEventListener('click', (e) => {
                            const teacher = JSON.parse(e.target.dataset.teacher);
                            document.getElementById('teacher-photo').src = teacher.photo;
                            document.getElementById('teacher-name').textContent = teacher.name;
                            document.getElementById('teacher-locations').textContent = teacher.locations.join(', ');
                            document.getElementById('teacher-art').textContent = teacher.art;
                            document.getElementById('contact-link').href = teacher.contact;
                            document.getElementById('teacher-popup').style.display = 'block';
                        });
                    });
                } else {
                    resultsDiv.textContent = 'No teachers found.';
                }
            });

            // Close popup
            document.querySelector('.close').addEventListener('click', () => {
                document.getElementById('teacher-popup').style.display = 'none';
            });

            document.querySelector('.back-arrow').addEventListener('click', () => {
                document.getElementById('teacher-popup').style.display = 'none';
            });
        })
        .catch(error => {
            console.error('Error fetching teachers:', error);
        });
});
