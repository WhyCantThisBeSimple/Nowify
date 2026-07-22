export function getEmptyPlayer() {
  return {
    playing: false,
    trackAlbum: {},
    trackArtists: [],
    trackId: '',
    trackTitle: ''
  }
}

export async function fetchCurrentlyPlaying(accessToken, endpoints) {
  const response = await fetch(
    `${endpoints.base}/${endpoints.nowPlaying}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  )

  if (!response.ok) {
    throw new Error(`An error has occurred: ${response.status}`)
  }

  if (response.status === 204) {
    return null
  }

  return response.json()
}

export function normalizeCurrentlyPlaying(response = {}) {
  if (!response || !response.item) {
    return getEmptyPlayer()
  }

  if (response.is_playing === false) {
    return getEmptyPlayer()
  }

  return {
    playing: response.is_playing,
    trackArtists: response.item.artists.map(artist => artist.name),
    trackTitle: response.item.name,
    trackId: response.item.id,
    trackAlbum: {
      title: response.item.album.name,
      image: response.item.album.images[0].url
    }
  }
}
