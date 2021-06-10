import { fetchViewSong, fetchViewArtist } from './index.js';

const songImg = document.querySelector('#songImg');
const title = document.querySelector('#viewSongInPlayer');
const artist = document.querySelector('#viewArtistInPlayer');

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
    loadNextSong(song, indexNo);
    playSong();
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
    let newPrev = document.createElement('button');
    newPrev.id = 'prev';
    newPrev.innerHTML = '<i class="" aria-hidden="true">PREVIOUS</i>';
    let newNext = document.createElement('button');
    newNext.id = 'next';
    newNext.innerHTML = '<i class="" aria-hidden="true">NEXT</i>';
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
    let newPrev = document.createElement('button');
    newPrev.id = 'prev';
    newPrev.innerHTML = '<i class="" aria-hidden="true">PREVIOUS</i>';
    let newNext = document.createElement('button');
    newNext.id = 'next';
    newNext.innerHTML = '<i class="" aria-hidden="true">NEXT</i>';
    play.parentNode.insertBefore(newNext, play.nextSibling);
    play.parentNode.insertBefore(newPrev, play);
    newPrev.addEventListener('click', function() {
        previousSong(song);
    });
    newNext.addEventListener('click', function() {
        nextSong(song);
    });
}

function loadEmptySong() {
    title.innerHTML = "";
    artist.innerHTML = "";
}

function loadNextSong(song, indexNo) {
    clearInterval(timer);
    resetSlider();

    title.remove();
    artist.remove();
    let newTitle = document.createElement('p');
    newTitle.id = 'viewSongInPlayer';
    newTitle.innerHTML = song[indexNo].songName;
    newTitle.setAttribute('data-id', song[indexNo]._id);
    let newArtist = document.createElement('p');
    newArtist.id = 'viewArtistInPlayer';
    newArtist.innerHTML = song[indexNo].artist.artistName;
    newArtist.setAttribute('data-id', song[indexNo].artist._id);
    songImg.parentNode.insertBefore(newArtist, songImg.nextSibling);
    songImg.parentNode.insertBefore(newTitle, songImg.nextSibling);
    newTitle.addEventListener('click', function() {
        fetchViewSong('false', this.getAttribute('data-id'));
    });
    newArtist.addEventListener('click', function() {
        fetchViewArtist('false', this.getAttribute('data-id'));
    });

    // title.innerHTML = song[indexNo].songName;
    // title.setAttribute('data-id', song[indexNo]._id);
    // artist.innerHTML = song[indexNo].artist.artistName;
    // artist.setAttribute('data-id', song[indexNo].artist._id);
    track.src = song[indexNo].songFile;
    songImg.src = song[indexNo].songImg;
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
    play.innerHTML = '<i>STOP</i>';
}

//pause song
function pauseSong() {
    track.pause();
    playingSong = false;
    play.innerHTML = '<i>PLAY</i>';
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