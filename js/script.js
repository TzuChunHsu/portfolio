(() => {
    'use strict';

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Runs a function at most once per animation frame (used for scroll/resize).
    const onFrame = (fn) => {
        let queued = false;
        return () => {
            if (queued) return;
            queued = true;
            requestAnimationFrame(() => {
                queued = false;
                fn();
            });
        };
    };

    /* ---------- Language: English (written in the HTML) or Traditional Chinese (js/zh-hant.js) ---------- */

    const zhHant = window.ZH_HANT || {};
    const langToggle = document.querySelector('.lang-toggle');
    const enTitle = document.title;

    // Remember each element's English text so switching back needs no second dictionary.
    const translatable = [];
    [['i18n', null], ['i18n-alt', 'alt'], ['i18n-label', 'aria-label']].forEach(([name, attr]) => {
        document.querySelectorAll(`[data-${name}]`).forEach((el) => {
            translatable.push({
                el,
                attr,
                key: el.getAttribute(`data-${name}`),
                en: attr ? el.getAttribute(attr) : el.innerHTML,
            });
        });
    });

    const setLang = (lang) => {
        const zh = lang === 'zh';
        const t = (key, en) => (zh && zhHant[key]) || en;

        document.documentElement.lang = zh ? 'zh-Hant' : 'en';
        document.title = t('meta.title', enTitle);
        translatable.forEach(({ el, attr, key, en }) => {
            if (attr) el.setAttribute(attr, t(key, en));
            else el.innerHTML = t(key, en);
        });

        // The button offers the other language, written in that language.
        langToggle.lang = zh ? 'en' : 'zh-Hant';
        langToggle.title = zh ? 'Switch to English' : '切換為繁體中文';
        langToggle.querySelector('.lang-toggle-text').textContent = zh ? 'EN' : '中文';

        try {
            localStorage.setItem('lang', lang);
        } catch {
            // Storage is blocked (private mode, etc.): the choice just isn't remembered.
        }

        // Keep ?lang=zh in the address bar so the Chinese view can be shared as a link.
        try {
            const url = new URL(window.location.href);
            if (zh) url.searchParams.set('lang', 'zh');
            else url.searchParams.delete('lang');
            history.replaceState(null, '', url);
        } catch {
            // Some browsers refuse replaceState on file:// pages.
        }
    };

    const startLang = () => {
        const fromUrl = new URLSearchParams(window.location.search).get('lang');
        if (fromUrl) return fromUrl;
        try {
            return localStorage.getItem('lang');
        } catch {
            return null;
        }
    };

    if (startLang() === 'zh') setLang('zh');

    langToggle.addEventListener('click', () => {
        setLang(document.documentElement.lang === 'zh-Hant' ? 'en' : 'zh');
        onScroll(); // Text lengths changed, so re-measure the scroll-driven parts.
    });

    /* ---------- Sticky header: hides inside the hero, slides back in after it ---------- */

    const header = document.querySelector('#header');
    const hero = document.querySelector('#hero');
    const menu = document.querySelector('#menu');
    const toggle = document.querySelector('.toggle-menu');

    const setMenu = (open) => {
        menu.classList.toggle('show', open);
        toggle.classList.toggle('active', open);
        toggle.setAttribute('aria-expanded', String(open));
        const icon = toggle.querySelector('i');
        icon.classList.toggle('fa-bars', !open);
        icon.classList.toggle('fa-xmark', open);
    };

    const checkHeaderScroll = () => {
        const y = window.scrollY;
        const wasSticky = header.classList.contains('sticky');
        if (y === 0) {
            header.classList.remove('sticky', 'sticky-return');
        } else if (y >= hero.offsetHeight) {
            header.classList.add('sticky');
            header.classList.remove('sticky-return');
        } else {
            header.classList.remove('sticky');
            header.classList.add('sticky-return');
        }
        if (wasSticky !== header.classList.contains('sticky')) setMenu(false);
    };

    toggle.addEventListener('click', () => setMenu(!menu.classList.contains('show')));
    menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menu.classList.contains('show')) {
            setMenu(false);
            toggle.focus();
        }
    });
    document.addEventListener('click', (e) => {
        if (menu.classList.contains('show') && !header.contains(e.target)) setMenu(false);
    });

    /* ---------- Highlight the nav link of the section on screen ---------- */

    const links = document.querySelectorAll('.navbar_item_link');
    const sections = document.querySelectorAll('main section[id]');

    const highlightLinkOnScroll = () => {
        const y = window.scrollY;
        sections.forEach((section) => {
            if (y >= section.offsetTop - 100 && y < section.offsetTop + section.offsetHeight - 100) {
                links.forEach((link) => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${section.id}`);
                });
            }
        });
    };

    /* ---------- Fade/slide elements in as they enter the screen (.box) ---------- */

    const boxes = document.querySelectorAll('.box');

    const checkBoxes = () => {
        const limit = window.innerHeight - 100;
        boxes.forEach((box) => {
            box.classList.toggle('visible', box.getBoundingClientRect().top < limit);
        });
    };

    /* ---------- Experience: the colored line grows next to each job as you scroll ---------- */

    const lines = document.querySelectorAll('.gradient-line');

    const growLines = () => {
        const reach = window.innerHeight * 0.85;
        lines.forEach((line) => {
            const max = line.nextElementSibling.offsetHeight - 32;
            const height = Math.max(0, Math.min(reach - line.getBoundingClientRect().top, max));
            line.style.height = `${height}px`;
        });
    };

    const onScroll = onFrame(() => {
        checkHeaderScroll();
        highlightLinkOnScroll();
        checkBoxes();
        growLines();
    });

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    checkHeaderScroll();
    highlightLinkOnScroll();
    checkBoxes();
    growLines();

    /* ---------- Profile photo: glow follows the mouse ---------- */

    const cadre = document.querySelector('.cadre');
    const hoverEffect = document.querySelector('.hover-effect');

    cadre.addEventListener('mousemove', (event) => {
        const rect = cadre.getBoundingClientRect();
        hoverEffect.style.transform = `translate(${event.clientX - rect.left - 50}px, ${event.clientY - rect.top - 50}px)`;
    });
    cadre.addEventListener('mouseleave', () => {
        hoverEffect.style.transform = 'translate(-150%, -150%)';
    });

    /* ---------- Activities: card tilts toward the mouse with a soft light ---------- */

    document.querySelectorAll('.experience_cadre').forEach((card) => {
        const back = card.querySelector('.back');

        card.addEventListener('mousemove', (e) => {
            const { left, top, width, height } = card.getBoundingClientRect();
            const deltaX = (e.clientX - (left + width / 1.1)) / width * 2;
            const deltaY = (e.clientY - (top + height / 1.1)) / height * 2;
            card.style.transform = `perspective(1400px) rotateX(${deltaY}deg) rotateY(${deltaX}deg)`;
            back.style.transform = `translate(${e.clientX - left - 50}px, ${e.clientY - top - 50}px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            back.style.transform = 'translate(-150%, -150%)';
        });
    });

    /* ---------- Skills: dim the hexagons outside the chosen category ---------- */

    const categoryButtons = document.querySelectorAll('.skills_category button');
    const skills = document.querySelectorAll('.skill');

    categoryButtons.forEach((button) => {
        button.addEventListener('click', () => {
            categoryButtons.forEach((btn) => btn.classList.toggle('active', btn === button));
            const category = button.dataset.category;
            skills.forEach((skill) => {
                const match = category === 'all' || skill.dataset.category.split(' ').includes(category);
                skill.classList.toggle('is-dim', !match);
            });
        });
    });

    /* ---------- Copy email address ---------- */

    const copyText = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
        } catch {
            const input = document.createElement('textarea');
            input.value = text;
            input.style.position = 'fixed';
            input.style.opacity = '0';
            document.body.appendChild(input);
            input.select();
            document.execCommand('copy');
            input.remove();
        }
    };

    document.querySelectorAll('[data-copy]').forEach((button) => {
        const message = button.parentElement.querySelector('.copy-message');
        button.addEventListener('click', () => {
            copyText(button.dataset.copy);
            message.classList.add('show');
            setTimeout(() => message.classList.remove('show'), 1500);
        });
    });

    /* ---------- Career: light pulses travel along the CPU traces ---------- */

    // Each pulse moves its gradient from `from` to `to` ([x1, y1, x2, y2]) over `steps` frames.
    const pulses = [
        { id: 'blue-pulse-1', from: [83, 320, 83, 415], to: [400, 83, 350, 133.75], steps: 110, pause: 1400 },
        { id: 'blue-pulse-2', from: [83, 267.5, 83, 415], to: [400, 83, 350, 133.75], steps: 160, pause: 1400 },
        { id: 'pink-pulse-1', from: [412, 264, 412, 304], to: [400, 83, 350, 133.75], steps: 50, pause: 1400 },
        { id: 'pink-pulse-2', from: [490, 266, 490, 284], to: [479, 120, 479, 150], steps: 110, pause: 1800 },
        { id: 'orange-pulse-1', from: [826, 270, 826, 340], to: [360, 130, 400, 170], steps: 105, pause: 1800 },
        { id: 'orange-pulse-2', from: [868, 280, 868, 440], to: [300, 140, 400, 180], steps: 170, pause: 1800 },
    ];

    const poweredBy = document.querySelector('.powered_by');

    if (poweredBy && !reduceMotion && 'IntersectionObserver' in window) {
        // Bumped whenever the CPU leaves or enters the screen so old loops stop.
        let generation = 0;
        const attrs = ['x1', 'y1', 'x2', 'y2'];

        const animatePulse = (pulse, gen) => {
            const gradient = document.getElementById(pulse.id);
            let step = 0;
            const update = () => {
                if (gen !== generation) return;
                const t = step / pulse.steps;
                attrs.forEach((attr, i) => {
                    gradient.setAttribute(attr, pulse.from[i] + (pulse.to[i] - pulse.from[i]) * t);
                });
                if (step++ < pulse.steps) {
                    requestAnimationFrame(update);
                } else {
                    setTimeout(() => animatePulse(pulse, gen), pulse.pause);
                }
            };
            setTimeout(update, 500);
        };

        new IntersectionObserver(([entry]) => {
            generation++;
            if (entry.isIntersecting) pulses.forEach((pulse) => animatePulse(pulse, generation));
        }).observe(poweredBy);
    }
})();
