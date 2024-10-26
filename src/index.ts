import express from 'express';
import { MapLoader } from './mapLoader';
import { MegaverseAPI } from './megaverseAPI';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = 3000;
const mapLoader = MapLoader.getInstance();
const megaverseApi = new MegaverseAPI();
const candidateId = process.env.CANDIDATE_ID;
const goalMapApi = `${process.env.GOAL_MAP_API}${candidateId}/goal`;

app.use(express.json());

mapLoader
    .loadMapData(goalMapApi)
    .then(() => console.log('Map data loaded successfully'))
    .catch((error) => console.error('Failed to load map data:', error));


app.post('/api/map/:candidateId/:objects', (req, res) => {
  const { candidateId, objects } = req.params;

  megaverseApi
    .modifyMapWithGoal(candidateId, objects, 'create', mapLoader.getMapObjects())
    .then(() => res.status(201).send(`${objects} created`))
    .catch(err => res.status(400).send(err.message));
});

app.delete('/api/map/:candidateId/:objects', (req, res) => {
  const { candidateId, objects } = req.params;

  megaverseApi
    .modifyMapWithGoal(candidateId, objects, 'delete', mapLoader.getMapObjects())
    .then(() => res.status(200).send(`${objects} deleted`))
    .catch(err => res.status(400).send(err.message));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

