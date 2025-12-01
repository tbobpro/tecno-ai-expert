// leaderboard.js - Полная исправленная версия без автообновления

const scriptURL = 'https://script.google.com/macros/s/AKfycbwX3KwItg5OETAjxrH9pG59adqBsz68e-Cwsqnlh4FyZVMDIhT1nmk8-VomGR9ZEz_d/exec';

// Глобальные переменные
let currentLeaderboardType = 'overall';
let currentData = [];
let cachedOverallData = null;
let currentCategory = '';
let currentSearchParticipant = '';
let currentSearchNetwork = '';
let currentSearchCity = '';
let currentSearchResults = null;
let isInitialLoad = true;
let refreshInProgress = false;

// Функция для отрисовки общего лидерборда
function renderOverallLeaderboard(data) {
    const table = document.getElementById('leaderboardTable');
    const tbody = document.getElementById('leaderboardBody');
    const tableHeader = document.getElementById('tableHeader');
    const loading = document.getElementById('loading');
    const noData = document.getElementById('noData');
    
    if (data && data.length > 0) {
        tableHeader.innerHTML = `
            <th class="rank">Место</th>
            <th>Участник</th>
            <th>Должность</th>
            <th>Город</th>
            <th>Сеть</th>
            <th class="store-address">Адрес магазина</th>
            <th>Общее время</th>
        `;
        
        tbody.innerHTML = '';
        data.forEach((participant, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="rank rank-${index + 1}">${index + 1}</td>
                <td class="participant-name">${participant.participant}</td>
                <td>${participant.participantRole}</td>
                <td>${participant.city}</td>
                <td>${participant.network}</td>
                <td class="store-address">${participant.storeAddress}</td>
                <td>${participant.totalTime}</td>
            `;
            tbody.appendChild(row);
        });
        
        loading.style.display = 'none';
        table.style.display = 'table';
        noData.style.display = 'none';
    } else {
        loading.style.display = 'none';
        table.style.display = 'none';
        noData.style.display = 'block';
        noData.innerHTML = '<p>Нет данных для отображения</p>';
    }
}

// Улучшенная функция для загрузки общего лидерборда
async function loadOverallLeaderboard(forceRefresh = false) {
    if (cachedOverallData && !forceRefresh) {
        currentData = cachedOverallData;
        renderOverallLeaderboard(currentData);
        return;
    }
    
    try {
        const loading = document.getElementById('loading');
        const noData = document.getElementById('noData');
        
        loading.style.display = 'block';
        noData.style.display = 'none';
        
        const timestamp = new Date().getTime();
        const url = `${scriptURL}?action=getLeaderboard&t=${timestamp}`;
        
        console.log('Загрузка общего зачета по URL:', url);
        
        const response = await fetch(url);
        
        console.log('Статус ответа:', response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const responseText = await response.text();
        console.log('Получен ответ:', responseText);
        
        let data;
        try {
            data = JSON.parse(responseText);
        } catch (parseError) {
            console.error('Ошибка парсинга JSON:', parseError);
            throw new Error('Неверный формат данных от сервера');
        }
        
        // Проверяем структуру ответа
        if (data && data.result === 'success' && Array.isArray(data.data)) {
            cachedOverallData = data.data;
            currentData = data.data;
            
            renderOverallLeaderboard(data.data);
            
            if (isInitialLoad) {
                // Загружаем все фильтры после загрузки данных
                loadAllFilters();
                isInitialLoad = false;
            }
        } else if (data && data.result === 'error') {
            throw new Error(data.message || 'Ошибка сервера');
        } else {
            throw new Error('Неверный формат данных');
        }
        
    } catch (error) {
        console.error('Ошибка загрузки общего зачета:', error);
        const loading = document.getElementById('loading');
        const noData = document.getElementById('noData');
        
        loading.style.display = 'none';
        noData.style.display = 'block';
        noData.innerHTML = `
            <p>Ошибка загрузки данных: ${error.message}</p>
            <p>Проверьте подключение к интернету и попробуйте обновить страницу.</p>
            <button onclick="loadOverallLeaderboard(true)" class="refresh-btn" style="margin-top: 10px;">
                <i class="fas fa-sync-alt"></i> Попробовать снова
            </button>
        `;
        
        currentData = [];
    }
}

// НОВАЯ ФУНКЦИЯ: Загрузка всех фильтров (сетей и городов)
async function loadAllFilters() {
    try {
        const timestamp = new Date().getTime();
        const url = `${scriptURL}?action=getAllNetworksAndCities&t=${timestamp}`;
        
        console.log('Загрузка фильтров по URL:', url);
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const responseText = await response.text();
        const result = JSON.parse(responseText);
        
        if (result.result === 'success' && result.data) {
            const networks = result.data.networks || [];
            const cities = result.data.cities || [];
            
            populateFilters(networks, cities);
            console.log('Фильтры загружены: сети -', networks.length, 'города -', cities.length);
        } else {
            throw new Error(result.message || 'Ошибка загрузки фильтров');
        }
        
    } catch (error) {
        console.error('Ошибка загрузки фильтров:', error);
        // Используем данные из общего зачета как запасной вариант
        if (currentData && currentData.length > 0) {
            const networks = [...new Set(currentData.map(p => p.network).filter(n => n))].sort();
            const cities = [...new Set(currentData.map(p => p.city).filter(c => c))].sort();
            populateFilters(networks, cities);
        }
    }
}

// ИСПРАВЛЕННАЯ ФУНКЦИЯ: Заполнение фильтров из всех данных
function populateFilters(networks, cities) {
    const networkFilter = document.getElementById('networkFilter');
    const cityFilter = document.getElementById('cityFilter');
    const searchNetwork = document.getElementById('searchNetwork');
    const searchCity = document.getElementById('searchCity');
    
    // Очищаем существующие опции (кроме первой)
    clearSelectOptions(networkFilter);
    clearSelectOptions(cityFilter);
    clearSelectOptions(searchNetwork);
    clearSelectOptions(searchCity);
    
    // Заполняем фильтры для общего зачета
    networks.forEach(network => {
        const option = document.createElement('option');
        option.value = network;
        option.textContent = network;
        networkFilter.appendChild(option);
        
        const searchOption = option.cloneNode(true);
        searchNetwork.appendChild(searchOption);
    });
    
    cities.forEach(city => {
        const option = document.createElement('option');
        option.value = city;
        option.textContent = city;
        cityFilter.appendChild(option);
        
        const searchOption = option.cloneNode(true);
        searchCity.appendChild(searchOption);
    });
    
    // Добавляем обработчики событий
    networkFilter.addEventListener('change', filterLeaderboard);
    cityFilter.addEventListener('change', filterLeaderboard);
}

// Функция для очистки опций select (кроме первой)
function clearSelectOptions(selectElement) {
    while (selectElement.options.length > 1) {
        selectElement.remove(1);
    }
}

// Функция для фильтрации таблицы
function filterLeaderboard() {
    if (currentLeaderboardType !== 'overall' || !currentData || currentData.length === 0) return;
    
    const networkFilter = document.getElementById('networkFilter').value;
    const cityFilter = document.getElementById('cityFilter').value;
    const tbody = document.getElementById('leaderboardBody');
    
    tbody.innerHTML = '';
    
    const filteredData = currentData.filter(participant => {
        const networkMatch = !networkFilter || participant.network === networkFilter;
        const cityMatch = !cityFilter || participant.city === cityFilter;
        return networkMatch && cityMatch;
    });
    
    filteredData.forEach((participant, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="rank rank-${index + 1}">${index + 1}</td>
            <td class="participant-name">${participant.participant}</td>
            <td>${participant.participantRole}</td>
            <td>${participant.city}</td>
            <td>${participant.network}</td>
            <td class="store-address">${participant.storeAddress}</td>
            <td>${participant.totalTime}</td>
        `;
        tbody.appendChild(row);
    });
    
    const table = document.getElementById('leaderboardTable');
    const noData = document.getElementById('noData');
    
    if (filteredData.length === 0) {
        table.style.display = 'none';
        noData.style.display = 'block';
        noData.innerHTML = '<p>Нет данных для выбранных фильтров</p>';
    } else {
        table.style.display = 'table';
        noData.style.display = 'none';
    }
}

// Функция для загрузки лидерборда по категории
async function loadCategoryLeaderboard(category) {
    if (!category) return;
    
    try {
        const loading = document.getElementById('loading');
        const table = document.getElementById('leaderboardTable');
        const tbody = document.getElementById('leaderboardBody');
        const tableHeader = document.getElementById('tableHeader');
        const noData = document.getElementById('noData');
        
        loading.style.display = 'block';
        noData.style.display = 'none';
        
        const timestamp = new Date().getTime();
        const url = `${scriptURL}?action=getCategoryLeaderboard&category=${encodeURIComponent(category)}&t=${timestamp}`;
        
        console.log('Загрузка категории по URL:', url);
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const responseText = await response.text();
        const result = JSON.parse(responseText);
        
        if (result.result === 'success' && Array.isArray(result.data)) {
            const data = result.data;
            
            if (data && data.length > 0) {
                tableHeader.innerHTML = `
                    <th class="rank">Место</th>
                    <th>Участник</th>
                    <th>Должность</th>
                    <th>Город</th>
                    <th>Сеть</th>
                    <th class="store-address">Адрес магазина</th>
                    <th>Время</th>
                `;
                
                tbody.innerHTML = '';
                data.forEach((participant, index) => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td class="rank rank-${index + 1}">${index + 1}</td>
                        <td class="participant-name">${participant.participant}</td>
                        <td>${participant.participantRole}</td>
                        <td>${participant.city}</td>
                        <td>${participant.network}</td>
                        <td class="store-address">${participant.storeAddress}</td>
                        <td>${participant.time}</td>
                    `;
                    tbody.appendChild(row);
                });
                
                loading.style.display = 'none';
                table.style.display = 'table';
                noData.style.display = 'none';
            } else {
                loading.style.display = 'none';
                table.style.display = 'none';
                noData.style.display = 'block';
                noData.innerHTML = '<p>Нет данных для выбранной категории</p>';
            }
        } else {
            throw new Error(result.message || 'Ошибка загрузки данных категории');
        }
        
    } catch (error) {
        console.error('Ошибка загрузки данных категории:', error);
        const loading = document.getElementById('loading');
        const noData = document.getElementById('noData');
        
        loading.style.display = 'none';
        noData.style.display = 'block';
        noData.innerHTML = `<p>Ошибка загрузки данных: ${error.message}</p>`;
    }
}

// ИСПРАВЛЕННАЯ ФУНКЦИЯ: Поиск участника с обязательными полями
async function searchParticipant(participantName, network, city) {
    try {
        // ИЗМЕНЕНИЕ: Проверка обязательных полей
        if (!network || !city) {
            showTempMessage('Для поиска необходимо выбрать сеть и город', 'error');
            return;
        }

        const searchBtn = document.getElementById('searchBtn');
        const loading = document.getElementById('loading');
        const searchResults = document.getElementById('searchResults');
        const searchNoData = document.getElementById('searchNoData');
        
        // Показываем загрузку в кнопке поиска
        searchBtn.disabled = true;
        searchBtn.classList.add('loading');
        searchResults.style.display = 'none';
        searchNoData.style.display = 'none';
        loading.style.display = 'block';
        
        const params = new URLSearchParams({
            action: 'searchParticipant',
            participant: participantName,
            network: network,
            city: city,
            t: new Date().getTime()
        });
        
        const url = `${scriptURL}?${params.toString()}`;
        console.log('Поиск участника по URL:', url);
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const responseText = await response.text();
        const data = JSON.parse(responseText);
        
        loading.style.display = 'none';
        searchBtn.disabled = false;
        searchBtn.classList.remove('loading');
        
        if (data.result === 'error') {
            throw new Error(data.message || 'Ошибка сервера');
        }
        
        if (data.result === 'success' && data.data && data.data.length > 0) {
            currentSearchResults = data.data;
            renderSearchResults(data.data, participantName, network, city);
            showTempMessage('Участник найден!', 'success');
        } else {
            currentSearchResults = null;
            searchNoData.style.display = 'block';
            searchNoData.innerHTML = `<p>Участник "${participantName}" в сети "${network}" в городе "${city}" не найден или не имеет результатов</p>`;
            showTempMessage('Участник не найден', 'info');
        }
        
    } catch (error) {
        console.error('Ошибка поиска:', error);
        const searchBtn = document.getElementById('searchBtn');
        const loading = document.getElementById('loading');
        
        loading.style.display = 'none';
        searchBtn.disabled = false;
        searchBtn.classList.remove('loading');
        
        const searchNoData = document.getElementById('searchNoData');
        searchNoData.style.display = 'block';
        searchNoData.innerHTML = `<p>Ошибка при поиске участника: ${error.message}</p>`;
        showTempMessage('Ошибка при поиске', 'error');
    }
}

// Функция для отрисовки результатов поиска
function renderSearchResults(data, participantName, network, city) {
    const searchResults = document.getElementById('searchResults');
    const participantInfo = document.getElementById('participantInfo');
    const searchResultsBody = document.getElementById('searchResultsBody');
    const searchNoData = document.getElementById('searchNoData');
    
    // Обновляем информацию об участнике
    let infoHTML = `<strong>Участник:</strong> ${participantName}`;
    infoHTML += `<br><strong>Сеть:</strong> ${network}`;
    infoHTML += `<br><strong>Город:</strong> ${city}`;
    infoHTML += `<br><strong>Найдено категорий:</strong> ${data.length}`;
    
    participantInfo.innerHTML = infoHTML;
    
    // Заполняем таблицу
    searchResultsBody.innerHTML = '';
    data.forEach(item => {
        const row = document.createElement('tr');
        
        // Определяем CSS класс для места
        let rankClass = '';
        if (item.rank === 1) rankClass = 'rank-1';
        else if (item.rank === 2) rankClass = 'rank-2';
        else if (item.rank === 3) rankClass = 'rank-3';
        
        row.innerHTML = `
            <td>${item.category}</td>
            <td>${item.bestTime}</td>
            <td class="rank ${rankClass}">${item.rank}</td>
            <td>${item.totalParticipants}</td>
        `;
        searchResultsBody.appendChild(row);
    });
    
    searchResults.style.display = 'block';
    searchNoData.style.display = 'none';
}

// Функция для переключения типа лидерборда
function switchLeaderboardType(type) {
    currentLeaderboardType = type;
    
    const overallBtn = document.querySelector('[data-type="overall"]');
    const categoryBtn = document.querySelector('[data-type="category"]');
    const searchBtn = document.querySelector('[data-type="search"]');
    const filters = document.querySelector('.filters');
    const categorySelector = document.getElementById('categorySelector');
    const searchSection = document.getElementById('searchSection');
    const leaderboardTable = document.getElementById('leaderboardTable');
    const loading = document.getElementById('loading');
    const noData = document.getElementById('noData');
    
    // Сбрасываем активные классы
    overallBtn.classList.remove('active');
    categoryBtn.classList.remove('active');
    searchBtn.classList.remove('active');
    
    // Скрываем все секции
    filters.style.display = 'none';
    categorySelector.style.display = 'none';
    searchSection.style.display = 'none';
    leaderboardTable.style.display = 'none';
    loading.style.display = 'none';
    noData.style.display = 'none';
    
    if (type === 'overall') {
        overallBtn.classList.add('active');
        filters.style.display = 'flex';
        loadOverallLeaderboard(false);
    } else if (type === 'category') {
        categoryBtn.classList.add('active');
        categorySelector.style.display = 'flex';
        // Восстанавливаем выбранную категорию
        if (currentCategory) {
            document.getElementById('categoryFilter').value = currentCategory;
            loadCategoryLeaderboard(currentCategory);
        }
    } else if (type === 'search') {
        searchBtn.classList.add('active');
        searchSection.style.display = 'block';
        
        // Восстанавливаем значения полей поиска
        document.getElementById('searchParticipant').value = currentSearchParticipant;
        document.getElementById('searchNetwork').value = currentSearchNetwork;
        document.getElementById('searchCity').value = currentSearchCity;
        
        // Восстанавливаем результаты поиска, если они есть
        if (currentSearchResults) {
            renderSearchResults(currentSearchResults, currentSearchParticipant, currentSearchNetwork, currentSearchCity);
        }
    }
}

// Функция для принудительного обновления данных
async function refreshLeaderboard() {
    if (refreshInProgress) return;
    
    const refreshBtn = document.getElementById('refreshBtn');
    refreshInProgress = true;
    refreshBtn.disabled = true;
    refreshBtn.classList.add('loading');
    
    try {
        if (currentLeaderboardType === 'overall') {
            await loadOverallLeaderboard(true);
        } else if (currentLeaderboardType === 'category') {
            const category = document.getElementById('categoryFilter').value;
            if (category) {
                await loadCategoryLeaderboard(category);
            }
        } else if (currentLeaderboardType === 'search') {
            // Обновляем результаты поиска
            const participantName = document.getElementById('searchParticipant').value.trim();
            const network = document.getElementById('searchNetwork').value;
            const city = document.getElementById('searchCity').value;
            
            if (participantName && network && city) {
                await searchParticipant(participantName, network, city);
            }
        }
        
        showTempMessage('Данные успешно обновлены', 'success');
    } catch (error) {
        console.error('Ошибка при обновлении:', error);
        showTempMessage('Ошибка при обновлении данных', 'error');
    } finally {
        refreshInProgress = false;
        refreshBtn.disabled = false;
        refreshBtn.classList.remove('loading');
    }
}

// Функция для показа временного сообщения
function showTempMessage(message, type = 'info') {
    // Удаляем существующие сообщения
    const existingMessages = document.querySelectorAll('.temp-message');
    existingMessages.forEach(msg => msg.remove());
    
    const messageEl = document.createElement('div');
    messageEl.className = `temp-message temp-message-${type}`;
    messageEl.textContent = message;
    messageEl.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 8px;
        color: white;
        font-weight: bold;
        z-index: 10000;
        transition: all 0.3s ease;
        opacity: 0;
        transform: translateY(-10px);
    `;
    
    document.body.appendChild(messageEl);
    
    // Анимация появления
    setTimeout(() => {
        messageEl.style.opacity = '1';
        messageEl.style.transform = 'translateY(0)';
    }, 10);
    
    // Автоматическое скрытие через 3 секунды
    setTimeout(() => {
        messageEl.style.opacity = '0';
        messageEl.style.transform = 'translateY(-10px)';
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.parentNode.removeChild(messageEl);
            }
        }, 300);
    }, 3000);
}

// Функция для закрытия вкладки
function closeTab() {
    if (window.history.length > 1) {
        window.history.back();
    } else {
        window.close();
        
        setTimeout(function() {
            if (!window.closed) {
                alert('Вкладка не может быть закрыта автоматически. Пожалуйста, закройте её вручную.');
            }
        }, 100);
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Загружаем общий лидерборд по умолчанию
    loadOverallLeaderboard();
    
    // Обработчики для переключения типа лидерборда
    document.querySelectorAll('.type-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const type = this.getAttribute('data-type');
            switchLeaderboardType(type);
        });
    });
    
    // Обработчик для выбора категории
    document.getElementById('categoryFilter').addEventListener('change', function() {
        currentCategory = this.value;
        if (currentCategory) {
            loadCategoryLeaderboard(currentCategory);
        } else {
            const table = document.getElementById('leaderboardTable');
            const tbody = document.getElementById('leaderboardBody');
            const noData = document.getElementById('noData');
            
            table.style.display = 'none';
            tbody.innerHTML = '';
            noData.style.display = 'block';
            noData.innerHTML = '<p>Выберите категорию для просмотра</p>';
        }
    });

    // Обработчик для кнопки обновления
    document.getElementById('refreshBtn').addEventListener('click', refreshLeaderboard);
    
    // ИСПРАВЛЕННЫЙ ОБРАБОТЧИК: Поиск участника с проверкой обязательных полей
    document.getElementById('searchBtn').addEventListener('click', function() {
        const participantName = document.getElementById('searchParticipant').value.trim();
        const network = document.getElementById('searchNetwork').value;
        const city = document.getElementById('searchCity').value;
        
        // Проверка заполнения всех обязательных полей
        if (!participantName) {
            showTempMessage('Пожалуйста, введите имя участника', 'error');
            document.getElementById('searchParticipant').focus();
            return;
        }
        
        if (!network) {
            showTempMessage('Пожалуйста, выберите сеть', 'error');
            document.getElementById('searchNetwork').focus();
            return;
        }
        
        if (!city) {
            showTempMessage('Пожалуйста, выберите город', 'error');
            document.getElementById('searchCity').focus();
            return;
        }
        
        currentSearchParticipant = participantName;
        currentSearchNetwork = network;
        currentSearchCity = city;
        searchParticipant(participantName, network, city);
    });
    
    // Добавляем поддержку поиска по Enter
    document.getElementById('searchParticipant').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            document.getElementById('searchBtn').click();
        }
    });
    
    // Обработчик для кнопки закрытия вкладки
    document.getElementById('closeTabBtn').addEventListener('click', closeTab);
    
    // Добавляем поддержку обновления по F5
    document.addEventListener('keydown', function(e) {
        if (e.key === 'F5') {
            e.preventDefault();
            refreshLeaderboard();
        }
    });
});
