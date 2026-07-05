/* ФИТНЕС-ЛЕНДИНГ — интерактив */
(function () {
    'use strict';

    /* 1. ПЛАВНЫЙ СКРОЛЛ К #PROGRAMS */
    var scrollToBtns = document.querySelectorAll('[data-scroll-to-programs]');
    scrollToBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            var target = document.querySelector('#programs');
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

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

        // Полный сброс состояния формы при каждом открытии
        if (leadForm) {
            leadForm.style.display = '';
            leadForm.reset();
        }
        if (formSuccess) {
            formSuccess.classList.remove('is-visible');
        }
        clearErrors();

        // Разблокируем кнопку submit на случай повторного открытия
        var submitBtn = leadForm ? leadForm.querySelector('.btn-submit') : null;
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Отправить заявку';
        }

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

            var submitBtn = leadForm.querySelector('.btn-submit');
            // Защита от двойной отправки
            if (submitBtn && submitBtn.disabled) return;

            var nameInput = document.getElementById('leadName');
            var phoneInput = document.getElementById('leadPhone');
            var consentInput = document.getElementById('leadConsent');

            // Защита, если элементы вдруг не найдены
            if (!nameInput || !phoneInput || !consentInput) {
                return;
            }

            var valid = true;

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

            // Блокируем кнопку, чтобы не отправить дважды
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Отправляем…';
            }

            var goalSelect = document.getElementById('leadGoal');
            var lead = {
                program: modalTitle ? modalTitle.textContent : '',
                name: nameInput.value.trim(),
                phone: phoneInput.value.trim(),
                goal: goalSelect ? goalSelect.value : '',
                timestamp: new Date().toISOString()
            };

            console.log('Заявка с формы:', lead);

            // Формируем данные для отправки на почту через FormSubmit.co
            var formData = new FormData();
            formData.append('name', lead.name);
            formData.append('phone', lead.phone);
            formData.append('goal', lead.goal);
            formData.append('program', lead.program);
            formData.append('timestamp', lead.timestamp);
            formData.append('_subject', 'Новая заявка с лендинга Кати Усмановой');
            formData.append('_template', 'table');
            formData.append('_captcha', 'false');

            // Отправка на почту sasha.www.ru78@gmail.com через FormSubmit.co
            fetch('https://formsubmit.co/ajax/sasha.www.ru78@gmail.com', {
                method: 'POST',
                headers: { 'Accept': 'application/json' },
                body: formData
            })
            .then(function (response) {
                if (!response.ok) throw new Error('Network error');
                return response.json();
            })
            .then(function (data) {
                console.log('Письмо успешно отправлено на почту:', data);
            })
            .catch(function (err) {
                console.warn('Не удалось отправить письмо на почту, но заявка сохранена локально:', err);
            })
            .finally(function () {
                // В любом случае показываем успех пользователю
                leadForm.style.display = 'none';
                if (formSuccess) {
                    formSuccess.classList.add('is-visible');
                }
                leadForm.reset();

                setTimeout(function () {
                    closeModal();
                }, 4000);
            });
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