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
    let canvas = null;
    let ctx = null;
    let pinCode = '';
    const CORRECT_PIN = '143';

    // LOADING
    function initLoading() {
        const loader = document.getElementById('loading-screen');
        window.addEventListener('load', () => {
            setTimeout(() => {
                loader.classList.add('hidden');
                setTimeout(() => showPinScreen(), 600);
            }, 2500);
        });
        setTimeout(() => {
            loader.classList.add('hidden');
            setTimeout(() => showPinScreen(), 600);
        }, 5000);
    }

    // PIN SCREEN
    function showPinScreen() {
        const pinScreen = document.getElementById('pin-screen');
        if (pinScreen) {
            pinScreen.style.display = 'flex';
            pinScreen.classList.remove('hidden');
        }
    }

    function hidePinScreen() {
        const pinScreen = document.getElementById('pin-screen');
        if (pinScreen) {
            pinScreen.classList.add('hidden');
        }
    }

    function updatePinDots() {
        for (let i = 0; i < 3; i++) {
            const dot = document.getElementById('dot-' + i);
            if (dot) {
                if (i < pinCode.length) {
                    dot.classList.add('filled');
                } else {
                    dot.classList.remove('filled');
                }
            }
        }
    }

    function showPinError() {
        const error = document.getElementById('pin-error');
        if (error) {
            error.classList.add('show');
            setTimeout(() => error.classList.remove('show'), 2000);
        }
    }

    function triggerCelebrationConfetti() {
        const colors = ['#ff6b9d', '#c44dff', '#ffd700', '#ff4757', '#2ed573', '#1e90ff', '#ff6348', '#ffa502', '#ff69b4', '#00d2ff'];
        for (let burst = 0; burst < 8; burst++) {
            setTimeout(() => {
                const x = Math.random() * window.innerWidth;
                const y = Math.random() * (window.innerHeight * 0.5);
                for (let i = 0; i < 60; i++) {
                    confettiParticles.push({
                        x: x,
                        y: y,
                        size: Math.random() * 10 + 4,
                        speedX: (Math.random() - 0.5) * 18,
                        speedY: (Math.random() - 0.8) * 16,
                        rotation: Math.random() * 360,
                        rotationSpeed: (Math.random() - 0.5) * 20,
                        color: colors[Math.floor(Math.random() * colors.length)],
                        opacity: 1,
                        gravity: 0.3,
                        friction: 0.985,
                        shape: Math.random() > 0.4 ? 'rect' : 'circle'
                    });
                }
            }, burst * 200);
        }
    }

    function initPinPad() {
        const buttons = document.querySelectorAll('.pin-btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                const num = btn.getAttribute('data-num');
                if (num === 'C') {
                    pinCode = '';
                    updatePinDots();
                } else if (num === 'OK') {
                    if (pinCode === CORRECT_PIN) {
                        hidePinScreen();
                        triggerCelebrationConfetti();
                        setTimeout(() => startMainExperience(), 1200);
                    } else {
                        pinCode = '';
                        updatePinDots();
                        showPinError();
                    }
                } else {
                    if (pinCode.length < 3) {
                        pinCode += num;
                        updatePinDots();
                    }
                }
            });
        });
    }

    function startMainExperience() {
        goToSlide(0);
        initAutoPlay();
        initVideoAndMusic();
        initFilmStrips();
        initMemoriesLoop();
    }

    // VIDEO + MUSIC SYNC
    function initVideoAndMusic() {
        const bgVideo = document.getElementById('bg-video');
        bgMusic = document.getElementById('bg-music');
        if (!bgMusic) return;
        bgMusic.volume = 0.4;
        if (bgVideo) {
            bgVideo.muted = true;
            const playPromise = bgVideo.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    if (CONFIG.presentation.backgroundMusic && bgMusic) {
                        bgMusic.play().then(() => { isMusicPlaying = true; }).catch(() => {});
                    }
                }).catch(() => {
                    // If video fails, still try music
                    if (CONFIG.presentation.backgroundMusic && bgMusic) {
                        bgMusic.play().then(() => { isMusicPlaying = true; }).catch(() => {});
                    }
                });
            }
        }
        function tryPlayMusic() {
            if (CONFIG.presentation.backgroundMusic && bgMusic && bgMusic.paused) {
                bgMusic.play().then(() => { isMusicPlaying = true; }).catch(() => {});
            }
        }
        document.addEventListener('click', tryPlayMusic);
        document.addEventListener('touchstart', tryPlayMusic);
        document.addEventListener('keydown', tryPlayMusic);
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
        bgMusic.volume = 0.4;
        function tryPlayMusic() {
            if (CONFIG.presentation.backgroundMusic && bgMusic && bgMusic.paused) {
                bgMusic.play().then(() => { isMusicPlaying = true; }).catch(() => {});
            }
        }
        // Try to play immediately (PIN unlock counts as user gesture)
        tryPlayMusic();
        document.addEventListener('click', tryPlayMusic);
        document.addEventListener('touchstart', tryPlayMusic);
        document.addEventListener('keydown', tryPlayMusic);
    }

    // CONFETTI
    const confettiParticles = [];
    function spawnConfetti(x, y) {
        const colors = ['#ff6b9d', '#c44dff', '#ffd700', '#ff4757', '#2ed573', '#1e90ff', '#ff6348', '#ffa502'];
        for (let i = 0; i < 40; i++) {
            confettiParticles.push({
                x: x,
                y: y,
                size: Math.random() * 8 + 4,
                speedX: (Math.random() - 0.5) * 12,
                speedY: (Math.random() - 0.8) * 14,
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 15,
                color: colors[Math.floor(Math.random() * colors.length)],
                opacity: 1,
                gravity: 0.35,
                friction: 0.98,
                shape: Math.random() > 0.5 ? 'rect' : 'circle'
            });
        }
    }
    function updateConfetti() {
        for (let i = confettiParticles.length - 1; i >= 0; i--) {
            const p = confettiParticles[i];
            p.speedY += p.gravity;
            p.speedX *= p.friction;
            p.speedY *= p.friction;
            p.x += p.speedX;
            p.y += p.speedY;
            p.rotation += p.rotationSpeed;
            p.opacity -= 0.008;
            if (p.opacity <= 0 || p.y > canvas.height + 50) {
                confettiParticles.splice(i, 1);
            }
        }
    }
    function drawConfetti() {
        confettiParticles.forEach(p => {
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation * Math.PI / 180);
            ctx.globalAlpha = Math.max(0, p.opacity);
            ctx.fillStyle = p.color;
            if (p.shape === 'rect') {
                ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
            } else {
                ctx.beginPath();
                ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
        });
    }
    function initConfetti() {
        document.addEventListener('click', function (e) {
            spawnConfetti(e.clientX, e.clientY);
        });
        document.addEventListener('touchstart', function (e) {
            const touch = e.touches[0];
            if (touch) spawnConfetti(touch.clientX, touch.clientY);
        });
    }

    // PARTICLES
    function initParticles() {
        canvas = document.getElementById('particle-canvas');
        if (!canvas) return;
        ctx = canvas.getContext('2d');
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
            updateConfetti();
            drawConfetti();
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
        initParticles();
        initConfetti();
        initPinPad();
    });
})();