import { fetchProfile, openEditProfilePanel } from './nav.js';
import { fetchSearch } from './nav.js';
import { fetchAllPlaylist } from './nav.js';
import { fetchViewPlaylist } from './nav.js';
import { openEditPlaylistPanel } from './nav.js';
import { fetchDeleteSongFromPlaylist } from './nav.js'
import { artistQueryInAlbum } from './newAlbum.js';
import { getArtistFromURL } from './editAlbum.js';
import { oneSongLoad, oneAlbumLoad, onePlaylistLoad } from './player.js';


//This function automatically fetch if pathname is /index
if(location.pathname == '/home') {
    fetchMyDocument();
} else {
    addAllListener();
}

async function fetchMyDocument() {      
    try {
        let response = await fetch('/fetch/home');
        document.querySelector('#main').innerHTML = ''; 
        document.querySelector('#main').innerHTML = await response.text(); 
        const newSong =  document.querySelector('#newSong');
        if(newSong) {
            newSong.addEventListener('click', function(){
                fetchNewSong('false');
            });
            document.querySelector('#newArtist').addEventListener('click', function(){
                fetchNewArtist('false');
            });
            document.querySelector('#newAlbum').addEventListener('click', function(){
                fetchNewAlbum('false');
            });
        }
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
        document.querySelectorAll('#viewPlaylist').forEach(elem => {
            elem.addEventListener('click', function(){
                fetchViewPlaylist('false', this.getAttribute('data-id'));
            });   
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
        document.querySelectorAll('#playOnePlaylist').forEach(elem => {
            elem.addEventListener('click', function(){
                onePlaylistLoad(this.getAttribute('data-id'));
            });   
        });
        const favBtn = document.querySelectorAll('#favourite');
        favBtn.forEach(elem => {
            elem.addEventListener('click', function(){
                favBtn.forEach(btn => {
                    if(btn.className == 'fav-btn' && btn.getAttribute('data-id') == elem.getAttribute('data-id')) {
                        btn.className = 'fav-btn-pink';
                        btn.src = '/images/favourite-pink.png';
                    } else if (btn.className != 'fav-btn' && btn.getAttribute('data-id') == elem.getAttribute('data-id')){
                        btn.className = 'fav-btn';
                        btn.src = '/images/favourite.png';
                    }
                })
                updateFavourite(this.getAttribute('data-id'));
            })
        });
        document.querySelectorAll('#openPlaylistPanel').forEach(elem => {
            elem.addEventListener('click', function(){
                openPlaylistPanel(this.getAttribute('data-id'));
            })
        });
    } catch (err) {
        console.log('Fetch error:' + err); 
    }
}

async function fetchNewSong(isPopState) {  
    try {
        let response = await fetch('/fetch/song/new'); 
        document.querySelector('#main').innerHTML = '';
        document.querySelector('#main').innerHTML = await response.text(); 
        if(isPopState == 'false')
            history.pushState('newSong', null, '/song/new');
    } catch (err) {
        console.log('Fetch error:' + err); 
    }
}

async function fetchNewArtist(isPopState) {  
    try {
        let response = await fetch('/fetch/artist/new'); 
        document.querySelector('#main').innerHTML = '';
        document.querySelector('#main').innerHTML = await response.text(); 
        if(isPopState == 'false')
            history.pushState('newArtist', null, '/artist/new');
    } catch (err) {
        console.log('Fetch error:' + err); 
    }
}

async function fetchNewAlbum(isPopState) {  
    try {
        let response = await fetch('/fetch/album/new'); 
        document.querySelector('#main').innerHTML = '';
        document.querySelector('#main').innerHTML = await response.text(); 
        if(isPopState == 'false')
            history.pushState('newAlbum', null, '/album/new');
        artistQueryInAlbum();
    } catch (err) {
        console.log('Fetch error:' + err); 
    }
}

async function fetchViewSong(isPopState, value) {
    try {
        let response = await fetch('/fetch/song/' + value); 
        document.querySelector('#main').innerHTML = '';
        document.querySelector('#main').innerHTML = await response.text(); 
        const editSong = document.querySelector('#editSong');
        if(editSong) {
            editSong.addEventListener('click', function(){
                fetchEditSong('false', this.getAttribute('data-id'));
            });
        }
        document.querySelectorAll('#viewArtist').forEach(elem => {
            elem.addEventListener('click', function(){
                fetchViewArtist('false', this.getAttribute('data-id'));
            });   
        });
        document.querySelector('#playOneSong').addEventListener('click', function(){
            oneSongLoad(this.getAttribute('data-id'));
        });
        document.querySelector('#openPlaylistPanel').addEventListener('click', function(){
            openPlaylistPanel(this.getAttribute('data-id'));
        });
        document.querySelector('#favourite').addEventListener('click', function(){
            if(this.className == 'fav-btn-big') {
                this.className = 'fav-btn-pink-big';
                this.src = '/images/favourite-pink.png';
            } else {
                this.className = 'fav-btn-big';
                this.src = '/images/favourite.png';
            }
            updateFavourite(this.getAttribute('data-id'));
        });
        if(isPopState == 'false')
            history.pushState('viewSong/' + value, null, '/song/' + value);
    } catch (err) {
        console.log('Fetch error:' + err); 
    }
}

async function fetchViewArtist(isPopState, value) {
    try {
        let response = await fetch('/fetch/artist/' + value); 
        document.querySelector('#main').innerHTML = '';
        document.querySelector('#main').innerHTML = await response.text(); 
        const editArtist = document.querySelector('#editArtist');
        if(editArtist) {
            editArtist.addEventListener('click', function(){
                fetchEditArtist('false', this.getAttribute('data-id'));
            });
        }
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
        document.querySelectorAll('#viewSong').forEach(elem => {
            elem.addEventListener('click', function(){
                fetchViewSong('false', this.getAttribute('data-id'));
            });   
        });
        document.querySelectorAll('#viewAlbum').forEach(elem => {
            elem.addEventListener('click', function(){
                fetchViewAlbum('false', this.getAttribute('data-id'));
            });   
        });
        if(isPopState == 'false')
            history.pushState('viewArtist/' + value, null, '/artist/' + value);
    } catch (err) {
        console.log('Fetch error:' + err); 
    }
}

async function fetchViewAlbum(isPopState, value) {
    try {
        let response = await fetch('/fetch/album/' + value); 
        document.querySelector('#main').innerHTML = '';
        document.querySelector('#main').innerHTML = await response.text(); 
        const editAlbum = document.querySelector('#editAlbum');
        if(editAlbum) {
            editAlbum.addEventListener('click', function(){
                fetchEditAlbum('false', this.getAttribute('data-id'));
            });
        }
        document.querySelectorAll('#viewSong').forEach(elem => {
            elem.addEventListener('click', function(){
                fetchViewSong('false', this.getAttribute('data-id'));
            });   
        });
        document.querySelector('#viewArtist').addEventListener('click', function(){
            fetchViewArtist('false', this.getAttribute('data-id'));
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
            history.pushState('viewAlbum/' + value, null, '/album/' + value);
    } catch (err) {
        console.log('Fetch error:' + err); 
    }
}

async function fetchEditSong(isPopState, value) {
    try {
        let response = await fetch('/fetch/song/' + value + '/edit'); 
        document.querySelector('#main').innerHTML = '';
        document.querySelector('#main').innerHTML = await response.text(); 
        if(isPopState == 'false')
            history.pushState('editSong/' + value, null, '/song/' + value + '/edit');
    } catch (err) {
        console.log('Fetch error:' + err); 
    }
}

async function fetchEditArtist(isPopState, value) {
    try {
        let response = await fetch('/fetch/artist/' + value + '/edit'); 
        document.querySelector('#main').innerHTML = '';
        document.querySelector('#main').innerHTML = await response.text(); 
        if(isPopState == 'false')
            history.pushState('editArtist/' + value, null, '/artist/' + value + '/edit');
    } catch (err) {
        console.log('Fetch error:' + err); 
    }
}

async function fetchEditAlbum(isPopState, value) {
    try {
        let response = await fetch('/fetch/album/' + value + '/edit'); 
        document.querySelector('#main').innerHTML = '';
        document.querySelector('#main').innerHTML = await response.text(); 
        if(isPopState == 'false')
            history.pushState('editAlbum/' + value, null, '/album/' + value + '/edit');
        getArtistFromURL();
    } catch (err) {
        console.log('Fetch error:' + err); 
    }
}

async function updateFavourite(value) {
    try {
        return await fetch('/fetch/database/updateFavourite/' + value);
    } catch (err) {
        console.log('Fetch error:' + err);
    }
}

async function openPlaylistPanel(songId) {
    try {
        let response = await fetch('/fetch/database/allPlaylist/' + songId);
        let playlist = await response.json();
        document.querySelector('#playlistPanel').classList.add('active');
        document.querySelector('#overlay').classList.add('active');
        document.querySelector('#closePlaylistBtn').addEventListener('click', function(){
            document.querySelector('#playlistPanel').classList.remove('active');
            document.querySelector('#overlay').classList.remove('active');
        });
        const playlistField = document.querySelector('#playlistList');
        playlistField.innerHTML = '';
        playlist.forEach(playlist => {
            let li = document.createElement('li');
            let img = document.createElement('img');
            img.src = playlist.playlistImg;
            let p = document.createElement('p');
            p.setAttribute('data-id', playlist._id);
            p.innerHTML = playlist.playlistName;
            p.className = 'playlist-li';
            li.appendChild(img);
            li.appendChild(p);
            playlistField.appendChild(li);
            li.addEventListener('click', function(){
                updatePlaylist(songId, p.getAttribute('data-id'));
            })
        });
        if(playlist.length == 0) {
            let li = document.createElement('li');
            let p = document.createElement('p');
            p.setAttribute('data-id', playlist._id);
            p.innerHTML = 'No playlist found or all of your playlist already contain this song.';
            p.className = 'playlist-li';
            li.appendChild(p);
            playlistField.appendChild(li);
        }
    } catch (err) {
        console.log('Fetch error:' + err);
    }
}

async function updatePlaylist(songId, playlistId) {
    try {
        const response =  await fetch('/fetch/database/updatePlaylist/' + songId + '/' + playlistId);
        await openPlaylistPanel(songId);
        return response;
    } catch (err) {
        console.log('Fetch error:' + err);
    }
}

function addAllListener() {
    let newSong = document.querySelector('#newSong');
    let viewSong = document.querySelectorAll('#viewSong');
    let editSong = document.querySelector('#editSong');
    let newArtist = document.querySelector('#newArtist');
    let viewArtist = document.querySelectorAll('#viewArtist');
    let editArtist = document.querySelector('#editArtist');
    let newAlbum = document.querySelector('#newAlbum');
    let viewAlbum = document.querySelectorAll('#viewAlbum');
    let editAlbum = document.querySelector('#editAlbum');
    let viewPlaylist = document.querySelectorAll('#viewPlaylist');
    let editPlaylist = document.querySelector('#editPlaylist');
    let removeSongFromPlaylist = document.querySelectorAll('#deleteSongFromPlaylist');
    let favourite = document.querySelectorAll('#favourite');
    let playOneSong = document.querySelectorAll('#playOneSong');
    let playOneAlbum = document.querySelectorAll('#playOneAlbum');
    let playOnePlaylist = document.querySelectorAll('#playOnePlaylist');
    let openPlaylistPanelBtn = document.querySelectorAll('#openPlaylistPanel');
    let editProfile = document.querySelector('#editProfile');

    if(newSong) { newSong.addEventListener('click', fetchNewSong('false')); }
    if(viewSong) {
        viewSong.forEach(elem => {
            elem.addEventListener('click', function(){
                fetchViewSong('false', this.getAttribute('data-id'));
            });
        });
    }
    if(editSong) { 
        editSong.addEventListener('click', function(){
            fetchEditSong('false', this.getAttribute('data-id'));
        }); 
    }
    if(newArtist) { newArtist.addEventListener('click', fetchNewArtist('false')); }
    if(viewArtist) {
        viewArtist.forEach(elem => {
            elem.addEventListener('click', function(){
                fetchViewArtist('false', this.getAttribute('data-id'));
            });
        });
    }
    if(editArtist) { 
        editArtist.addEventListener('click', function(){
            fetchEditArtist('false', this.getAttribute('data-id'));
        }); 
    }
    if(newAlbum) { newAlbum.addEventListener('click', fetchNewAlbum('false')); }
    if(viewAlbum) {
        viewAlbum.forEach(elem => {
            elem.addEventListener('click', function(){
                fetchViewAlbum('false', this.getAttribute('data-id'));
            });
        });
    }
    if(editAlbum) { 
        editAlbum.addEventListener('click', function(){
            fetchEditAlbum('false', this.getAttribute('data-id'));
        }); 
    }
    if(viewPlaylist) {
        viewPlaylist.forEach(elem => {
            elem.addEventListener('click', function(){
                fetchViewPlaylist('false', this.getAttribute('data-id'));
            });
        });
    }
    if(editPlaylist) {
        editPlaylist.addEventListener('click', function(){
            openEditPlaylistPanel();
        });
    }
    if(removeSongFromPlaylist) {
        removeSongFromPlaylist.forEach(elem => {
            elem.addEventListener('click', function(){
                fetchDeleteSongFromPlaylist(editPlaylist.getAttribute('data-id'), this.getAttribute('data-id'));
            });   
        });
    }
    if(favourite) {
        favourite.forEach(elem => {
            elem.addEventListener('click', function(){
                if(this.className == 'fav-btn' || this.className == 'fav-btn-pink') {
                    if(this.className == 'fav-btn') {
                        this.className = 'fav-btn-pink';
                        this.src = '/images/favourite-pink.png';
                    } else {
                        this.className = 'fav-btn';
                        this.src = '/images/favourite.png';
                    }
                } else {
                    if(this.className == 'fav-btn-big') {
                        this.className = 'fav-btn-pink-big';
                        this.src = '/images/favourite-pink.png';
                    } else {
                        this.className = 'fav-btn-big';
                        this.src = '/images/favourite.png';
                    }
                }
                updateFavourite(this.getAttribute('data-id'));
            });   
        });
    }
    if(playOneSong) {
        playOneSong.forEach(elem => {
            elem.addEventListener('click', function(){
                oneSongLoad(this.getAttribute('data-id'));
            });   
        });
    }
    if(playOneAlbum) {
        playOneAlbum.forEach(elem => {
            elem.addEventListener('click', function(){
                oneAlbumLoad(this.getAttribute('data-id'));
            });   
        });
    }
    if(playOnePlaylist) {
        playOnePlaylist.forEach(elem => {
            elem.addEventListener('click', function(){
                onePlaylistLoad(this.getAttribute('data-id'));
            });   
        });
    }
    if(openPlaylistPanelBtn) {
        openPlaylistPanelBtn.forEach(elem => {
            elem.addEventListener('click', function(){
                openPlaylistPanel(this.getAttribute('data-id'));
            });
        });
    }
    if(editProfile) {
        editProfile.addEventListener('click', function(){
            openEditProfilePanel();
        })
    }
}

window.onpopstate = function(e) {
    // alert("location: " + document.location + ", state: " + JSON.stringify(event.state))
    
    if(e.state == null) {
        fetchMyDocument('true');
    } else {
        let state = e.state.split('/');
        console.log(state);
        if (state[0] == 'profile') {
            fetchProfile('true', state[1]);
        } else if (state[0] == 'search') {
            fetchSearch('true');
        } else if (state[0] == 'allPlaylist') {
            fetchAllPlaylist('true', state[1]);
        } else if (state[0] == 'viewPlaylist') {
            fetchViewPlaylist('true', state[1]);
        }

        else if (state[0] == 'newSong') {
            fetchNewSong('true');
        } else if (state[0] == 'viewSong') {
            fetchViewSong('true', state[1]);
        } else if (state[0] == 'editSong') {
            fetchEditSong('true', state[1]);
        } 

        else if (state[0] == 'newArtist') {
            fetchNewArtist('true');
        } else if (state[0] == 'viewArtist') {
            fetchViewArtist('true', state[1])
        } else if (state[0] == 'editArtist') {
            fetchEditArtist('true', state[1]);
        } 
        
        else if (state[0] == 'newAlbum') {
            fetchNewAlbum('true');
        } else if (state[0] == 'viewAlbum') {
            fetchViewAlbum('true', state[1])
        } else if (state[0] == 'editAlbum') {
            fetchEditAlbum('true', state[1]);
        }
    }
  };

export { fetchMyDocument };
export { fetchViewSong };
export { fetchViewAlbum };
export { fetchViewArtist };
export { updateFavourite };
export { openPlaylistPanel };