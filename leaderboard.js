// leaderboard.js - Работающая версия с исправлениями

const scriptURL = 'https://script.google.com/macros/s/AKfycbzGI2sCdYQECLeRvBd4ppmcSMj80kTGrdsIkSfvL1gxxvzcSRxTUHSYFCwR-NCoALqB/exec';

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
        loading.style.display = 'block';
        
        const response = await fetch(scriptURL + '?action=getLeaderboard&t=' + new Date().getTime());
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        cachedOverallData = data;
        currentData = data;
        
        renderOverallLeaderboard(data);
        
        if (isInitialLoad) {
            populateFilters(data);
            isInitialLoad = false;
        }
    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        const loading = document.getElementById('loading');
        loading.style.display = 'none';
        
        const noData = document.getElementById('noData');
        noData.style.display = 'block';
        noData.innerHTML = '<p>Ошибка загрузки данных. Проверьте подключение к интернету.</p>';
        
        currentData = [];
    }
}

// Функция для загрузки лидерборда по категории
async function loadCategoryLeaderboard(category) {
    if (!category) return;
    
    try {
        const loading = document.getElementById('loading');
        loading.style.display = 'block';
        
        const response = await fetch(scriptURL + '?action=getCategoryLeaderboard&category=' + encodeURIComponent(category) + '&t=' + new Date().getTime());
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        const table = document.getElementById('leaderboardTable');
        const tbody = document.getElementById('leaderboardBody');
        const tableHeader = document.getElementById('tableHeader');
        const noData = document.getElementById('noData');
        
        if (data && data.length > 0) {
            tableHeader.innerHTML = `
                <th class="rank">Место</th>
                <th>Участник</th>
                <th>Должность</th>
                <th>Город</th>
                <th>Сеть</th>
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
    } catch (error) {
        console.error('Ошибка загрузки данных категории:', error);
        const loading = document.getElementById('loading');
        loading.style.display = 'none';
        
        const noData = document.getElementById('noData');
        noData.style.display = 'block';
        noData.innerHTML = '<p>Ошибка загрузки данных. Попробуйте обновить страницу.</p>';
    }
}

// Функция для поиска участника с обязательными фильтрами
async function searchParticipant(participantName, network, city) {
    // Проверяем, что выбраны сеть и город
    if (!network || !city) {
        showTempMessage('Пожалуйста, выберите сеть и город для поиска', 'error');
        return;
    }
    
    try {
        const searchBtn = document.getElementById('searchBtn');
        const loading = document.getElementById('loading');
        const searchResults = document.getElementById('searchResults');
        const searchNoData = document.getElementById('searchNoData');
        
        // Показываем загрузку в кнопке поиска
        searchBtn.disabled = true;
        searchBtn.classList.add('loading');
        searchResults.style.display = 'none';
        searchNoData.style.display = 'none';
        
        const params = new URLSearchParams({
            action: 'searchParticipant',
            participant: participantName,
            t: new Date().getTime()
        });
        
        if (network) params.append('network', network);
        if (city) params.append('city', city);
        
        const response = await fetch(scriptURL + '?' + params.toString());
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        searchBtn.disabled = false;
        searchBtn.classList.remove('loading');
        
        if (data.error) {
            throw new Error(data.error);
        }
        
        if (data.length > 0) {
            renderSearchResults(data, participantName, network, city);
            showTempMessage('Участник найден!', 'success');
        } else {
            searchNoData.style.display = 'block';
            searchNoData.innerHTML = `<p>Участник "${participantName}" в сети "${network}" в городе "${city}" не найден или не имеет результатов</p>`;
            showTempMessage('Участник не найден', 'info');
        }
        
    } catch (error) {
        console.error('Ошибка поиска:', error);
        const searchBtn = document.getElementById('searchBtn');
        searchBtn.disabled = false;
        searchBtn.classList.remove('loading');
        
        const searchNoData = document.getElementById('searchNoData');
        searchNoData.style.display = 'block';
        searchNoData.innerHTML = '<p>Ошибка при поиске участника. Попробуйте еще раз.</p>';
        showTempMessage('Ошибка при поиске', 'error');
    }
}

// Функция для отрисовки результатов поиска (без даты)
function renderSearchResults(data, participantName, network, city) {
    const searchResults = document.getElementById('searchResults');
    const participantInfo = document.getElementById('participantInfo');
    const searchResultsBody = document.getElementById('searchResultsBody');
    const searchNoData = document.getElementById('searchNoData');
    
    // Обновляем информацию об участнике
    participantInfo.innerHTML = `
        <strong>Участник:</strong> ${participantName}<br>
        <strong>Сеть:</strong> ${network}<br>
        <strong>Город:</strong> ${city}<br>
        <strong>Найдено категорий:</strong> ${data.length}
    `;
    
    // Заполняем таблицу (без колонки даты)
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

// Функция для заполнения фильтров
function populateFilters(data) {
    const networks = [...new Set(data.map(p => p.network))].filter(n => n);
    const cities = [...new Set(data.map(p => p.city))].filter(c => c);
    
    const networkFilter = document.getElementById('networkFilter');
    const cityFilter = document.getElementById('cityFilter');
    const searchNetwork = document.getElementById('searchNetwork');
    const searchCity = document.getElementById('searchCity');
    
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
    
    networkFilter.addEventListener('change', filterLeaderboard);
    cityFilter.addEventListener('change', filterLeaderboard);
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
        // Очищаем предыдущие результаты поиска
        document.getElementById('searchResults').style.display = 'none';
        document.getElementById('searchNoData').style.display = 'none';
        
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
    
    // Обработчик для кнопки поиска (с проверкой обязательных полей)
    document.getElementById('searchBtn').addEventListener('click', function() {
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
