async function regionSearch(region){
    const response = await fetch(`/poi/region/${region}`);
    const pointsofinterest = await response.json();
    
    pointsofinterest.forEach(point => {
        const node1 = document.createElement("p");
        const text1 = document.createTextNode(`ID: ${point.id} Name ${point.name} Type: ${point.type} Desription: ${point.description} Recommendations: ${point.recommendations}`);
        const buttonElement = document.createElement("input");
        buttonElement.setAttribute("type", "button");
        buttonElement.setAttribute("value", `Recommend`)
        buttonElement.setAttribute("id", `${point.id}`);
        node1.appendChild(text1);
        document.getElementById("results").appendChild(node1);
        document.getElementById("results").appendChild(buttonElement);

        buttonElement.addEventListener("click", async(e) => {
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
    })
}

document.getElementById('regionSearch').addEventListener('click', () =>{
    const region = document.getElementById('region').value;
    regionSearch(region);
});



