/* ===================================================================
    PORTFOLIO - MASTER JAVASCRIPT FILE (THE ABSOLUTE FINAL VERSION 2.0)
    - "Data Waves" animation particle size reverted to original.
    - All other features are final and complete.
    =================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // --- HERO & MISSION & GSAP SCRIPTS ---
    (() => {
        if (typeof THREE === 'undefined' || window.threeJsInitialized) return;
        window.threeJsInitialized = true;
        let scene, camera, renderer, stars, starGeo;
        const container = document.getElementById('three-canvas');
        if (!container) return;
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 1, 1000);
        camera.position.z = 1; camera.rotation.x = Math.PI / 2;
        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(renderer.domElement);
        starGeo = new THREE.BufferGeometry();
        const starCount = 6000;
        const positions = new Float32Array(starCount * 3);
        for (let i = 0; i < starCount * 3; i++) { positions[i] = (Math.random() - 0.5) * 600; }
        starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        let sprite = new THREE.TextureLoader().load('https://i.imgur.com/y6t7f3S.png');
        let starMaterial = new THREE.PointsMaterial({ color: 0xaaaaaa, size: 0.7, map: sprite, transparent: true, blending: THREE.AdditiveBlending, });
        stars = new THREE.Points(starGeo, starMaterial);
        scene.add(stars);
        function onWindowResize() { if (!container) return; camera.aspect = container.clientWidth / container.clientHeight; camera.updateProjectionMatrix(); renderer.setSize(container.clientWidth, container.clientHeight); }
        window.addEventListener('resize', onWindowResize, false);
        let frame = 0;
        function animate() { if (!starGeo || !renderer) return; frame += 0.002; const positions = starGeo.attributes.position.array; for (let i = 0; i < positions.length; i += 3) { positions[i + 1] += Math.sin(frame + positions[i]) * 0.02; } starGeo.attributes.position.needsUpdate = true; stars.rotation.y += 0.0002; renderer.render(scene, camera); requestAnimationFrame(animate); }
        animate();
    })();
    (() => {
        if (window.vcvxMissionReimagined) return;
        window.vcvxMissionReimagined = true;
        const wrapper = document.getElementById('vcvx-mission-reimagined');
        const iconTrigger = document.querySelector('.mission-trigger-icon');
        if (wrapper && iconTrigger) { iconTrigger.addEventListener('click', () => { if (!wrapper.classList.contains('mission-triggered')) { wrapper.classList.add('mission-triggered'); } }, { once: true }); }
    })();
    (() => {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || window.vcvxGsapAnims) return;
        window.vcvxGsapAnims = true;
        gsap.registerPlugin(ScrollTrigger);
        // GSAP animation for "Why It Matters" section
        const mattersContainer = document.querySelector('.matters-container-final');
        if (mattersContainer) {
            const card1 = document.querySelector('#node-1'); const card2 = document.querySelector('#node-2');
            const card1Content = Array.from(card1.children); const card2Content = Array.from(card2.children);
            const tl = gsap.timeline({ scrollTrigger: { trigger: mattersContainer, start: "top 75%" } });
            if (window.innerWidth > 980) { tl.to(card1, { opacity: 1, rotateY: 0, duration: 1, ease: "power3.out" }).to(card2, { opacity: 1, rotateY: 0, duration: 1, ease: "power3.out" }, "-=0.8").to([...card1Content, ...card2Content], { opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out" }, "-=0.5"); }
            else { tl.to([card1, card2], { opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: "power3.out" }).to([...card1Content, ...card2Content], { opacity: 1, duration: 0.8, ease: "power3.out" }, "-=0.5"); }
            const quoteCard = document.querySelector('#node-2');
            if (quoteCard) { quoteCard.addEventListener('mousemove', e => { const rect = quoteCard.getBoundingClientRect(); const x = e.clientX - rect.left; const y = e.clientY - rect.top; quoteCard.style.setProperty('--x', `${x}px`); quoteCard.style.setProperty('--y', `${y}px`); }); }
        }
    })();
    
    // =================================================================
    // ===== "DATA WAVES" ANIMATION FOR "WHAT I BUILD" SECTION =====
    // =================================================================
    (() => {
        if (typeof THREE === 'undefined') return;

        const canvas = document.getElementById('data-waves-canvas');
        if (!canvas) return;

        const container = canvas.parentElement;
        let camera, scene, renderer, particles, geometry, material;
        let mouse = new THREE.Vector2(-100, -100);
        let count = 0;
        const numParticlesX = 70;
        const numParticlesZ = 70;
        const separation = 20;

        function init() {
            camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 1, 10000);
            camera.position.y = 250;
            camera.position.z = 380;

            scene = new THREE.Scene();

            const positions = [];
            const scales = [];
            let i = 0, j = 0;

            for (i = 0; i < numParticlesX; i++) {
                for (j = 0; j < numParticlesZ; j++) {
                    positions.push((i * separation) - ((numParticlesX * separation) / 2));
                    positions.push(0); // y position
                    positions.push((j * separation) - ((numParticlesZ * separation) / 2));
                    scales.push(1);
                }
            }
            
            geometry = new THREE.BufferGeometry();
            geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
            geometry.setAttribute('scale', new THREE.Float32BufferAttribute(scales, 1));

            material = new THREE.ShaderMaterial({
                uniforms: { color: { value: new THREE.Color(0x00E5FF) } },
                vertexShader: `
                    attribute float scale;
                    void main() {
                        vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
                        // UPDATED: Particle size reverted to original
                        gl_PointSize = scale * ( 200.0 / - mvPosition.z );
                        gl_Position = projectionMatrix * mvPosition;
                    }
                `,
                fragmentShader: `
                    uniform vec3 color;
                    void main() {
                        if ( length( gl_PointCoord - vec2( 0.5, 0.5 ) ) > 0.475 ) discard;
                        gl_FragColor = vec4( color, 1.0 );
                    }
                `
            });

            particles = new THREE.Points(geometry, material);
            scene.add(particles);

            renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(container.clientWidth, container.clientHeight);

            container.addEventListener('mousemove', onMouseMove, false);
            window.addEventListener('resize', onWindowResize, false);
        }

        function onWindowResize() {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        }
        
        function onMouseMove(event) {
            const rect = container.getBoundingClientRect();
            mouse.x = ( (event.clientX - rect.left) / container.clientWidth ) * 2 - 1;
            mouse.y = - ( (event.clientY - rect.top) / container.clientHeight ) * 2 + 1;
        }

        function animate() {
            requestAnimationFrame(animate);
            render();
        }

        function render() {
            camera.lookAt(scene.position);
            
            const positions = particles.geometry.attributes.position.array;
            const scales = particles.geometry.attributes.scale.array;
            let i = 0, j = 0;

            const mouseInfluence = 200;
            const waveHeight = 50;

            for (i = 0; i < numParticlesX; i++) {
                for (j = 0; j < numParticlesZ; j++) {
                    const index = (i * numParticlesZ + j);
                    
                    const mouseDistance = Math.sqrt(
                        Math.pow(positions[index*3] - (mouse.x * 600), 2) +
                        Math.pow(positions[index*3+2] - (mouse.y * -400), 2)
                    );

                    let wave = 0;
                    if(mouseDistance < mouseInfluence) {
                        const factor = 1 - (mouseDistance / mouseInfluence);
                        wave = Math.sin(factor * Math.PI) * waveHeight * 2;
                    }

                    positions[index * 3 + 1] = 
                        (Math.sin((i + count) * 0.3) * waveHeight) +
                        (Math.sin((j + count) * 0.5) * waveHeight) + 
                        wave;
                    
                    scales[index] = 
                        (Math.sin((i + count) * 0.3) + 1) * 2 +
                        (Math.sin((j + count) * 0.5) + 1) * 2;
                }
            }

            particles.geometry.attributes.position.needsUpdate = true;
            particles.geometry.attributes.scale.needsUpdate = true;

            renderer.render(scene, camera);
            count += 0.05;
        }

        init();
        animate();
    })();

    // --- PORTFOLIO MODAL FUNCTIONALITY ---
    (() => {
        const portfolioCards = document.querySelectorAll('.portfolio-card-new');
        const modal = document.getElementById('portfolio-modal');
        const modalTitle = document.getElementById('modal-title');
        const modalDescription = document.getElementById('modal-description');
        const closeModalBtn = document.getElementById('modal-close-btn');
        if (!modal) return;
        portfolioCards.forEach(card => {
            card.addEventListener('click', () => {
                const title = card.getAttribute('data-title');
                const description = card.getAttribute('data-description');
                modalTitle.textContent = title;
                modalDescription.textContent = description;
                modal.classList.add('visible');
            });
        });
        const closeModal = () => { modal.classList.remove('visible'); };
        closeModalBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => { if (e.target === modal) { closeModal(); } });
    })();

    // --- INTERACTIVE LARGE BUBBLE EFFECT FOR CTA SECTION ---
    (() => {
        const canvas = document.getElementById('hyperspace-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const container = canvas.parentElement;
        let bubbles = [];
        const mouse = { x: undefined, y: undefined };
        function resizeCanvas() { canvas.width = container.clientWidth; canvas.height = container.clientHeight; }
        const canvasContainer = canvas.parentElement;
        canvasContainer.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        });
        canvasContainer.addEventListener('mouseleave', () => { mouse.x = undefined; mouse.y = undefined; });
        class Bubble {
            constructor() { this.reset(); }
            reset() { this.radius = Math.random() * 60 + 30; this.x = Math.random() * canvas.width; this.y = canvas.height + this.radius; this.speedY = Math.random() * 0.5 + 0.2; this.opacity = this.radius / 120 * 0.8; this.waveAngle = Math.random() * Math.PI * 2; this.originalX = this.x; }
            update() {
                this.y -= this.speedY;
                this.waveAngle += 0.02;
                this.x = this.originalX + Math.sin(this.waveAngle) * 20;
                if (mouse.x !== undefined) {
                    let dx = this.x - mouse.x; let dy = this.y - mouse.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    let interactionRadius = 200;
                    if (distance < interactionRadius) {
                        let force = (interactionRadius - distance) / interactionRadius;
                        this.x += (dx / distance) * force * 2.5; this.y += (dy / distance) * force * 2.5;
                    }
                }
                if (this.y < -this.radius) { this.reset(); }
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                const gradient = ctx.createRadialGradient(this.x - this.radius * 0.3, this.y - this.radius * 0.3, 0, this.x, this.y, this.radius);
                gradient.addColorStop(0, `rgba(255, 255, 255, ${this.opacity * 0.4})`);
                gradient.addColorStop(0.8, `rgba(255, 255, 255, ${this.opacity * 0.1})`);
                gradient.addColorStop(1, `rgba(255, 255, 255, 0)`);
                ctx.fillStyle = gradient;
                ctx.fill();
                ctx.strokeStyle = `rgba(255, 255, 255, ${this.opacity * 0.2})`;
                ctx.stroke();
            }
        }
        function createBubbles() { bubbles = []; const bubbleCount = 5; for (let i = 0; i < bubbleCount; i++) { bubbles.push(new Bubble()); } }
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            bubbles.forEach(bubble => { bubble.update(); bubble.draw(); });
            requestAnimationFrame(animate);
        }
        window.addEventListener('resize', () => { resizeCanvas(); createBubbles(); });
        resizeCanvas();
        createBubbles();
        animate();
    })();

    // --- FINAL: VANTA 'FOG' EFFECT FOR FOOTER ---
    (() => {
        if (typeof VANTA !== 'undefined' && typeof VANTA.FOG !== 'undefined') {
            VANTA.FOG({
                el: "#footer-vanta-bg",
                mouseControls: false,
                touchControls: false,
                gyroControls: false,
                minHeight: 200.00,
                minWidth: 200.00,
                highlightColor: 0xe0f2fe,
                midtoneColor: 0x7dd3fc,
                lowlightColor: 0x075985,
                baseColor: 0x0c4a6e,
                blurFactor: 0.60,
                speed: 1.50,
                zoom: 0.80
            });
        }
    })();
});