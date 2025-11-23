// leaderboard.js - Полностью переработанная версия

// URL скрипта Google Apps - ЗАМЕНИТЕ НА ВАШ РЕАЛЬНЫЙ URL
const scriptURL = 'https://script.google.com/macros/s/AKfycbx3bKqR2Vkb-DnZVEQIkTRfnBT3uiVRvyt4jmVcuqh5vfU-4W9p2xBsDOCf0j6JiUY/exec';

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

// Улучшенная функция для выполнения запросов
async function makeRequest(url, options = {}) {
    try {
        console.log('Выполняем запрос:', url);
        
        const response = await fetch(url, {
            method: 'GET',
            ...options,
            mode: 'cors',
            cache: 'no-cache'
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('Получен ответ:', result);
        return result;
        
    } catch (error) {
        console.error('Ошибка запроса:', error);
        throw error;
    }
}

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

// Функция для загрузки общего лидерборда
async function loadOverallLeaderboard(forceRefresh = false) {
    if (cachedOverallData && !forceRefresh) {
        currentData = cachedOverallData;
        renderOverallLeaderboard(currentData);
        return;
    }
    
    try {
        const loading = document.getElementById('loading');
        const noData = document.getElementById('noData');
        const table = document.getElementById('leaderboardTable');
        
        loading.style.display = 'block';
        table.style.display = 'none';
        noData.style.display = 'none';
        
        const timestamp = new Date().getTime();
        const url = `${scriptURL}?action=getLeaderboard&t=${timestamp}`;
        
        const result = await makeRequest(url);
        
        if (result && result.result === 'success') {
            cachedOverallData = result.data || [];
            currentData = cachedOverallData;
            
            renderOverallLeaderboard(currentData);
            
            if (isInitialLoad) {
                populateFilters(currentData);
                isInitialLoad = false;
            }
        } else if (result && result.result === 'error') {
            throw new Error(result.message);
        } else {
            throw new Error('Неверный формат ответа от сервера');
        }
        
    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        const loading = document.getElementById('loading');
        const noData = document.getElementById('noData');
        
        loading.style.display = 'none';
        noData.style.display = 'block';
        
        if (error.message.includes('Failed to fetch')) {
            noData.innerHTML = `
                <p>Ошибка подключения к серверу</p>
                <p style="font-size: 0.9rem; margin-top: 10px;">
                    Проверьте:<br>
                    - Интернет-подключение<br>
                    - URL скрипта в настройках<br>
                    - Настройки CORS в Google Apps Script
                </p>
            `;
        } else {
            noData.innerHTML = `<p>Ошибка загрузки данных: ${error.message}</p>`;
        }
        
        currentData = [];
    }
}

// Функция для загрузки лидерборда по категории
async function loadCategoryLeaderboard(category) {
    if (!category) return;
    
    try {
        const loading = document.getElementById('loading');
        const table = document.getElementById('leaderboardTable');
        const noData = document.getElementById('noData');
        
        loading.style.display = 'block';
        table.style.display = 'none';
        noData.style.display = 'none';
        
        const timestamp = new Date().getTime();
        const url = `${scriptURL}?action=getCategoryLeaderboard&category=${encodeURIComponent(category)}&t=${timestamp}`;
        
        const result = await makeRequest(url);
        
        const tbody = document.getElementById('leaderboardBody');
        const tableHeader = document.getElementById('tableHeader');
        
        if (result && result.result === 'success' && result.data && result.data.length > 0) {
            tableHeader.innerHTML = `
                <th class="rank">Место</th>
                <th>Участник</th>
                <th>Должность</th>
                <th>Город</th>
                <th>Сеть</th>
                <th>Время</th>
            `;
            
            tbody.innerHTML = '';
            result.data.forEach((participant, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td class="rank rank-${index + 1}">${index + 1}</td>
                    <td class="participant-name">${participant.participant}</td>
                    <td>${participant.participantRole}</td>
                    <td>${participant.city}</td>
                    <td>${participant.network}</td>
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
            if (result && result.result === 'error') {
                noData.innerHTML = `<p>Ошибка: ${result.message}</p>`;
            } else {
                noData.innerHTML = '<p>Нет данных для выбранной категории</p>';
            }
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

// Функция для поиска участника
async function searchParticipant(participantName, network, city) {
    if (!network || !city) {
        showTempMessage('Пожалуйста, выберите сеть и город для поиска', 'error');
        return;
    }
    
    try {
        const searchBtn = document.getElementById('searchBtn');
        const loading = document.getElementById('loading');
        const searchResults = document.getElementById('searchResults');
        const searchNoData = document.getElementById('searchNoData');
        const table = document.getElementById('leaderboardTable');
        
        searchBtn.disabled = true;
        searchBtn.classList.add('loading');
        searchResults.style.display = 'none';
        searchNoData.style.display = 'none';
        table.style.display = 'none';
        loading.style.display = 'block';
        
        const timestamp = new Date().getTime();
        const url = `${scriptURL}?action=searchParticipant&participant=${encodeURIComponent(participantName)}&network=${encodeURIComponent(network)}&city=${encodeURIComponent(city)}&t=${timestamp}`;
        
        const result = await makeRequest(url);
        
        searchBtn.disabled = false;
        searchBtn.classList.remove('loading');
        loading.style.display = 'none';
        
        if (result.result === 'error') {
            throw new Error(result.message);
        }
        
        if (result.data && result.data.length > 0) {
            renderSearchResults(result.data, participantName, network, city);
            showTempMessage('Участник найден!', 'success');
        } else {
            searchNoData.style.display = 'block';
            searchNoData.innerHTML = `<p>Участник "${participantName}" в сети "${network}" в городе "${city}" не найден или не имеет результатов</p>`;
            showTempMessage('Участник не найден', 'info');
        }
        
    } catch (error) {
        console.error('Ошибка поиска:', error);
        const searchBtn = document.getElementById('searchBtn');
        const loading = document.getElementById('loading');
        
        searchBtn.disabled = false;
        searchBtn.classList.remove('loading');
        loading.style.display = 'none';
        
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
    
    participantInfo.innerHTML = `
        <strong>Участник:</strong> ${participantName}<br>
        <strong>Сеть:</strong> ${network}<br>
        <strong>Город:</strong> ${city}<br>
        <strong>Найдено категорий:</strong> ${data.length}
    `;
    
    searchResultsBody.innerHTML = '';
    data.forEach(item => {
        const row = document.createElement('tr');
        
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

// Функция для заполнения фильтров
function populateFilters(data) {
    const networks = [...new Set(data.map(p => p.network))].filter(n => n);
    const cities = [...new Set(data.map(p => p.city))].filter(c => c);
    
    const networkFilter = document.getElementById('networkFilter');
    const cityFilter = document.getElementById('cityFilter');
    const searchNetwork = document.getElementById('searchNetwork');
    const searchCity = document.getElementById('searchCity');
    
    // Заполняем фильтры для общего зачета
    if (networkFilter) {
        networkFilter.innerHTML = '<option value="">Все сети</option>';
        networks.forEach(network => {
            const option = document.createElement('option');
            option.value = network;
            option.textContent = network;
            networkFilter.appendChild(option);
        });
    }
    
    if (cityFilter) {
        cityFilter.innerHTML = '<option value="">Все города</option>';
        cities.forEach(city => {
            const option = document.createElement('option');
            option.value = city;
            option.textContent = city;
            cityFilter.appendChild(option);
        });
    }
    
    // Заполняем фильтры для поиска
    if (searchNetwork) {
        searchNetwork.innerHTML = '<option value="">Выберите сеть</option>';
        networks.forEach(network => {
            const option = document.createElement('option');
            option.value = network;
            option.textContent = network;
            searchNetwork.appendChild(option);
        });
    }
    
    if (searchCity) {
        searchCity.innerHTML = '<option value="">Выберите город</option>';
        cities.forEach(city => {
            const option = document.createElement('option');
            option.value = city;
            option.textContent = city;
            searchCity.appendChild(option);
        });
    }
    
    if (networkFilter && cityFilter) {
        networkFilter.addEventListener('change', filterLeaderboard);
        cityFilter.addEventListener('change', filterLeaderboard);
    }
}

// Функция для фильтрации таблицы
function filterLeaderboard() {
    if (currentLeaderboardType !== 'overall' || !currentData || currentData.length === 0) return;
    
    const networkFilter = document.getElementById('networkFilter');
    const cityFilter = document.getElementById('cityFilter');
    const tbody = document.getElementById('leaderboardBody');
    const table = document.getElementById('leaderboardTable');
    const noData = document.getElementById('noData');
    
    if (!networkFilter || !cityFilter || !tbody) return;
    
    const networkValue = networkFilter.value;
    const cityValue = cityFilter.value;
    
    tbody.innerHTML = '';
    
    const filteredData = currentData.filter(participant => {
        const networkMatch = !networkValue || participant.network === networkValue;
        const cityMatch = !cityValue || participant.city === cityValue;
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
            <td>${participant.totalTime}</td>
        `;
        tbody.appendChild(row);
    });
    
    if (filteredData.length === 0) {
        table.style.display = 'none';
        noData.style.display = 'block';
        noData.innerHTML = '<p>Нет данных для выбранных фильтров</p>';
    } else {
        table.style.display = 'table';
        noData.style.display = 'none';
    }
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
    const searchResults = document.getElementById('searchResults');
    const searchNoData = document.getElementById('searchNoData');
    
    // Сбрасываем активные классы
    if (overallBtn) overallBtn.classList.remove('active');
    if (categoryBtn) categoryBtn.classList.remove('active');
    if (searchBtn) searchBtn.classList.remove('active');
    
    // Скрываем все секции
    if (filters) filters.style.display = 'none';
    if (categorySelector) categorySelector.style.display = 'none';
    if (searchSection) searchSection.style.display = 'none';
    if (leaderboardTable) leaderboardTable.style.display = 'none';
    if (loading) loading.style.display = 'none';
    if (noData) noData.style.display = 'none';
    if (searchResults) searchResults.style.display = 'none';
    if (searchNoData) searchNoData.style.display = 'none';
    
    if (type === 'overall') {
        if (overallBtn) overallBtn.classList.add('active');
        if (filters) filters.style.display = 'flex';
        loadOverallLeaderboard(false);
    } else if (type === 'category') {
        if (categoryBtn) categoryBtn.classList.add('active');
        if (categorySelector) categorySelector.style.display = 'flex';
        if (currentCategory) {
            const categoryFilter = document.getElementById('categoryFilter');
            if (categoryFilter) categoryFilter.value = currentCategory;
            loadCategoryLeaderboard(currentCategory);
        }
    } else if (type === 'search') {
        if (searchBtn) searchBtn.classList.add('active');
        if (searchSection) searchSection.style.display = 'block';
        
        // Восстанавливаем значения полей поиска
        const searchParticipantInput = document.getElementById('searchParticipant');
        const searchNetworkSelect = document.getElementById('searchNetwork');
        const searchCitySelect = document.getElementById('searchCity');
        
        if (searchParticipantInput) searchParticipantInput.value = currentSearchParticipant;
        if (searchNetworkSelect) searchNetworkSelect.value = currentSearchNetwork;
        if (searchCitySelect) searchCitySelect.value = currentSearchCity;
        
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
    if (refreshBtn) {
        refreshBtn.disabled = true;
        refreshBtn.classList.add('loading');
    }
    
    try {
        if (currentLeaderboardType === 'overall') {
            await loadOverallLeaderboard(true);
        } else if (currentLeaderboardType === 'category') {
            const categoryFilter = document.getElementById('categoryFilter');
            if (categoryFilter && categoryFilter.value) {
                await loadCategoryLeaderboard(categoryFilter.value);
            }
        } else if (currentLeaderboardType === 'search') {
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
        const refreshBtn = document.getElementById('refreshBtn');
        if (refreshBtn) {
            refreshBtn.disabled = false;
            refreshBtn.classList.remove('loading');
        }
    }
}

// Функция для показа временного сообщения
function showTempMessage(message, type = 'info') {
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
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
        backdrop-filter: blur(10px);
    `;
    
    if (type === 'success') {
        messageEl.style.background = 'linear-gradient(45deg, #4CAF50 0%, #45a049 100%)';
        messageEl.style.borderLeft = '4px solid #2E7D32';
    } else if (type === 'error') {
        messageEl.style.background = 'linear-gradient(45deg, #f44336 0%, #d32f2f 100%)';
        messageEl.style.borderLeft = '4px solid #C62828';
    } else {
        messageEl.style.background = 'linear-gradient(45deg, #2196F3 0%, #1976D2 100%)';
        messageEl.style.borderLeft = '4px solid #1565C0';
    }
    
    document.body.appendChild(messageEl);
    
    setTimeout(() => {
        messageEl.style.opacity = '1';
        messageEl.style.transform = 'translateY(0)';
    }, 10);
    
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
    console.log('Инициализация таблицы лидеров...');
    
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
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', function() {
            currentCategory = this.value;
            if (currentCategory) {
                loadCategoryLeaderboard(currentCategory);
            } else {
                const table = document.getElementById('leaderboardTable');
                const tbody = document.getElementById('leaderboardBody');
                const noData = document.getElementById('noData');
                
                if (table) table.style.display = 'none';
                if (tbody) tbody.innerHTML = '';
                if (noData) {
                    noData.style.display = 'block';
                    noData.innerHTML = '<p>Выберите категорию для просмотра</p>';
                }
            }
        });
    }

    // Обработчик для кнопки обновления
    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', refreshLeaderboard);
    }
    
    // Обработчик для кнопки поиска
    const searchBtn = document.getElementById('searchBtn');
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            const participantName = document.getElementById('searchParticipant').value.trim();
            const network = document.getElementById('searchNetwork').value;
            const city = document.getElementById('searchCity').value;
            
            if (participantName && network && city) {
                currentSearchParticipant = participantName;
                currentSearchNetwork = network;
                currentSearchCity = city;
                searchParticipant(participantName, network, city);
            } else {
                if (!participantName) {
                    showTempMessage('Пожалуйста, введите имя участника', 'error');
                    document.getElementById('searchParticipant').focus();
                } else if (!network) {
                    showTempMessage('Пожалуйста, выберите сеть', 'error');
                    document.getElementById('searchNetwork').focus();
                } else if (!city) {
                    showTempMessage('Пожалуйста, выберите город', 'error');
                    document.getElementById('searchCity').focus();
                }
            }
        });
    }
    
    // Добавляем поддержку поиска по Enter
    const searchParticipantInput = document.getElementById('searchParticipant');
    if (searchParticipantInput) {
        searchParticipantInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                document.getElementById('searchBtn').click();
            }
        });
    }
    
    // Обработчик для кнопки закрытия вкладки
    const closeTabBtn = document.getElementById('closeTabBtn');
    if (closeTabBtn) {
        closeTabBtn.addEventListener('click', closeTab);
    }
    
    // Добавляем поддержку обновления по F5
    document.addEventListener('keydown', function(e) {
        if (e.key === 'F5') {
            e.preventDefault();
            refreshLeaderboard();
        }
    });
    
    console.log('Таблица лидеров инициализирована');
});
