import li from './nav.js';

li.forEach(element => {
    console.log(element);
    element.classList.remove('current');
});