// const urlServer = 'https://httprelay.io/link/';
const urlServer = 'https://httprelay.io/mcast/';

[].slice.call(document.getElementsByTagName('video')).forEach(i => {
    i.addEventListener('play', e => {
        let key_master = document.querySelector('#key').textContent;

        if (key_master.trim() == '')
            return;

        console.log('play', urlServer + key_master);
        fetch(urlServer + key_master, {
            method: 'POST',
            body: JSON.stringify({key: key_master, time: i.currentTime})
        })
        .then(r => console.log(r));
    });

    i.addEventListener('timeupdate', i => {
        // let rounded_time = parseInt(i.timeStamp);

        if (document.querySelector('#key').textContent.trim() == '')
            return;

        console.log('timeupdate');

        let key_master = document.querySelector('#key').textContent;
        fetch(urlServer + key_master, {
            method: 'POST',
            body: JSON.stringify({key: key_master, time: i.target.currentTime, time_sended: i.timeStamp})
        })
        .then(r => console.log(r));
    })
})


document.querySelector('#generate').addEventListener('click', e => document.querySelector('#key').textContent = Math.random().toString(36).substr(2));

document.querySelector('#sync_btn').addEventListener('click', e => {
    let key = document.querySelector('#code').value.trim();
    console.log(key, urlServer + key);

    fetch(urlServer + key)
    .then(r => r .json())
    .then(j => [].slice.call(document.getElementsByTagName('video')).forEach(i => {
        console.log('set play', i.paused, i.currentTime, j.time)
        if (i.paused) i.play();
        i.currentTime = j.time;
    }))
    .catch(e => console.log(e));
})
