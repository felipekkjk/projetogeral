// frontend/js/main.js

document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('themeToggle');
    const refreshBtn = document.getElementById('refreshBtn');
    const body = document.body;

    const STORAGE_KEY = 'smarttraffic-theme';

    /* =========================================
       TEMA
    ========================================= */

    function updateThemeIcon() {
        if (!themeToggleBtn) return;

        const icon = themeToggleBtn.querySelector('i');
        const isDark = body.classList.contains('dark-theme');

        icon.className = isDark
            ? 'fas fa-sun'
            : 'fas fa-moon';

        themeToggleBtn.setAttribute(
            'aria-label',
            isDark ? 'Ativar modo claro' : 'Ativar modo escuro'
        );
    }

    function loadTheme() {
        const savedTheme = localStorage.getItem(STORAGE_KEY);

        if (savedTheme === 'dark') {
            body.classList.add('dark-theme');
        }

        updateThemeIcon();
    }

    function toggleTheme() {
        body.classList.toggle('dark-theme');

        const isDark = body.classList.contains('dark-theme');

        localStorage.setItem(
            STORAGE_KEY,
            isDark ? 'dark' : 'light'
        );

        updateThemeIcon();
    }

    themeToggleBtn?.addEventListener('click', toggleTheme);

    loadTheme();


    /* =========================================
       ATUALIZAÇÃO
    ========================================= */

    async function refreshDashboard() {
        if (!refreshBtn) return;

        const originalContent = refreshBtn.innerHTML;

        refreshBtn.disabled = true;
        refreshBtn.classList.add('loading');

        refreshBtn.innerHTML = `
            <i class="fas fa-circle-notch fa-spin"></i>
            <span>Atualizando...</span>
        `;

        try {
            /*
             * Aqui você pode conectar sua API real.
             *
             * Exemplo:
             *
             * const data = await fetchTrafficData(
             *     -23.5505,
             *     -46.6333
             * );
             *
             * updateDashboard(data);
             */

            await new Promise(resolve => setTimeout(resolve, 1200));

            showToast(
                'Dados atualizados com sucesso!',
                'success'
            );
        } catch (error) {
            console.error(error);

            showToast(
                'Não foi possível atualizar os dados.',
                'error'
            );
        } finally {
            refreshBtn.disabled = false;
            refreshBtn.classList.remove('loading');
            refreshBtn.innerHTML = originalContent;
        }
    }

    refreshBtn?.addEventListener('click', refreshDashboard);


    /* =========================================
       TOAST
    ========================================= */

    function showToast(message, type = 'success') {
        const existingToast = document.querySelector('.toast');

        if (existingToast) {
            existingToast.remove();
        }

        const toast = document.createElement('div');

        toast.className = `toast toast-${type}`;

        toast.innerHTML = `
            <div class="toast-icon">
                <i class="fas ${
                    type === 'success'
                        ? 'fa-check-circle'
                        : 'fa-exclamation-circle'
                }"></i>
            </div>

            <div class="toast-content">
                <strong>
                    ${type === 'success' ? 'Tudo certo!' : 'Ops!'}
                </strong>

                <span>${message}</span>
            </div>

            <button class="toast-close" aria-label="Fechar">
                <i class="fas fa-times"></i>
            </button>
        `;

        document.body.appendChild(toast);

        requestAnimationFrame(() => {
            toast.classList.add('show');
        });

        toast
            .querySelector('.toast-close')
            ?.addEventListener('click', () => {
                closeToast(toast);
            });

        setTimeout(() => {
            closeToast(toast);
        }, 4000);
    }

    function closeToast(toast) {
        toast.classList.remove('show');

        setTimeout(() => {
            toast.remove();
        }, 300);
    }


    /* =========================================
       NAVEGAÇÃO SUAVE
    ========================================= */

    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', event => {
            const targetId = link.getAttribute('href');

            if (!targetId || targetId === '#') return;

            const target = document.querySelector(targetId);

            if (!target) return;

            event.preventDefault();

            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    });


    /* =========================================
       MENU ATIVO
    ========================================= */

    const sections = document.querySelectorAll('main section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;

                navLinks.forEach(link => {
                    link.classList.remove('active');

                    if (
                        link.getAttribute('href') ===
                        `#${entry.target.id}`
                    ) {
                        link.classList.add('active');
                    }
                });
            });
        },
        {
            threshold: 0.35
        }
    );

    sections.forEach(section => observer.observe(section));


    /* =========================================
       FORMULÁRIO DE ROTAS
    ========================================= */

    const routeForm = document.getElementById('routeForm');
    const routeResults = document.getElementById('routeResults');

    routeForm?.addEventListener('submit', event => {
        event.preventDefault();

        const origin = document
            .getElementById('origin')
            ?.value
            .trim();

        const destination = document
            .getElementById('destination')
            ?.value
            .trim();

        if (!origin || !destination) return;

        routeResults.classList.remove('hidden');

        routeResults.innerHTML = `
            <div class="route-loading">
                <div class="route-loader">
                    <i class="fas fa-route"></i>
                </div>

                <div>
                    <strong>Analisando melhor rota...</strong>
                    <span>
                        Nossa inteligência está verificando
                        as condições do trânsito.
                    </span>
                </div>
            </div>
        `;

        setTimeout(() => {
            routeResults.innerHTML = `
                <div class="route-result">
                    <div class="route-result-header">
                        <div>
                            <span class="result-label">
                                MELHOR ROTA
                            </span>

                            <h3>
                                <i class="fas fa-bolt"></i>
                                Rota mais rápida
                            </h3>
                        </div>

                        <span class="route-badge">
                            <i class="fas fa-check"></i>
                            Recomendada
                        </span>
                    </div>

                    <div class="route-metrics">
                        <div>
                            <i class="fas fa-clock"></i>
                            <strong>31 min</strong>
                            <span>tempo estimado</span>
                        </div>

                        <div>
                            <i class="fas fa-road"></i>
                            <strong>12,4 km</strong>
                            <span>distância</span>
                        </div>

                        <div>
                            <i class="fas fa-traffic-light"></i>
                            <strong>Moderado</strong>
                            <span>trânsito</span>
                        </div>
                    </div>

                    <div class="route-path">
                        <span>${origin}</span>

                        <div class="route-line">
                            <i class="fas fa-circle"></i>
                            <span></span>
                            <i class="fas fa-location-dot"></i>
                        </div>

                        <span>${destination}</span>
                    </div>
                </div>
            `;
        }, 1000);
    });
});
