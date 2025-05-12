let accessToken = '';

window.onload = () => {
  const hash = window.location.hash;
  if (hash) {
    accessToken = new URLSearchParams(hash.substring(1)).get('access_token');
  }
};

async function searchSong() {
  const songName = document.getElementById('songInput').value;

  if (!accessToken) {
    alert("Login with Spotify first!");
    window.location.href = "auth.html";
    return;
  }

  const searchUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(songName)}&type=track&limit=1`;
  const searchRes = await fetch(searchUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
  const searchData = await searchRes.json();
  const trackId = searchData.tracks.items[0]?.id;

  if (!trackId) {
    alert("Song not found.");
    return;
  }

  const recUrl = `https://api.spotify.com/v1/recommendations?seed_tracks=${trackId}&limit=10`;
  const recRes = await fetch(recUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  const recData = await recRes.json();
  displayPlaylist(recData.tracks);
}

function displayPlaylist(tracks) {
  const playlistDiv = document.getElementById('playlist');
  playlistDiv.innerHTML = '';

  tracks.forEach(track => {
    const trackElement = document.createElement('div');
    trackElement.innerHTML = `
      <p><strong>${track.name}</strong> by ${track.artists[0].name}</p>
      <audio controls src="${track.preview_url}"></audio>
      <hr>
    `;
    playlistDiv.appendChild(trackElement);
  });
}
