const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const cd = $('.cd')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const btnPause = $('.btn-toggle-pause')
const container = $('.container')
const progress = $('#progress')
const btnNext = $('.btn-next')
const btnPrev = $('.btn-prev')
const btnRandom = $('.btn-random')
const btnRepeat =$('.btn-repeat')
const playlist = $('.playlist')



const app= {
    currentIndex: 0,
    isPlaying: false,
    isRandom:false,
    isRepeat:false,
    songs: [
        {
            name:'Yeu 5',
            singer:'Rhymastic',
            path:'./assets/audio/yeu5.mp3',
            image:'./assets/images/yeu5.jpg'
        },
        {
            name:'Sofar',
            singer:'Binz',
            path:'./assets/audio/sofar.mp3',
            image:'./assets/images/sofar.jpg'
        },
        {
            name:'Cam On',
            singer:'Den',
            path:'./assets/audio/cam-on.mp3',
            image:'./assets/images/cam-on.jpg'
        },
        {
            name:'Di qua mua ha',
            singer:'Thai Dinh',
            path:'./assets/audio/di-qua-mua-ha.mp3',
            image:'./assets/images/di qua mua ha.jpg'
        },
        {
            name:'Loi nho',
            singer:'Đen Vâu ft. Phương Anh Đào',
            path:'./assets/audio/loi-nho.mp3',
            image:'./assets/images/den-loi-nho.jpg'
        },
        {
            name:'Nang tho',
            singer:'Hoàng Dũng ',
            path:'./assets/audio/Nang Tho - Hoang Dung.mp3',
            image:'./assets/images/hoang-dung-nang-tho.jpg'
        },
        {
            name:'THEY SAID',
            singer:'TOULIVER X BINZ ',
            path:'./assets/audio/they-said.mp3',
            image:'./assets/images/binz-they-said.jpg'
        },
        {
            name:'Nến Và Hoa',
            singer:'Rhymastic',
            path:'./assets/audio/nen-va-hoa.mp3',
            image:'./assets/images/rhymastic-nen-va-hoa.jpg'
        },
        {
            name:'NoiNayCoAnhRemix',
            singer:'SonTungMTP',
            path:'./assets/audio/noi-nay-co-anh.mp3',
            image:'./assets/images/noi-nay-co-anh-STMTP.jpg'
        },
        {
            name:'Dễ đến dễ đi',
            singer:'Quang Hung MasterD',
            path:'./assets/audio/de-den-de-di.mp3',
            image:'./assets/images/de-den-de-di.jpg'
        },

    ],
    // render songs
    render: function(){
        const htmls = this.songs.map((song,index) =>{
            return`
            <div class="song ${index===this.currentIndex ? 'active': ''}" data-index="${index}">
                <div class="thumb" style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>        
            `
        })
        playlist.innerHTML = htmls.join('')
    },
    defineProperties:function(){
        Object.defineProperty(this,'currentSong',{
            get:function(){
                return this.songs[this.currentIndex]
                
            }
        })
    } ,
    handelEvents: function(){
        const _this =  this
        const cdWidth = cd.offsetWidth
        // xu ly CD quay va dung
        const cdThumbAnimate =  cdThumb.animate([
            { transform: 'rotate(360deg)'}
        ],
            {
                duration: 10000,
                iterations: Infinity
            }
        )
        cdThumbAnimate.pause()
        // phong to /thu nho CD
        document.addEventListener('scroll',()=>{
            const scrollTop= window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop
            
            cd.style.width =newCdWidth>0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth

        })
        // click play 
        btnPause.addEventListener('click',(event)=>{
            if(_this.isPlaying){
                audio.pause()
            }else{
                audio.play()
            }
        })
        // khi song dc play
        audio.onplay = function(){
            _this.isPlaying = true
            container.classList.add('playing')
            cdThumbAnimate.play()
        }
        audio.onpause = function(){
            _this.isPlaying = false
            container.classList.remove('playing')
            cdThumbAnimate.pause()
        }
        // khi tien do bai hat thay doi
        audio.ontimeupdate = function(){
            if( audio.duration){
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent     
            }
        }
        // xu ly khi tua bai hat 
        progress.addEventListener('change',(e)=>{
           const seekTime = audio.duration / 100 * e.target.value
           audio.currentTime = seekTime

        })
        // khi nhan next bai hat 
        btnNext.onclick= function(){
            if(_this.isRandom){
                _this.playRandom()

            }else{
                _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }
        // khi nhan prev bai hat 
        btnPrev.onclick= function(){
            if(_this.isRandom){
                _this.playRandom()
            }else{
                _this.prevSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()

        }
        // xu ly next song khi audio ket thuc
        audio.onended = function(){
            if(_this.isRepeat){
                audio.play()
            }else{
                btnNext.click()
            }
        }
        // lang nghe hanh vi click vao playlist
        playlist.onclick = function(e){
            const songNode =e.target.closest('.song:not(.active)')
            if(songNode || e.target.closest('.option')){
                // xu li khi click vao bai hat trong playlist
                if(songNode){
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                }
            }
        }
        // bat/ tat random
        btnRandom.onclick = function(){
            _this.isRandom = !_this.isRandom
            this.classList.toggle('active', _this.isRandom)
        }
        // xu ly lap lai 1 bai hat
        btnRepeat.onclick = function(){
            _this.isRepeat = !_this.isRepeat
            this.classList.toggle('active', _this.isRepeat)
        }
    },
    scrollToActiveSong: function(){
        setTimeout(()=>{
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            })
        },300)
    },
    loadCurrentSong: function(){
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${ this.currentSong.image}')`
        audio.src = this.currentSong.path
    },
    nextSong: function(){
        this.currentIndex++
        if(this.currentIndex >= this.songs.length){
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong: function(){
        this.currentIndex--
        console.log(this.currentIndex)
        if(this.currentIndex < 0){
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },
    playRandom: function(){
        let newIndex
        do{
            newIndex = Math.floor(Math.random() * this.songs.length)
        }while(newIndex === this.currentIndex)

        this.currentIndex = newIndex
        this.loadCurrentSong()
    },
    start: function(){
        // define property for Object
        this.defineProperties()
        // handle Events
        this.handelEvents()
        // upload the first song in UI
        this.loadCurrentSong()
        // render playlist on Web by html
        this.render()
    }
}
app.start()



