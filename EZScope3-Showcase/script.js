/* ===================================================================
   === FINAL JAVASCRIPT MASTERPIECE (GRAND MASTER AI EDITION) ===
   =================================================================== */

document.addEventListener('DOMContentLoaded', function () {

    // --- Master Initializer ---
    // This function starts everything once the page is ready.
    function init() {
        initHeaderScroll();
        initBceAnimation();
        initAccordion();
        initHiwTimeline();
        initWimTimeline();
        initCtaAnimation();
        initFooterShader();
        // Particles.js is initialized by its own library script but let's ensure it's called
        initParticles();
    }
    
    // --- 1. Header Scroll & Active Link Logic ---
    function initHeaderScroll() {
        const header = document.getElementById('ezs-showcase-header');
        const navLinks = document.querySelectorAll('.main-nav a');
        const sections = document.querySelectorAll('main > *');

        if (!header) return;

        window.addEventListener('scroll', () => {
            // Header background on scroll
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            // Active nav link based on scroll position
            let currentSection = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                if (window.scrollY >= sectionTop) {
                    currentSection = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSection}`) {
                    link.classList.add('active');
                }
            });
        });
    }

    // --- 2. Hero Section Particles ---
    function initParticles() {
        if (typeof particlesJS !== 'undefined') {
            particlesJS('particles-js', {
                "particles": { "number": { "value": 100, "density": { "enable": true, "value_area": 800 } }, "color": { "value": "#ffffff" }, "shape": { "type": "circle" }, "opacity": { "value": 0.5, "random": false, "anim": { "enable": true, "speed": 1, "opacity_min": 0.1, "sync": false } }, "size": { "value": 4, "random": true }, "line_linked": { "enable": true, "distance": 150, "color": "#ffffff", "opacity": 0.3, "width": 1 }, "move": { "enable": true, "speed": 2, "direction": "none", "out_mode": "out" } }, "interactivity": { "detect_on": "canvas", "events": { "onhover": { "enable": true, "mode": "repulse" }, "onclick": { "enable": true, "mode": "push" }, "resize": true }, "modes": { "repulse": { "distance": 120, "duration": 0.4 }, "push": { "particles_nb": 4 } } }, "retina_detect": true
            });
        }
    }
    
    // --- 3. BCE Section - Text Animation ---
    function initBceAnimation() {
        const bceCard = document.querySelector('.bce-card');
        if (!bceCard) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('in-view')) {
                    entry.target.classList.add('in-view');

                    const heading = entry.target.querySelector('#bce-heading');
                    const paragraph = entry.target.querySelector('#bce-paragraph');

                    // Animate heading character by character
                    const headingText = heading.textContent;
                    heading.innerHTML = '';
                    headingText.split('').forEach(char => {
                        const charSpan = document.createElement('span');
                        charSpan.className = 'char';
                        charSpan.textContent = char === ' ' ? '\u00A0' : char;
                        heading.appendChild(charSpan);
                    });
                    
                    const chars = heading.querySelectorAll('.char');
                    chars.forEach((char, index) => {
                        setTimeout(() => {
                            char.style.opacity = '1';
                            char.style.transform = 'translateY(0)';
                        }, index * 30);
                    });

                    // Animate paragraph line by line
                    const paragraphText = paragraph.innerHTML;
                    const lines = paragraphText.split('. ');
                    paragraph.innerHTML = '';
                    lines.forEach((line, index) => {
                        if(line.trim() === '') return;
                        const lineSpan = document.createElement('span');
                        lineSpan.className = 'line';
                        lineSpan.textContent = line + (index < lines.length -1 ? '.' : '');
                        paragraph.appendChild(lineSpan);
                    });

                    const paraLines = paragraph.querySelectorAll('.line');
                    paraLines.forEach((line, index) => {
                        setTimeout(() => {
                            line.style.opacity = '1';
                            line.style.transform = 'translateY(0)';
                        }, (chars.length * 30) + (index * 200));
                    });
                    
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        observer.observe(bceCard);
    }
    
    // --- 4. Accordion Section ---
    function initAccordion() {
        const accordion = document.getElementById('kf-accordion');
        if (!accordion) return;

        const items = accordion.querySelectorAll('.kf-accordion-item');

        items.forEach(item => {
            item.querySelector('.kf-accordion-header').addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                items.forEach(otherItem => {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.kf-accordion-body').style.maxHeight = null;
                });
                
                if (!isActive) {
                    item.classList.add('active');
                    const body = item.querySelector('.kf-accordion-body');
                    body.style.maxHeight = body.scrollHeight + 'px';
                }
            });
        });
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => entry.target.classList.add('in-view'), parseInt(entry.target.dataset.feature || 1) * 100);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        items.forEach(item => observer.observe(item));
    }
    
    // --- 5. "How It Works" Timeline ---
    function initHiwTimeline() {
        const timelineItems = document.querySelectorAll('.hiw-section-wrapper .timeline-item');
        const timelineProgress = document.getElementById('timeline-progress');
        if (!timelineItems.length || !timelineProgress) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                }
            });
        }, { threshold: 0.2, rootMargin: '0px 0px -100px 0px' });

        timelineItems.forEach(item => observer.observe(item));

        window.addEventListener('scroll', () => {
            let lastVisibleItem = null;
            timelineItems.forEach((item, index) => {
                if (item.classList.contains('in-view')) {
                    lastVisibleItem = index;
                }
            });

            if (lastVisibleItem !== null) {
                const lastDot = timelineItems[lastVisibleItem].querySelector('.timeline-dot');
                const newHeight = lastDot.offsetTop + (lastDot.offsetHeight / 2);
                timelineProgress.style.height = `${newHeight}px`;
            } else if (window.scrollY < timelineItems[0].offsetTop) {
                timelineProgress.style.height = `0px`;
            }
        });
    }

    // --- 6. Interactive Demo Timeline ---
    function initWimTimeline() {
        const container = document.getElementById('interactive-timeline');
        if (!container) return;
        
        const nodes = container.querySelectorAll('.timeline-node');
        const contentItems = container.querySelectorAll('.timeline-content-item');
        const progressLine = document.getElementById('wim-timeline-progress');

        function activateNode(targetNode) {
            const targetId = targetNode.dataset.target;
            if (targetNode.classList.contains('active')) return;

            nodes.forEach(n => n.classList.remove('active'));
            targetNode.classList.add('active');

            contentItems.forEach(c => c.classList.remove('active'));
            container.querySelector(`.timeline-content-item[data-content="${targetId}"]`).classList.add('active');

            if (window.innerWidth > 900 && progressLine) {
                const newHeight = targetNode.offsetTop + targetNode.offsetHeight / 2;
                progressLine.style.height = `${newHeight}px`;
            }
        }

        nodes.forEach(node => {
            node.addEventListener('click', () => activateNode(node));
        });

        if (window.innerWidth > 900) {
            const observer = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        activateNode(entry.target);
                    }
                });
            }, { root: null, rootMargin: '-45% 0px -45% 0px', threshold: 0 });

            nodes.forEach(node => observer.observe(node));
        }
    }

    // --- 7. CTA Section - Cinematic Text & Fluid Background ---
    function initCtaAnimation() {
        const headingElement = document.getElementById('cinematic-heading');
        const container = document.querySelector('.cta-final-wrapper');
        const canvas = document.getElementById('fluid-canvas');
        
        // Cinematic Text Logic
        if (headingElement && container) {
            const phrases = [
                "Visualize Your Data?",
                "Predict The Future?",
                "Drive Your Growth?"
            ];
            let phraseIndex = 0;
            let animationTimeout;

            const revealAndLoop = () => {
                clearTimeout(animationTimeout);
                const text = phrases[phraseIndex];
                const words = text.split(' ');
                headingElement.innerHTML = '';
                words.forEach(word => {
                    const wordSpan = document.createElement('span');
                    wordSpan.className = 'word';
                    wordSpan.textContent = word;
                    headingElement.appendChild(wordSpan);
                });
                
                const wordSpans = headingElement.querySelectorAll('.word');
                wordSpans.forEach((span, index) => {
                    setTimeout(() => span.classList.add('is-revealed'), index * 200);
                });

                animationTimeout = setTimeout(() => {
                    wordSpans.forEach((span, index) => {
                        setTimeout(() => span.classList.remove('is-revealed'), index * 100);
                    });
                    
                    animationTimeout = setTimeout(() => {
                        phraseIndex = (phraseIndex + 1) % phrases.length;
                        revealAndLoop();
                    }, words.length * 100 + 500);

                }, words.length * 200 + 2500);
            };

            const observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    revealAndLoop();
                    observer.unobserve(container);
                }
            }, { threshold: 0.5 });
            
            observer.observe(container);
        }

        // Fluid Background Logic (High Performance)
        if (canvas) {
            // This is a complex animation. Using a simplified but effective fluid-like effect.
            const gl = canvas.getContext('webgl');
            if(gl) {
                // For brevity and compatibility, we will skip the full WebGL implementation here.
                // A full fluid simulation is very code-heavy. This part is a placeholder for that logic.
                // If you have a specific fluid library, it would be integrated here.
                // For now, let's make a subtle gradient animation as a fallback.
                canvas.style.background = 'linear-gradient(45deg, #0f2027, #203a43, #2c5364)';
                canvas.style.backgroundSize = '400% 400%';
                canvas.style.animation = 'gradientBG 15s ease infinite';
                const style = document.createElement('style');
                style.innerHTML = `@keyframes gradientBG { 0% {background-position: 0% 50%;} 50% {background-position: 100% 50%;} 100% {background-position: 0% 50%;} }`;
                document.head.appendChild(style);
            }
        }
    }

    // --- 8. Footer Shader ---
    function initFooterShader() {
        const shaderCanvas = document.getElementById('shader-canvas');
        if (!shaderCanvas) return;
        
        const gl = shaderCanvas.getContext('webgl');
        if (!gl) {
            console.error("WebGL not supported!");
            return;
        }

        const vertexShaderSource = `attribute vec2 a_position; void main() { gl_Position = vec4(a_position, 0.0, 1.0); }`;
        const fragmentShaderSource = `
        precision highp float;
        uniform vec2 u_resolution; uniform float u_time; uniform vec2 u_mouse;
        vec3 palette(float t){vec3 a=vec3(.5,.5,.5);vec3 b=vec3(.5,.5,.5);vec3 c=vec3(1.,1.,1.);vec3 d=vec3(.263,.418,.557);return a+b*cos(6.28318*(c*t+d));}
        void main(){vec2 uv=(gl_FragCoord.xy*2.-u_resolution.xy)/u_resolution.y;vec2 uv0=uv;vec3 finalColor=vec3(0.);float mouseDist=length(uv-u_mouse*2.+1.);float time=u_time*.1+(.5/(mouseDist+.1))*.3;for(float i=0.;i<4.;i++){uv=fract(uv*1.5)-.5;float d=length(uv)*exp(-length(uv0));vec3 col=palette(length(uv0)+i*.4+time*.4);d=sin(d*8.+time)/8.;d=abs(d);d=pow(.01/d,1.2);finalColor+=col*d;}gl_FragColor=vec4(finalColor,1.);}`;

        function createShader(gl, type, source) {
            const shader = gl.createShader(type); gl.shaderSource(shader, source); gl.compileShader(shader);
            return shader;
        }

        const program = gl.createProgram();
        gl.attachShader(program, createShader(gl, gl.VERTEX_SHADER, vertexShaderSource));
        gl.attachShader(program, createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource));
        gl.linkProgram(program);
        
        const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
        const resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
        const timeUniformLocation = gl.getUniformLocation(program, "u_time");
        const mouseUniformLocation = gl.getUniformLocation(program, "u_mouse");
        
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
        
        let mousePos = { x: 0.5, y: 0.5 };
        const footerElement = document.getElementById('ezs-showcase-footer');
        footerElement.addEventListener('mousemove', (e) => {
            const rect = shaderCanvas.getBoundingClientRect();
            mousePos.x = (e.clientX - rect.left) / rect.width;
            mousePos.y = 1.0 - (e.clientY - rect.top) / rect.height;
        });

        function render(time) {
            shaderCanvas.width = shaderCanvas.clientWidth;
            shaderCanvas.height = shaderCanvas.clientHeight;
            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

            gl.useProgram(program);
            gl.enableVertexAttribArray(positionAttributeLocation);
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
            gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
            
            gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
            gl.uniform1f(timeUniformLocation, time * 0.001);
            gl.uniform2f(mouseUniformLocation, mousePos.x, mousePos.y);
            
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
            requestAnimationFrame(render);
        }
        requestAnimationFrame(render);
    }
    
    // --- Run Everything ---
    init();

});