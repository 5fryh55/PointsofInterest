import express,{ application, response } from 'express';
import  Database from 'better-sqlite3';

const db = new Database('PointsOfInterest\\pointsofinterest.db');
const app = express();

app.use(express.static('public'));
app.use(express.json());

app.get("/region/:region", (req, res) =>{
    try{
        const stmt=db.prepare(`SELECT * FROM pointsofinterest WHERE region=?`);
        const results = stmt.all(req.params.region);
        res.json(results);
    }
    catch(error){
        res.status(500).json({error:error});
    }
});

app.post("/create", (req, res)=>{
    try{
        if(req.body.name == "" || req.body.type == "" || req.body.country == "" 
        || req.body.region == "" || req.body.lon== "" || req.body.lat == "" || req.body.description == ""){
            res.status(400).json({error:"Error blank fields"});
        }
        else{
            const stmt = db.prepare(`INSERT INTO pointsofinterest(name, type, country, region, lon, lat, description, recommendations) VALUES (?,?,?,?,?,?,?)`);
            const info = stmt.run(req.body.name, req.body.type, req.body.country, req.body.region, req.body.lon, req.body.lat, req.body.description, 0);
            res.json({id: info.lastInsertRowId}); 
        }}
        catch(error){
            res.status(500).json({error:error});
        }
});

app.listen(1010);