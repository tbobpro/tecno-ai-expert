// leaderboard.js - Исправленная логика для таблицы лидеров

// URL скрипта Google Apps
const scriptURL = 'https://script.google.com/macros/s/AKfycbz1J59eDpOi8cFIPjApFUy98sqJuJMbF2c97xm2Ecjv88yEbxbN7B8wzk-ptXXfwGMl/exec';

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
        console.log('Отрисовка данных:', data);
        
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
                <td class="participant-name">${participant.participant || 'Не указано'}</td>
                <td>${participant.participantRole || 'Не указано'}</td>
                <td>${participant.city || 'Не указано'}</td>
                <td>${participant.network || 'Не указано'}</td>
                <td>${participant.totalTime || '00:00.00'}</td>
            `;
            tbody.appendChild(row);
        });
        
        loading.style.display = 'none';
        table.style.display = 'table';
        noData.style.display = 'none';
    } else {
        console.log('Нет данных для отображения');
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
        
        loading.style.display = 'block';
        noData.style.display = 'none';
        
        console.log('Загрузка общего лидерборда...');
        
        const response = await fetch(scriptURL + '?action=getLeaderboard');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Получены данные:', data);
        
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
        const noData = document.getElementById('noData');
        
        loading.style.display = 'none';
        noData.style.display = 'block';
        noData.innerHTML = '<p>Ошибка загрузки данных. Проверьте подключение к интернету.</p>';
        currentData = [];
    }
}

// Функция для загрузки лидерборда по категории
async function loadCategoryLeaderboard(category) {
    if (!category) {
        console.warn('Категория не выбрана');
        return;
    }
    
    try {
        const loading = document.getElementById('loading');
        const noData = document.getElementById('noData');
        const table = document.getElementById('leaderboardTable');
        
        loading.style.display = 'block';
        noData.style.display = 'none';
        table.style.display = 'none';
        
        console.log('Загрузка категории:', category);
        
        const encodedCategory = encodeURIComponent(category);
        const url = `${scriptURL}?action=getCategoryLeaderboard&category=${encodedCategory}`;
        
        console.log('URL запроса:', url);
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Получены данные категории:', data);
        
        const tbody = document.getElementById('leaderboardBody');
        const tableHeader = document.getElementById('tableHeader');
        
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
                    <td class="participant-name">${participant.participant || 'Не указано'}</td>
                    <td>${participant.participantRole || 'Не указано'}</td>
                    <td>${participant.city || 'Не указано'}</td>
                    <td>${participant.network || 'Не указано'}</td>
                    <td>${participant.time || '00:00.00'}</td>
                    <td>${participant.date || 'Не указано'}</td>
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
        const noData = document.getElementById('noData');
        
        loading.style.display = 'none';
        noData.style.display = 'block';
        noData.innerHTML = `<p>Ошибка загрузки данных: ${error.message}</p>`;
    }
}

// Функция для заполнения фильтров
function populateFilters(data) {
    if (!data || data.length === 0) {
        console.log('Нет данных для заполнения фильтров');
        return;
    }
    
    const networks = [...new Set(data.map(p => p.network).filter(n => n))];
    const cities = [...new Set(data.map(p => p.city).filter(c => c))];
    
    const networkFilter = document.getElementById('networkFilter');
    const cityFilter = document.getElementById('cityFilter');
    
    // Очищаем существующие опции (кроме первой)
    while (networkFilter.children.length > 1) {
        networkFilter.removeChild(networkFilter.lastChild);
    }
    while (cityFilter.children.length > 1) {
        cityFilter.removeChild(cityFilter.lastChild);
    }
    
    // Добавляем уникальные сети
    networks.forEach(network => {
        const option = document.createElement('option');
        option.value = network;
        option.textContent = network;
        networkFilter.appendChild(option);
    });
    
    // Добавляем уникальные города
    cities.forEach(city => {
        const option = document.createElement('option');
        option.value = city;
        option.textContent = city;
        cityFilter.appendChild(option);
    });
    
    console.log('Фильтры заполнены:', { networks, cities });
}

// Функция для фильтрации таблицы
function filterLeaderboard() {
    if (currentLeaderboardType !== 'overall' || !currentData || currentData.length === 0) {
        console.log('Фильтрация невозможна: неверный тип или нет данных');
        return;
    }
    
    const networkFilter = document.getElementById('networkFilter').value;
    const cityFilter = document.getElementById('cityFilter').value;
    const tbody = document.getElementById('leaderboardBody');
    const table = document.getElementById('leaderboardTable');
    const noData = document.getElementById('noData');
    
    console.log('Применение фильтров:', { networkFilter, cityFilter });
    
    const filteredData = currentData.filter(participant => {
        const networkMatch = !networkFilter || participant.network === networkFilter;
        const cityMatch = !cityFilter || participant.city === cityFilter;
        return networkMatch && cityMatch;
    });
    
    console.log('Отфильтрованные данные:', filteredData);
    
    tbody.innerHTML = '';
    
    if (filteredData.length > 0) {
        filteredData.forEach((participant, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="rank rank-${index + 1}">${index + 1}</td>
                <td class="participant-name">${participant.participant || 'Не указано'}</td>
                <td>${participant.participantRole || 'Не указано'}</td>
                <td>${participant.city || 'Не указано'}</td>
                <td>${participant.network || 'Не указано'}</td>
                <td>${participant.totalTime || '00:00.00'}</td>
            `;
            tbody.appendChild(row);
        });
        
        table.style.display = 'table';
        noData.style.display = 'none';
    } else {
        table.style.display = 'none';
        noData.style.display = 'block';
        noData.innerHTML = '<p>Нет данных для выбранных фильтров</p>';
    }
}

// Остальные функции остаются без изменений
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

function refreshLeaderboard() {
    console.log('Обновление лидерборда...');
    if (currentLeaderboardType === 'overall') {
        loadOverallLeaderboard(true);
    } else {
        const category = document.getElementById('categoryFilter').value;
        if (category) {
            loadCategoryLeaderboard(category);
        } else {
            alert('Пожалуйста, выберите категорию для обновления');
        }
    }
}

function addRefreshButton() {
    if (refreshButtonAdded) return;
    
    const header = document.querySelector('header');
    if (header.querySelector('.refresh-btn')) {
        refreshButtonAdded = true;
        return;
    }
    
    const refreshBtn = document.createElement('button');
    refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Обновить';
    refreshBtn.className = 'refresh-btn';
    
    refreshBtn.addEventListener('click', refreshLeaderboard);
    
    header.appendChild(refreshBtn);
    refreshButtonAdded = true;
}

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
    console.log('Инициализация лидерборда...');
    loadOverallLeaderboard();
    
    document.querySelectorAll('.type-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const type = this.getAttribute('data-type');
            switchLeaderboardType(type);
        });
    });
    
    document.getElementById('categoryFilter').addEventListener('change', function() {
        const category = this.value;
        if (category) {
            loadCategoryLeaderboard(category);
        } else {
            const table = document.getElementById('leaderboardTable');
            const noData = document.getElementById('noData');
            const loading = document.getElementById('loading');
            
            table.style.display = 'none';
            noData.style.display = 'none';
            loading.style.display = 'none';
        }
    });

    addRefreshButton();
    
    document.getElementById('closeTabBtn').addEventListener('click', closeTab);
});// leaderboard.js - Исправленная логика для таблицы лидеров

// URL скрипта Google Apps
const scriptURL = 'https://script.google.com/macros/s/AKfycbztalHgLIhd6gDzmySOaG3VlRnOdB_OwyoH3vfjs7Gbf2b3NJqNFKFJp21Kv10IUt2O/exec';

// Текущий тип лидерборда
let currentLeaderboardType = 'overall';
let currentData = []; // Сохраняем загруженные данные
let cachedOverallData = null; // Кэш для общего зачета
let isInitialLoad = true; // Флаг первой загрузки
let refreshButtonAdded = false; // Флаг для отслеживания добавления кнопки

// Функция для отрисовки общего лидерборда
function renderOverallLeaderboard(data) {
    const table = document.getElementById('leaderboardTable');
    const tbody = document.getElementById('leaderboardBody');
    const tableHeader = document.getElementById('tableHeader');
    const loading = document.getElementById('loading');
    const noData = document.getElementById('noData');
    
    if (data && data.length > 0) {
        // Устанавливаем заголовки для общего зачета
        tableHeader.innerHTML = `
            <th class="rank">Место</th>
            <th>Участник</th>
            <th>Должность</th>
            <th>Город</th>
            <th>Сеть</th>
            <th>Общее время</th>
        `;
        
        // Заполняем таблицу
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
    // Если данные уже загружены и не требуется принудительное обновление, используем кэш
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
        
        // Сохраняем данные в кэш
        cachedOverallData = data;
        currentData = data;
        
        renderOverallLeaderboard(data);
        
        // Заполняем фильтры только при первой загрузке
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
    if (!category) {
        console.warn('Категория не выбрана');
        return;
    }
    
    try {
        const loading = document.getElementById('loading');
        loading.style.display = 'block';
        
        // Кодируем категорию для URL
        const encodedCategory = encodeURIComponent(category);
        const url = `${scriptURL}?action=getCategoryLeaderboard&category=${encodedCategory}`;
        
        console.log('Загрузка категории:', category, 'URL:', url);
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        console.log('Получены данные категории:', data);
        
        const table = document.getElementById('leaderboardTable');
        const tbody = document.getElementById('leaderboardBody');
        const tableHeader = document.getElementById('tableHeader');
        const noData = document.getElementById('noData');
        
        if (data && data.length > 0) {
            // Устанавливаем заголовки для категории
            tableHeader.innerHTML = `
                <th class="rank">Место</th>
                <th>Участник</th>
                <th>Должность</th>
                <th>Город</th>
                <th>Сеть</th>
                <th>Время</th>
                <th>Дата</th>
            `;
            
            // Заполняем таблицу
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
        noData.innerHTML = '<p>Ошибка загрузки данных категории</p>';
    }
}

// Функция для заполнения фильтров (вызывается только один раз)
function populateFilters(data) {
    if (!data || data.length === 0) return;
    
    const networks = [...new Set(data.map(p => p.network))].filter(n => n);
    const cities = [...new Set(data.map(p => p.city))].filter(c => c);
    
    const networkFilter = document.getElementById('networkFilter');
    const cityFilter = document.getElementById('cityFilter');
    
    // Очищаем только если фильтры уже заполнены
    if (networkFilter.children.length > 1) {
        // Сохраняем первый элемент (опцию "Все сети")
        const firstNetworkOption = networkFilter.children[0];
        networkFilter.innerHTML = '';
        networkFilter.appendChild(firstNetworkOption);
        
        // Сохраняем первый элемент (опцию "Все города")
        const firstCityOption = cityFilter.children[0];
        cityFilter.innerHTML = '';
        cityFilter.appendChild(firstCityOption);
    }
    
    // Добавляем уникальные сети
    networks.forEach(network => {
        const option = document.createElement('option');
        option.value = network;
        option.textContent = network;
        networkFilter.appendChild(option);
    });
    
    // Добавляем уникальные города
    cities.forEach(city => {
        const option = document.createElement('option');
        option.value = city;
        option.textContent = city;
        cityFilter.appendChild(option);
    });
    
    // Добавляем обработчики событий для фильтров
    networkFilter.addEventListener('change', filterLeaderboard);
    cityFilter.addEventListener('change', filterLeaderboard);
}

// Функция для фильтрации таблицы
function filterLeaderboard() {
    if (currentLeaderboardType !== 'overall' || !currentData || currentData.length === 0) return;
    
    const networkFilter = document.getElementById('networkFilter').value;
    const cityFilter = document.getElementById('cityFilter').value;
    const tbody = document.getElementById('leaderboardBody');
    
    // Очищаем таблицу
    tbody.innerHTML = '';
    
    // Фильтруем данные
    const filteredData = currentData.filter(participant => {
        const networkMatch = !networkFilter || participant.network === networkFilter;
        const cityMatch = !cityFilter || participant.city === cityFilter;
        return networkMatch && cityMatch;
    });
    
    // Заполняем таблицу отфильтрованными данными
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
    
    // Показываем сообщение, если нет данных после фильтрации
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
    
    // Сбрасываем состояние
    overallBtn.classList.remove('active');
    categoryBtn.classList.remove('active');
    
    if (type === 'overall') {
        overallBtn.classList.add('active');
        filters.style.display = 'flex';
        categorySelector.style.display = 'none';
        
        // Сбрасываем фильтры при переключении на общий зачет
        document.getElementById('networkFilter').value = '';
        document.getElementById('cityFilter').value = '';
        
        // Используем кэшированные данные вместо повторной загрузки
        loadOverallLeaderboard(false); // false = не принуждать к обновлению
    } else {
        categoryBtn.classList.add('active');
        filters.style.display = 'none';
        categorySelector.style.display = 'flex';
        
        // Сбрасываем таблицу при переключении на категории
        const table = document.getElementById('leaderboardTable');
        const tbody = document.getElementById('leaderboardBody');
        const noData = document.getElementById('noData');
        const loading = document.getElementById('loading');
        
        table.style.display = 'none';
        tbody.innerHTML = '';
        noData.style.display = 'none';
        loading.style.display = 'none';
        
        // Сбрасываем выбор категории
        document.getElementById('categoryFilter').value = '';
    }
}

// Функция для принудительного обновления данных
function refreshLeaderboard() {
    if (currentLeaderboardType === 'overall') {
        loadOverallLeaderboard(true); // true = принудительное обновление
    } else {
        const category = document.getElementById('categoryFilter').value;
        if (category) {
            loadCategoryLeaderboard(category);
        } else {
            alert('Пожалуйста, выберите категорию для обновления');
        }
    }
}

// Функция для добавления кнопки обновления (исправленная)
function addRefreshButton() {
    // Проверяем, не добавлена ли уже кнопка
    if (refreshButtonAdded) {
        return;
    }
    
    const header = document.querySelector('header');
    
    // Проверяем, существует ли уже кнопка обновления
    if (header.querySelector('.refresh-btn')) {
        refreshButtonAdded = true;
        return;
    }
    
    const refreshBtn = document.createElement('button');
    refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Обновить';
    refreshBtn.className = 'refresh-btn';
    
    refreshBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
        this.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
    });
    
    refreshBtn.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    });
    
    refreshBtn.addEventListener('click', refreshLeaderboard);
    
    header.appendChild(refreshBtn);
    refreshButtonAdded = true;

    // Адаптивность для мобильных
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    function handleMobileChange(e) {
        if (e.matches) {
            refreshBtn.style.padding = '6px 12px';
            refreshBtn.style.fontSize = '0.85rem';
        } else {
            refreshBtn.style.padding = '8px 15px';
            refreshBtn.style.fontSize = '0.9rem';
        }
    }
    mediaQuery.addListener(handleMobileChange);
    handleMobileChange(mediaQuery);
}

// Функция для закрытия вкладки
function closeTab() {
    // Пытаемся закрыть вкладку
    if (window.history.length > 1) {
        // Если есть история, возвращаемся назад
        window.history.back();
    } else {
        // Если нет истории, пытаемся закрыть вкладку
        window.close();
        
        // Если вкладка не закрылась (например, из-за политики браузера),
        // показываем сообщение и предлагаем закрыть вручную
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
        const category = this.value;
        if (category) {
            loadCategoryLeaderboard(category);
        } else {
            // Если категория не выбрана, скрываем таблицу
            const table = document.getElementById('leaderboardTable');
            const noData = document.getElementById('noData');
            const loading = document.getElementById('loading');
            
            table.style.display = 'none';
            noData.style.display = 'none';
            loading.style.display = 'none';
        }
    });

    // Добавляем кнопку обновления в интерфейс
    addRefreshButton();
    
    // ОБРАБОТЧИК ДЛЯ КНОПКИ ЗАКРЫТИЯ ВКЛАДКИ
    document.getElementById('closeTabBtn').addEventListener('click', closeTab);
});// leaderboard.js - Логика для таблицы лидеров

// URL скрипта Google Apps
const scriptURL = 'https://script.google.com/macros/s/AKfycbz1J59eDpOi8cFIPjApFUy98sqJuJMbF2c97xm2Ecjv88yEbxbN7B8wzk-ptXXfwGMl/exec';

// Текущий тип лидерборда
let currentLeaderboardType = 'overall';
let currentData = []; // Сохраняем загруженные данные
let cachedOverallData = null; // Кэш для общего зачета
let isInitialLoad = true; // Флаг первой загрузки
let refreshButtonAdded = false; // Флаг для отслеживания добавления кнопки

// Функция для отрисовки общего лидерборда
function renderOverallLeaderboard(data) {
    const table = document.getElementById('leaderboardTable');
    const tbody = document.getElementById('leaderboardBody');
    const tableHeader = document.getElementById('tableHeader');
    const loading = document.getElementById('loading');
    const noData = document.getElementById('noData');
    
    if (data && data.length > 0) {
        // Устанавливаем заголовки для общего зачета
        tableHeader.innerHTML = `
            <th class="rank">Место</th>
            <th>Участник</th>
            <th>Должность</th>
            <th>Город</th>
            <th>Сеть</th>
            <th>Общее время</th>
        `;
        
        // Заполняем таблицу
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
    // Если данные уже загружены и не требуется принудительное обновление, используем кэш
    if (cachedOverallData && !forceRefresh) {
        currentData = cachedOverallData;
        renderOverallLeaderboard(currentData);
        return;
    }
    
    try {
        const loading = document.getElementById('loading');
        loading.style.display = 'block';
        
        const response = await fetch(scriptURL + '?action=getLeaderboard');
        const data = await response.json();
        
        // Сохраняем данные в кэш
        cachedOverallData = data;
        currentData = data;
        
        renderOverallLeaderboard(data);
        
        // Заполняем фильтры только при первой загрузке
        if (isInitialLoad) {
            populateFilters(data);
            isInitialLoad = false;
        }
    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        const loading = document.getElementById('loading');
        loading.innerHTML = '<p>Ошибка загрузки данных</p>';
        currentData = [];
    }
}

// Функция для загрузки лидерборда по категории
async function loadCategoryLeaderboard(category) {
    try {
        const loading = document.getElementById('loading');
        loading.style.display = 'block';
        
        const response = await fetch(scriptURL + '?action=getCategoryLeaderboard&category=' + encodeURIComponent(category));
        const data = await response.json();
        
        const table = document.getElementById('leaderboardTable');
        const tbody = document.getElementById('leaderboardBody');
        const tableHeader = document.getElementById('tableHeader');
        const noData = document.getElementById('noData');
        
        if (data && data.length > 0) {
            // Устанавливаем заголовки для категории
            tableHeader.innerHTML = `
                <th class="rank">Место</th>
                <th>Участник</th>
                <th>Должность</th>
                <th>Город</th>
                <th>Сеть</th>
                <th>Время</th>
                <th>Дата</th>
            `;
            
            // Заполняем таблицу
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
        }
    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        document.getElementById('loading').innerHTML = '<p>Ошибка загрузки данных</p>';
    }
}

// Функция для заполнения фильтров (вызывается только один раз)
function populateFilters(data) {
    const networks = [...new Set(data.map(p => p.network))].filter(n => n);
    const cities = [...new Set(data.map(p => p.city))].filter(c => c);
    
    const networkFilter = document.getElementById('networkFilter');
    const cityFilter = document.getElementById('cityFilter');
    
    // Очищаем только если фильтры уже заполнены
    if (networkFilter.children.length > 1) {
        // Сохраняем первый элемент (опцию "Все сети")
        const firstNetworkOption = networkFilter.children[0];
        networkFilter.innerHTML = '';
        networkFilter.appendChild(firstNetworkOption);
        
        // Сохраняем первый элемент (опцию "Все города")
        const firstCityOption = cityFilter.children[0];
        cityFilter.innerHTML = '';
        cityFilter.appendChild(firstCityOption);
    }
    
    // Добавляем уникальные сети
    networks.forEach(network => {
        const option = document.createElement('option');
        option.value = network;
        option.textContent = network;
        networkFilter.appendChild(option);
    });
    
    // Добавляем уникальные города
    cities.forEach(city => {
        const option = document.createElement('option');
        option.value = city;
        option.textContent = city;
        cityFilter.appendChild(option);
    });
    
    // Добавляем обработчики событий для фильтров
    networkFilter.addEventListener('change', filterLeaderboard);
    cityFilter.addEventListener('change', filterLeaderboard);
}

// Функция для фильтрации таблицы
function filterLeaderboard() {
    if (currentLeaderboardType !== 'overall' || !currentData || currentData.length === 0) return;
    
    const networkFilter = document.getElementById('networkFilter').value;
    const cityFilter = document.getElementById('cityFilter').value;
    const tbody = document.getElementById('leaderboardBody');
    
    // Очищаем таблицу
    tbody.innerHTML = '';
    
    // Фильтруем данные
    const filteredData = currentData.filter(participant => {
        const networkMatch = !networkFilter || participant.network === networkFilter;
        const cityMatch = !cityFilter || participant.city === cityFilter;
        return networkMatch && cityMatch;
    });
    
    // Заполняем таблицу отфильтрованными данными
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
    
    // Показываем сообщение, если нет данных после фильтрации
    const table = document.getElementById('leaderboardTable');
    const noData = document.getElementById('noData');
    
    if (filteredData.length === 0) {
        table.style.display = 'none';
        noData.style.display = 'block';
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
    
    // Сбрасываем состояние
    overallBtn.classList.remove('active');
    categoryBtn.classList.remove('active');
    
    if (type === 'overall') {
        overallBtn.classList.add('active');
        filters.style.display = 'flex';
        categorySelector.style.display = 'none';
        
        // Сбрасываем фильтры при переключении на общий зачет
        document.getElementById('networkFilter').value = '';
        document.getElementById('cityFilter').value = '';
        
        // Используем кэшированные данные вместо повторной загрузки
        loadOverallLeaderboard(false); // false = не принуждать к обновлению
    } else {
        categoryBtn.classList.add('active');
        filters.style.display = 'none';
        categorySelector.style.display = 'flex';
        
        // Сбрасываем таблицу при переключении на категории
        const table = document.getElementById('leaderboardTable');
        const tbody = document.getElementById('leaderboardBody');
        const noData = document.getElementById('noData');
        const loading = document.getElementById('loading');
        
        table.style.display = 'none';
        tbody.innerHTML = '';
        noData.style.display = 'none';
        loading.style.display = 'none';
        
        // Сбрасываем выбор категории
        document.getElementById('categoryFilter').value = '';
    }
}

// Функция для принудительного обновления данных
function refreshLeaderboard() {
    if (currentLeaderboardType === 'overall') {
        loadOverallLeaderboard(true); // true = принудительное обновление
    } else {
        const category = document.getElementById('categoryFilter').value;
        if (category) {
            loadCategoryLeaderboard(category);
        }
    }
}

// Функция для добавления кнопки обновления (исправленная)
function addRefreshButton() {
    // Проверяем, не добавлена ли уже кнопка
    if (refreshButtonAdded) {
        return;
    }
    
    const header = document.querySelector('header');
    
    // Проверяем, существует ли уже кнопка обновления
    if (header.querySelector('.refresh-btn')) {
        refreshButtonAdded = true;
        return;
    }
    
    const refreshBtn = document.createElement('button');
    refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Обновить';
    refreshBtn.className = 'refresh-btn';
    
    refreshBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
        this.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
    });
    
    refreshBtn.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    });
    
    refreshBtn.addEventListener('click', refreshLeaderboard);
    
    header.appendChild(refreshBtn);
    refreshButtonAdded = true;

    // Адаптивность для мобильных
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    function handleMobileChange(e) {
        if (e.matches) {
            refreshBtn.style.padding = '6px 12px';
            refreshBtn.style.fontSize = '0.85rem';
        } else {
            refreshBtn.style.padding = '8px 15px';
            refreshBtn.style.fontSize = '0.9rem';
        }
    }
    mediaQuery.addListener(handleMobileChange);
    handleMobileChange(mediaQuery);
}

// Функция для закрытия вкладки
function closeTab() {
    // Пытаемся закрыть вкладку
    if (window.history.length > 1) {
        // Если есть история, возвращаемся назад
        window.history.back();
    } else {
        // Если нет истории, пытаемся закрыть вкладку
        window.close();
        
        // Если вкладка не закрылась (например, из-за политики браузера),
        // показываем сообщение и предлагаем закрыть вручную
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
        const category = this.value;
        if (category) {
            loadCategoryLeaderboard(category);
        }
    });

    // Добавляем кнопку обновления в интерфейс
    addRefreshButton();
    
    // ОБРАБОТЧИК ДЛЯ КНОПКИ ЗАКРЫТИЯ ВКЛАДКИ
    document.getElementById('closeTabBtn').addEventListener('click', closeTab);
});
