// A wrapper to ensure all code runs after the page is fully loaded.
document.addEventListener('DOMContentLoaded', function() {

    // ===================================================================
    // ===== 1. HERO SECTION (THREE.JS) =====
    // This part is self-executing and uses the three.js library.
    // ===================================================================
    (() => {
        if (typeof THREE === 'undefined') {
            console.error("Three.js library is not loaded.");
            return;
        }
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        const container = document.getElementById('canvas-container-v4');
        if (!container) return;

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(renderer.domElement);

        const geometry = new THREE.IcosahedronGeometry(1.6, 5);
        const material = new THREE.MeshStandardMaterial({
            color: 0xffffff, metalness: 0.6, roughness: 0.3, wireframe: true, transparent: true, opacity: 0.25
        });
        const orb = new THREE.Mesh(geometry, material);
        scene.add(orb);

        const coreGeometry = new THREE.SphereGeometry(0.7, 32, 32);
        const coreMaterial = new THREE.MeshBasicMaterial({ color: 0xF58220 });
        const core = new THREE.Mesh(coreGeometry, coreMaterial);
        scene.add(core);

        const pointLight = new THREE.PointLight(0xF58220, 3, 12);
        pointLight.position.set(0, 0, 0);
        scene.add(pointLight);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
        scene.add(ambientLight);
        camera.position.z = 5;

        const mouse = { x: 0, y: 0 };
        document.addEventListener('mousemove', (event) => {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        }, false);

        const clock = new THREE.Clock();
        function animate() {
            requestAnimationFrame(animate);
            const elapsedTime = clock.getElapsedTime();
            orb.rotation.y = elapsedTime * 0.1;
            orb.rotation.x = elapsedTime * 0.05;
            const pulse = Math.sin(elapsedTime * 1.2) * 0.15 + 0.9;
            core.scale.set(pulse, pulse, pulse);
            pointLight.intensity = pulse * 3;
            camera.position.x += (mouse.x * 0.8 - camera.position.x) * 0.04;
            camera.position.y += (mouse.y * 0.8 - camera.position.y) * 0.04;
            camera.lookAt(scene.position);
            renderer.render(scene, camera);
        }
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
        animate();
    })();


    // ===================================================================
    // ===== 2. HEADER SCRIPT =====
    // ===================================================================
    const header = document.getElementById('bff-aurora-header');
    if (header) {
        const nav = document.getElementById('bff-main-nav');
        const navLinks = document.querySelectorAll('.bff-nav-link');
        const menuToggle = document.getElementById('bff-menu-toggle');
        
        // Smooth scroll for nav links
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId && targetId.startsWith('#')) {
                    e.preventDefault();
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        const headerHeight = header.offsetHeight;
                        const targetPosition = targetElement.offsetTop - headerHeight;
                        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
                    }
                }
            });
        });

        // Mobile menu toggle
        if (menuToggle && nav) {
            menuToggle.addEventListener('click', function() {
                this.classList.toggle('open');
                nav.classList.toggle('open');
            });
            nav.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', function() {
                    if (nav.classList.contains('open')) {
                        menuToggle.classList.remove('open');
                        nav.classList.remove('open');
                    }
                });
            });
        }
        
        // Scrolled header effect
        window.addEventListener('scroll', function() {
            if (window.scrollY > 30) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
        
        // Active link highlighting on scroll
        const sections = document.querySelectorAll('.bff-showcase-section');
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    navLinks.forEach(link => {
                        const linkHref = link.getAttribute('href');
                        link.classList.remove('active');
                        if (linkHref && linkHref.includes('#' + id)) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, { rootMargin: '-40% 0px -60% 0px' });
        sections.forEach(section => { observer.observe(section); });
    }

    // ===================================================================
    // ===== 3. ABOUT US (ACCORDION) =====
    // ===================================================================
    const aboutSection = document.getElementById('about-us-section');
    if (aboutSection) {
        const accordionItems = aboutSection.querySelectorAll('.bff-accordion-item');
        accordionItems.forEach(item => {
            const header = item.querySelector('.bff-accordion-header');
            header.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                accordionItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.bff-accordion-content').style.maxHeight = null;
                    otherItem.querySelector('.bff-accordion-icon').textContent = '+';
                });
                if (!isActive) {
                    item.classList.add('active');
                    const content = item.querySelector('.bff-accordion-content');
                    content.style.maxHeight = content.scrollHeight + "px";
                    item.querySelector('.bff-accordion-icon').textContent = '−';
                }
            });
        });

        const discoverButton = document.querySelector('.hero-cta-button-v4');
        if (discoverButton) {
            discoverButton.addEventListener('click', function(e) {
                const targetAccordionItem = document.querySelector('#our-mission-item');
                if (targetAccordionItem) {
                    setTimeout(() => {
                        targetAccordionItem.querySelector('.bff-accordion-header').click();
                    }, 400); // Delay to allow for smooth scroll
                }
            });
        }
    }

    // ===================================================================
    // ===== 4. OUR BOARD (FLIP CARDS) =====
    // For touch devices, it adds a click-to-flip functionality.
    // ===================================================================
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0 || window.innerWidth <= 980) {
        const flipCards = document.querySelectorAll('#bff-our-board .bff-flip-card');
        flipCards.forEach(card => {
            card.addEventListener('click', function(event) {
                if (event.target.tagName === 'A') return;
                flipCards.forEach(otherCard => {
                    if (otherCard !== this) otherCard.classList.remove('flipped');
                });
                this.classList.toggle('flipped');
            });
        });
    }

    // ===================================================================
    // ===== 5. CORE VALUES (CANVAS GALAXY) =====
    // ===================================================================
    const valuesCanvas = document.getElementById('valuesCanvasV2');
    if (valuesCanvas) {
        const ctx = valuesCanvas.getContext('2d');
        const descriptionBox = document.getElementById('value-description-box-v2');
        const titleEl = document.getElementById('value-title-v2');
        const textEl = document.getElementById('value-text-v2');
        const closeBtn = document.getElementById('close-value-box-v2');
        
        let planets = [], particles = [], mouse = { x: undefined, y: undefined }, selectedPlanet = null;

        const coreValues = [
            { title: "Excellence", text: "Maintaining the highest standards in all our development and design programs.", color: '#FFD700' },
            { title: "Relevance", text: "Prioritizing practical, applicable skills that are in demand in the industry.", color: '#87CEEB' },
            { title: "Inclusion", text: "Creating pathways for individuals from all backgrounds to succeed in tech.", color: '#98FB98' },
            { title: "Collaboration", text: "Believing that strong partnerships are the key to sustainable innovation.", color: '#FFA07A' },
            { title: "Innovation", text: "Embracing emerging technologies and evolving industry best practices.", color: '#DDA0DD' },
            { title: "Impact", text: "Committing to demonstrating tangible outcomes through rigorous evaluation.", color: '#FF6347' }
        ];

        function resizeGalaxyCanvas() {
            const container = document.getElementById('canvas-wrapper');
            valuesCanvas.width = container.offsetWidth;
            valuesCanvas.height = container.offsetHeight;
            initGalaxy();
        }

        class Sun {
            constructor(x, y, radius) { this.x = x; this.y = y; this.radius = radius; this.baseRadius = radius; this.pulseAngle = 0; }
            draw() {
                this.pulseAngle += 0.02; this.radius = this.baseRadius + Math.sin(this.pulseAngle) * 3;
                const glow = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius * 2);
                glow.addColorStop(0, 'rgba(245, 130, 32, 0.8)'); glow.addColorStop(0.5, 'rgba(245, 130, 32, 0.3)'); glow.addColorStop(1, 'rgba(245, 130, 32, 0)');
                ctx.fillStyle = glow; ctx.fillRect(0,0,valuesCanvas.width, valuesCanvas.height);
                ctx.beginPath(); ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2); ctx.fillStyle = 'rgba(255, 220, 150, 1)'; ctx.fill();
            }
        }
        class Planet {
            constructor(x,y,r,c,or,vd){this.x=x;this.y=y;this.radius=r;this.color=c;this.orbitRadius=or;this.valueData=vd;this.angle=Math.random()*Math.PI*2;this.speed=.002+(Math.random()-.5)*.001;this.isHovered=!1}
            draw(){ctx.beginPath();ctx.arc(valuesCanvas.width/2,valuesCanvas.height/2,this.orbitRadius,0,2*Math.PI);ctx.strokeStyle="rgba(255,255,255,.05)";ctx.lineWidth=1;ctx.stroke();ctx.beginPath();const t=ctx.createRadialGradient(this.x-.2*this.radius,this.y-.2*this.radius,0,this.x,this.y,this.radius);t.addColorStop(0,"rgba(255,255,255,.4)"),t.addColorStop(.5,this.color),t.addColorStop(1,this.color),ctx.arc(this.x,this.y,this.radius,0,2*Math.PI),ctx.fillStyle=t,ctx.shadowColor=this.isHovered?this.color:"transparent",ctx.shadowBlur=this.isHovered?25:0,ctx.fill(),ctx.closePath(),ctx.shadowBlur=0}
            update(){this.angle+=this.speed,this.x=valuesCanvas.width/2+this.orbitRadius*Math.cos(this.angle),this.y=valuesCanvas.height/2+this.orbitRadius*Math.sin(this.angle),this.draw()}
        }
        class Particle{constructor(x,y,r){this.x=x,this.y=y,this.radius=r,this.baseAlpha=.1+Math.random()*.5,this.alpha=this.baseAlpha,this.twinkleSpeed=.01+Math.random()*.02}draw(){this.alpha=this.baseAlpha+Math.sin(Date.now()*this.twinkleSpeed)*this.baseAlpha,ctx.beginPath(),ctx.arc(this.x,this.y,this.radius,0,2*Math.PI),ctx.fillStyle=`rgba(255,255,255,${this.alpha})`,ctx.fill()}}
        
        let sun;
        function initGalaxy() {
            planets = []; particles = [];
            sun = new Sun(valuesCanvas.width / 2, valuesCanvas.height / 2, 15);
            const isMobile = window.innerWidth <= 767;
            const baseOrbit = isMobile ? 40 : 70; const orbitStep = isMobile ? 28 : 38;
            for (let i = 0; i < coreValues.length; i++) {
                planets.push(new Planet(0,0, isMobile ? 8 : 10, coreValues[i].color, baseOrbit + i * orbitStep, coreValues[i]));
            }
            for (let i = 0; i < 150; i++) {
                particles.push(new Particle(Math.random()*valuesCanvas.width,Math.random()*valuesCanvas.height,Math.random()*1.5));
            }
        }

        function animateGalaxy() {
            requestAnimationFrame(animateGalaxy);
            ctx.clearRect(0, 0, valuesCanvas.width, valuesCanvas.height);
            particles.forEach(p => p.draw());
            sun.draw();
            let hoveredPlanet = null;
            planets.forEach(planet => {
                planet.update();
                const dist = Math.hypot(mouse.x - planet.x, mouse.y - planet.y);
                planet.isHovered = dist < planet.radius + 10;
                if(planet.isHovered) hoveredPlanet = planet;
            });
            valuesCanvas.style.cursor = hoveredPlanet ? 'pointer' : 'default';
        }

        valuesCanvas.addEventListener('mousemove', (e) => {
            const rect = valuesCanvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left; mouse.y = e.clientY - rect.top;
        });
        valuesCanvas.addEventListener('click', () => {
            const currentlyHovered = planets.find(p => p.isHovered);
            if (currentlyHovered) {
                selectedPlanet = currentlyHovered;
                titleEl.textContent = currentlyHovered.valueData.title;
                textEl.textContent = currentlyHovered.valueData.text;
                descriptionBox.classList.add('visible');
            }
        });
        closeBtn.addEventListener('click', () => {
            descriptionBox.classList.remove('visible');
            selectedPlanet = null;
        });

        resizeGalaxyCanvas();
        animateGalaxy();
        window.addEventListener('resize', resizeGalaxyCanvas);
    }
    
    // ===================================================================
    // ===== 6. EVENTS TIMELINE =====
    // ===================================================================
    const timelineContainer = document.querySelector('#bff-upcoming-timeline');
    if (timelineContainer) {
        timelineContainer.querySelectorAll('.bff-timeline-item').forEach(item => {
            item.querySelector('.bff-event-card-wrapper').addEventListener('click', () => {
                const wasActive = item.classList.contains('active');
                timelineContainer.querySelectorAll('.bff-timeline-item').forEach(i => i.classList.remove('active'));
                if (!wasActive) item.classList.add('active');
            });
        });
    }

    // ===================================================================
    // ===== 7. IMPACT SLIDER =====
    // ===================================================================
    const sliderContainer = document.querySelector('.cinematic-slider-container');
    if (sliderContainer) {
        const slides = sliderContainer.querySelectorAll('.cinematic-slide');
        const nextBtn = document.getElementById('next-slide');
        const prevBtn = document.getElementById('prev-slide');
        let currentSlide = 0;
        function showSlide(index) {
            slides.forEach((slide) => slide.classList.remove('active'));
            slides[index].classList.add('active');
        }
        nextBtn.addEventListener('click', () => {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        });
        prevBtn.addEventListener('click', () => {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            showSlide(currentSlide);
        });
    }

    // ===================================================================
    // ===== 8. GALLERY & LIGHTBOX =====
    // ===================================================================
    const galleryItems = document.querySelectorAll('.gallery-item-v2');
    const lightbox = document.getElementById('bff-lightbox-v2');
    if (lightbox && galleryItems.length > 0) {
        const lightboxImg = document.getElementById('lightbox-v2-img');
        const lightboxTitle = document.getElementById('lightbox-v2-title');
        const closeBtn = document.getElementById('lightbox-v2-close');
        const prevBtn = document.getElementById('lightbox-v2-prev');
        const nextBtn = document.getElementById('lightbox-v2-next');
        let currentIndex;
        const showImage = (index) => {
            if(index < 0 || index >= galleryItems.length) return;
            const item = galleryItems[index];
            lightboxImg.src = item.getAttribute('data-src');
            lightboxTitle.textContent = item.getAttribute('data-title');
            currentIndex = index;
            prevBtn.style.display = (index === 0) ? 'none' : 'block';
            nextBtn.style.display = (index === galleryItems.length-1)?'none':'block';
        };
        galleryItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
                showImage(index);
            });
        });
        const closeLightbox = () => { lightbox.classList.remove('active'); document.body.style.overflow = 'auto'; };
        const showNext = () => showImage(currentIndex + 1);
        const showPrev = () => showImage(currentIndex - 1);
        closeBtn.addEventListener('click', closeLightbox);
        nextBtn.addEventListener('click', showNext);
        prevBtn.addEventListener('click', showPrev);
        lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('active')) {
                if(e.key==='Escape') closeLightbox(); if(e.key==='ArrowRight')showNext(); if(e.key==='ArrowLeft')showPrev();
            }
        });
    }
    
    // ===================================================================
    // ===== 9. TESTIMONIAL (NEURAL FLOW CANVAS) =====
    // ===================================================================
    const neuralCanvas = document.getElementById('neural-flow-canvas');
    if (neuralCanvas) {
        const n_ctx = neuralCanvas.getContext('2d');
        let n_parentCard = neuralCanvas.closest('.bff-testimonial-card-v3');
        let n_particles = []; let n_noise;
        const Perlin=new function(){this.p=new Uint8Array(512),this.init=function(){for(let t=0;t<256;t++)this.p[t]=t;for(let t=255;t>0;t--){let e=Math.floor(Math.random()*(t+1));[this.p[t],this.p[e]]=[this.p[e],this.p[t]]}for(let t=0;t<256;t++)this.p[t+256]=this.p[t]},this.init();const t=t=>t*t*t*(t*(6*t-15)+10),e=(t,e,i)=>e+t*(i-e),i=(t,e,i)=>{const s=15&t,h=s<8?e:i,a=s<4?i:12===s||14===s?e:0;return((1&s)==0?h:-h)+((2&s)==0?a:-a)};this.noise=(s,h)=>{const a=Math.floor(s)&255,r=Math.floor(h)&255;s-=Math.floor(s),h-=Math.floor(h);const n=t(s),o=t(h),c=this.p,l=c[a]+r,d=c[a+1]+r;return e(o,e(n,i(c[l],s,h),i(c[d],s-1,h)),e(n,i(c[l+1],s,h-1),i(c[d+1],s-1,h-1)))}}
        n_noise = Perlin.noise;
        function resizeNeuralCanvas(){neuralCanvas.width=n_parentCard.offsetWidth,neuralCanvas.height=n_parentCard.offsetHeight}
        class NeuralParticle{constructor(){this.x=Math.random()*neuralCanvas.width,this.y=Math.random()*neuralCanvas.height,this.vx=0,this.vy=0,this.life=100+Math.random()*50}update(t,e){const i=n_noise(this.x*t,this.y*t)*Math.PI*2;this.vx=Math.cos(i)*e,this.vy=Math.sin(i)*e,this.x+=this.vx,this.y+=this.vy,this.life--,this.x>neuralCanvas.width||this.x<0||this.y>neuralCanvas.height||this.y<0||this.life<=0&&(this.x=Math.random()*neuralCanvas.width,this.y=Math.random()*neuralCanvas.height,this.life=100+Math.random()*50)}draw(){n_ctx.fillStyle="rgba(245,130,32,.5)",n_ctx.beginPath(),n_ctx.arc(this.x,this.y,1,0,2*Math.PI),n_ctx.fill()}}
        function initNeural(){n_particles=[];let t=neuralCanvas.width*neuralCanvas.height/5e3;for(let e=0;e<t;e++)n_particles.push(new NeuralParticle)}
        function animateNeural(){n_ctx.fillStyle="rgba(17,24,39,.05)",n_ctx.fillRect(0,0,neuralCanvas.width,neuralCanvas.height),n_particles.forEach(t=>{t.update(.003,.5),t.draw()}),requestAnimationFrame(animateNeural)}
        resizeNeuralCanvas(),initNeural(),animateNeural();
        let resizeTimer; window.addEventListener("resize",function(){clearTimeout(resizeTimer),resizeTimer=setTimeout(()=>{resizeNeuralCanvas(),initNeural()},250)});
    }
    
    // ===================================================================
    // ===== 10. CONTACT FORM (MAGNETIC ITEMS & MAILT0) =====
    // ===================================================================
    const contactSection = document.getElementById('bff-contact-section');
    if (contactSection) {
        contactSection.addEventListener('mousemove', function(e) {
            const rect = contactSection.getBoundingClientRect();
            contactSection.style.setProperty('--mouse-x', (e.clientX-rect.left)+'px');
            contactSection.style.setProperty('--mouse-y', (e.clientY-rect.top)+'px');
        });
        const magneticItems = contactSection.querySelectorAll('.magnetic-item');
        magneticItems.forEach(item => {
            item.addEventListener('mousemove', function(e) {
                const rect = item.getBoundingClientRect();
                const moveX = (e.clientX-rect.left-rect.width/2)/3.5;
                const moveY = (e.clientY-rect.top-rect.height/2)/3.5;
                item.style.transform = `translate(${moveX}px, ${moveY}px)`;
                item.style.transition = 'transform .1s linear';
            });
            item.addEventListener('mouseleave', function() {
                item.style.transform = 'translate(0,0)';
                item.style.transition = 'transform .3s cubic-bezier(.175,.885,.32,1.275)';
            });
        });
        const form = document.getElementById('magic-contact-form-v5');
        if(form){form.addEventListener('submit',function(e){e.preventDefault();const name=document.getElementById("user-name-v5").value,email=document.getElementById("user-email-v5").value,msg=document.getElementById("user-message-v5").value;window.location.href=`mailto:info@example.com?subject=${encodeURIComponent("Message from "+name)}&body=${encodeURIComponent("Name: "+name+"\nEmail: "+email+"\n\nMessage:\n"+msg)}`})}
    }

    // ===================================================================
    // ===== 11. SPONSORS GRID (VANILLA TILT) =====
    // ===================================================================
     if (typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(document.querySelectorAll("#bff-magnetic-grid-section .bff-logo-item"), {
            glare: true, "max-glare": 0.2
        });
    }

}); // End of main DOMContentLoaded listener


// ===================================================================
// ===== JQUERY-DEPENDENT SCRIPTS (Must run after jQuery is loaded) =====
// ===================================================================
jQuery(document).ready(function($) {
    // FOOTER (WATER RIPPLES)
    const footerSection = $('#bff-final-footer');
    if (footerSection.length && typeof $.fn.ripples === 'function') {
        try {
            footerSection.ripples({
                resolution: 512, dropRadius: 20, perturbance: 0.04, interactive: true
            });
            
            const magneticItems = footerSection.find('.magnetic-content > *, .magnetic-content li');
            footerSection.on('mousemove', function(e) {
                const rect = this.getBoundingClientRect();
                const mouseX = e.clientX-rect.left, mouseY=e.clientY-rect.top;
                magneticItems.each(function() {
                    const item=$(this), itemRect=this.getBoundingClientRect(), itemCenterX=itemRect.left-rect.left+itemRect.width/2, itemCenterY=itemRect.top-rect.top+itemRect.height/2;
                    const dist=Math.sqrt(Math.pow(mouseX-itemCenterX,2)+Math.pow(mouseY-itemCenterY,2)), maxDist=250;
                    if(dist<maxDist){const moveX=(itemCenterX-mouseX)/5,moveY=(itemCenterY-mouseY)/5;item.css('transform',`translate(${moveX}px, ${moveY}px)`)}
                    else{item.css('transform','translate(0,0)')}
                });
            });
            footerSection.on('mouseleave',function(){magneticItems.css('transform','translate(0,0)')});

        } catch(e) { console.error("Could not apply ripples effect:", e); }
    }
});