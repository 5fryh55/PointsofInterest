import express from 'express';
import Database from 'better-sqlite3';
import expressSession from 'express-session';
import betterSqlite3Session from 'express-session-better-sqlite3';

const db = new Database('pointsofinterest.db');
const usersRouter = express.Router();
const sessDb = new Database('session.db');
const sqliteStore = betterSqlite3Session(expressSession, sessDb);

usersRouter.use(expressSession({
    store: new sqliteStore(),
    secret: 'POIsession',
    resave: true,
    saveUninitialized: false,
    rolling: true, 
    unset: 'destroy',
    proxy: true,
    cookie:{
        maxAge:600000,
        httpOnly: false
    }
}));

usersRouter.post('/login', (req, res) =>{
    const stmt = db.prepare(`SELECT password from poi_users WHERE username =?`);
    const results = stmt.all(req.body.username);
    if(results.length ==1){
        if(req.body.password == results[0].password)
        {
            req.session.username = req.body.username;
            res.json({"username": req.body.username})
            res.status(200);
        }
        else {
            res.status(401).json({error: "Incorrect details!"});
        }
    }
    else {
        res.status(400).json({error: "User not found!"});
    }
});

usersRouter.post('/logout', (req, res) =>{
    req.session = null;
    res.json({'success': 1});
});

usersRouter.get('/login', (req, res)=>{
    res.json({username: req.session.username || null});
});

usersRouter.use((req, res, next) =>{
    if(["POST", "DELETE"].indexOf(req.method) == -1){
        next();
    }
    else{
        if(req.session.username){
        next();
        }
        else {
            res.status(401).json({error: "User not logged in."});
        }
    }
});

export default usersRouter;