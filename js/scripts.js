const gallery = document.getElementById('gallery');
/* 
 * Fetches the employee information from the RandomUser API in a single request
 * The request returns information for 12 people including:
 * image, first & last name, email, city/location
 * 
 * Extra Credit: API request returns only US users to allow searching by name
 */
fetch ('https://randomuser.me/api/?results=12&nat=us')
    .then(response => checkStatus(response))
    .then(res => res.json())
    .then(data => {
        createPage(data.results);
        handleSearch(data.results);
        handleModalWindow(data.results);
    })
// fetch helper function to handle errors
function checkStatus(response){
	if(response.ok){
		return Promise.resolve(response);
	} else {
		return Promise.reject(new Error(response.statusText));
	}
}
    
/* 
 * Creates the intitial page by creating the search box, displaying employee data,
 * and creating a modal window which is hidden by default.
 * 
 * Extra Credit: API request returns only US users to allow searching by name
 */
function createPage(employeeData){
    //create search box
    const searchContainer = document.getElementsByClassName('search-container')[0];
    const search = `
    <form action="#" method="get">
        <input type="search" id="search-input" class="search-input" placeholder="Search...">
        <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
    </form>
    `;
    searchContainer.insertAdjacentHTML('beforeend', search);
    // display employee data
    displayData(employeeData);
    // create modal window
    const modal = `
    <div class="modal-container" id="modal">
        <div class="modal">
            <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
            <div class="modal-info-container" id="modal-info">
            </div>
        </div>

        <div class="modal-btn-container">
            <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
            <button type="button" id="modal-next" class="modal-next btn">Next</button>
        </div>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', modal);
    document.getElementById('modal').hidden = true;
}

function displayData(data){
    gallery.innerHTML = '';
    for(let i = 0; i <data.length; i+=1){
        const employee = data[i];
        const html = `
        <div class="card">
            <div class="card-img-container">
                <img class="card-img" src="${employee.picture.large}" alt="profile picture">
            </div>
            <div class="card-info-container">
                <h3 id="name" class="card-name cap">${employee.name.first} ${employee.name.last}</h3>
                <p class="card-text">${employee.email}</p>
                <p class="card-text cap">${employee.location.city}, ${employee.location.state}</p>
            </div>
        </div>
        `;
        gallery.insertAdjacentHTML('beforeend', html);
    };
}

/* 
 * Handles the modal window which pops up when any part of an employee item is clicked.
 * Opens, closes window, and handles toggle functionality.
 * 
 * Extra Credit: Toggle feature allows to switch between employees in modal window
 */
function handleModalWindow(data){
    const exitModal = document.getElementById('modal-close-btn');
    const modalWindow = document.getElementById('modal');
    const prevBtn = document.getElementById('modal-prev');
    const nextBtn = document.getElementById('modal-next');
    let employeeIndex;
    document.querySelectorAll('.card').forEach((card, i) => {
        card.addEventListener('click', ()=> {
            employeeIndex = i;
            updateModalWindow(data[i]);
            modalWindow.hidden = false;
        });
    });
    //hide modal window when user clicks 'X'
    exitModal.addEventListener('click', (e)=>{
        modalWindow.hidden = true;
    });
    
    //extra credit: handle toggle, looping through employees
    prevBtn.addEventListener('click', (e)=>{
        if(employeeIndex > 0) {
            employeeIndex = employeeIndex - 1;
        } else {
            employeeIndex = data.length-1;
        }
        updateModalWindow(data[employeeIndex]);
    });
    nextBtn.addEventListener('click', (e)=>{
        if(employeeIndex < data.length-1) {
            employeeIndex = employeeIndex + 1;
        } else {
            employeeIndex = 0;
        }
        updateModalWindow(data[employeeIndex]);
    });
}

function updateModalWindow(employee){
    // formats phone number & birthday
    let phoneNum = employee.phone.toString();
    phoneNum = phoneNum.substring(0,5)+' '+phoneNum.substring(6,);
    let bday = employee.dob.date.substring(0, 10);
    bday = bday.substring(5,7)+'/'+bday.substring(8,)+'/'+bday.substring(0,4);
    // updates window with employee's details
    document.getElementById('modal-info').innerHTML = `
    <img class="modal-img" src="${employee.picture.large}" alt="profile picture">
    <h3 id="name" class="modal-name cap">${employee.name.first} ${employee.name.last}</h3>
    <p class="modal-text">${employee.email}</p>
    <p class="modal-text cap">${employee.location.city}</p>
    <hr>
    <p class="modal-text">${phoneNum}</p>
    <p class="modal-text">${employee.location.street.number} ${employee.location.street.name}, ${employee.location.city}, ${employee.location.state} ${employee.location.postcode}</p>
    <p class="modal-text">Birthday: ${bday}</p>`;
}

/* 
 * Extra Credit: search functionality allows user to filter directory by name
 * 
 */
function handleSearch(employeeData){
    const searchButton = document.getElementById('search-submit');

    searchButton.addEventListener('click', (e)=>{
        const matches = [];
        const search = document.getElementById('search-input').value.toLowerCase();
        employeeData.forEach(employee => {
            const firstName = employee.name.first.toLowerCase();
            const lastName = employee.name.last.toLowerCase();
            if(firstName.includes(search) || lastName.includes(search)){
                matches.push(employee);
            }
        });
        gallery.innerHTML=" ";
        displayData(matches);
        handleModalWindow(matches);
      });
}