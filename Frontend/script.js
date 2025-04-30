const lastOffsets = {
    happy: null,
    sad: null,
    chill: null,
    energetic: null
};

const BASE_URL = window.location.hostname === 'localhost' ?
    'http://localhost:3001' :
    'https://soulsonick.onrender.com';

async function getAccessToken() {
    const response = await fetch(`${BASE_URL}/token`);
    const data = await response.json();
    return data.token;
}


// async function getAccessToken() {
//     const response = await fetch('https://soulsonick.onrender.com/token');
//     const data = await response.json();
//     return data.token;
// }

async function fetchTracksByMood(mood) {
    const token = await getAccessToken();

    // Retry until new offset is different from last
    let newOffset;
    do {
        newOffset = Math.floor(Math.random() * 100); // max ~200 results total
    } while (newOffset === lastOffsets[mood]);

    lastOffsets[mood] = newOffset; // store the new offset

    const response = await fetch(`https://api.spotify.com/v1/search?q=${mood}&type=track&limit=6&offset=${newOffset}`, {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    });

    const data = await response.json();
    return data.tracks.items;
}



fetchTracksByMood("happy").then(tracks => {
    displayTracks(tracks); // ← you’ll build this display function
});

// Listen for clicks on mood buttons
document.querySelectorAll('.mood-btn').forEach(button => {
    button.addEventListener('click', async() => {
        const mood = button.dataset.mood;
        const tracks = await fetchTracksByMood(mood);
        displayTracks(tracks);
    });
});

function displayTracks(tracks) {
    const container = document.getElementById('tracks-container');
    container.innerHTML = '';

    tracks.forEach(track => {
                const previewUrl = track.preview_url;
                const spotifyLink = track.external_urls.spotify;
                const html = `
        <div class="bg-white rounded-lg shadow p-4 flex flex-col items-center text-center">
          <img src="${track.album.images[0].url}" alt="${track.name}" class="w-full h-48 object-cover rounded mb-4">
          <h3 class="text-lg font-bold">${track.name}</h3>
          <p class="text-sm text-gray-600 mb-2">${track.artists[0].name}</p>
          ${
            previewUrl
              ? `<audio controls class="w-full mt-2">
                   <source src="${previewUrl}" type="audio/mpeg">
                 </audio>`
              : `<a href="${spotifyLink}" target="_blank" class="text-blue-500 underline mt-2">Listen on Spotify</a>`
          }
        </div>
      `;
      container.innerHTML += html;
    });
}