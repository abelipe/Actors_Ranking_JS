const total_ID = []; // Global Array to store all the IDs used

async function getData(needed_ID) {
    const url = `https://freetestapi.com/api/v1/actors/${needed_ID}`;
    const handleResponse = response => 
        response.ok 
            ? response.json() 
            : Promise.reject(new Error(`Response status: ${response.status}`));

    const logActors = actors => {
        console.log(actors);
        total_ID.push(actors.id);
    };
    const logError = error => console.error(error.message);

    fetch(url)
        .then(handleResponse)
        .then(logActors)
        .catch(logError);
}

function verify_ID() {
    const needed_ID = Math.floor(Math.random() * 40) + 1;
    return total_ID.includes(needed_ID) ? verify_ID() : needed_ID;
    // If the ID is already in the array, call the function again to get a new ID
}

async function main() {
    const needed_ID = verify_ID();
    getData(needed_ID);
    console.log(total_ID);
    // Executes when the page is loaded
}

main();