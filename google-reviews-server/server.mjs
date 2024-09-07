import fetch from 'node-fetch'
import express from 'express';
import cors from 'cors';

const app = express();
const port = 3000;

// Habilita CORS para todas las rutas
app.use(cors());

app.get('/google-reviews', async (req, res) => {
    const placeId = 'ChIJbfOMr3PIvJURJ2vXCwQqGzI';  // Reemplaza con tu Place ID
    const apiKey = 'AIzaSyB2qQJFxptyNJyBkyQD1bzZHg-sr3V07Tw';  // Reemplaza con tu clave API

    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=rating,reviews&key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error al obtener las calificaciones:', error);
        res.status(500).send('Error al obtener las calificaciones');
    }
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
