// leaderboard.js - Логика для таблицы лидеров (исправленная версия)

// URL скрипта Google Apps
const scriptURL = 'https://script.google.com/macros/s/AKfycbz2lw2AOd9ZE0yQ7sW6eIi5uEsh7V7YuSbNSXmk_-2goNtpX_U9rHgFvxl-iQOANpBf/exec';

// Текущий тип лидерборда
let currentLeaderboardType = 'overall';
let currentData = [];
let cachedOverallData = null;
let isInitialLoad = true;
let refreshButtonAdded = false;

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
        
        const response = await fetch(scriptURL + '?action=getLeaderboard');
        
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
        loading.innerHTML = '<p>Ошибка загрузки данных. Проверьте подключение к интернету.</p>';
        currentData = [];
    }
}

// Функция для загрузки лидерборда по категории
async function loadCategoryLeaderboard(category) {
    try {
        const loading = document.getElementById('loading');
        loading.style.display = 'block';
        
        const response = await fetch(scriptURL + '?action=getCategoryLeaderboard&category=' + encodeURIComponent(category));
        
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
                <th>Дата</th>
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
                    <td>${participant.date}</td>
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

// Функция для заполнения фильтров
function populateFilters(data) {
    const networks = [...new Set(data.map(p => p.network))].filter(n => n);
    const cities = [...new Set(data.map(p => p.city))].filter(c => c);
    
    const networkFilter = document.getElementById('networkFilter');
    const cityFilter = document.getElementById('cityFilter');
    
    // Очищаем только если фильтры уже заполнены
    if (networkFilter.children.length > 1) {
        const firstNetworkOption = networkFilter.children[0];
        networkFilter.innerHTML = '';
        networkFilter.appendChild(firstNetworkOption);
        
        const firstCityOption = cityFilter.children[0];
        cityFilter.innerHTML = '';
        cityFilter.appendChild(firstCityOption);
    }
    
    networks.forEach(network => {
        const option = document.createElement('option');
        option.value = network;
        option.textContent = network;
        networkFilter.appendChild(option);
    });
    
    cities.forEach(city => {
        const option = document.createElement('option');
        option.value = city;
        option.textContent = city;
        cityFilter.appendChild(option);
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
    const filters = document.querySelector('.filters');
    const categorySelector = document.getElementById('categorySelector');
    
    overallBtn.classList.remove('active');
    categoryBtn.classList.remove('active');
    
    if (type === 'overall') {
        overallBtn.classList.add('active');
        filters.style.display = 'flex';
        categorySelector.style.display = 'none';
        
        document.getElementById('networkFilter').value = '';
        document.getElementById('cityFilter').value = '';
        
        loadOverallLeaderboard(false);
    } else {
        categoryBtn.classList.add('active');
        filters.style.display = 'none';
        categorySelector.style.display = 'flex';
        
        const table = document.getElementById('leaderboardTable');
        const tbody = document.getElementById('leaderboardBody');
        const noData = document.getElementById('noData');
        const loading = document.getElementById('loading');
        
        table.style.display = 'none';
        tbody.innerHTML = '';
        noData.style.display = 'none';
        loading.style.display = 'none';
        
        document.getElementById('categoryFilter').value = '';
    }
}

// Функция для принудительного обновления данных
function refreshLeaderboard() {
    if (currentLeaderboardType === 'overall') {
        loadOverallLeaderboard(true);
    } else {
        const category = document.getElementById('categoryFilter').value;
        if (category) {
            loadCategoryLeaderboard(category);
        }
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
        const category = this.value;
        if (category) {
            loadCategoryLeaderboard(category);
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

    // ОБРАБОТЧИК ДЛЯ КНОПКИ ЗАКРЫТИЯ ВКЛАДКИ
    document.getElementById('closeTabBtn').addEventListener('click', function() {
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
    });
});
