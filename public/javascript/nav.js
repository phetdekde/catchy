import { fetchMyDocument } from './index.js';

const mobileBtn = document.getElementById('mobile-cta'),
    nav = document.querySelector('nav'),
    mobileBtnExit = document.getElementById('mobile-exit'),
    li = document.querySelectorAll('li');
    
const logoHome = document.querySelector('#logoHome').addEventListener('click', fetchHome), 
    navHome = document.querySelector('#navHome').addEventListener('click', fetchHome),
    navSearch = document.querySelector('#navSearch').addEventListener('click', fetchSearch),
    navPlaylist = document.querySelector('#navPlaylist').addEventListener('click', fetchPlaylist),
    navProfile = document.querySelector('#navProfile').addEventListener('click', function(){
        fetchProfile('false', this.getAttribute('value'));
    });

mobileBtn.addEventListener('click', () => {
    nav.classList.add('menu-btn');
});

mobileBtnExit.addEventListener('click', () => {
    nav.classList.remove('menu-btn');
});

li.forEach(elem => {
    elem.addEventListener('click', () => {
        li.forEach(elem => {
            elem.classList.remove('current');
        });
    });
});

async function fetchHome() {      
    try {
        let response = await fetch('/fetch/home'); 
        document.querySelector('#main').innerHTML = '';
        document.querySelector('#main').innerHTML = await response.text(); 
        history.pushState(null, null, '/home');
        fetchMyDocument();
    } catch (err) {
        console.log('Fetch error:' + err); 
    }
}

async function fetchSearch() {      
    try {
        let response = await fetch('/fetch/index'); 
        document.querySelector('#main').innerHTML = '';
        document.querySelector('#main').innerHTML = await response.text(); 
        history.pushState(null, null, '/index');
    } catch (err) {
        console.log('Fetch error:' + err); 
    }
}

async function fetchPlaylist() {      
    try {
        let response = await fetch('/fetch/index'); 
        document.querySelector('#main').innerHTML = '';
        document.querySelector('#main').innerHTML = await response.text(); 
        history.pushState(null, null, '/index');
    } catch (err) {
        console.log('Fetch error:' + err); 
    }
}

async function fetchProfile(isPopState, value) {      
    try {
        let response = await fetch('/fetch/user/' + value); 
        document.querySelector('#main').innerHTML = '';
        document.querySelector('#main').innerHTML = await response.text(); 
        if(isPopState == 'false')
            history.pushState('profile/' + value, null, '/user/' + value);
    } catch (err) {
        console.log('Fetch error:' + err); 
    }
}

export { fetchProfile };