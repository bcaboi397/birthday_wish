/**
 * ✨ HAPPY BIRTHDAY SHRISHTY — ROMANTIC PRESENTATION ENGINE
 * Auto-playing cinematic slideshow. No controls — just pure romance.
 */
(function () {
    'use strict';

    const CONFIG = window.BIRTHDAY_CONFIG || {
        presentation: { autoPlay: true, autoPlayDelay: 5500, transitionDuration: 1000, loopSlides: true, backgroundMusic: true },
        audio: { backgroundMusic: "audio/birthday-song.mp3" },
        filmPhotos: []
    };
    let currentSlide = 0;
    let totalSlides = 0;
    let autoPlayTimer = null;
    let isMusicPlaying = false;
    let bgMusic = null;
    let isTransitioning = false;

    // LOADING
    function initLoading() {
        const loader = document.getElementById('loading-screen');
        window.addEventListener('load', () => {
            setTimeout(() => {
                loader.classList.add('hidden');
                setTimeout(() => goToSlide(0), 300);
            }, 2500);
        });
        setTimeout(() => {
            loader.classList.add('hidden');
            setTimeout(() => goToSlide(0), 300);
        }, 5000);
    }

    // SLIDES
    function initSlides() {
        totalSlides = document.querySelectorAll('.slide').length;
    }

    function goToSlide(index) {
        if (isTransitioning) return;
        isTransitioning = true;
        const slides = document.querySelectorAll('.slide');
        slides[currentSlide].classList.remove('active');
        currentSlide = index;
        if (currentSlide >= totalSlides) currentSlide = 0;
        if (currentSlide < 0) currentSlide = totalSlides - 1;
        slides[currentSlide].classList.add('active');
        setTimeout(() => { isTransitioning = false; }, CONFIG.presentation.transitionDuration);
    }

    function nextSlide() { goToSlide(currentSlide + 1); }

    // AUTO-PLAY
    function initAutoPlay() {
        if (!CONFIG.presentation.autoPlay) return;
        autoPlayTimer = setInterval(() => { nextSlide(); }, CONFIG.presentation.autoPlayDelay);
    }

    // MUSIC
    function initMusic() {
        bgMusic = document.getElementById('bg-music');
        if (!bgMusic) return;
        bgMusic.volume = 0.3;
        document.addEventListener('click', function firstClick() {
            if (CONFIG.presentation.backgroundMusic) {
                bgMusic.play().then(() => { isMusicPlaying = true; }).catch(() => {});
            }
            document.removeEventListener('click', firstClick);
        }, { once: true });
    }

    // PARTICLES
    function initParticles() {
        const canvas = document.getElementById('particle-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let particles = [];
        function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
        resize();
        window.addEventListener('resize', resize);
        class Particle {
            constructor() { this.reset(); }
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2.5 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.4;
                this.speedY = (Math.random() - 0.5) * 0.4;
                this.opacity = Math.random() * 0.4 + 0.1;
                this.flicker = Math.random() * 0.02 + 0.01;
                this.color = Math.random() > 0.5 ? '212,165,116' : '232,160,180';
            }
            update() {
                this.x += this.speedX; this.y += this.speedY;
                this.opacity += Math.sin(Date.now() * this.flicker) * 0.01;
                this.opacity = Math.max(0.05, Math.min(0.5, this.opacity));
                if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
            }
            draw() {
                ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(' + this.color + ',' + this.opacity + ')'; ctx.fill();
            }
        }
        for (let i = 0; i < 50; i++) particles.push(new Particle());
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => { p.update(); p.draw(); });
            requestAnimationFrame(animate);
        }
        animate();
    }

    // FILM STRIPS
    function initFilmStrips() {
        const photos = CONFIG.filmPhotos;
        if (!photos || photos.length === 0) return;
        const leftTrack = document.getElementById('film-left');
        const rightTrack = document.getElementById('film-right');
        function createFrames(track) {
            let html = '';
            for (let i = 0; i < 20; i++) {
                const photo = photos[i % photos.length];
                html += '<div class="film-frame"><img src="' + photo + '" alt="Film photo" loading="lazy"></div>';
            }
            track.innerHTML = html;
        }
        createFrames(leftTrack);
        createFrames(rightTrack);
    }

    // MEMORIES LOOP
    function initMemoriesLoop() {
        const track = document.getElementById('film-reel-track');
        if (!track) return;
        track.innerHTML = track.innerHTML + track.innerHTML;
    }

    // INIT
    document.addEventListener('DOMContentLoaded', () => {
        initLoading();
        initSlides();
        initAutoPlay();
        initMusic();
        initParticles();
        initFilmStrips();
        initMemoriesLoop();
    });
})();