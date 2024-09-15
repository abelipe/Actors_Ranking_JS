document.addEventListener('DOMContentLoaded', () => {
    const total_ID = []; // Global Array to store all the IDs used
    const Save_actors = []; // Global Array to store all the actors
    const table = document.getElementById('table-body');
    let intervalID;
    let needed_ID = 0;
    const total_Awards = []; //contains all the awards
    let awards_counter = {}; //contains all the awards and the amount of times they appear

    
    

    async function Awards_counter() {
        const awards = total_Awards;
        awards_counter = awards.reduce((acc, award) => {
            acc[award] = (acc[award] || 0) + 1;g
            return acc;
        }, {});

    }


    async function getData(needed_ID) {
        const url = `https://freetestapi.com/api/v1/actors/${needed_ID}`;
        const handleResponse = response => 
            response.ok 
                ? response.json() 
                : Promise.reject(new Error(`Response status: ${response.status}`));
        
        const logActors = actors => {
            //console.log(actors);
            total_ID.push(actors.id); // Push the ID to the array
            Save_actors.push(actors);
            actors.awards.forEach(award => {
                total_Awards.push(award);
            });
            Awards_counter()
            generateHTML(actors); // Call generateHTML after fetching the data
        };
        const logError = error => console.error(error.message);

        return fetch(url)
            .then(handleResponse)
            .then(logActors)
            .catch(logError);
    }

    function generateHTML(actors) {
        const { id, name, awards } = actors;
        table.innerHTML += `
            <tr>
                <td>${id}</td>
                <td>${name}</td>
                <td>${awards} Total: ${awards.length}</td>
                <td>
                    <button id="button_${id}">View</button>
                    <button id="delete_${id}">Delete</button>
                </td>
            </tr>
        `;
    }

    function verify_ID() {
        needed_ID = Math.floor(Math.random() * 40) + 1;
        needed_ID += 1
        return total_ID.includes(needed_ID) ? verify_ID() : needed_ID;
        // If the ID is already in the array, call the function again to get a new ID
    }
     // Function to check if all IDs have been collected in the case it does the global counter goes to 1 and clear interval
    const checkAndExecute = () => 
        total_ID.length === 40 
            ? (clearInterval(intervalID), console.log('All IDs have been collected'), needed_ID=0)//, console.log(total_Awards), console.log(awards_counter))
            : main();

    async function main() {
        const needed_ID = verify_ID();
        await getData(needed_ID);
        //console.log(total_ID);
        // Executes when the page is loaded
    }

    // Execute main function immediately
    main();

    // Set interval to execute main function every 5 seconds
    intervalID = setInterval(checkAndExecute, 5000);

    // Declare the input, button and table
    const searchInput = document.getElementById('Buscador');
    const searchButton = document.getElementById('search_btn');
    const tableBody = document.getElementById('table-body');
    const searchResultsDiv = document.getElementById('search-results');

   // Function to fetch data from table and count awards
function countAwards() {
    const awards = {};
    const rows = tableBody.rows;

    // Iterate through each row in the table
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const awardString = row.cells[2].textContent;

        // Check if the cell starts with "None"
        if (awardString.trim().toLowerCase().startsWith("none")) {
            continue; // Skip this cell
        }

        // Extract awards until "Total" appears
        const totalIndex = awardString.indexOf("Total");
        let awardsString = awardString;
        if (totalIndex !== -1) {
            awardsString = awardString.substring(0, totalIndex);
        }

        const awardRegex = /(?!none|total|\d)[^,]+(?=,|$)/gi; // Match award names (before commas or end of string), excluding "none", "total", and numbers
        const awardsArray = awardsString.match(awardRegex); // Extract award names

        // Count the total amount of each award
        for (let j = 0; j < awardsArray.length; j++) {
            const award = awardsArray[j].trim(); // Remove whitespace
            if (awards[award]) {
                awards[award]++;
            } else {
                awards[award] = 1;
            }
        }
    }

    return awards;
}

// Get the canvas element
const ctx = document.getElementById('award-chart').getContext('2d');

// Function to create and update the chart
function updateChart() {
    const awards = countAwards();
    const labels = Object.keys(awards);
    const data = Object.values(awards);

    // Create a new chart or update the existing one
    if (window.chart) {
        window.chart.destroy();
    }

    window.chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Awards',
                data: data,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Create a MutationObserver to monitor changes to the table
const observer = new MutationObserver(() => {
    updateChart();
});

// Observe changes to the table body
observer.observe(tableBody, {
    childList: true,
    subtree: true
});


// Function to save the content
function saveContent() {
  const inputData = searchInput.value;
  const searchResultsData = searchResultsDiv.innerHTML;
  const tableBodyData = tableBody.innerHTML;

  // Store the content in local storage
  localStorage.setItem('inputData', inputData);
  localStorage.setItem('searchResultsData', searchResultsData);
  localStorage.setItem('tableBodyData', tableBodyData);
}

// Function to retrieve the content
function retrieveContent() {
  const inputData = localStorage.getItem('inputData');
  const searchResultsData = localStorage.getItem('searchResultsData');
  const tableBodyData = localStorage.getItem('tableBodyData');

  // Populate the HTML elements with the saved data
  searchInput.value = inputData;
  searchResultsDiv.innerHTML = searchResultsData;
  tableBody.innerHTML = tableBodyData;
}

// Call the saveContent function when the window is about to close
window.addEventListener('beforeunload', saveContent);

// Call the retrieveContent function when the window is reopened
window.addEventListener('load', retrieveContent);

    // Filter function
    searchButton.addEventListener('click', () => {
        const searchTerm = searchInput.value.trim().toLowerCase();
        const rows = Array.from(tableBody.rows);
        const searchResults = rows.filter(row => 
            Array.from(row.cells).some(cell => 
                cell.textContent.toLowerCase().includes(searchTerm)
            )
        );

        searchTerm === '' ? 
        searchResultsDiv.innerHTML = '' : 
        (() => {
            const searchResultsTable = document.createElement('table');
            searchResultsTable.innerHTML = `
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Awards</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${searchResults.map(row => `
                        <tr>
                            ${Array.from(row.cells).slice(0, -1).map(cell => `<td>${cell.textContent}</td>`).join('')}
                            <td>
                                <button>View</button>
                                <button>Delete</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            `;

            searchResultsDiv.innerHTML = '';
            searchResultsDiv.appendChild(searchResultsTable);
        })();
    });

   // Function to handle "View" buttons
   async function handleViewButtonClick(row) {
    const dialog = document.getElementById('actor-dialog');
    const nameElem = document.getElementById('actor-name');
    const birthdateElem = document.getElementById('actor-birthdate');
    const nationalityElem = document.getElementById('actor-nationality');
    const imageElem = document.getElementById('actor-image');
    const deathyearElem = document.getElementById('death-year');
    const bioElem = document.getElementById('actor-bio');

    const actorID = row.cells[0].textContent;
    const actorData = Save_actors.find(actor => actor.id === parseInt(actorID));

    nameElem.textContent = `Name: ${actorData.name}`;
    birthdateElem.textContent = `Birth Date: ${actorData.birth_year}`;
    nationalityElem.textContent = `Nationality: ${actorData.nationality}`;
    imageElem.src = actorData.image;
    deathyearElem.textContent = `Death Date: ${actorData.death_year}`;
    bioElem.textContent = `Biography: ${actorData.biography}`;

    dialog.showModal();
  }
  // Function to handle "Delete" buttons
  async function handleDeleteButtonClick(row) {
    const actorID = parseInt(row.cells[0].textContent);
    const index = total_ID.indexOf(actorID);
    index !== -1 && total_ID.splice(index, 1);
    Save_actors.splice(index, 1);
    //console.log(actorID);
    clearInterval(intervalID);
    intervalID = setInterval(checkAndExecute, 5000);
    
  }
    


    // Close button closes the dialog
    document.getElementById('close-dialog').addEventListener("click", () => {
        document.getElementById('actor-dialog').close();
    });

    // Event listener "Delete" and "View" buttons
    const tableBodyFiltered = document.getElementById('search-results');
    tableBodyFiltered.addEventListener('click', (e) => {
        console.log(total_ID);
        const row = e.target.tagName === 'BUTTON' && e.target.textContent === 'Delete' ? e.target.parentNode.parentNode : null;
        row ? handleDeleteButtonClick(row) : null
        e.target.tagName === 'BUTTON' && e.target.textContent === 'Delete' ? e.target.parentNode.parentNode.remove() : null;
        
    });

    tableBody.addEventListener('click', (e) => {
        console.log(total_ID);
        const row = e.target.tagName === 'BUTTON' && e.target.textContent === 'Delete' ? e.target.parentNode.parentNode : null;
        row ? handleDeleteButtonClick(row) : null
        e.target.tagName === 'BUTTON' && e.target.textContent === 'Delete' ? e.target.parentNode.parentNode.remove() : null;
        clearInterval(intervalID);
        intervalID = setInterval(checkAndExecute, 5000);
    });

    tableBodyFiltered.addEventListener('click', async (e) => {
        const row = e.target.tagName === 'BUTTON' && e.target.textContent === "View" ? e.target.parentNode.parentNode : null;
        await (row ? handleViewButtonClick(row) : null);
    });

    table.addEventListener('click', async (e) => {
        const row = e.target.tagName === 'BUTTON' && e.target.textContent === "View" ? e.target.parentNode.parentNode : null;
        await (row ? handleViewButtonClick(row) : null);
    });
});



