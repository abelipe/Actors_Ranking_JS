document.addEventListener('DOMContentLoaded', () => {
    const total_ID = []; // Global Array to store all the IDs used
    const table = document.getElementById('table-body');

    async function getData(needed_ID) {
        const url = `https://freetestapi.com/api/v1/actors/${needed_ID}`;
        const handleResponse = response => 
            response.ok 
                ? response.json() 
                : Promise.reject(new Error(`Response status: ${response.status}`));
        
        const logActors = actors => {
            //console.log(actors);
            total_ID.push(actors.id);
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
        const needed_ID = Math.floor(Math.random() * 40) + 1;
        return total_ID.includes(needed_ID) ? verify_ID() : needed_ID;
        // If the ID is already in the array, call the function again to get a new ID
    }

    const checkAndExecute = () => 
        total_ID.length === 40 
            ? (clearInterval(intervalID), console.log('All IDs have been collected')) 
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
    const intervalID = setInterval(checkAndExecute, 5000);
});

// Declare the input, button and table
const searchInput = document.getElementById('Buscador');
const searchButton = document.querySelector('button');
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

// Delete function for main table and filtered table

tableBody.addEventListener('click', (e) => {
    e.target.tagName === 'BUTTON' && e.target.textContent === 'Delete' ? e.target.parentNode.parentNode.remove() : null;
});

const tableBodyFiltered = document.getElementById('search-results');
tableBodyFiltered.addEventListener('click', (e) => {
    e.target.tagName === 'BUTTON' && e.target.textContent === 'Delete' ? e.target.parentNode.parentNode.remove() : null;
});
