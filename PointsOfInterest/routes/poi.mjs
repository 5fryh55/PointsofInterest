import express from 'express';
import Database from "better-sqlite3"; 

const db = new Database('pointsofinterest.db');
const pointsofinterestRouter = express.Router();

pointsofinterestRouter.get("/region/:region", (req, res) =>{
    try{
        const stmt = db.prepare(`SELECT * FROM pointsofinterest WHERE region=?`);
        const results = stmt.all(req.params.region);
        res.json(results);
    }
    catch(error){
        res.status(500).json({error:error});
    }
});

pointsofinterestRouter.get("/all", (req, res) =>{
    try{
        const stmt = db.prepare(`SELECT * FROM pointsofinterest`);
        const results = stmt.all();
        res.json(results);
    }
    catch(error){
        res.status(500).json({error:error});
    }
});

pointsofinterestRouter.post("/recommend/:id", (req, res) =>{
    try{
        const stmt = db.prepare(`UPDATE pointsofinterest SET recommendations = recommendations + ? WHERE id = ?`);
        const info = stmt.run(req.body.qty, req.params.id);
        if(info.changes == 1){
            res.json({success:1});
        }
        else{
            res.status(404).json({error:'Could not recommend.'})
        }
    }
    catch(error){
        res.status(500).json({error:error});
    }
});

pointsofinterestRouter.post("/create", (req, res)=>{
    try{
        if(req.body.name == "" || req.body.name == null || req.body.type == "" || req.body.type == null ||
        req.body.country == "" || req.body.country == null || req.body.region == "" || req.body.region == null ||
        req.body.lon== "" || req.body.lon == null || req.body.lat == "" || req.body.lat == null ||
        req.body.description == "" || req.body.description == null){
            res.status(400).json({error:"Error blank fields"});
        }
        else{
            const stmt = db.prepare(`INSERT INTO pointsofinterest (
                name,
                type,
                country,
                region,
                lon,
                lat,
                description,
                recommendations
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
                );
            const info = stmt.run(req.body.name, req.body.type, req.body.country, req.body.region, req.body.lon, req.body.lat, req.body.description, req.body.recommendations);
            res.json({id: info.lastInsertRowId}); 
            res.status(200);
        }}
        catch(error){
            res.status(500).json({error:error});
        } 
});

export default pointsofinterestRouter;