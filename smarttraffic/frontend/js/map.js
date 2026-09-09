// frontend/js/map.js
let map;

function initMap() {
    // Coordenadas: São Paulo (-23.5505, -46.6333)
    const lat = -23.5505;
    const lng = -46.6333;

    // Se já existir um mapa carregado, limpa a instância
    if (map) {
        map.remove();
    }

    // Inicializa o mapa
    map = L.map('map').setView([lat, lng], 13);

    // Adiciona a camada do OpenStreetMap
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    // Adiciona um marcador de exemplo
    L.marker([lat, lng]).addTo(map)
        .bindPopup('<b>SmartTraffic</b><br>Monitoramento ativo nesta área.')
        .openPopup();

    // Força o Leaflet a recalcular o tamanho e desenhar os blocos
    setTimeout(() => {
        map.invalidateSize();
    }, 200);
}

// Executa a inicialização assim que o DOM estiver pronto
document.addEventListener('DOMContentLoaded', initMap);
