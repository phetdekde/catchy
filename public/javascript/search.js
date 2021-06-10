import { fetchViewSong, fetchViewArtist, fetchViewAlbum, updateFavourite, openPlaylistPanel } from './index.js';
import { oneSongLoad, oneAlbumLoad } from './player.js';

search();

function search() {
    const searchPage = document.querySelector('section.search');
    if(searchPage) {
        const inputField = searchPage.querySelector('#inputField');
        const searchField = inputField.querySelector('input');
        const searchBtn = inputField.querySelector('#searchBtn');
        const outputField = searchPage.querySelector('#outputField');
        const songField = outputField.querySelector('#song');
        const artistField = outputField.querySelector('#artist');
        const albumField = outputField.querySelector('#album');

        searchBtn.addEventListener('click', async function(){
            deleteAllChild(songField, artistField, albumField);
            if(searchField.value) {
                let song = await getSong(searchField.value);
                let artist = await getArtist(searchField.value);
                let album = await getAlbum(searchField.value);
                createAllElement(song, artist, album, songField, artistField, albumField);
                addAllListener();
            }
        });
    }
}

function deleteAllChild(songField, artistField, albumField) {
    while(songField.firstChild) {
        songField.removeChild(songField.lastChild);
    }
    while(artistField.firstChild) {
        artistField.removeChild(artistField.lastChild);
    }
    while(albumField.firstChild) {
        albumField.removeChild(albumField.lastChild);
    }
}

function addAllListener() {
    document.querySelectorAll('#viewSong').forEach(elem => {
        elem.addEventListener('click', function(){
            fetchViewSong('false', this.getAttribute('data-id'));
        });   
    });
    document.querySelectorAll('#viewArtist').forEach(elem => {
        elem.addEventListener('click', function(){
            fetchViewArtist('false', this.getAttribute('data-id'));
        });   
    });
    document.querySelectorAll('#viewAlbum').forEach(elem => {
        elem.addEventListener('click', function(){
            fetchViewAlbum('false', this.getAttribute('data-id'));
        });   
    });
    document.querySelectorAll('#favourite').forEach(elem => {
        elem.addEventListener('click', function(){
            updateFavourite(this.getAttribute('data-id'));
        })
    });
    document.querySelectorAll('#playOneSong').forEach(elem => {
        elem.addEventListener('click', function(){
            oneSongLoad(this.getAttribute('data-id'));
        });   
    });
    document.querySelectorAll('#playOneAlbum').forEach(elem => {
        elem.addEventListener('click', function(){
            oneAlbumLoad(this.getAttribute('data-id'));
        });   
    });
    document.querySelectorAll('#openPlaylistPanel').forEach(elem => {
        elem.addEventListener('click', function(){
            openPlaylistPanel(this.getAttribute('data-id'));
        })
    });
}

function createAllElement(song, artist, album, songField, artistField, albumField) {
    song.forEach(element => {
        let newDiv = document.createElement('div');
        let img = document.createElement('img');
        img.src = element.songImg;
        let h2 = document.createElement('h2');
        h2.id = 'viewSong';
        h2.setAttribute('data-id', element._id);
        h2.innerHTML = element.songName;
        let h3 = document.createElement('h3');
        h3.id = 'viewArtist';
        h3.setAttribute('data-id', element.artist._id);
        h3.innerHTML = element.artist.artistName;

        let playBtn = document.createElement('button');
        playBtn.id = 'playOneSong';
        playBtn.setAttribute('data-id', element._id);
        playBtn.innerHTML = 'Play song';
        let favBtn = document.createElement('button');
        favBtn.id = 'favourite';
        favBtn.setAttribute('data-id', element._id);
        favBtn.innerHTML = 'Favourite';
        let addToPlaylistBtn = document.createElement('button');
        addToPlaylistBtn.id = 'openPlaylistPanel';
        addToPlaylistBtn.setAttribute('data-id', element._id);
        addToPlaylistBtn.innerHTML = 'Add to playlist';

        newDiv.appendChild(img);
        newDiv.appendChild(h2);
        newDiv.appendChild(h3);
        newDiv.appendChild(playBtn);
        newDiv.appendChild(favBtn);
        newDiv.appendChild(addToPlaylistBtn);
        songField.appendChild(newDiv);
    });
    artist.forEach(element => {
        let newDiv = document.createElement('div');
        let img = document.createElement('img');
        img.src = element.artistImg;
        let h2 = document.createElement('h2');
        h2.id = 'viewArtist';
        h2.setAttribute('data-id', element._id);
        h2.innerHTML = element.artistName;
        newDiv.appendChild(img);
        newDiv.appendChild(h2);
        artistField.appendChild(newDiv);
    });
    album.forEach(element => {
        let newDiv = document.createElement('div');
        let img = document.createElement('img');
        img.src = element.albumImg;
        let h2 = document.createElement('h2');
        h2.id = 'viewAlbum';
        h2.setAttribute('data-id', element._id);
        h2.innerHTML = element.albumName;
        let h3 = document.createElement('h3');
        h3.id = 'viewArtist';
        h3.setAttribute('data-id', element.artist._id);
        h3.innerHTML = element.artist.artistName;

        let playBtn = document.createElement('button');
        playBtn.id = 'playOneAlbum';
        playBtn.setAttribute('data-id', element._id);
        favBtn.innerHTML = 'Play album';

        newDiv.appendChild(img);
        newDiv.appendChild(h2);
        newDiv.appendChild(h3);
        newDiv.appendChild(playBtn);
        albumField.appendChild(newDiv);
    });
}

async function getSong(value) {
    let data = await fetch('/fetch/database/song/' + value);
    return await data.json();
}

async function getArtist(value) {
    let data = await fetch('/fetch/database/artist/' + value);
    return await data.json();
}

async function getAlbum(value) {
    let data = await fetch('/fetch/database/album/' + value);
    return await data.json();
}

export { search }