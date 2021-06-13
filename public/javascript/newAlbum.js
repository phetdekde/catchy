artistQueryInAlbum();

async function artistQueryInAlbum() {
    const newArtistPage = document.querySelector('#newAlbum');
    const searchWrapper = document.querySelector('#searchInput');

    //artist suggestion function
    if(newArtistPage) {
        //GET ALL ARTIST LIST
        let artist = await getArtist();
        let artistList = [];
        for (let i = 0; i < artist.length; i++) {
            artistList[i] = artist[i].artistName;
        }
        const inputBox = searchWrapper.querySelector('input');
        const suggBox = searchWrapper.querySelector('#autocomBox');
        inputBox.addEventListener('keyup', function(e){
            let userData = e.target.value; //user entered data
            let emptyArr = [];
            if(userData) {
                emptyArr = artistList.filter((data)=>{
                    //filtering arr value and user char to lowercase and return only those word/sentc which starts with user entered word
                    return data.toLocaleLowerCase().startsWith(userData.toLocaleLowerCase());
                });
                emptyArr = emptyArr.map((data)=>{
                    return data = '<li>' + data + '</li>';
                });
                searchWrapper.classList.add('active'); //show autocomp box
                showSuggestions(emptyArr, inputBox, suggBox);
                //adding onclick att in all li tag 
                let allList = suggBox.querySelectorAll('li');
                for (let i = 0; i < allList.length; i++) {
                    allList[i].addEventListener('click', function(){
                        select(this, inputBox, searchWrapper);
                    });
                }
            } else {
                searchWrapper.classList.remove('active'); //remove autocomp box
            }
        });
    }

    //display song that's not in any album from certain artist
    if(newArtistPage) {
        const inputBox = searchWrapper.querySelector('input');
        document.querySelector('#querySong').addEventListener('click', async function(){
            //remove every song first
            deleteAllChild();
            //if inputbox has value
            const songList = document.querySelector('#songList');
            let li = document.createElement('li');
            if(inputBox.value) {
                let song = await getSong(inputBox.value);
                if(song != 'Artist not found') {
                    //show every song from the artist
                    if(song.length > 0) {
                        song.forEach(element => {
                            let checkbox = document.createElement('input');
                            checkbox.type = 'checkbox';
                            checkbox.name = 'album[song]';
                            checkbox.value = element._id;
                            checkbox.id = element.songName;
                            let label = document.createElement('label');
                            label.htmlFor = element.songName;
                            label.style.marginRight = '1rem';
                            label.appendChild(document.createTextNode(element.songName));
                            li.appendChild(checkbox);
                            li.appendChild(label);
                            songList.appendChild(li);
                        });
                    } else {
                        let label = document.createElement('label');
                        label.appendChild(document.createTextNode("This artist doesn't have any songs or all of them are already in an album"));
                        li.appendChild(label);
                        songList.appendChild(li);
                    }
                } else {
                    let label = document.createElement('label');
                    label.appendChild(document.createTextNode(song));
                    li.appendChild(label);
                    songList.appendChild(li);
                }
            }
        });
    }
}

function select(element, inputBox, searchWrapper) {
    let selectUserData = element.textContent;
    inputBox.value = selectUserData; //passing the user selected list item data in textfield
    searchWrapper.classList.remove('active'); //remove autocomp box
}

function showSuggestions(list, inputBox, suggBox) {
    let listData;
    if(!list.length) {
        let userValue = inputBox.value;
        listData = '<li>' + userValue + '</li>';
    } else {
        listData = list.join('');
    }
    suggBox.innerHTML = listData;
}

function deleteAllChild() {
    const songList = document.querySelector('#songList');
        while(songList.firstChild) {
            songList.removeChild(songList.lastChild);
    }
}

async function getArtist() {
    let data = await fetch('/fetch/database/allArtist');
    return await data.json();
}

async function getSong(artistName) {
    let data = await fetch('/fetch/database/songByArtistName/' + artistName);
    return await data.json();
}
export { artistQueryInAlbum };