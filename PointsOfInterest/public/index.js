isUserLoggedIn();

async function isUserLoggedIn(){
    const loggedInUser = await getUser();
    if(loggedInUser.username == null){
        loginForm();   
    }else{
        userBanner(loggedInUser);
    }
}

const map = L.map("map");
const attrib="Map data copyright OpenStreetMap contributors, Open Database License";
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            { attribution: attrib } ).addTo(map);
map.setView([50.909698,-1.404351], 14);

async function userBanner(loggedInUser){
    document.getElementById("user").innerHTML = (`Logged in as: ${loggedInUser.username} <input type="button" value="Logout" id="logoutButton"/>`);
    document.getElementById('logoutButton').addEventListener('click', () =>{
        logoutUser();
    });
};

async function loginForm(){
    document.getElementById("user").innerHTML = (`Enter login info: 
    <form>
        Username:
        <input id="username">
        Password:
        <input id="password" type="password">
        <input type="button" value="Login" id="loginButton">
    </form>`);
    document.getElementById('loginButton').addEventListener('click', () =>{
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    loginUser(username, password);
    });
};

async function showAllPOI(){
    const response = await fetch(`/poi/all`);
    const pointsofinterest = await response.json();

    pointsofinterest.forEach(point => {
        const marker = L.marker([point.lat, point.lon]).addTo(map);
        const text = (`Name: ${point.name}, Description: ${point.description}`)
        marker.bindPopup(text);
    });
};

async function regionSearch(region){
    const response = await fetch(`/poi/region/${region}`);
    const pointsofinterest = await response.json();
    if(pointsofinterest.length==0){
        alert("Nothing found")
    }
    else{
        pointsofinterest.forEach(point => {
            const node1 = document.createElement("p");
            const text1 = document.createTextNode(`ID: ${point.id} Name ${point.name} Type: ${point.type} Desription: ${point.description} Recommendations: ${point.recommendations}`);
            const recommendButton = document.createElement("input");
            const locateButton = document.createElement("input");
            recommendButton.setAttribute("type", "button");
            recommendButton.setAttribute("value", `Recommend`)
            recommendButton.setAttribute("id", `${point.id}`);
            locateButton.setAttribute("type", "button");
            locateButton.setAttribute("value", `Locate on map`)
            locateButton.setAttribute("id", `${point.id}`);
            node1.appendChild(text1);
            document.getElementById("results").appendChild(node1);
            document.getElementById("results").appendChild(recommendButton);
            document.getElementById("results").appendChild(locateButton);
    
            recommendButton.addEventListener("click", async(e) => {
                const recommend = {id:point.id, qty:1};
                const response = await fetch (`/poi/recommend/${recommend.id}`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(recommend)
            });
                if(response.status == 200){
                    alert("POI recommended.");                
                }
                else{
                    alert("Error");
                }
            }); 
            locateButton.addEventListener("click", async(e) => {
                poiLocate(point);        
            });
        });
    }
};

async function regionPOIs(region){
    const response = await fetch(`/poi/region/${region}`);
    const pointsofinterest = await response.json();
    if(pointsofinterest.length==0){
        alert("Nothing found")
    }
    else{
        map.setView([pointsofinterest[0].lat, pointsofinterest[0].lon], 10);
        pointsofinterest.forEach(point => {
            const marker = L.marker([point.lat, point.lon]).addTo(map);
            const text = (`Name: ${point.name}, Description: ${point.description}`)
            marker.bindPopup(text);
        });
    }
};

async function poiLocate(point){
    map.setView([point.lat, point.lon], 13);
    const marker = L.marker([point.lat, point.lon]).addTo(map);
    const text = (`Name: ${point.name}, Description: ${point.description}`)
    marker.bindPopup(text);
};

async function addPoiToMap(e){
    /* const domDiv = document.createElement('div');
    const formPOI = document.createTextNode("form");
    formPOI.setAttribute("id", "formPOI");
    domDiv.appendChild(formPOI)

    const formText = ("Add new point of interest:");
    formPOI.appendChild(formText);

    const nameAdd = document.createElement("input");
    nameAdd.setAttribute("type", "text");
    nameAdd.setAttribute("value", "Enter Name");
    formPOI.appendChild(nameAdd);

    const typeAdd = document.createElement("input");
    typeAdd.setAttribute("type", "text");
    typeAdd.setAttribute("value", "Enter Type");
    formPOI.appendChild(typeAdd);

    const countryAdd = document.createElement("input");
    countryAdd.setAttribute("type", "text");
    countryAdd.setAttribute("value", "Enter Country");
    formPOI.appendChild(countryAdd);

    const regionAdd = document.createElement("input");
    regionAdd.setAttribute("type", "text");
    regionAdd.setAttribute("value", "Enter Region");
    formPOI.appendChild(regionAdd); 

    const lonAdd = document.createElement("input");
    lonAdd.setAttribute("type", "number");
    lonAdd.setAttribute("value", "Enter Lon");
    formPOI.appendChild(lonAdd);

    const latAdd = document.createElement("input");
    latAdd.setAttribute("type", "number");
    latAdd.setAttribute("value", "Enter Lat");
    formPOI.appendChild(latAdd);

    const descriptionAdd = document.createElement("input");
    nameAdd.setAttribute("type", "text");
    nameAdd.setAttribute("value", "Enter Description");
    formPOI.appendChild(descriptionAdd);

    const submit = document.createElement("input");
    nameAdd.setAttribute("type", "submit");
    nameAdd.setAttribute("value", "Submit");
    formPOI.appendChild(submit); */
    
    const loggedInUser = await getUser();
    if(loggedInUser.username == null){
        alert("Please log in to add POI to map")   
    }else{
        const name = prompt("Enter name");
        const type = prompt("Enter type");
        const country = prompt("Enter country");
        const region = prompt("Enter region");
        const lon = e.latlng.lng;
        const lat = e.latlng.lat;
        const description = prompt("Enter description");
    
        const poi = {
            name: name, 
            type: type, 
            country: country,
            region: region,
            lon: lon,
            lat: lat, 
            description: description,
            recommendations:0
        };
    
        const response = await fetch("/poi/create/", {
            method: 'POST', 
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify(poi)
        });
        if(response.status == 400){
            alert("Error making new poi, blank entries.");
        }
        else{
            alert("Added POI");
            const newpos = [e.latlng.lat, e.latlng.lng];
            const newMark = L.marker(newpos).addTo(map);
            const text = (`Name: ${name}, Description: ${description}`)
            newMark.bindPopup(text);
        }       
    }
};

async function loginUser(username, password){
    const user = {
        username:username,
        password:password
    }
    const response = await fetch('/users/login', {
        method: 'POST', 
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify(user)
    });
    if(response.status == 200){
        alert("Logging in...");
        userBanner(user);
    }
    else{
        alert("Incorrect Details.");
    } 
};

async function getUser(){
    const response = await fetch("/users/login");
    const user = await response.json();
    return user;
};

async function logoutUser(){
    const usercheck = await fetch("/users/login");
    const user = await usercheck.json();
    
    const response = await fetch('/users/logout', {
        method: 'POST', 
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify(user)
    });
    const userLogout = await response.json();
    if(userLogout){
        alert("User logged out.")
        loginForm();
    }
    else{
        alert("?");
    }
};

document.getElementById('locateRegionPoi').addEventListener('click', () =>{
    const region = document.getElementById('region').value;
    regionPOIs(region);
});

document.getElementById('locateAll').addEventListener('click', () =>{
    showAllPOI();
});

document.getElementById('regionSearch').addEventListener('click', () =>{
    const region = document.getElementById('region').value;
    regionSearch(region);
});

map.on("click", e => {
    addPoiToMap(e)
});



