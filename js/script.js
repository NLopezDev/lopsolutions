/* =====================================================
   LOP Solutions - Landing JS
   - Scroll spy nav
   - Animacion al hacer scroll
   - Validacion y manejo de formulario
   - Anio dinamico
   ===================================================== */

(function () {
    'use strict';

    // =========== Anio dinamico en footer ===========
    const yearEl = document.getElementById('currentYear');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // =========== Navbar con efecto scroll ===========
    const nav = document.getElementById('mainNav');
    const onScroll = () => {
        if (window.scrollY > 60) nav.classList.add('scrolled');
        else nav.classList.remove('scrolled');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // =========== Smooth close de navbar mobile al click ===========
    document.querySelectorAll('#navbarNav .nav-link, #navbarNav .btn-cta').forEach(link => {
        link.addEventListener('click', () => {
            const collapse = document.getElementById('navbarNav');
            if (collapse.classList.contains('show')) {
                const bsCollapse = bootstrap.Collapse.getInstance(collapse) || new bootstrap.Collapse(collapse, { toggle: false });
                bsCollapse.hide();
            }
        });
    });

    // =========== Animacion fade-in en scroll ===========
    const animatedSelectors = [
        '.pain-card', '.service-card', '.diff-card', '.step-card',
        '.extra-card', '.sector-tag', '.accordion-item'
    ];
    const animatedNodes = document.querySelectorAll(animatedSelectors.join(','));
    animatedNodes.forEach(el => el.classList.add('fade-in'));

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });
        animatedNodes.forEach(el => observer.observe(el));
    } else {
        animatedNodes.forEach(el => el.classList.add('visible'));
    }

    // =========== Validacion de formulario y manejo de envio ===========
    const form = document.getElementById('contactForm');
    const formMsg = document.getElementById('formMsg');

    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            formMsg.className = 'form-msg';
            formMsg.textContent = '';

            // Validacion HTML5
            if (!form.checkValidity()) {
                form.classList.add('was-validated');
                formMsg.classList.add('error');
                formMsg.textContent = 'Por favor completa los campos obligatorios.';
                return;
            }

            // Email basico
            const email = form.email.value.trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                formMsg.classList.add('error');
                formMsg.textContent = 'El email ingresado no es valido.';
                return;
            }

            // Construir payload
            const data = {
                nombre: form.nombre.value.trim(),
                empresa: form.empresa.value.trim(),
                email: email,
                telefono: form.telefono.value.trim(),
                usuarios: form.usuarios.value,
                servicio: form.servicio.value,
                mensaje: form.mensaje.value.trim(),
                origen: 'landing-lop-solutions',
                timestamp: new Date().toISOString()
            };

            // TODO: integrar con backend / Formspree / EmailJS / Google Forms
            // Mientras tanto: log + simulacion + mailto fallback
            console.log('[LOP] Form payload:', data);

            // Construir mailto fallback (abre cliente de mail)
            const subject = encodeURIComponent('Consulta web - ' + data.empresa);
            const body = encodeURIComponent(
                'Nombre: ' + data.nombre + '\n' +
                'Empresa: ' + data.empresa + '\n' +
                'Email: ' + data.email + '\n' +
                'Telefono: ' + data.telefono + '\n' +
                'Usuarios: ' + data.usuarios + '\n' +
                'Servicio: ' + data.servicio + '\n\n' +
                'Mensaje:\n' + data.mensaje
            );
            const mailto = 'mailto:contacto@lopsolutions.com.ar?subject=' + subject + '&body=' + body;

            // UX: mostrar mensaje de exito + abrir mailto
            formMsg.classList.remove('error');
            formMsg.classList.add('success');
            formMsg.textContent = 'Solicitud preparada. Abriendo tu cliente de correo...';

            setTimeout(() => {
                window.location.href = mailto;
                form.reset();
                form.classList.remove('was-validated');
            }, 600);
        });
    }

    // =========== Mobile: planes colapsables (tap para expandir) ===========
    const mobileMQ = window.matchMedia('(max-width: 767.98px)');
    const serviceCards = document.querySelectorAll('.service-card');

    serviceCards.forEach(card => {
        card.addEventListener('click', function (e) {
            // Solo en mobile
            if (!mobileMQ.matches) return;
            // No togglear si tocaron el boton de "Solicitar propuesta"
            if (e.target.closest('a.btn')) return;
            card.classList.toggle('is-expanded');
        });
    });

    // Si pasa de mobile a desktop, limpio estados expandidos
    mobileMQ.addEventListener('change', (e) => {
        if (!e.matches) {
            serviceCards.forEach(c => c.classList.remove('is-expanded'));
        }
    });

    // =========== Scroll spy simple para nav links ===========
    const sections = document.querySelectorAll('section[id], header[id]');
    const navLinks = document.querySelectorAll('#navbarNav .nav-link');
    if ('IntersectionObserver' in window && sections.length) {
        const spy = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    navLinks.forEach(l => {
                        l.classList.toggle('active', l.getAttribute('href') === '#' + id);
                    });
                }
            });
        }, { rootMargin: '-40% 0px -55% 0px' });
        sections.forEach(s => spy.observe(s));
    }

})();
