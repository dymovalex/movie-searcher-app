const sideBarButton = document.querySelector('.side-bar');

function openWatchList(e){
    console.log(e);
    e.target.classList.toggle('open');
}

sideBarButton.addEventListener('click', openWatchList);