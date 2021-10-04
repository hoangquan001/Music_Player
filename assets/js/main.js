const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const playlist = $('.playlist');
const cd = $('.cd');
var songs = null;
const heading = $('header h2');
const cdThum = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
const player = $('.player');
const progress = $('#progress');
const btnNext = $('.btn-next');
const btnPre = $('.btn-prev');
const btnRan = $('.btn-random');
const btnRepeat = $('.btn-repeat');

const app = {
    preIndex: 0,
    curIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    song: [

        {
            id: 6,
            Name: "Yêu là cưới",
            singer: "Phát Hồ",
            path: "./assets/music/YeuLaCuoi.mp3",
            // path:" https://vnso-zn-24-tf-mp3-320s1-zmp3.zadn.vn/a89f4d8569c3809dd9d2/2629504776318571597?authen=exp=1633490042~acl=/a89f4d8569c3809dd9d2/*~hmac=cf5a7b9549a03918d1c838c8e9e4cea0&fs=MTYzMzMxNzI0MjE0OHx3ZWJWNnwxMDU2NzUxOTU5fDE3MS4yMjUdUngMjU0LjE0Mw",
            img: "./assets/img/YeuLaCuoi.jpg"
        },
        {
            id: 0,
            Name: "Cô Ấy Đã Từng",
            singer: "Mạc Văn Khoa",
            path: "./assets/music/CoAyDaTung.mp3",
            img: "./assets/img/CoAyDaTung.jpg"
        },
        {
            id: 1,
            Name: "Ai mang cô đơn đi",
            singer: "K-ATM",
            path: "./assets/music/AiMangCoDonDi.mp3",
            img: "./assets/img/AiMangCoDonDi.jpg"
        },
        {
            id: 2,
            Name: "Họa Mây",
            singer: "X2X Band ft Dinh Long",
            path: "./assets/music/HoaMay.mp3",
            img: "./assets/img/HoaMay.jpg"
        },
        {
            id: 3,
            Name: "Sầu Hồng Gai",
            singer: "G5R Squad",
            path: "./assets/music/SauHongGai.mp3",
            img: "./assets/img/SauHongGai.jpg"
        },
        {
            id: 4,
            Name: "Tướng Quân",
            singer: "Nhật phong",
            path: "./assets/music/TuongQuan.mp3",
            img: "./assets/img/TuongQuan.jpg"
        },
        {
            id: 5,
            Name: "Vô Tình",
            singer: "Xesi",
            path: "./assets/music/VoTinh.mp3",
            img: "./assets/img/VoTinh.jpg"
        }
    ],
    Render: function () {
        const html = this.song.map((song) => {
            return `
            <div class="song">
            <div class="thumb" style="background-image: url(${song.img})">
            </div>
            <div class="body">
                <h3 class="title">${song.Name}</h3>
                <p class="author">${song.singer}</p>
            </div>
            <div class="option">
                <i class="fas fa-ellipsis-h"></i>
            </div>
             </div>`
        })

        playlist.innerHTML = html.join('')
    },
    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.song[app.curIndex];
            }
        })
    },
    //xử lý sự kiện của object hiện tại
    handleEvent: function () {
        const _this = this;
        createIndex = function (isNext) {
            var index = _this.curIndex;
            _this.preIndex = index;
            if (_this.isRandom)
                do {
                    index = Math.floor(Math.random() * _this.song.length);
                } while (index == _this.curIndex)
            else if (isNext)
                index++;
            else
                index--;
            return index;
        }
        pauseMusic = function () {
            player.classList.remove("playing");
            audio.pause();
            rolation.pause();
            _this.isPlaying = false;
        }
        playMusic = function () {
            audio.play();
            player.classList.add("playing");
            rolation.play();
            _this.isPlaying = true;
        }
        preMusic = function () {
            _this.curIndex = createIndex(false);
            if (_this.curIndex < 0)
                _this.curIndex = _this.song.length - 1;
            _this.loadMusic();
        }
        nextMusic = function () {
            _this.curIndex = createIndex(true);
            if (_this.curIndex >= _this.song.length)
                _this.curIndex = 0
            _this.loadMusic();
        }
        const rolation = cd.animate([
            {
                transform: 'rotate(360deg)',
            }], {
            duration: 12000,
            iterations: Infinity
        })
        //check event click div in list song
        songs.forEach((element, index) => {
            element.onclick = function () {
                if (_this.curIndex == index) {
                    if (_this.isPlaying == true)
                        pauseMusic();
                    else
                        playMusic();
                    return;
                }
                _this.preIndex = _this.curIndex;
                _this.curIndex = index;
                _this.loadMusic();
            }
        });
        //sự kiện cuộn
        const cdWidth = cd.offsetWidth;
        document.onscroll = function () {

            var scrollTop = window.scrollY || document.documentElement.scrollTop;
            var newCD = cdWidth - scrollTop;
            if (newCD < 0) newCD = 0;
            cd.style.width = newCD + 'px';
            cd.style.opacity = (1 - 0.005 * scrollTop) < 0.3 ? 0 : (1 - 0.005 * scrollTop);
        }

        //click play or pause
        playBtn.onclick = function () {
            if (_this.isPlaying == true)
                pauseMusic();
            else
                playMusic();
        }

        //chạy slide bar
        audio.ontimeupdate = function () {
            progress.value = (audio.currentTime / audio.duration * 100);
        }
        //lướt tới thời gian bài hát trên thanh tua
        progress.addEventListener("change", function () {
            audio.currentTime = this.value * audio.duration / 100;

            if (_this.isPlaying == false) {
                playMusic();
            }
        })
        //event khi bài hát đến cuối
        audio.addEventListener("ended", function () {
            setTimeout(() => {
                if (_this.isRepeat == true)
                    this.play();
                else
                    nextMusic();
            }, 2000);
        })

        btnNext.onclick = function () {
            nextMusic();
        }

        btnPre.onclick = function () {
            preMusic();
        }
        btnRan.onclick = function (e) {
            _this.isRandom = !_this.isRandom;
            this.classList.toggle("active", _this.isRandom);
        }
        btnRepeat.onclick = function (e) {
            _this.isRepeat = !_this.isRepeat;
            this.classList.toggle("active", _this.isRepeat);
        }
    },

    //Load toan bo tai nguyen khi thuc hien change song
    loadMusic: function () {
        heading.innerText = this.song[this.curIndex].Name;
        cdThum.style.backgroundImage = `url('${this.song[this.curIndex].img}')`;
        audio.src = this.song[this.curIndex].path;
        this.isPlaying = true;
        player.classList.add("playing");
        audio.play();
        songs[this.preIndex].classList.remove("active");
        songs[this.curIndex].classList.toggle('active');
    }
    ,
    start: function () {
        this.defineProperties();
        this.Render();
        songs = $$('.song');
        this.loadMusic();
        this.handleEvent();
    }
}

app.start();