console.log("hello js plotify")
let currentSong = new Audio();

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}


async function getSongs(){
    let a = await fetch("http://127.0.0.1:5500/songs/")
    let response = await a.text();
    console.log(response)
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split("/songs/")[1])
        }
    }
    return songs
}

const playMusic = (track, pause=false)=>{
    // let audio = new Audio("/songs/" + track)
    currentSong.src = "/songs/" + track
    if(!pause){
        currentSong.play()
    }
    play.src = "pause.svg"
    document.querySelector(".songinfo").innerHTML = track
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"

}


async function main() {

    let songs = await getSongs()
    playMusic(songs[0])

    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]

    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li><img src="music.svg">
                            <div class="info">
                                <div>${song.replaceAll("%20", " ")}</div>
                                <div>Song Artist</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img src="play.svg">
                            </div>
        </li>`;
        
    }


    //attack a event listener to each song

    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())

        })
    })

    //attach an event listener to play next and previous
    play.addEventListener("click", ()=>{
        if(currentSong.paused){
            currentSong.play()
            play.src = "pause.svg"
        }
        else{
            currentSong.pause()
            play.src = "play.svg"
        }
    })

//3:36:49




    //Listen for timeupdate event

    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })

    //add an event to seekbar to slide 

    // document.querySelector(".seekbar").addEventListener("click", e=>{
    //     const percent = (e.offsetX/e.target.getBoundingClientRect().width) * 100 + "%";
    //     document.querySelector(".circle").style.left = (e.offsetX/e.target.getBoundingClientRect().width) * 100 + "%";
    //     currentSong.currentTime = ((currentSong.duration)* percent)/100
        
    // })
    
    document.querySelector(".seekbar").addEventListener("click", e => {
        const clickedPercent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        const seekTime = (clickedPercent / 100) * currentSong.duration;
      
        // Update circle position visually
        document.querySelector(".circle").style.left = clickedPercent + "%";
      
        // Set currentTime using the media element's method
        currentSong.currentTime = seekTime;
      });




    // add an event listener for hamburger

    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })

    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-100%"
    })


    // add event listener for next and previous

    previous.addEventListener("click", ()=>{
        currentSong.pause()
        console.log("Previous clicked")
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }
    })

    next.addEventListener("click", ()=>{
        currentSong.pause()
        console.log("Next clicked")

        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }
    })








    

    



}
main()

