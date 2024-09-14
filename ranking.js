document.addEventListener('DOMContentLoaded', () => {
    const total_ID = []; // Global Array to store all the IDs used
    const Save_actors = []; // Global Array to store all the actors
    const table = document.getElementById('table-body');
    let intervalID;
    let needed_ID = 0;


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
        // to make it random: needed_ID = Math.floor(Math.random() * 40) + 1;
        needed_ID += 1
        return total_ID.includes(needed_ID) ? verify_ID() : needed_ID;
        // If the ID is already in the array, call the function again to get a new ID
    }
     // Function to check if all IDs have been collected in the case it does the global counter goes to 1 and clear interval
    const checkAndExecute = () => 
        total_ID.length === 40 
            ? (clearInterval(intervalID), console.log('All IDs have been collected'), needed_ID=0)
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


