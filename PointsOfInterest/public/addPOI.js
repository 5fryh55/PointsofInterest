checkUser();

async function checkUser(){
    const response = await fetch("/users/login");
    const user = await response.json();
    if(user.username == null){
        document.getElementById("addPOIForm").innerHTML = ("You need to be logged in to view this page, go back home.");   
    }
};

async function addNewPointOfInterest(name, type, country, region, lon, lat, description){
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
    if (response.status == 400){
        alert("Blank fields.");
    }else{
      alert("Added POI");
    }    
};

document.getElementById('addPointOfInterest').addEventListener('click', () =>{
    const name = document.getElementById('nameAdd').value;
    const type = document.getElementById('typeAdd').value;
    const country = document.getElementById('countryAdd').value;
    const region = document.getElementById('regionAdd').value;
    const lon = document.getElementById('lonAdd').value;
    const lat = document.getElementById('latAdd').value;
    const description = document.getElementById('descriptionAdd').value;
    addNewPointOfInterest(name, type, country, region, lon, lat, description);

});