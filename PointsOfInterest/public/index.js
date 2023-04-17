async function regionSearch(region){
    const response = await fetch(`/region/${region}`);
    const pointsofinterest = await response.json();
    
    pointsofinterest.forEach(point => {
        const node1 = document.createElement("p");
        const text1 = document.createTextNode(`ID: ${point.id} Name ${point.name} Type: ${point.type} Desription: ${point.description} Recommendations: ${point.recommendations}`);
        const buttonElement = document.createElement("input");
        buttonElement.setAttribute("type", "button");
        buttonElement.setAttribute("value", "Recommend")
        buttonElement.setAttribute("id", `${point.id}`);
        node1.appendChild(text1);
        document.getElementById("results").appendChild(node1);
        document.getElementById("results").appendChild(buttonElement);
    })
}

async function addNewPointOfInterest(name, type, country, region, lon, lat, description){
    const poi = {
        name: name, 
        type: type, 
        country: country,
        region: region,
        lon: lon,
        lat: lat, 
        description: description
    };
    const response = await fetch(`/create`, {
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

document.getElementById('regionSearch').addEventListener('click', () =>{
    const region = document.getElementById('region').value;
    regionSearch(region);
});

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
