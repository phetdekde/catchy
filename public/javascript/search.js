import { fetchViewSong, fetchViewArtist, fetchViewAlbum, updateFavourite, openPlaylistPanel } from './index.js';
import { oneSongLoad, oneAlbumLoad } from './player.js';

search();

function search() {
    const searchPage = document.querySelector('section.search');
    if(searchPage) {
        const inputField = searchPage.querySelector('#inputField');
        const searchField = inputField.querySelector('input');
        const searchBtn = inputField.querySelector('#searchBtn');
        const typeSelect = inputField.querySelector('#type');
        const sortSelect = inputField.querySelector('#sort');
        const outputField = searchPage.querySelector('#outputField');
        const songField = outputField.querySelector('#song');
        const artistField = outputField.querySelector('#artist');
        const albumField = outputField.querySelector('#album');

        searchBtn.addEventListener('click', async function(){
            // deleteAllChild(songField, artistField, albumField);
            if(searchField.value) {
                if(typeSelect.value == 'song') {
                    await getSong(searchField.value, sortSelect.value);            
                } else if(typeSelect.value == 'album') {
                    await getAlbum(searchField.value, sortSelect.value);       
                } else if(typeSelect.value == 'artist') {
                    await getArtist(searchField.value, sortSelect.value);       
                } else {
                    await getSong(searchField.value, sortSelect.value);  
                    await getArtist(searchField.value, sortSelect.value);    
                    await getAlbum(searchField.value, sortSelect.value);   
                }
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
            if(this.className == 'fav-btn') {
                this.className = 'fav-btn-pink';
                this.src = '/images/favourite-pink.png';
            } else {
                this.className = 'fav-btn';
                this.src = '/images/favourite.png';
            }
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

async function getSong(value, sort) {
    try {
        let response = await fetch('/fetch/database/song/' + value + '/' + sort); 
        document.querySelector('#song').innerHTML = '';
        document.querySelector('#song').innerHTML = await response.text(); 
    } catch {
        console.log('Fetch error:' + err); 
    }                 
}

async function getArtist(value, sort) {
    try {
        let response = await fetch('/fetch/database/artist/' + value + '/' + sort); 
        document.querySelector('#artist').innerHTML = '';
        document.querySelector('#artist').innerHTML = await response.text(); 
    } catch {
        console.log('Fetch error:' + err); 
    }                 
}

async function getAlbum(value, sort) {
    try {
        let response = await fetch('/fetch/database/album/' + value + '/' + sort); 
        document.querySelector('#album').innerHTML = '';
        document.querySelector('#album').innerHTML = await response.text(); 
    } catch {
        console.log('Fetch error:' + err); 
    }                 
}

export { search }