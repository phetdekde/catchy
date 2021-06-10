getArtistFromURL();

async function getArtistFromURL() {
    let albumId = location.pathname.split('/');
    const songList = document.querySelector('#songList');
    if(songList) {
        let songInAlbum = await getSongInAlbum(albumId[2]);
        if(songInAlbum) {
            songInAlbum.forEach(element => {
                let checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.name = 'album[song]';
                checkbox.value = element._id;
                checkbox.id = element.songName;
                checkbox.checked = true;
                let label = document.createElement('label');
                label.htmlFor = element.songName;
                label.appendChild(document.createTextNode(element.songName));
                songList.appendChild(checkbox);
                songList.appendChild(label);
            });
        }
        let songNotInAlbum = await getSongNotInAlbum(albumId[2]);
        if(songNotInAlbum) {
            songNotInAlbum.forEach(element => {
                let checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.name = 'album[song]';
                checkbox.value = element._id;
                checkbox.id = element.songName;
                let label = document.createElement('label');
                label.htmlFor = element.songName;
                label.appendChild(document.createTextNode(element.songName));
                songList.appendChild(checkbox);
                songList.appendChild(label);
            });   
        }
    }
}

async function getSongInAlbum(albumId) {
    let data = await fetch('/fetch/database/songByAlbumId/inAlbum/' + albumId);
    return await data.json();
}

async function getSongNotInAlbum(albumId) {
    let data = await fetch('/fetch/database/songByAlbumId/notInAlbum/' + albumId);
    return await data.json();
}

export { getArtistFromURL }