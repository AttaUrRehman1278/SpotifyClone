let currentSurah = new Audio();
let surahs;
let currFolder;

function secondsToMinSec(seconds) {
    if (isNaN(seconds) || seconds < 0){
        return "00:00"
    }
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

async function getSurahs(folder) {
    currFolder = folder;
    let a = await fetch(`http://127.0.0.1:3000/${folder}/`);
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    surahs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")){
            surahs.push(element.href.split(`/`)[5])
        }
    }
    
    let surahUL = document.querySelector(".playlist").getElementsByTagName("ul")[0]
    surahUL.innerHTML = " "

    for (const surah of surahs){

        
        surahUL.innerHTML = surahUL.innerHTML +  ` <li>
        <img src="public/rockstar-umair.jfif" alt="">
        <div class='info'>
        <div class='song-name'>${surah.replaceAll("%20", " ")}</div>
        </div>
        <div class='play-song'>
        <img src="public/play.svg" alt="">
        </div>
        </li>`;
        
    }
    

    Array.from(document.querySelector(".playlist").getElementsByTagName("li")).forEach(surah => {
        surah.addEventListener("click", element => {
            playAudio(surah.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    });
    return surahs

}

const playAudio = (track, pause = false) => {
    
    currentSurah.src = `/${currFolder}/`+ track;
    if (!pause) {
        currentSurah.play();
    }
    play.src = "public/pause.svg";
    document.querySelector(".surahinfo").textContent = decodeURI(track.split(".")[0]);
    document.querySelector(".surahtime").textContent = "00:00/00:00";
}

async function displayAlbums() {
    const response = await fetch(`http://127.0.0.1:3000/tilawat/`);
    const text = await response.text();
    let div = document.createElement("div")
    div.innerHTML = text
    let anchors = div.getElementsByTagName("a")
    let albumCards = document.querySelector(".albumCards")
    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const element = array[index];
        if (element.href.includes("/tilawat")){
            let folder = element.href.split("/").slice(-2)[0]

            let response = await fetch(`http://127.0.0.1:3000/tilawat/${folder}/info.json`);
            let text = await response.json();
            albumCards.innerHTML = albumCards.innerHTML + `<div data-folder="${folder}" class="card">
            <div class="play-btn">
                                <?xml version="1.0" encoding="utf-8"?>

<!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->
<svg width="800px" height="800px" viewBox="-1 1 22 22" fill="#000000" xmlns="http://www.w3.org/2000/svg">
<g id="Media / Play">
<path id="Vector" d="M5 17.3336V6.66698C5 5.78742 5 5.34715 5.18509 5.08691C5.34664 4.85977 5.59564 4.71064 5.87207 4.67499C6.18868 4.63415 6.57701 4.84126 7.35254 5.25487L17.3525 10.5882L17.3562 10.5898C18.2132 11.0469 18.642 11.2756 18.7826 11.5803C18.9053 11.8462 18.9053 12.1531 18.7826 12.4189C18.6418 12.7241 18.212 12.9537 17.3525 13.4121L7.35254 18.7454C6.57645 19.1593 6.1888 19.3657 5.87207 19.3248C5.59564 19.2891 5.34664 19.1401 5.18509 18.9129C5 18.6527 5 18.2132 5 17.3336Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</g>
</svg>
                                </div>
                            <img src="tilawat/${folder}/rockstar-umair.jfif" alt="">
                            <h2>${text.title}</h2>
                            <p>${text.description}</p>
                        </div>` 
        }
    }
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            surahs = await getSurahs(`tilawat/${item.currentTarget.dataset.folder}`)
            playAudio(surahs[0])
        })
    })
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", item => {
            document.querySelector(".sidebar").style.left = "0%";
        })
    })
}

async function main() {
    await getSurahs(`tilawat/Ahmed Khedr`);
    playAudio(surahs[0], true);

    displayAlbums();
    
    play.addEventListener("click", () => {
        if (currentSurah.paused) {
            currentSurah.play();
            play.src = "public/pause.svg";
        } else {
            currentSurah.pause();
            play.src = "public/play.svg";
        }
    });

    const surahTime = document.querySelector(".surahtime");
    const circle = document.querySelector(".circle");

    currentSurah.addEventListener("timeupdate", () => {
        surahTime.textContent = `${secondsToMinSec(currentSurah.currentTime)}/${secondsToMinSec(currentSurah.duration)}`;
        circle.style.left = `${(currentSurah.currentTime / currentSurah.duration) * 100}%`;
    });

    document.querySelector(".seekbar").addEventListener("click", (e) => {
        const percent = e.offsetX / e.currentTarget.offsetWidth;
        circle.style.left = `${percent * 100}%`;
        currentSurah.currentTime = percent * currentSurah.duration;
    });

    // Add Event Listener for hamburger
    document.querySelector(".hamburger").addEventListener("click", (e => {
        document.querySelector(".sidebar").style.left = "0%";
    }))

    // Add Event Listener for hamburger
    document.querySelector(".close").addEventListener("click", (e => {
        document.querySelector(".sidebar").style.left = "-120%";
    }))


    // Add Event Listener for previous and next surah
    previous.addEventListener("click", () => {
        currentSurah.pause()

        let index = surahs.indexOf(currentSurah.src.split("/").slice(-1)[0])
        if((index -1 ) >= 0){
            playAudio(surahs[index - 1])
        }
    })

    next.addEventListener("click", () => {
        currentSurah.pause()

        let index = surahs.indexOf(currentSurah.src.split("/").slice(-1)[0])
        if((index + 1) < surahs.length){
            playAudio(surahs[index + 1])
        }
    })

    // Add Event Listener for Volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e => {
        currentSurah.volume = parseInt(e.target.value)/100
    }))

    document.querySelector(".volume > img").addEventListener("click", e => {
        console.log(e.target)
        if(e.target.src.includes("public/volume.svg")){
            e.target.src = e.target.src.replace("public/volume.svg","public/mute.svg")
            currentSurah.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else {
            e.target.src = e.target.src.replace("public/mute.svg", "public/volume.svg")
            currentSurah.volume = 0.50;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 50;
        }
    })

   
}

main();
