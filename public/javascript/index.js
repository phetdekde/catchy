import { fetchProfile } from './nav.js';

//This function automatically fetch if pathname is /index
if(location.pathname == 'home') {
    fetchMyDocument('false');
} else {
    addAllListener();
}

async function fetchMyDocument(isPopState) {      
    try {
        let response = await fetch('/fetch/home');
        document.querySelector('#main').innerHTML = '';
        document.querySelector('#main').innerHTML = await response.text(); 
        document.querySelector('#newSong').addEventListener('click', function(){
            fetchNewSong('false');
        });
        document.querySelectorAll('#viewSong').forEach(elem => {
            elem.addEventListener('click', function(){
                fetchViewSong('false', this.getAttribute('value'));
            });   
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

async function fetchViewSong(isPopState, value) {
    try {
        let response = await fetch('/fetch/song/' + value); 
        document.querySelector('#main').innerHTML = '';
        document.querySelector('#main').innerHTML = await response.text(); 
        document.querySelector('#editSong').addEventListener('click', function(){
            fetchEditSong('false', this.getAttribute('value'));
        });
        if(isPopState == 'false')
            history.pushState('viewSong/' + value, null, '/song/' + value);
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

function addAllListener() {
    let newSong = document.querySelector('#newSong');
    let viewSong = document.querySelectorAll('#viewSong');
    let editSong = document.querySelector('#editSong');

    if(newSong) { newSong.addEventListener('click', fetchNewSong); }
    if(viewSong) {
        viewSong.forEach(elem => {
            elem.addEventListener('click', function(){
                fetchViewSong('false', this.getAttribute('value'));
            });
        });
    }
    if(editSong) { 
        editSong.addEventListener('click', function(){
            fetchEditSong('false', this.getAttribute('value'));
        }); 
    }
}

window.onpopstate = function(e) {
    // alert("location: " + document.location + ", state: " + JSON.stringify(event.state));
    if(e.state == null) {
        fetchMyDocument('true');
    } else {
        let state = e.state.split('/');
        console.log(state);
        if (state[0] == 'viewSong') {
            fetchViewSong('true', state[1]);
        } else if (state[0] == 'newSong') {
            fetchNewSong('true');
        } else if (state[0] == 'editSong') {
            fetchEditSong('true', state[1]);
        } else if (state[0] == 'profile') {
            fetchProfile('true', state[1])
        }
    }
  };

export { fetchMyDocument };