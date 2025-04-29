require('dotenv').config();
console.log("CLIENT ID: ", process.env.CLIENT_ID);
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());

app.get('/token', async(req, res) => {
    const clientId = process.env.CLIENT_ID;
    const clientSecret = process.env.CLIENT_SECRET;

    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    try {
        const response = await axios.post('https://accounts.spotify.com/api/token',
            'grant_type=client_credentials', {
                headers: {
                    'Authorization': `Basic ${auth}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

        res.json({ token: response.data.access_token });
    } catch (error) {
        console.error('Token error:', error.response && error.response.data ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to retrieve token' });
    }
});

app.listen(PORT, () => {
    console.log(`Token server running at http://localhost:${PORT}`);
});