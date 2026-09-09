// frontend/js/main.js
document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('themeToggle');
    const refreshBtn = document.getElementById('refreshBtn');

    // Alternar Tema (Dark/Light)
    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        const icon = themeToggleBtn.querySelector('i');
        if (document.body.classList.contains('dark-theme')) {
            icon.className = 'fas fa-sun';
        } else {
            icon.className = 'fas fa-moon';
        }
    });

    // Ação do Botão Atualizar
    refreshBtn.addEventListener('click', () => {
        refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Atualizando...';
        setTimeout(() => {
            refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Atualizar';
            alert('Dados atualizados com sucesso!');
        }, 1200);
    });
});
