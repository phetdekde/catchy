import { fetchViewSong, fetchViewArtist } from './index.js';

const songImg = document.querySelector('#songImg');
const songInfo = document.querySelector('#songInfo');

const play = document.querySelector('#play');
play.addEventListener('click', function () {
    justPlay();
});

const slider = document.querySelector('#durationSlider');
slider.addEventListener('change', function () {
    changeDuration();
});

const volumeIcon = document.querySelector('#volumeIcon');
volumeIcon.addEventListener('click', function () {
    muteSound();
})
const recentVolume = document.querySelector('#volume');
recentVolume.addEventListener('change', function () {
    volumeChange();
});

let timer;
let indexNo = 0;
let playingSong = false;

//create an audio element
let track = document.createElement('audio');

async function oneSongLoad(songId) {
    let song = await getSong(songId);
    indexNo = 0;
    //set song in player
    loadNextSong(song, indexNo);
    //play this song
    playSong();
    const previous = document.querySelector('#prev');
    const next = document.querySelector('#next');
    previous.remove();
    next.remove();
    let newPrev = document.createElement('img');
    newPrev.id = 'prev';
    newPrev.className = 'prev-btn';
    newPrev.src = '/images/previous.png';
    let newNext = document.createElement('img');
    newNext.id = 'next';
    newNext.className = 'next-btn';
    newNext.src = '/images/next.png';
    play.parentNode.insertBefore(newNext, play.nextSibling);
    play.parentNode.insertBefore(newPrev, play);
    newPrev.addEventListener('click', function() {
        previousSong(song);
    });
    newNext.addEventListener('click', function() {
        nextSong(song);
    });
}

async function oneAlbumLoad(albumId) {
    let song = await getAlbum(albumId);
    indexNo = 0;
    if(song != null) {
        loadNextSong(song, indexNo);
        playSong();
    }
    const previous = document.querySelector('#prev');
    const next = document.querySelector('#next');
    previous.remove();
    next.remove();
    let newPrev = document.createElement('img');
    newPrev.id = 'prev';
    newPrev.className = 'prev-btn';
    newPrev.src = '/images/previous.png';
    let newNext = document.createElement('img');
    newNext.id = 'next';
    newNext.className = 'next-btn';
    newNext.src = '/images/next.png';
    play.parentNode.insertBefore(newNext, play.nextSibling);
    play.parentNode.insertBefore(newPrev, play);
    newPrev.addEventListener('click', function() {
        previousSong(song);
    });
    newNext.addEventListener('click', function() {
        nextSong(song);
    });
}

async function onePlaylistLoad(playlistId) {
    let song = await getPlaylist(playlistId);
    indexNo = 0;
    if(song != null) {
        loadNextSong(song, indexNo);
        playSong();
    }
    const previous = document.querySelector('#prev');
    const next = document.querySelector('#next');
    previous.remove();
    next.remove();
    let newPrev = document.createElement('img');
    newPrev.id = 'prev';
    newPrev.className = 'prev-btn';
    newPrev.src = '/images/previous.png';
    let newNext = document.createElement('img');
    newNext.id = 'next';
    newNext.className = 'next-btn';
    newNext.src = '/images/next.png';
    play.parentNode.insertBefore(newNext, play.nextSibling);
    play.parentNode.insertBefore(newPrev, play);
    newPrev.addEventListener('click', function() {
        previousSong(song);
    });
    newNext.addEventListener('click', function() {
        nextSong(song);
    });
}

function loadNextSong(song, indexNo) {
    clearInterval(timer);
    resetSlider();

    //remove song info (songName, artistName) element first 
    document.querySelector('#viewSongInPlayer').remove();
    document.querySelector('#viewArtistInPlayer').remove();

    //create new song info
    let newTitle = document.createElement('p');
    newTitle.id = 'viewSongInPlayer';
    newTitle.className = 'song-name link';
    newTitle.innerHTML = song[indexNo].songName;
    newTitle.setAttribute('data-id', song[indexNo]._id);
    let newArtist = document.createElement('p');
    newArtist.id = 'viewArtistInPlayer';
    newArtist.className = 'artist-name link';
    newArtist.innerHTML = song[indexNo].artist.artistName;
    newArtist.setAttribute('data-id', song[indexNo].artist._id);
    songInfo.appendChild(newTitle);
    songInfo.appendChild(newArtist);
    newTitle.addEventListener('click', function() {
        fetchViewSong('false', this.getAttribute('data-id'));
    });
    newArtist.addEventListener('click', function() {
        fetchViewArtist('false', this.getAttribute('data-id'));
    });

    track.volume = recentVolume.value / 100;
    track.src = song[indexNo].songFile;
    songImg.src = song[indexNo].songImg;
    songImg.id = 'songImg';
    songImg.className = 'song-img';
    track.load();

    timer = setInterval(function(){rangeSlider(song)}, 1000);
}

//mute sound
function muteSound() {
    track.volume = 0;
}

//reset song slider
function resetSlider() {
    slider.value = 0;
}

//checking if the song is playing or not
function justPlay() {
    if (playingSong == false) {
        playSong();
    } else {
        pauseSong();
    }
}

//play song
function playSong() {
    track.play();
    playingSong = true;
    play.src = '/images/pause.png';
    play.className = 'pause-btn';
}

//pause song
function pauseSong() {
    track.pause();
    playingSong = false;
    play.src = '/images/play-2.png';
    play.className = 'play-btn';
}

//next song
function nextSong(song) {
    console.log(song);
    if (indexNo < song.length - 1) {
        indexNo += 1;
        loadNextSong(song, indexNo);
        playSong();
    } else {
        indexNo = 0;
        loadNextSong(song, indexNo);
        playSong();
    }
}

//previous song
function previousSong(song) {
    if (indexNo > 0) {
        indexNo -= 1;
        loadNextSong(song, indexNo);
        playSong();
    } else {
        indexNo = song.length - 1;
        loadNextSong(song, indexNo);
        playSong();
    }
}

//change volume
function volumeChange() {
    track.volume = recentVolume.value / 100;
}

//change slider position
function changeDuration() {
    slider.position = track.duration * (slider.value / 100);
    track.currentTime = slider.position;
}

function rangeSlider(song) {
    let position = 0;

    //update slider pos
    if (!isNaN(track.duration)) {
        position = track.currentTime * (100 / track.duration);
        slider.value = position;
    }

    //function will run when the song is over
    if (track.ended) {
        if(indexNo == song.length - 1) {
            indexNo = 0;
            loadNextSong(song, indexNo);
            playSong();
        } else {
            indexNo += 1;
            loadNextSong(song, indexNo);
            playSong();
        }
    }
}

async function getSong(songId) {
    try {
        let response = await fetch('/fetch/database/player/song/' + songId); 
        return  await response.json(); 
    } catch (err) {
        console.log('Fetch error:' + err); 
    }   
}

async function getAlbum(albumId) {
    try {
        let response = await fetch('/fetch/database/player/album/' + albumId); 
        return  await response.json(); 
    } catch (err) {
        console.log('Fetch error:' + err); 
    }    
}

async function getPlaylist(playlistId) {
    try {
        let response = await fetch('/fetch/database/player/playlist/' + playlistId); 
        return  await response.json(); 
    } catch (err) {
        console.log('Fetch error:' + err); 
    }
}

export { oneSongLoad };
export { oneAlbumLoad };
export { onePlaylistLoad };