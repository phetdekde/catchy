import { search } from './search.js';
import { fetchStart, fetchViewSong, fetchViewArtist, updateFavourite, openPlaylistPanel } from './index.js';
import { oneSongLoad, onePlaylistLoad } from './player.js';

const mobileBtn = document.getElementById('mobile-cta'),
    nav = document.querySelector('nav'),
    mobileBtnExit = document.getElementById('mobile-exit');

document.querySelectorAll('li'); 
document.querySelector('#logoHome').addEventListener('click', fetchHome);
document.querySelector('#navHome').addEventListener('click', fetchHome);
document.querySelector('#navSearch').addEventListener('click', function(){
    fetchSearch('false');
});
document.querySelector('#navPlaylist').addEventListener('click', function(){
    fetchAllPlaylist('false', this.getAttribute('data-id'));
});
document.querySelector('#navProfile').addEventListener('click', function(){
    fetchProfile('false', this.getAttribute('value'));
});

mobileBtn.addEventListener('click', () => {
    nav.classList.add('menu-btn');
});
mobileBtnExit.addEventListener('click', () => {
    nav.classList.remove('menu-btn');
});

async function fetchHome() {      
    try {
        fetchStart();
        history.pushState(null, null, '/home');
    } catch (err) {
        console.log('Fetch error:' + err); 
    }
}

async function fetchSearch(isPopState) {      
    try {
        let response = await fetch('/fetch/search'); 
        document.querySelector('#main').innerHTML = '';
        document.querySelector('#main').innerHTML = await response.text();
        if(isPopState == 'false') 
            history.pushState('search', null, '/search');
        search();
    } catch (err) {
        console.log('Fetch error:' + err); 
    }
}

async function fetchAllPlaylist(isPopState, userId) {      
    try {
        let response = await fetch('/fetch/allPlaylist/' + userId); 
        document.querySelector('#main').innerHTML = '';
        document.querySelector('#main').innerHTML = await response.text();
        document.querySelectorAll('#viewPlaylist').forEach(elem => {
            elem.addEventListener('click', function(){
                fetchViewPlaylist('false', this.getAttribute('data-id'));
            });   
        });
        document.querySelectorAll('#playOnePlaylist').forEach(elem => {
            elem.addEventListener('click', function(){
                onePlaylistLoad(this.getAttribute('data-id'));
            });   
        });
        if(isPopState == 'false')
            history.pushState('allPlaylist/' + userId, null, '/allplaylist/' + userId);
    } catch (err) {
        console.log('Fetch error:' + err); 
    }
}

async function fetchViewPlaylist(isPopState, playlistId) {
    try {
        let response = await fetch('/fetch/playlist/' + playlistId); 
        document.querySelector('#main').innerHTML = '';
        document.querySelector('#main').innerHTML = await response.text();
        document.querySelector('#playOnePlaylist').addEventListener('click', function(){
            onePlaylistLoad(this.getAttribute('data-id'));
        });
        document.querySelectorAll('#viewSong').forEach(elem => {
            elem.addEventListener('click', function(){
                fetchViewSong('false', this.getAttribute('data-id'));
            });   
        });
        document.querySelectorAll('#playOneSong').forEach(elem => {
            elem.addEventListener('click', function(){
                oneSongLoad(this.getAttribute('data-id'));
            });   
        });
        document.querySelector('#playOnePlaylist').addEventListener('click', function(){
            onePlaylistLoad(this.getAttribute('data-id'));
        });
        document.querySelectorAll('#viewArtist').forEach(elem => {
            elem.addEventListener('click', function(){
                fetchViewArtist('false', this.getAttribute('data-id'));
            });   
        });
        const editPlaylist = document.querySelector('#editPlaylist')
        if(editPlaylist) {
            editPlaylist.addEventListener('click', function(){
                openEditPlaylistPanel();
            });
        }
        document.querySelectorAll('#deleteSongFromPlaylist').forEach(elem => {
            elem.addEventListener('click', function(){
                fetchDeleteSongFromPlaylist(playlistId, this.getAttribute('data-id'));
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
        if(isPopState == 'false')
            history.pushState('viewPlaylist/' + playlistId, null, '/playlist/' + playlistId);
    } catch (err) {
        console.log('Fetch error:' + err); 
    }
}


async function fetchProfile(isPopState, value) {      
    try {
        let response = await fetch('/fetch/user/' + value); 
        document.querySelector('#main').innerHTML = '';
        document.querySelector('#main').innerHTML = await response.text(); 
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
        document.querySelectorAll('#playOneSong').forEach(elem => {
            elem.addEventListener('click', function(){
                oneSongLoad(this.getAttribute('data-id'));
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
        document.querySelectorAll('#openPlaylistPanel').forEach(elem => {
            elem.addEventListener('click', function(){
                openPlaylistPanel(this.getAttribute('data-id'));
            })
        });
        const editProfile = document.querySelector('#editProfile');
        if(editProfile) {
            editProfile.addEventListener('click', function(){
                openEditProfilePanel();
            });
        }
        if(isPopState == 'false')
            history.pushState('profile/' + value, null, '/user/' + value);
    } catch (err) {
        console.log('Fetch error:' + err); 
    }
}

function openEditPlaylistPanel() {
    document.querySelector('#editPlaylistPanel').classList.add('active');
    document.querySelector('#overlay').classList.add('active');
    document.querySelector('#closeEditPlaylistBtn').addEventListener('click', function(){
        document.querySelector('#editPlaylistPanel').classList.remove('active');
        document.querySelector('#overlay').classList.remove('active');
    });
}

function openEditProfilePanel() {
    document.querySelector('#editProfilePanel').classList.add('active');
    document.querySelector('#overlay').classList.add('active');
    document.querySelector('#closeEditProfileBtn').addEventListener('click', function(){
        document.querySelector('#editProfilePanel').classList.remove('active');
        document.querySelector('#overlay').classList.remove('active');
    });
}

async function fetchDeleteSongFromPlaylist(playlistId, songId) {
    try {
        await fetch('/fetch/database/removeSongFromPlaylist/' + songId + '/' + playlistId); 
        fetchViewPlaylist('false', playlistId);
    } catch (err) {
        console.log('Fetch error:' + err); 
    }
}

export { fetchProfile };
export { fetchSearch };
export { fetchAllPlaylist };
export { fetchViewPlaylist };
export { openEditPlaylistPanel };
export { fetchDeleteSongFromPlaylist };
export { openEditProfilePanel };