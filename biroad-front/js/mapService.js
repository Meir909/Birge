// Сервис для работы с картами и геолокацией
class MapService {
    constructor() {
        this.map = null;
        this.markers = [];
        this.routes = [];
        this.geocoder = null;
        this.directionsService = null;
        this.currentLocation = null;
        this.init();
    }

    async init() {
        try {
            // Инициализация Google Maps
            await this.loadGoogleMaps();
            this.setupServices();
            this.getCurrentLocation();
        } catch (error) {
            console.error('Ошибка инициализации карт:', error);
            this.fallbackToStaticMap();
        }
    }

    // Загрузка Google Maps API
    loadGoogleMaps() {
        return new Promise((resolve, reject) => {
            if (window.google && window.google.maps) {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${window.CONFIG.MAPS.GOOGLE_MAPS_API_KEY}&libraries=places,geometry&callback=initMaps`;
            script.async = true;
            script.defer = true;

            window.initMaps = () => {
                resolve();
            };

            script.onerror = () => {
                reject(new Error('Не удалось загрузить Google Maps API'));
            };

            document.head.appendChild(script);
        });
    }

    // Настройка сервисов Google Maps
    setupServices() {
        this.geocoder = new google.maps.Geocoder();
        this.directionsService = new google.maps.DirectionsService();
        this.directionsRenderer = new google.maps.DirectionsRenderer();
    }

    // Инициализация карты
    initMap(containerId, options = {}) {
        const mapOptions = {
            center: window.CONFIG.MAP_SETTINGS.DEFAULT_CENTER,
            zoom: window.CONFIG.MAP_SETTINGS.DEFAULT_ZOOM,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            styles: this.getMapStyles(),
            disableDefaultUI: false,
            zoomControl: true,
            streetViewControl: false,
            fullscreenControl: false,
            ...options
        };

        this.map = new google.maps.Map(document.getElementById(containerId), mapOptions);
        
        // Добавляем контролы
        this.addCustomControls();
        
        return this.map;
    }

    // Стили для карты
    getMapStyles() {
        return [
            {
                featureType: "poi",
                elementType: "labels",
                stylers: [{ visibility: "off" }]
            },
            {
                featureType: "transit",
                elementType: "labels",
                stylers: [{ visibility: "off" }]
            }
        ];
    }

    // Добавление кастомных контролов
    addCustomControls() {
        // Кнопка геолокации
        const locationControl = document.createElement('div');
        locationControl.innerHTML = `
            <button class="map-control-btn" onclick="mapService.centerOnUser()">
                <span class="material-symbols-outlined">my_location</span>
            </button>
        `;
        locationControl.style.marginTop = '10px';
        locationControl.style.marginRight = '10px';
        
        this.map.controls[google.maps.ControlPosition.RIGHT_TOP].push(locationControl);
    }

    // Получение текущего местоположения
    getCurrentLocation() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Геолокация не поддерживается'));
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.currentLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    resolve(this.currentLocation);
                },
                (error) => {
                    console.error('Ошибка геолокации:', error);
                    reject(error);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 300000
                }
            );
        });
    }

    // Центрирование на местоположении пользователя
    async centerOnUser() {
        try {
            const location = await this.getCurrentLocation();
            if (this.map) {
                this.map.setCenter(location);
                this.map.setZoom(15);
                
                // Добавляем маркер пользователя
                this.addUserMarker(location);
            }
        } catch (error) {
            console.error('Ошибка центрирования:', error);
        }
    }

    // Добавление маркера пользователя
    addUserMarker(location) {
        // Удаляем старый маркер пользователя
        this.removeUserMarker();
        
        const marker = new google.maps.Marker({
            position: location,
            map: this.map,
            title: 'Ваше местоположение',
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 8,
                fillColor: '#2463eb',
                fillOpacity: 1,
                strokeColor: '#ffffff',
                strokeWeight: 2
            },
            zIndex: 1000
        });

        this.userMarker = marker;
    }

    // Удаление маркера пользователя
    removeUserMarker() {
        if (this.userMarker) {
            this.userMarker.setMap(null);
            this.userMarker = null;
        }
    }

    // Геокодирование (адрес → координаты)
    async geocodeAddress(address) {
        return new Promise((resolve, reject) => {
            this.geocoder.geocode({ address: address }, (results, status) => {
                if (status === google.maps.GeocoderStatus.OK) {
                    resolve(results[0].geometry.location);
                } else {
                    reject(new Error(`Геокодирование не удалось: ${status}`));
                }
            });
        });
    }

    // Обратное геокодирование (координаты → адрес)
    async reverseGeocode(lat, lng) {
        return new Promise((resolve, reject) => {
            const latlng = { lat: parseFloat(lat), lng: parseFloat(lng) };
            
            this.geocoder.geocode({ location: latlng }, (results, status) => {
                if (status === google.maps.GeocoderStatus.OK) {
                    resolve(results[0]);
                } else {
                    reject(new Error(`Обратное геокодирование не удалось: ${status}`));
                }
            });
        });
    }

    // Построение маршрута
    async calculateRoute(origin, destination, waypoints = []) {
        return new Promise((resolve, reject) => {
            const request = {
                origin: origin,
                destination: destination,
                waypoints: waypoints.map(wp => ({ location: wp, stopover: false })),
                travelMode: google.maps.TravelMode.DRIVING,
                unitSystem: google.maps.UnitSystem.METRIC,
                optimizeWaypoints: true,
                avoidTolls: false,
                avoidHighways: false
            };

            this.directionsService.route(request, (result, status) => {
                if (status === google.maps.DirectionsStatus.OK) {
                    resolve(result);
                } else {
                    reject(new Error(`Построение маршрута не удалось: ${status}`));
                }
            });
        });
    }

    // Отображение маршрута на карте
    displayRoute(routeResult) {
        if (this.directionsRenderer) {
            this.directionsRenderer.setDirections(routeResult);
            this.directionsRenderer.setMap(this.map);
        }
        return routeResult;
    }

    // Добавление маркера группы
    addGroupMarker(groupData) {
        const marker = new google.maps.Marker({
            position: { lat: groupData.lat, lng: groupData.lng },
            map: this.map,
            title: groupData.name,
            icon: this.getGroupIcon(groupData),
            animation: google.maps.Animation.DROP
        });

        // Добавляем информационное окно
        const infoWindow = new google.maps.InfoWindow({
            content: this.createGroupInfoWindow(groupData)
        });

        marker.addListener('click', () => {
            infoWindow.open(this.map, marker);
        });

        this.markers.push(marker);
        return marker;
    }

    // Иконка для группы
    getGroupIcon(groupData) {
        const colors = {
            'active': '#10b981',
            'available': '#2463eb',
            'full': '#ef4444'
        };

        return {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: colors[groupData.status] || colors.available,
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2
        };
    }

    // Создание контента для информационного окна
    createGroupInfoWindow(groupData) {
        return `
            <div class="group-info-window">
                <h3>${groupData.name}</h3>
                <p><strong>Водитель:</strong> ${groupData.driver}</p>
                <p><strong>Мест:</strong> ${groupData.availableSeats}/${groupData.totalSeats}</p>
                <p><strong>Время:</strong> ${groupData.departureTime}</p>
                <button class="join-group-btn" data-group-id="${groupData.id}">
                    Присоединиться
                </button>
            </div>
        `;
    }

    // Поиск nearby групп
    async findNearbyGroups(location, radius = 5000) {
        try {
            // Здесь будет API вызов к вашему бэкенду
            const response = await fetch(window.getApiUrl('backend', `/groups/nearby?lat=${location.lat}&lng=${location.lng}&radius=${radius}`), {
                headers: window.getApiHeaders('backend', true)
            });

            if (!response.ok) {
                throw new Error('Ошибка поиска групп');
            }

            const groups = await response.json();
            
            // Отображаем группы на карте
            groups.forEach(group => {
                this.addGroupMarker(group);
            });

            return groups;
        } catch (error) {
            console.error('Ошибка поиска nearby групп:', error);
            return this.getMockNearbyGroups(location);
        }
    }

    // Мок данные для nearby групп (для демонстрации)
    getMockNearbyGroups(location) {
        return [
            {
                id: 'group1',
                name: 'Школа №123 - Утренняя группа',
                driver: 'Анна Петрова',
                lat: location.lat + 0.01,
                lng: location.lng + 0.01,
                availableSeats: 2,
                totalSeats: 4,
                departureTime: '08:00',
                status: 'available'
            },
            {
                id: 'group2',
                name: 'Лицей №15 - Вечерняя группа',
                driver: 'Иван Сидоров',
                lat: location.lat - 0.01,
                lng: location.lng - 0.01,
                availableSeats: 0,
                totalSeats: 3,
                departureTime: '17:30',
                status: 'full'
            }
        ];
    }

    // Очистка всех маркеров
    clearMarkers() {
        this.markers.forEach(marker => marker.setMap(null));
        this.markers = [];
    }

    // Очистка маршрутов
    clearRoutes() {
        if (this.directionsRenderer) {
            this.directionsRenderer.setDirections({ routes: [] });
        }
    }

    // Резервный вариант - статическая карта
    fallbackToStaticMap() {
        console.log('Используем статическую карту');
        // Здесь можно добавить интеграцию со статическими картами или другим провайдером
    }

    // Получение оптимального маршрута с помощью AI
    async getOptimalRoute(start, end, preferences = {}) {
        try {
            const response = await fetch(window.getApiUrl('ai', '/chat/completions'), {
                method: 'POST',
                headers: window.getApiHeaders('ai'),
                body: JSON.stringify({
                    model: window.CONFIG.AI_SETTINGS.ROUTE_MODEL,
                    messages: [
                        {
                            role: 'system',
                            content: window.CONFIG.AI_SETTINGS.SYSTEM_PROMPT
                        },
                        {
                            role: 'user',
                            content: `Построй оптимальный маршрут для карпула из точки A в точку B с учетом предпочтений: ${JSON.stringify(preferences)}. 
                            Начало: ${start}, Конец: ${end}. 
                            Учитывай пробки, безопасность, экономию топлива.`
                        }
                    ],
                    temperature: window.CONFIG.AI_SETTINGS.TEMPERATURE,
                    max_tokens: window.CONFIG.AI_SETTINGS.MAX_TOKENS
                })
            });

            if (!response.ok) {
                throw new Error('Ошибка AI API');
            }

            const result = await response.json();
            return result.choices[0].message.content;
        } catch (error) {
            console.error('Ошибка получения оптимального маршрута:', error);
            return null;
        }
    }

    // Поиск школ поблизости
    async findNearbySchools(location, radius = 10000) {
        try {
            const response = await fetch(window.getApiUrl('backend', `/schools/nearby?lat=${location.lat}&lng=${location.lng}&radius=${radius}`), {
                headers: window.getApiHeaders('backend', true)
            });

            if (!response.ok) {
                throw new Error('Ошибка поиска школ');
            }

            return await response.json();
        } catch (error) {
            console.error('Ошибка поиска школ:', error);
            return this.getMockSchools(location);
        }
    }

    // Мок данные для школ
    getMockSchools(location) {
        return [
            {
                id: 'school1',
                name: 'Школа №123',
                address: 'ул. Ленина, 123',
                lat: location.lat + 0.02,
                lng: location.lng + 0.02,
                type: 'school',
                rating: 4.5
            },
            {
                id: 'school2',
                name: 'Лицей №15',
                address: 'пр. Мира, 45',
                lat: location.lat - 0.02,
                lng: location.lng - 0.02,
                type: 'lyceum',
                rating: 4.8
            }
        ];
    }
}

// Инициализация сервиса карт
window.mapService = new MapService();
