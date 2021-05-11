const mobileBtn = document.getElementById('mobile-cta'),
    nav = document.querySelector('nav'),
    mobileBtnExit = document.getElementById('mobile-exit'),
    li = document.querySelectorAll('li');

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

export default li;