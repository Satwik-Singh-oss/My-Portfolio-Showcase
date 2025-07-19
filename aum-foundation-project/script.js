// This is a wrapper to ensure all code runs after the page is ready.
(function($) {
    $(document).ready(function() {

        // ======================================================
        // ===== 1. HERO SECTION SCRIPT =====
        // ======================================================
        var $heroSection = $('#aum-hero-section');
        if ($heroSection.length) {
            var $heroTitle = $('.hero-title');
            if($heroTitle.length && !$heroTitle.hasClass('words-animated')) {
                var text = $heroTitle.text();
                var words = text.split(' ');
                $heroTitle.html('');
                $.each(words, function(i, word) {
                    var delay = (i * 0.2) + 0.2;
                    $('<span>').text(word).css('animation-delay', delay + 's').appendTo($heroTitle);
                    $heroTitle.append(' ');
                });
                $heroTitle.addClass('words-animated');
            }

            if ($heroSection.find('.hero-video-bg').length === 0) {
                var videoURL = 'https://theaumfoundation.com/wp-content/uploads/2025/07/12721449_1920_1080_60fps.mp4';
                var videoElement = '<video autoplay muted loop playsinline class="hero-video-bg"><source src="' + videoURL + '" type="video/mp4"></video>';
                var auroraElement = '<div class="aurora-overlay"></div>';
                $heroSection.prepend(auroraElement);
                $heroSection.prepend(videoElement);
            }

            const canvas = document.getElementById('particle-canvas');
            if(canvas) {
                const ctx = canvas.getContext('2d');
                let particles = [];
                let aumSymbols = [];
                let mouse = { x: null, y: null, radius: 150 };

                window.addEventListener('mousemove', function(event) {
                    mouse.x = event.clientX;
                    mouse.y = event.clientY;
                });
                window.addEventListener('mouseleave', function() {
                    mouse.x = null;
                    mouse.y = null;
                });

                function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
                resizeCanvas();

                class Particle {
                    constructor() {
                        this.x = Math.random() * canvas.width;
                        this.y = Math.random() * canvas.height;
                        this.baseX = this.x; this.baseY = this.y;
                        this.density = (Math.random() * 30) + 1;
                        this.radius = Math.random() * 1.5 + 0.5;
                        this.color = 'rgba(255, 215, 100, ' + (Math.random() * 0.5 + 0.2) + ')';
                    }
                    draw() {
                        ctx.beginPath(); ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                        ctx.closePath(); ctx.fillStyle = this.color; ctx.fill();
                    }
                    update() {
                        let dx = mouse.x - this.x;
                        let dy = mouse.y - this.y;
                        let distance = Math.sqrt(dx * dx + dy * dy);
                        let forceDirectionX = dx / distance;
                        let forceDirectionY = dy / distance;
                        let maxDistance = mouse.radius;
                        let force = (maxDistance - distance) / maxDistance;
                        let directionX = 0, directionY = 0;

                        if (distance < mouse.radius) {
                            directionX = -(forceDirectionX * force * this.density);
                            directionY = -(forceDirectionY * force * this.density);
                        } else {
                            if (this.x !== this.baseX) { let dx = this.x - this.baseX; this.x -= dx / 10; }
                            if (this.y !== this.baseY) { let dy = this.y - this.baseY; this.y -= dy / 10; }
                        }
                        this.x += directionX; this.y += directionY;
                    }
                }

                function createAumSymbol() {
                    aumSymbols.push({ 
                        x: Math.random() * canvas.width, 
                        y: Math.random() * canvas.height, 
                        size: Math.random() * 30 + 30,
                        opacity: Math.random() * 0.2, 
                        fadeSpeed: Math.random() * 0.002 + 0.001, 
                        fadingIn: true, 
                        maxOpacity: Math.random() * 0.3 + 0.5,
                        rotation: Math.random() * 360, 
                        rotationSpeed: (Math.random() - 0.5) * 0.1 
                    });
                }

                function initCanvasObjects() {
                    particles = []; aumSymbols = [];
                    let numberOfParticles = (canvas.width * canvas.height) / 15000;
                    for (let i = 0; i < numberOfParticles; i++) particles.push(new Particle());
                    for (let i = 0; i < 8; i++) createAumSymbol();
                }

                function animateCanvas() {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    particles.forEach(p => { p.update(); p.draw(); });
                    aumSymbols.forEach(aum => {
                            if (aum.fadingIn) { aum.opacity += aum.fadeSpeed; if (aum.opacity >= aum.maxOpacity) aum.fadingIn = false; } else { aum.opacity -= aum.fadeSpeed; if (aum.opacity <= 0) { aum.x = Math.random() * canvas.width; aum.y = Math.random() * canvas.height; aum.opacity = 0; aum.fadingIn = true; } }
                        ctx.save(); ctx.translate(aum.x, aum.y); ctx.rotate(aum.rotation * Math.PI / 180); ctx.font = `${aum.size}px Playfair Display`; ctx.fillStyle = `rgba(255, 215, 130, ${aum.opacity})`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('ॐ', 0, 0); ctx.restore();
                    });
                    requestAnimationFrame(animateCanvas);
                }
                
                initCanvasObjects();
                animateCanvas();
                window.addEventListener('resize', () => { resizeCanvas(); initCanvasObjects(); });
            }
            
            var $contentWrapper = $('.hero-content-wrapper');
            var $canvas = $('#particle-canvas');
            if($contentWrapper.length) {
                $heroSection.on('mousemove', function(e) {
                    var rect = this.getBoundingClientRect(),
                        x = e.clientX - rect.left, y = e.clientY - rect.top,
                        centerX = rect.width / 2, centerY = rect.height / 2,
                        rotateX = (y - centerY) / centerY * -5,
                        rotateY = (x - centerX) / centerX * 5;
                    
                    $contentWrapper.css('transform', `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`);
                    $canvas.css('transform', `rotateX(${-rotateX / 2}deg) rotateY(${-rotateY / 2}deg)`);

                    this.style.setProperty('--mouse-x', x + "px");
                    this.style.setProperty('--mouse-y', y + "px");
                });
                $heroSection.on('mouseleave', function() {
                    $contentWrapper.css('transform', 'rotateX(0deg) rotateY(0deg)');
                    $canvas.css('transform', 'rotateX(0deg) rotateY(0deg)');
                });
            }

            function handleMagneticEffect(e, $element) {
                const rect = $element[0].getBoundingClientRect();
                const strength = 40;
                const x = (e.clientX - rect.left - rect.width / 2) / rect.width * strength;
                const y = (e.clientY - rect.top - rect.height / 2) / rect.height * strength;
                $element.css('transform', `translate(${x}px, ${y}px)`);
            }

            $('.hero-btn').on('mousemove', function(e) {
                handleMagneticEffect(e, $(this));
            }).on('mouseleave', function() {
                 $(this).css('transform', 'translate(0, 0)');
            });

            function handleScrollAnimation() {
                const scrollY = window.scrollY;
                const heroHeight = $heroSection.outerHeight();
                const scrollPercent = scrollY / (heroHeight / 2);
                
                if (scrollPercent <= 1) {
                    $heroSection.css('opacity', 1 - scrollPercent);
                    $('.hero-title').css('transform', `translateY(${scrollY * 0.5}px)`);
                    $('.hero-subtitle').css('transform', `translateY(${scrollY * 0.3}px)`);
                    $('.hero-buttons').css('transform', `translateY(${scrollY * 0.2}px)`);
                }
            }
            
            $(window).on('scroll', handleScrollAnimation);
        }

        // ======================================================
        // ===== 2. MISSION & VISION SCRIPT =====
        // ======================================================
        const mvSection = document.querySelector('#mv-section');
        if (mvSection) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('section-visible');
                    }
                });
            }, { threshold: 0.2 });
            observer.observe(mvSection);
        }
        $('.mv-column').on('mousemove', function(e) {
            let rect = this.getBoundingClientRect();
            let x = e.clientX - rect.left;
            let y = e.clientY - rect.top;
            let centerX = rect.width / 2;
            let centerY = rect.height / 2;
            
            let rotateX = (y - centerY) / centerY * -8;
            let rotateY = (x - centerX) / centerX * 8;
            $(this).css('transform', `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`);

            this.style.setProperty('--mouse-x', x + 'px');
            this.style.setProperty('--mouse-y', y + 'px');

        }).on('mouseleave', function() {
            $(this).css('transform', 'perspective(1000px) rotateX(0deg) rotateY(0deg)');
        });
        
        // ======================================================
        // ===== 3. PILLARS OF SEVA SCRIPT =====
        // ======================================================
        function initFinalUnveilingScript() {
            const section = document.getElementById('pillars-ultimate-section');
            const canvas = document.getElementById('pillars-particle-canvas');
            if (section && canvas) {
                const ctx = canvas.getContext('2d');
                let particles = []; let hue = 25;
                const setCanvasSize = () => { canvas.width = section.offsetWidth; canvas.height = section.offsetHeight; };
                setCanvasSize();
                class Particle { constructor(x,y){this.x=x;this.y=y;this.size=Math.random()*2.5+1;this.speedX=(Math.random()-.5)*1.5;this.speedY=(Math.random()-.5)*1.5;this.color=`hsl(${hue},100%,70%)`;this.life=1}update(){this.x+=this.speedX;this.y+=this.speedY;if(this.size>0.1)this.size-=0.03;this.life-=0.02}draw(){ctx.globalAlpha=this.life;ctx.fillStyle=this.color;ctx.beginPath();ctx.arc(this.x,this.y,this.size,0,Math.PI*2);ctx.fill()}}
                function animateParticles(){ctx.clearRect(0,0,canvas.width,canvas.height);for(let i=0;i<particles.length;i++){particles[i].update();particles[i].draw();if(particles[i].life<=0||particles[i].size<=0.1){particles.splice(i,1);i--}}ctx.globalAlpha=1;requestAnimationFrame(animateParticles)}
                animateParticles();
                section.addEventListener('mousemove',(e)=>{const rect=section.getBoundingClientRect();const mouseX=e.clientX-rect.left;const mouseY=e.clientY-rect.top;for(let i=0;i<2;i++){particles.push(new Particle(mouseX,mouseY))}hue=(hue+1)%360});
                window.addEventListener('resize', setCanvasSize);
            }

            const unveilSound = new Audio('https://cdn.pixabay.com/audio/2022/02/08/audio_3338b10556.mp3'); 
            unveilSound.volume = 0.3;

            $('.pillar-card-unveil').off('click.unveil').on('click.unveil', function() {
                const $this = $(this);
                const wasActive = $this.hasClass('active');

                if ($('.pillar-card-unveil.active').length > 0 && !$this.hasClass('active')) {
                     $('.pillar-card-unveil.active').removeClass('active');
                     setTimeout(function() {
                         openCard($this);
                     }, 800); 
                } else if (wasActive) {
                    $this.removeClass('active');
                } else {
                    openCard($this);
                }
            });

            function openCard($card) {
                $card.addClass('active');
                unveilSound.currentTime = 0;
                unveilSound.play().catch(e => {});
                var mantraText = $card.data('mantra');
                $card.find('.unveiled-mantra').text(mantraText);
            }
        }
        initFinalUnveilingScript();

        // ======================================================
        // ===== 4. SACRED PROJECTS SCRIPT =====
        // ======================================================
        function initNextLevelProjects() {
            const grid = $('.projects-focus-grid');
            const cards = $('.project-focus-card');
            const header = $('.projects-header-final');

            const observer = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const el = $(entry.target);
                        const delay = el.is('.project-focus-card') ? (el.index() * 150) : 0;
                        
                        setTimeout(() => {
                            el.addClass('is-visible');
                        }, delay);

                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });

            if(header.length) observer.observe(header[0]);
            cards.each(function() {
                observer.observe(this);
            });

            grid.on('mouseenter', function() {
                grid.addClass('has-mouse');
            }).on('mouseleave', function() {
                grid.removeClass('has-mouse');
            }).on('mousemove', function(e) {
                const rect = grid[0].getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                grid.css('--mouse-x', `${x}px`);
                grid.css('--mouse-y', `${y}px`);
            });

            cards.each(function() {
                const card = $(this);
                card.on('mousemove', function(e) {
                    const rect = card[0].getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;
                    
                    const rotateX = (y - centerY) / centerY * -8;
                    const rotateY = (x - centerX) / centerX * 8;
                    
                    card.css('transform', `scale(1.03) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`);

                }).on('mouseleave', function() {
                    card.css('transform', 'scale(1) rotateX(0deg) rotateY(0deg)');
                });
            });
        }
        initNextLevelProjects();

    }); // End of jQuery $(document).ready

    // ======================================================
    // ===== SECTIONS WITH VANILLA JS (NO JQUERY) =====
    // ======================================================
    
    // ===== 5. ORBIT CTA SCRIPT =====
    const orbitContainer = document.querySelector('.orbit-container');
    if (orbitContainer) {
        const items = document.querySelectorAll('.orbit-item');
        const totalItems = items.length;
        let speed = 0.0012; 
        let angle = 0;
        const radiusX = window.innerWidth < 600 ? 200 : 350; 
        const radiusY = window.innerWidth < 600 ? 120 : 180; 

        items.forEach(item => { item.lastX = 0; item.lastY = 0; });

        function animateOrbit() {
            angle += speed;
            items.forEach((item, index) => {
                if (!item.isHovered) {
                    const itemAngle = angle + (index * (Math.PI * 2 / totalItems));
                    const x = Math.cos(itemAngle) * radiusX;
                    const y = Math.sin(itemAngle) * radiusY;
                    item.lastX = x; item.lastY = y;
                    item.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) scale(1)`;
                }
            });
            requestAnimationFrame(animateOrbit);
        }

        items.forEach(item => {
            item.addEventListener('mouseover', () => {
                item.isHovered = true;
                item.style.transform = `translate(${item.lastX}px, ${item.lastY}px) translate(-50%, -50%) scale(1.15)`;
            });
            item.addEventListener('mouseout', () => { item.isHovered = false; });
        });
        animateOrbit();
    }

    // ===== 6. NEWSLETTER SCRIPT (V2 - THE CORRECT ONE) =====
    const newsletterV2 = document.querySelector('.divine-newsletter-section-v2');
    if (newsletterV2 && !newsletterV2.classList.contains('js-initialized')) {
        newsletterV2.classList.add('js-initialized');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    newsletterV2.classList.add('is-visible');
                    observer.unobserve(newsletterV2);
                }
            });
        }, { threshold: 0.2 });
        observer.observe(newsletterV2);

        const symbols = newsletterV2.querySelectorAll('.divine-symbols-bg-v2 .symbol');
        const formCard = newsletterV2.querySelector('.lotus-form-container-v2');

        newsletterV2.addEventListener('mousemove', function(e) {
            const rect = newsletterV2.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const moveX = (e.clientX - centerX) / centerX;
            const moveY = (e.clientY - centerY) / centerY;

            symbols.forEach(symbol => {
                const depth = symbol.getAttribute('data-depth');
                const x = -(moveX * 40 * depth);
                const y = -(moveY * 40 * depth);
                symbol.style.transform = `translate(${x}px, ${y}px)`;
            });

            const cardRect = formCard.getBoundingClientRect();
            if (e.clientX >= cardRect.left && e.clientX <= cardRect.right && e.clientY >= cardRect.top && e.clientY <= cardRect.bottom) {
                const cardCenterX = cardRect.left + cardRect.width / 2;
                const cardCenterY = cardRect.top + cardRect.height / 2;
                const rotateX = (e.clientY - cardCenterY) / cardCenterY * -8;
                const rotateY = (e.clientX - cardCenterX) / cardCenterX * 8;
                formCard.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            } else {
                 formCard.style.transform = 'rotateX(0deg) rotateY(0deg)';
            }
        });

        newsletterV2.addEventListener('mouseleave', function() {
            formCard.style.transform = 'rotateX(0deg) rotateY(0deg)';
        });

        const button = newsletterV2.querySelector('.subscribe-button-v2');
        button.addEventListener('click', function(e) {
            e.preventDefault();
            if (button.classList.contains('loading') || button.classList.contains('success')) return;
            button.classList.add('loading');

            setTimeout(() => {
                button.classList.remove('loading');
                button.classList.add('success');
                setTimeout(() => { button.classList.remove('success'); }, 2000);
            }, 1500);
        });
    }

    // ===== 7. FOOTER SCRIPT with Tone.js =====
    const footerElement = document.getElementById('divya-footer-final-version');
    if (footerElement && typeof Tone !== 'undefined') {
        const omSoundPlayer = new Tone.Player({ url: "https://theaumfoundation.com/wp-content/uploads/2025/07/om_chanting.mp3", loop: false }).toDestination();
        const bellSoundSynth = new Tone.MetalSynth({ frequency: 300, envelope: { attack: 0.001, decay: 0.4, release: 0.2 }, harmonicity: 5.1, modulationIndex: 32, resonance: 4000, octaves: 1.5 }).toDestination();
        
        footerElement.querySelectorAll('.social-icon-bell-final').forEach(icon => {
            icon.addEventListener('mouseenter', () => {
                if (Tone.context.state !== 'running') { Tone.start(); }
                bellSoundSynth.triggerAttackRelease("C5", "8n", Tone.now());
            });
        });

        const mainAumSymbolContainer = footerElement.querySelector('.divya-aum-container-final');
        if(mainAumSymbolContainer) {
            mainAumSymbolContainer.addEventListener('click', function() {
                if (Tone.context.state !== 'running') { Tone.start(); }
                if (this.classList.contains('activated')) { this.classList.remove('activated'); }
                void this.offsetWidth; this.classList.add('activated');
                if (omSoundPlayer.loaded) { (omSoundPlayer.state === 'started') ? omSoundPlayer.stop() : omSoundPlayer.start(); }
            });
        }
    }

})(jQuery);