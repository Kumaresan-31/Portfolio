document.addEventListener('DOMContentLoaded', () => {

    // ===== Init Lucide =====
    if (typeof lucide !== 'undefined') lucide.createIcons();

    // ===== tsParticles =====
    if (typeof tsParticles !== 'undefined') {
        tsParticles.load('tsparticles', {
            fpsLimit: 60,
            particles: {
                number: { value: 55, density: { enable: true, area: 900 } },
                color: { value: ['#00d4ff', '#8a2be2', '#ffffff'] },
                shape: { type: 'circle' },
                opacity: { value: { min: 0.05, max: 0.3 }, animation: { enable: true, speed: 0.8, sync: false } },
                size: { value: { min: 0.5, max: 2.5 } },
                links: { enable: true, distance: 130, color: '#00d4ff', opacity: 0.08, width: 1 },
                move: {
                    enable: true, speed: 0.6, direction: 'none',
                    random: true, straight: false, outModes: 'bounce'
                }
            },
            interactivity: {
                events: {
                    onHover: { enable: true, mode: 'grab' },
                    onClick: { enable: true, mode: 'push' }
                },
                modes: {
                    grab: { distance: 160, links: { opacity: 0.3 } },
                    push: { quantity: 2 }
                }
            },
            detectRetina: true,
            background: { color: 'transparent' }
        });
    }

    // ===== Cursor Glow =====
    const glow = document.getElementById('cursor-glow');
    let mouseX = -1000, mouseY = -1000;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        glow.style.left = mouseX + 'px';
        glow.style.top  = mouseY + 'px';
    });

    document.addEventListener('mouseleave', () => glow.style.opacity = '0');
    document.addEventListener('mouseenter', () => glow.style.opacity = '1');

    // ===== Magnetic Buttons =====
    document.querySelectorAll('.magnetic').forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top  + rect.height / 2;
            const dx = (e.clientX - cx) * 0.25;
            const dy = (e.clientY - cy) * 0.25;
            el.style.transform = `translate(${dx}px, ${dy}px)`;
        });
        el.addEventListener('mouseleave', () => {
            el.style.transform = '';
        });
    });

    // ===== Navbar scroll =====
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
    });

    // ===== Active nav highlight =====
    const sections    = document.querySelectorAll('section[id]');
    const navAnchors  = document.querySelectorAll('.nav-links a');

    const highlightNav = () => {
        let pos = window.scrollY + 120;
        sections.forEach(sec => {
            if (pos >= sec.offsetTop && pos < sec.offsetTop + sec.offsetHeight) {
                navAnchors.forEach(a => a.classList.remove('active'));
                const link = document.querySelector(`.nav-links a[href="#${sec.id}"]`);
                if (link) link.classList.add('active');
            }
        });
    };
    window.addEventListener('scroll', highlightNav);

    // ===== Mobile menu =====
    const menuBtn  = document.getElementById('mobile-menu');
    const navLinks = document.getElementById('nav-links');
    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', () => navLinks.classList.toggle('open'));
        navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));
    }

    // ===== Smooth scroll =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                const top = target.getBoundingClientRect().top + window.pageYOffset - navbar.offsetHeight;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // ===== Scroll Reveal =====
    const revealObs = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => entry.target.classList.add('visible'), i * 80);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

    // ===== Typewriter =====
    const roles = [
        'Full Stack Developer',
        'Node.js Engineer',
        'Problem Solver',
        'Open Source Enthusiast',
        'CS Student @ KEC'
    ];
    let roleIndex = 0, charIndex = 0, deleting = false;
    const tw = document.getElementById('typewriter');

    function type() {
        if (!tw) return;
        const current = roles[roleIndex];
        if (!deleting) {
            tw.textContent = current.slice(0, ++charIndex);
            if (charIndex === current.length) { deleting = true; setTimeout(type, 1800); return; }
        } else {
            tw.textContent = current.slice(0, --charIndex);
            if (charIndex === 0) { deleting = false; roleIndex = (roleIndex + 1) % roles.length; setTimeout(type, 400); return; }
        }
        setTimeout(type, deleting ? 45 : 80);
    }

    setTimeout(type, 800);

    // ===== Video hover play =====
    document.querySelectorAll('.project-video').forEach(video => {
        const card = video.closest('.project-card');
        card.addEventListener('mouseenter', () => video.play());
        card.addEventListener('mouseleave', () => { video.pause(); video.currentTime = 0; });
    });

    // ===== Contact Form =====
    const form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = document.getElementById('submit-btn');
            const orig = btn.innerHTML;
            btn.disabled = true;
            btn.innerHTML = 'Sending...';

            try {
                const res = await fetch(form.action, {
                    method: 'POST',
                    body: new FormData(form),
                    headers: { Accept: 'application/json' }
                });
                if (res.ok) {
                    btn.innerHTML = '✓ Sent!';
                    btn.style.background = 'linear-gradient(135deg,#10b981,#059669)';
                    form.reset();
                } else throw new Error('fail');
            } catch {
                btn.innerHTML = '✗ Try Again';
                btn.style.background = 'linear-gradient(135deg,#ef4444,#dc2626)';
            } finally {
                setTimeout(() => {
                    btn.disabled = false;
                    btn.innerHTML = orig;
                    btn.style.background = '';
                    if (typeof lucide !== 'undefined') lucide.createIcons();
                }, 3000);
            }
        });
    }

    // ===== Theme toggle (light mode) =====
    const themeBtn  = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    let light = false;

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            light = !light;
            document.documentElement.style.setProperty('--bg',  light ? '#f8fafc' : '#020215');
            document.documentElement.style.setProperty('--bg2', light ? '#ffffff' : '#0d0a21');
            document.documentElement.style.setProperty('--text', light ? '#0f172a' : '#ffffff');
            document.documentElement.style.setProperty('--muted', light ? '#475569' : '#94a3b8');
            document.documentElement.style.setProperty('--glass', light ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.03)');
            document.documentElement.style.setProperty('--glass-border', light ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.07)');
            themeIcon.setAttribute('data-lucide', light ? 'moon' : 'sun');
            if (typeof lucide !== 'undefined') lucide.createIcons();
        });
    }

});
