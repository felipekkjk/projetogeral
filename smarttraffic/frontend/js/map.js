// frontend/js/map.js

let map = null;
let trafficLayer = null;
let incidentLayer = null;

const DEFAULT_LOCATION = {
    lat: -23.5505,
    lng: -46.6333,
    zoom: 13
};


/**
 * Inicializa o mapa.
 */
function initMap() {
    if (typeof L === 'undefined') {
        console.error('Leaflet não foi carregado.');
        return;
    }

    if (map) {
        map.remove();
    }

    map = L.map('map', {
        zoomControl: false,
        attributionControl: true
    }).setView(
        [DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lng],
        DEFAULT_LOCATION.zoom
    );


    /* =========================================
       CONTROLES
    ========================================= */

    L.control.zoom({
        position: 'bottomright'
    }).addTo(map);


    /* =========================================
       MAPA
    ========================================= */

    const lightTiles = L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
            maxZoom: 19,
            attribution:
                '&copy; OpenStreetMap contributors'
        }
    );

    lightTiles.addTo(map);


    /* =========================================
       MARCADOR PRINCIPAL
    ========================================= */

    const trafficIcon = L.divIcon({
        className: 'custom-map-marker',
        html: `
            <div class="map-marker-pulse"></div>

            <div class="map-marker">
                <i class="fas fa-car"></i>
            </div>
        `,
        iconSize: [50, 50],
        iconAnchor: [25, 25],
        popupAnchor: [0, -25]
    });

    L.marker(
        [DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lng],
        {
            icon: trafficIcon
        }
    )
        .addTo(map)
        .bindPopup(`
            <div class="map-popup">
                <div class="popup-icon">
                    <i class="fas fa-traffic-light"></i>
                </div>

                <div>
                    <strong>SmartTraffic</strong>

                    <span>
                        Monitoramento ativo
                    </span>

                    <small>
                        São Paulo • Tempo real
                    </small>
                </div>
            </div>
        `)
        .openPopup();


    /* =========================================
       CAMADAS DE TRÂNSITO
    ========================================= */

    trafficLayer = L.layerGroup().addTo(map);
    incidentLayer = L.layerGroup().addTo(map);


    /* =========================================
       EXEMPLO DE PONTOS DE TRÂNSITO
    ========================================= */

    addTrafficPoint(
        -23.5505,
        -46.6333,
        'high',
        'Congestionamento intenso'
    );

    addTrafficPoint(
        -23.5596,
        -46.6582,
        'medium',
        'Fluxo moderado'
    );

    addTrafficPoint(
        -23.5489,
        -46.6388,
        'low',
        'Trânsito fluindo'
    );


    setTimeout(() => {
        map.invalidateSize();
    }, 300);
}


/**
 * Adiciona ponto de trânsito no mapa.
 */
function addTrafficPoint(
    lat,
    lng,
    level,
    description
) {
    if (!map || !trafficLayer) return;

    const colors = {
        low: '#22c55e',
        medium: '#f59e0b',
        high: '#ef4444'
    };

    const color = colors[level] || colors.medium;

    const icon = L.divIcon({
        className: 'traffic-point-wrapper',

        html: `
            <div
                class="traffic-point"
                style="--traffic-color: ${color}"
            >
                <span></span>
            </div>
        `,

        iconSize: [20, 20],
        iconAnchor: [10, 10]
    });

    L.marker([lat, lng], { icon })
        .addTo(trafficLayer)
        .bindTooltip(description, {
            direction: 'top',
            offset: [0, -8]
        });
}


/**
 * Adiciona incidente.
 */
function addIncident(
    lat,
    lng,
    title,
    description
) {
    if (!map || !incidentLayer) return;

    const icon = L.divIcon({
        className: 'incident-marker',

        html: `
            <div>
                <i class="fas fa-triangle-exclamation"></i>
            </div>
        `,

        iconSize: [40, 40],
        iconAnchor: [20, 20]
    });

    L.marker([lat, lng], { icon })
        .addTo(incidentLayer)
        .bindPopup(`
            <div class="map-popup">
                <div class="popup-icon danger">
                    <i class="fas fa-triangle-exclamation"></i>
                </div>

                <div>
                    <strong>${title}</strong>

                    <span>
                        ${description}
                    </span>
                </div>
            </div>
        `);
}


/**
 * Centraliza o mapa em determinada localização.
 */
function centerMap(lat, lng, zoom = 15) {
    if (!map) return;

    map.flyTo(
        [lat, lng],
        zoom,
        {
            duration: 1.2
        }
    );
}


document.addEventListener(
    'DOMContentLoaded',
    initMap
);
