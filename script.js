/* ФИТНЕС-ЛЕНДИНГ — интерактив */
(function () {
    'use strict';

    /* 1. ПЛАВНЫЙ СКРОЛЛ К #PROGRAMS */
    var scrollToBtn = document.querySelector('[data-scroll-to-programs]');
    if (scrollToBtn) {
        scrollToBtn.addEventListener('click', function () {
            var target = document.querySelector('#programs');
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }

    /* 2. МОДАЛЬНОЕ ОКНО */
    var overlay = document.getElementById('modalOverlay');
    var modalTitle = document.getElementById('modalTitle');
    var modalDescription = document.getElementById('modalDescription');
    var modalClose = document.getElementById('modalClose');
    var leadForm = document.getElementById('leadForm');
    var formSuccess = document.getElementById('formSuccess');

    var programDescriptions = {
        'Метод Усмановой': 'Флагманская программа Кати. Освойте технику и втянетесь в регулярные тренировки без травм и через силу. Первая программа, с которой начинают все ученицы.',
        'Стройности': 'Марафон на 21 день. Первый видимый результат — уходит жир, появляется тонус и лёгкость. Идеально для старта с нуля.',
        'Упругая попа 1.0': 'Первый объём и подтянутость ягодиц с собственным весом. Для тех, кто впервые целенаправленно работает над попой.',
        'Упругая попа 2.0': 'Плотные, упругие ягодицы — следующий уровень после 1.0. С резинкой и утяжелителями, для подготовленных.',
        'Плоский живот': 'Убрать вываливающийся живот. Тренировки на глубокие мышцы пресса, которые отвечают за плоский живот, а не за «кубики».',
        'Жиросжигающий': 'Курс на 6 недель. Сжечь жир и проявить рельеф с гантелями по схеме интервальных нагрузок. Для подготовленных.'
    };

    function openModal(programName) {
        if (!overlay) return;
        modalTitle.textContent = programName || 'Выбор программы';
        modalDescription.textContent = programDescriptions[programName] || 'Выберите подходящую программу под вашу цель.';
        leadForm.style.display = '';
        formSuccess.classList.remove('is-visible');
        clearErrors();
        overlay.classList.add('is-open');
        document.body.style.overflow = 'hidden';
        setTimeout(function () {
            var nameInput = document.getElementById('leadName');
            if (nameInput) nameInput.focus();
        }, 100);
    }

    function closeModal() {
        if (!overlay) return;
        overlay.classList.remove('is-open');
        document.body.style.overflow = '';
    }

    var detailButtons = document.querySelectorAll('.program-link');
    detailButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
            var programName = btn.getAttribute('data-program');
            openModal(programName);
        });
    });

    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    if (overlay) {
        overlay.addEventListener('click', function (e) {
            if (e.target === overlay) {
                closeModal();
            }
        });
    }

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && overlay && overlay.classList.contains('is-open')) {
            closeModal();
        }
    });

    /* 3. ВАЛИДАЦИЯ И ОТПРАВКА ФОРМЫ */
    function clearErrors() {
        var errors = document.querySelectorAll('.form-error');
        errors.forEach(function (el) { el.textContent = ''; });
    }

    function showError(field, message) {
        var errorEl = document.getElementById('error' + field);
        if (errorEl) errorEl.textContent = message;
    }

    if (leadForm) {
        leadForm.addEventListener('submit', function (e) {
            e.preventDefault();
            clearErrors();
            var valid = true;

            var nameInput = document.getElementById('leadName');
            var phoneInput = document.getElementById('leadPhone');
            var consentInput = document.getElementById('leadConsent');

            if (!nameInput.value.trim()) {
                showError('Name', 'Введите имя');
                valid = false;
            }

            var phoneValue = phoneInput.value.replace(/\D/g, '');
            if (!phoneValue) {
                showError('Phone', 'Введите телефон');
                valid = false;
            } else if (phoneValue.length < 10) {
                showError('Phone', 'Введите корректный телефон');
                valid = false;
            }

            if (!consentInput.checked) {
                showError('Consent', 'Необходимо согласие на обработку данных');
                valid = false;
            }

            if (!valid) return;

            var goalSelect = document.getElementById('leadGoal');
            var lead = {
                program: modalTitle.textContent,
                name: nameInput.value.trim(),
                phone: phoneInput.value.trim(),
                goal: goalSelect ? goalSelect.value : '',
                timestamp: new Date().toISOString()
            };

            console.log('Заявка отправлена:', lead);

            leadForm.style.display = 'none';
            formSuccess.classList.add('is-visible');
            leadForm.reset();

            setTimeout(function () {
                closeModal();
            }, 4000);
        });
    }

    /* 4. COOKIE-ПЛАШКА */
    var cookieBanner = document.querySelector('.cookie-banner');
    var cookieAccept = document.getElementById('cookieAccept');

    function showCookieBanner() {
        if (!cookieBanner) return;
        var accepted = false;
        try {
            accepted = localStorage.getItem('cookieAccepted') === 'true';
        } catch (e) {}
        if (!accepted) {
            cookieBanner.classList.add('is-visible');
        }
    }

    if (cookieAccept) {
        cookieAccept.addEventListener('click', function () {
            try {
                localStorage.setItem('cookieAccepted', 'true');
            } catch (e) {}
            cookieBanner.classList.remove('is-visible');
        });
    }

    setTimeout(showCookieBanner, 1000);

})();