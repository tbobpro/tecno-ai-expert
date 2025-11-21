// game.js - Основная логика игры TECNO AI EXPERT

// Глобальные переменные игры
let timerInterval;
let startTime;
let elapsedTime = 0;
let isRunning = false;
let currentRound = 1;
let totalRounds = 6;
let gameStarted = false;
let gameEnded = false;
let participantName = '';
let participantRole = '';
let hostName = '';
let network = '';
let city = '';
let storeAddress = '';
let storeCode = '';
let currentCardText = '';
let gameResults = [];
let usedCardTexts = [];
let cardFlippedInRound = false;
let gameStartTime = null;
let totalGameTime = 0;
let completedTasksCount = 0;
let feedback = '';

// Переменные для тестового режима
let isTestMode = false;
let secretClickCount = 0;
let secretClickTimeout = null;

// Тексты карточек
const allCardTexts = [
    "Ассистент Ella (Где найти помощника)",
    "Ассистент Ella (Умный поиск)",
    "Помощник по работе с документами",
    "Редактор AI",
    "Работа с документами (Картинка в документ)",
    "Работа с документами (Расшифровка записей диктофона)",
    "Круг для поиска",
    "Интеграция с сервисами Яндекс",
    "Решение математических задач",
    "Студия AI (Удаление объекта с фотографии)",
    "Студия AI (Расширение границ кадра)",
    "Студия AI (AI Доска для рисования)",
    "Студия AI (AI Генератор обоев)",
    "Студия AI (Улучшение групповых портретов)",
    "Умный переводчик (Перевод разговора)",
    "Умный переводчик (Синхронный перевод)",
    "Умный переводчик (Перевод изображений)",
    "Телефонный помощник (Сводка и расшифровка звонков)",
    "Телефонный помощник (Автоответчик AI)",
    "Телефонный помощник (Перевод звонков в реальном времени)",
    "Телефонный помощник (ИИ Шумоподавление)"
];

// Пояснения к карточкам (из вашего файла)
window.cardExplanations = {
    "Ассистент Ella (Где найти помощника)": "Вам нужно продемонстрировать, где можно найти помощника Ella",
    "Ассистент Ella (Умный поиск)": "Вам нужно продемонстрировать любую функцию Умного поиска с помощью Ella (распознавание изображения и информации о нём, Звонок по номеру на экране, Добавить номер в контакты, Добавить событие в календарь, Перенести текст на экране в блокнот, Резюме статьи, Сканирование QR кода с изображения на экране",
    "Помощник по работе с документами": "Вам нужно найти помощника и продемонстрировать, как он работает",
    "Редактор AI": "Вам нужно продемонстрировать, как работает Редактор AI в Заметках",
    "Работа с документами (Картинка в документ)": "Вам нужно сконвертировать фотографию документа в формат Word или Excel",
    "Работа с документами (Расшифровка записей диктофона)": "Вам нужно записать аудио в приложении Диктофон и продемонстрировать функцию расшифровки",
    "Круг для поиска": "Вам нужно вызвать функцию Круг для поиска и продемонстрировать его функцию поиска по фрагменту текста или изображения",
    "Интеграция с сервисами Яндекс": "Вам нужно продемонстрировать функцию взаимодействия AI с Я.Навигатором или Я.Такси",
    "Решение математических задач": "Вам нужно продемонстрировать возможность решения задач с листа или скриншота смартфона",
    "Студия AI (Удаление объекта с фотографии)": "Вам нужно продемонстрировать функцию удаления любого объекта с фотографии в AI Галерее",
    "Студия AI (Расширение границ кадра)": "Вам нужно продемонстрировать функцию расширения границ фотографии в AI Галерее",
    "Студия AI (AI Доска для рисования)": "Вам необходимо нарисовать что-нибудь на AI Доске и сгенерировать картинку",
    "Студия AI (AI Генератор обоев)": "Вам нужно найти генератор обоев, написать запрос для обоев и сгенерировать их",
    "Студия AI (Улучшение групповых портретов)": "Вам необходимо продемонстрировать, где находится функция включения Улучшения групповых портретов",
    "Умный переводчик (Перевод разговора)": "Вам необходимо найти функцию и продемонстрировать её работу - провести диалог с ведущим",
    "Умный переводчик (Синхронный перевод)": "Вам необходимо найти функцию и продемонстрировать её работу",
    "Умный переводчик (Перевод изображений)": "Вам необходимо найти функцию и продемонстрировать её работу с помощью какой-нибудь фотографии или скриншота",
    "Телефонный помощник (Сводка и расшифровка звонков)": "Вам необходимо найти и активировать функцию Расшифровка звонков",
    "Телефонный помощник (Автоответчик AI)": "Вам необходимо найти и активировать функцию Автоответчик AI",
    "Телефонный помощник (Перевод звонков в реальном времени)": "Вам необходимо найти и активировать функцию Перевод в режиме реального времени",
    "Телефонный помощник (ИИ Шумоподавление)": "Вам необходимо найти и активировать функцию ИИ Шумоподавление"
};

// URL скрипта Google Apps
const scriptURL = 'https://script.google.com/macros/s/AKfycbz1J59eDpOi8cFIPjApFUy98sqJuJMbF2c97xm2Ecjv88yEbxbN7B8wzk-ptXXfwGMl/exec';

// Инициализация игры при загрузке DOM
document.addEventListener('DOMContentLoaded', function() {
    initializeGame();
});

function initializeGame() {
    // Инициализация обработчиков событий
    initializeEventListeners();
    // Инициализация модальных окон
    initializeModals();
    // Сброс таймера
    resetTimer();
}

function initializeEventListeners() {
    // Получаем элементы DOM
    const startBtn = document.getElementById('startBtn');
    const stopBtn = document.getElementById('stopBtn');
    const doneBtn = document.getElementById('doneBtn');
    const skipBtn = document.getElementById('skipBtn');
    const startGameBtn = document.getElementById('startGameBtn');
    const submitSkipBtn = document.getElementById('submitSkipBtn');
    const cancelSkipBtn = document.getElementById('cancelSkipBtn');
    const closeExplanationBtn = document.getElementById('closeExplanationBtn');
    const skipFromExplanationBtn = document.getElementById('skipFromExplanationBtn');
    const leaderboardBtn = document.getElementById('leaderboardBtn');
    const leaderboardBtnFromModal = document.getElementById('leaderboardBtnFromModal');
    const submitFeedbackBtn = document.getElementById('submitFeedbackBtn');

    // Назначаем обработчики событий
    if (startBtn) startBtn.addEventListener('click', startTimer);
    if (stopBtn) stopBtn.addEventListener('click', stopTimer);
    if (doneBtn) doneBtn.addEventListener('click', handleDone);
    if (skipBtn) skipBtn.addEventListener('click', handleSkip);
    if (startGameBtn) startGameBtn.addEventListener('click', handleStartGame);
    if (submitSkipBtn) submitSkipBtn.addEventListener('click', handleSubmitSkip);
    if (cancelSkipBtn) cancelSkipBtn.addEventListener('click', handleCancelSkip);
    if (closeExplanationBtn) closeExplanationBtn.addEventListener('click', handleCloseExplanation);
    if (skipFromExplanationBtn) skipFromExplanationBtn.addEventListener('click', handleSkipFromExplanation);
    if (leaderboardBtn) leaderboardBtn.addEventListener('click', handleLeaderboard);
    if (leaderboardBtnFromModal) leaderboardBtnFromModal.addEventListener('click', handleLeaderboardFromModal);
    if (submitFeedbackBtn) submitFeedbackBtn.addEventListener('click', handleSubmitFeedback);

    // Новые обработчики для секретного входа
    const secretTrigger = document.getElementById('secretTrigger');
    const secretLoginBtn = document.getElementById('secretLoginBtn');
    const cancelSecretLoginBtn = document.getElementById('cancelSecretLoginBtn');
    const restartGameBtn = document.getElementById('restartGameBtn');

    if (secretTrigger) {
        secretTrigger.addEventListener('click', handleSecretTriggerClick);
    }
    if (secretLoginBtn) {
        secretLoginBtn.addEventListener('click', handleSecretLogin);
    }
    if (cancelSecretLoginBtn) {
        cancelSecretLoginBtn.addEventListener('click', hideSecretLoginModal);
    }
    if (restartGameBtn) {
        restartGameBtn.addEventListener('click', restartGame);
    }
}

// Функция для обработки кликов по скрытой кнопке
function handleSecretTriggerClick() {
    secretClickCount++;
    
    // Сбрасываем таймер при каждом клике
    if (secretClickTimeout) {
        clearTimeout(secretClickTimeout);
    }
    
    // Устанавливаем таймер для сброса счетчика (5 секунд)
    secretClickTimeout = setTimeout(() => {
        secretClickCount = 0;
    }, 5000);
    
    // Если нажали 5 раз, показываем модальное окно
    if (secretClickCount >= 5) {
        showSecretLoginModal();
        secretClickCount = 0; // Сбрасываем счетчик
    }
}

// Функция для обработки скрытого входа
function handleSecretLogin() {
    const password = document.getElementById('secretPassword').value;
    if (password === '55555') {
        // Генерируем случайные данные
        const randomData = generateRandomData();
        
        // Заполняем поля формы
        participantName = randomData.participant;
        participantRole = randomData.participantRole;
        hostName = randomData.host;
        network = randomData.network;
        city = randomData.city;
        storeAddress = randomData.storeAddress;
        storeCode = randomData.storeCode;
        
        // Устанавливаем тестовый режим
        isTestMode = true;
        
        // Скрываем модальные окна
        hideSecretLoginModal();
        hideNamesModal();
        
        // Запускаем игру
        gameStarted = true;
        gameStartTime = new Date();
        const roundInfo = document.getElementById('roundInfo');
        if (roundInfo) roundInfo.style.display = 'block';
        createCards();
        
        // Показываем информацию о тестовом режиме
        alert('Тестовый режим активирован! Данные заполнены автоматически.');
    } else {
        alert('Неверный пароль!');
    }
}

// Функции для управления модальным окном секретного входа
function showSecretLoginModal() {
    const modal = document.getElementById('secretLoginModal');
    if (modal) {
        modal.style.display = 'flex';
        document.getElementById('secretPassword').value = '';
        document.getElementById('secretPassword').focus();
    }
}

function hideSecretLoginModal() {
    const modal = document.getElementById('secretLoginModal');
    if (modal) {
        modal.style.display = 'none';
        secretClickCount = 0; // Сбрасываем счетчик
    }
}

// Функция для перезапуска игры в тестовом режиме
function restartGame() {
    if (!isTestMode) return;
    
    // Генерируем новые случайные данные
    const randomData = generateRandomData();
    
    // Обновляем глобальные переменные
    participantName = randomData.participant;
    participantRole = randomData.participantRole;
    hostName = randomData.host;
    network = randomData.network;
    city = randomData.city;
    storeAddress = randomData.storeAddress;
    storeCode = randomData.storeCode;
    
    // Сбрасываем состояние игры
    resetGameState();
    
    // Скрываем результаты и кнопку перезапуска
    const resultsTable = document.getElementById('resultsTable');
    const summaryResults = document.getElementById('summaryResults');
    const restartContainer = document.getElementById('restartGameContainer');
    
    if (resultsTable) resultsTable.style.display = 'none';
    if (summaryResults) summaryResults.style.display = 'none';
    if (restartContainer) restartContainer.style.display = 'none';
    
    // Запускаем новую игру
    gameStarted = true;
    gameStartTime = new Date();
    createCards();
    
    // Показываем информацию о новых данных
    alert(`Новая игра! Участник: ${participantName}, Город: ${city}, Адрес: ${storeAddress}`);
}

// Функция для полного сброса состояния игры
function resetGameState() {
    timerInterval = null;
    startTime = null;
    elapsedTime = 0;
    isRunning = false;
    currentRound = 1;
    gameStarted = false;
    gameEnded = false;
    currentCardText = '';
    gameResults = [];
    usedCardTexts = [];
    cardFlippedInRound = false;
    gameStartTime = null;
    totalGameTime = 0;
    completedTasksCount = 0;
    feedback = '';
    
    // Сбрасываем UI
    resetTimer();
    
    const currentRoundDisplay = document.getElementById('currentRound');
    if (currentRoundDisplay) currentRoundDisplay.textContent = '1';
    
    const resultsBody = document.getElementById('resultsBody');
    if (resultsBody) resultsBody.innerHTML = '';
    
    const cardsGrid = document.getElementById('cardsGrid');
    if (cardsGrid) cardsGrid.innerHTML = '';
    
    // Разблокируем карточки
    const allCards = document.querySelectorAll('.card');
    allCards.forEach(card => {
        card.classList.remove('flipped', 'disabled', 'game-ended');
        card.style.opacity = '1';
        card.style.cursor = 'pointer';
    });
}

// Функция для получения локального времени в формате строки
function getLocalTimestamp() {
    const now = new Date();
    
    // Форматируем дату в формате: YYYY-MM-DD HH:MM:SS
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// Функция для перемешивания массива
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Функция для получения доступных текстов карточек
function getAvailableCardTexts() {
    return allCardTexts.filter(text => !usedCardTexts.includes(text));
}

// Создание и отрисовка карточек
function createCards() {
    const cardsGrid = document.getElementById('cardsGrid');
    if (!cardsGrid) return;
    
    cardsGrid.innerHTML = '';
    const availableTexts = getAvailableCardTexts();
    const textsToUse = availableTexts.length >= 12 
        ? shuffleArray([...availableTexts]).slice(0, 12)
        : shuffleArray([...availableTexts]);
    
    textsToUse.forEach((text) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.text = text;
        card.innerHTML = `
            <div class="card-inner">
                <div class="card-front">
                    <img src="card-logo.png" alt="TECNO AI">
                </div>
                <div class="card-back">
                    <span>${text}</span>
                </div>
            </div>
        `;
        
        card.addEventListener('click', function() {
            // Блокируем клик, если игра завершена
            if (gameEnded) return;
            
            if (!this.classList.contains('flipped') && !cardFlippedInRound) {
                this.classList.add('flipped');
                currentCardText = this.dataset.text;
                cardFlippedInRound = true;
                
                // Показываем пояснение к заданию
                showExplanationModal(currentCardText);
                
                // Разблокируем кнопки секундомера и действия
                const startBtn = document.getElementById('startBtn');
                const skipBtn = document.getElementById('skipBtn');
                if (startBtn) startBtn.disabled = false;
                if (skipBtn) skipBtn.disabled = false;
                
                const allCards = document.querySelectorAll('.card');
                allCards.forEach(c => {
                    if (!c.classList.contains('flipped')) {
                        c.classList.add('disabled');
                    }
                });
            }
        });
        
        cardsGrid.appendChild(card);
    });
}

// Функции для секундомера
function formatTime(ms) {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const hundredths = Math.floor((ms % 1000) / 10);
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${hundredths.toString().padStart(2, '0')}`;
}

function updateTimer() {
    const currentTime = Date.now();
    elapsedTime = currentTime - startTime;
    const timerDisplay = document.getElementById('timer');
    if (timerDisplay) {
        timerDisplay.textContent = formatTime(elapsedTime);
    }
}

function startTimer() {
    if (!isRunning) {
        isRunning = true;
        startTime = Date.now() - elapsedTime;
        timerInterval = setInterval(updateTimer, 10);
        
        const startBtn = document.getElementById('startBtn');
        const stopBtn = document.getElementById('stopBtn');
        const doneBtn = document.getElementById('doneBtn');
        
        if (startBtn) startBtn.disabled = true;
        if (stopBtn) stopBtn.disabled = false;
        if (doneBtn) doneBtn.disabled = false;
    }
}

function stopTimer() {
    if (isRunning) {
        isRunning = false;
        clearInterval(timerInterval);
        
        const startBtn = document.getElementById('startBtn');
        const stopBtn = document.getElementById('stopBtn');
        
        if (startBtn) startBtn.disabled = false;
        if (stopBtn) stopBtn.disabled = true;
    }
}

function resetTimer() {
    stopTimer();
    elapsedTime = 0;
    
    const timerDisplay = document.getElementById('timer');
    const startBtn = document.getElementById('startBtn');
    const stopBtn = document.getElementById('stopBtn');
    const doneBtn = document.getElementById('doneBtn');
    const skipBtn = document.getElementById('skipBtn');
    
    if (timerDisplay) timerDisplay.textContent = '00:00.00';
    if (startBtn) startBtn.disabled = true;
    if (stopBtn) stopBtn.disabled = true;
    if (doneBtn) doneBtn.disabled = true;
    if (skipBtn) skipBtn.disabled = true;
}

// Функция для отправки данных о выполненных заданиях в Google Таблицы
function sendCompletedTaskData(card, time, status) {
    // Создаем временную форму для отправки данных задания
    const tempForm = document.createElement('form');
    tempForm.style.display = 'none';
    
    const inputCard = document.createElement('input');
    inputCard.name = 'Card';
    inputCard.value = card;
    
    const inputTime = document.createElement('input');
    inputTime.name = 'Time';
    inputTime.value = time;
    
    const inputStatus = document.createElement('input');
    inputStatus.name = 'Status';
    inputStatus.value = status;
    
    const inputParticipant = document.createElement('input');
    inputParticipant.name = 'Participant';
    inputParticipant.value = participantName;
    
    const inputParticipantRole = document.createElement('input');
    inputParticipantRole.name = 'ParticipantRole';
    inputParticipantRole.value = participantRole;
    
    const inputHost = document.createElement('input');
    inputHost.name = 'Host';
    inputHost.value = hostName;
    
    const inputNetwork = document.createElement('input');
    inputNetwork.name = 'Network';
    inputNetwork.value = network;
    
    const inputCity = document.createElement('input');
    inputCity.name = 'City';
    inputCity.value = city;
    
    const inputStoreAddress = document.createElement('input');
    inputStoreAddress.name = 'StoreAddress';
    inputStoreAddress.value = storeAddress;
    
    const inputStoreCode = document.createElement('input');
    inputStoreCode.name = 'StoreCode';
    inputStoreCode.value = storeCode;
    
    const inputRound = document.createElement('input');
    inputRound.name = 'Round';
    inputRound.value = currentRound;
    
    const inputLocalTimestamp = document.createElement('input');
    inputLocalTimestamp.name = 'LocalTimestamp';
    inputLocalTimestamp.value = getLocalTimestamp();
    
    tempForm.appendChild(inputCard);
    tempForm.appendChild(inputTime);
    tempForm.appendChild(inputStatus);
    tempForm.appendChild(inputParticipant);
    tempForm.appendChild(inputParticipantRole);
    tempForm.appendChild(inputHost);
    tempForm.appendChild(inputNetwork);
    tempForm.appendChild(inputCity);
    tempForm.appendChild(inputStoreAddress);
    tempForm.appendChild(inputStoreCode);
    tempForm.appendChild(inputRound);
    tempForm.appendChild(inputLocalTimestamp);
    
    document.body.appendChild(tempForm);
    
    // Отправляем форму
    fetch(scriptURL, { 
        method: 'POST', 
        body: new FormData(tempForm),
        mode: 'no-cors'
    })
    .then(() => {
        console.log('Данные задания отправлены (no-cors режим)');
    })
    .catch(error => {
        console.log('Запрос задания выполнен (ошибка CORS проигнорирована)');
    })
    .finally(() => {
        document.body.removeChild(tempForm);
    });
}

// Функция для создания и скачивания файла с результатами
function saveGameResultsToFile() {
    if (gameResults.length === 0) return;
    
    // Создаем CSV содержимое с обратной связью
    let csvContent = "Дата проведения игры,Время проведения раунда,Раунд,Участник,Должность участника,Ведущий,Карточка,Время,Статус,Комментарий,Сеть,Город,Адрес магазина,Код точки,Обратная связь\n";
    
    gameResults.forEach(result => {
        const row = [
            result.gameDate,
            result.roundTime,
            result.round,
            `"${result.participant}"`,
            `"${result.participantRole}"`,
            `"${result.host}"`,
            `"${result.card}"`,
            `"${result.time}"`,
            `"${result.status}"`,
            `"${result.comment}"`,
            `"${result.network}"`,
            `"${result.city}"`,
            `"${result.storeAddress}"`,
            `"${result.storeCode}"`,
            "" // Обратная связь для отдельных раундов не заполняется
        ].join(',');
        
        csvContent += row + '\n';
    });
    
    // Добавляем итоговую строку с обратной связью
    const lastResult = gameResults[gameResults.length - 1];
    const summaryRow = [
        lastResult.gameDate,
        lastResult.roundTime,
        "Итог",
        `"${lastResult.participant}"`,
        `"${lastResult.participantRole}"`,
        `"${lastResult.host}"`,
        "",
        `"${formatTime(totalGameTime)}"`,
        `"Выполнено: ${completedTasksCount}/6"`,
        "",
        `"${lastResult.network}"`,
        `"${lastResult.city}"`,
        `"${lastResult.storeAddress}"`,
        `"${lastResult.storeCode}"`,
        `"${feedback}"` // Добавляем обратную связь
    ].join(',');
    
    csvContent += summaryRow + '\n';
    
    // Создаем Blob и ссылку для скачивания
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    // Формируем имя файла с датой, сетью и именем участника
    const firstResult = gameResults[0];
    const filename = `TECNO_AI_EXPERT_${firstResult.gameDate}_${firstResult.network}_${firstResult.participant}.csv`;
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Функция для отправки данных в Google Таблицы
function sendToGoogleSheets(result) {
    // Получаем элементы формы
    const formHost = document.getElementById('form-host');
    const formParticipant = document.getElementById('form-participant');
    const formParticipantRole = document.getElementById('form-participant-role');
    const formCard = document.getElementById('form-card');
    const formTime = document.getElementById('form-time');
    const formStatus = document.getElementById('form-status');
    const formComment = document.getElementById('form-comment');
    const formRound = document.getElementById('form-round');
    const formNetwork = document.getElementById('form-network');
    const formCity = document.getElementById('form-city');
    const formStoreAddress = document.getElementById('form-store-address');
    const formStoreCode = document.getElementById('form-store-code');
    const formLocalTimestamp = document.getElementById('form-local-timestamp');
    const googleForm = document.getElementById('submit-to-google-sheet');
    
    if (!googleForm) return;
    
    // Заполняем скрытую форму данными
    if (formHost) formHost.value = result.host;
    if (formParticipant) formParticipant.value = result.participant;
    if (formParticipantRole) formParticipantRole.value = result.participantRole;
    if (formCard) formCard.value = result.card;
    if (formTime) formTime.value = result.time;
    if (formStatus) formStatus.value = result.status;
    if (formComment) formComment.value = result.comment;
    if (formRound) formRound.value = result.round;
    if (formNetwork) formNetwork.value = result.network;
    if (formCity) formCity.value = result.city;
    if (formStoreAddress) formStoreAddress.value = result.storeAddress;
    if (formStoreCode) formStoreCode.value = result.storeCode;
    if (formLocalTimestamp) formLocalTimestamp.value = getLocalTimestamp();
    
    // Показываем индикатор загрузки
    const loadingIndicator = document.getElementById('loadingIndicator');
    const successMessage = document.getElementById('successMessage');
    
    if (loadingIndicator) loadingIndicator.style.display = 'block';
    
    // Отправляем форму
    fetch(scriptURL, { 
        method: 'POST', 
        body: new FormData(googleForm),
        mode: 'no-cors'
    })
    .then(() => {
        console.log('Данные отправлены (no-cors режим)');
        if (loadingIndicator) loadingIndicator.style.display = 'none';
        if (successMessage) {
            successMessage.style.display = 'block';
            setTimeout(() => {
                successMessage.style.display = 'none';
            }, 3000);
        }
    })
    .catch(error => {
        console.log('Запрос выполнен (ошибка CORS проигнорирована)');
        if (loadingIndicator) loadingIndicator.style.display = 'none';
        if (successMessage) {
            successMessage.style.display = 'block';
            setTimeout(() => {
                successMessage.style.display = 'none';
            }, 3000);
        }
    });
}

// Функция для отправки итогов в Google Таблицы
function sendSummaryToGoogleSheets() {
    // Получаем элементы формы
    const formSummaryParticipant = document.getElementById('form-summary-participant');
    const formSummaryParticipantRole = document.getElementById('form-summary-participant-role');
    const formSummaryHost = document.getElementById('form-summary-host');
    const formSummaryCity = document.getElementById('form-summary-city');
    const formSummaryNetwork = document.getElementById('form-summary-network');
    const formSummaryStoreCode = document.getElementById('form-summary-store-code');
    const formSummaryStoreAddress = document.getElementById('form-summary-store-address');
    const formSummaryTimestamp = document.getElementById('form-summary-timestamp');
    const formSummaryCompletedCount = document.getElementById('form-summary-completed-count');
    const formSummaryTotalTime = document.getElementById('form-summary-total-time');
    const formSummaryFeedback = document.getElementById('form-summary-feedback');
    const summaryForm = document.getElementById('submit-summary-to-google-sheet');
    
    if (!summaryForm) return;
    
    // Заполняем скрытую форму данными
    if (formSummaryParticipant) formSummaryParticipant.value = participantName;
    if (formSummaryParticipantRole) formSummaryParticipantRole.value = participantRole;
    if (formSummaryHost) formSummaryHost.value = hostName;
    if (formSummaryCity) formSummaryCity.value = city;
    if (formSummaryNetwork) formSummaryNetwork.value = network;
    if (formSummaryStoreCode) formSummaryStoreCode.value = storeCode;
    if (formSummaryStoreAddress) formSummaryStoreAddress.value = storeAddress;
    if (formSummaryTimestamp) formSummaryTimestamp.value = getLocalTimestamp();
    if (formSummaryCompletedCount) formSummaryCompletedCount.value = completedTasksCount;
    if (formSummaryTotalTime) formSummaryTotalTime.value = formatTime(totalGameTime);
    if (formSummaryFeedback) formSummaryFeedback.value = feedback;
    
    // Отправляем форму
    fetch(scriptURL, { 
        method: 'POST', 
        body: new FormData(summaryForm),
        mode: 'no-cors'
    })
    .then(() => {
        console.log('Итоговые данные отправлены (no-cors режим)');
    })
    .catch(error => {
        console.log('Запрос итогов выполнен (ошибка CORS проигнорирована)');
    });
}

// Функция для завершения раунда
function completeRound(status, comment = '') {
    if (status === 'Сделано' && elapsedTime === 0) {
        alert('Пожалуйста, запустите секундомер перед завершением раунда.');
        return;
    }
    
    // Обновляем общее время игры
    totalGameTime += elapsedTime;
    
    // Обновляем счетчик выполненных заданий
    if (status === 'Сделано') {
        completedTasksCount++;
        // УБРАЛИ вызов sendCompletedTaskData - данные теперь отправляются только через sendToGoogleSheets
    }
    
    const now = new Date();
    const gameDate = now.toISOString().split('T')[0];
    const roundTime = now.toTimeString().split(' ')[0];
    
    const result = {
        round: currentRound,
        participant: participantName,
        participantRole: participantRole,
        host: hostName,
        card: currentCardText,
        time: formatTime(elapsedTime),
        status: status,
        comment: comment,
        network: network,
        city: city,
        storeAddress: storeAddress,
        storeCode: storeCode,
        gameDate: gameDate,
        roundTime: roundTime
    };
    
    gameResults.push(result);
    
    if (currentCardText && !usedCardTexts.includes(currentCardText)) {
        usedCardTexts.push(currentCardText);
    }
    
    addResultToTable(result);
    
    // ОТПРАВЛЯЕМ ДАННЫЕ ТОЛЬКО ОДИН РАЗ - через sendToGoogleSheets
    sendToGoogleSheets(result);
    
    resetTimer();
    cardFlippedInRound = false;
    
    if (currentRound < totalRounds) {
        currentRound++;
        const currentRoundDisplay = document.getElementById('currentRound');
        if (currentRoundDisplay) currentRoundDisplay.textContent = currentRound;
        createCards();
    } else {
        endGame();
    }
    
    currentCardText = '';
}

// Функция для добавления результата в таблицу
function addResultToTable(result) {
    const resultsBody = document.getElementById('resultsBody');
    if (!resultsBody) return;
    
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${result.round}</td>
        <td>${result.card}</td>
        <td>${result.time}</td>
        <td>${result.status}</td>
    `;
    resultsBody.appendChild(row);
}

// Функция для завершения игры
function endGame() {
    const resultsTable = document.getElementById('resultsTable');
    const summaryResults = document.getElementById('summaryResults');
    const completedCountDisplay = document.getElementById('completedCount');
    const totalTimeDisplay = document.getElementById('totalTime');
    const doneBtn = document.getElementById('doneBtn');
    const skipBtn = document.getElementById('skipBtn');
    const startBtn = document.getElementById('startBtn');
    const stopBtn = document.getElementById('stopBtn');
    const currentRoundDisplay = document.getElementById('currentRound');
    
    if (resultsTable) resultsTable.style.display = 'block';
    if (summaryResults) summaryResults.style.display = 'block';
    if (completedCountDisplay) completedCountDisplay.textContent = completedTasksCount;
    if (totalTimeDisplay) totalTimeDisplay.textContent = formatTime(totalGameTime);
    
    if (doneBtn) doneBtn.disabled = true;
    if (skipBtn) skipBtn.disabled = true;
    if (startBtn) startBtn.disabled = true;
    if (stopBtn) stopBtn.disabled = true;
    if (currentRoundDisplay) currentRoundDisplay.textContent = totalRounds;
    
    // Устанавливаем флаг завершения игры
    gameEnded = true;
    
    // Блокируем все карточки
    const allCards = document.querySelectorAll('.card');
    allCards.forEach(card => {
        card.classList.add('disabled');
        card.style.opacity = '0.6';
        card.style.cursor = 'not-allowed';
    });
    
    // Показываем кнопку "Заново" в тестовом режиме
    if (isTestMode) {
        const restartContainer = document.getElementById('restartGameContainer');
        if (restartContainer) {
            restartContainer.style.display = 'block';
        }
    }
    
    // Показываем модальное окно обратной связи вместо немедленного сохранения
    showFeedbackModal();
}

// Функция для показа модального окна обратной связи
function showFeedbackModal() {
    const feedbackModal = document.getElementById('feedbackModal');
    if (feedbackModal) {
        feedbackModal.style.display = 'flex';
    }
}

// Функция для скрытия модального окна обратной связи
function hideFeedbackModal() {
    const feedbackModal = document.getElementById('feedbackModal');
    if (feedbackModal) {
        feedbackModal.style.display = 'none';
    }
}

// Обработчики событий
function handleDone() {
    if (currentCardText) {
        completeRound('Сделано');
    } else {
        alert('Пожалуйста, переверните карточку перед завершением раунда.');
    }
}

function handleSkip() {
    if (currentCardText) {
        stopTimer(); // Останавливаем таймер при нажатии "Пропущено"
        showSkipModal();
    } else {
        alert('Пожалуйста, переверните карточку перед пропуском.');
    }
}

function handleStartGame() {
    const participantNameInput = document.getElementById('participantName');
    const participantRoleInput = document.getElementById('participantRole');
    const hostNameInput = document.getElementById('hostName');
    const networkInput = document.getElementById('network');
    const cityInput = document.getElementById('city');
    const storeAddressInput = document.getElementById('storeAddress');
    const storeCodeInput = document.getElementById('storeCode');
    const confirmationCheckbox = document.getElementById('dataConfirmation');
    
    if (!participantNameInput || !participantRoleInput || !hostNameInput || 
        !networkInput || !cityInput || !storeAddressInput || !storeCodeInput || !confirmationCheckbox) {
        alert('Ошибка: не все поля формы найдены.');
        return;
    }
    
    participantName = participantNameInput.value.trim();
    participantRole = participantRoleInput.value.trim();
    hostName = hostNameInput.value.trim();
    network = networkInput.value.trim();
    city = cityInput.value.trim();
    storeAddress = storeAddressInput.value.trim();
    storeCode = storeCodeInput.value.trim();
    const isConfirmed = confirmationCheckbox.checked;
    
    if (participantName && participantRole && hostName && network && city && storeAddress && storeCode && isConfirmed) {
        hideNamesModal();
        gameStarted = true;
        gameStartTime = new Date();
        const roundInfo = document.getElementById('roundInfo');
        if (roundInfo) roundInfo.style.display = 'block';
        createCards();
    } else {
        alert('Пожалуйста, заполните все поля и подтвердите правильность данных.');
        
        // Подсвечиваем неподтвержденный чекбокс
        if (!isConfirmed) {
            confirmationCheckbox.style.outline = '2px solid #ff6b6b';
            setTimeout(() => {
                confirmationCheckbox.style.outline = '';
            }, 2000);
        }
    }
}

function handleSubmitSkip() {
    const skipReasonInput = document.getElementById('skipReason');
    if (!skipReasonInput) return;
    
    const skipReason = skipReasonInput.value.trim();
    if (skipReason) {
        completeRound('Пропущено', skipReason);
        hideSkipModal();
        skipReasonInput.value = '';
    } else {
        alert('Пожалуйста, укажите причину пропуска.');
    }
}

function handleCancelSkip() {
    hideSkipModal();
    const skipReasonInput = document.getElementById('skipReason');
    if (skipReasonInput) skipReasonInput.value = '';
    
    // ВОЗВРАЩАЕМ ПОЛЬЗОВАТЕЛЯ К ПОЯСНЕНИЮ КАРТОЧКИ
    showExplanationModal(currentCardText);
}

function handleCloseExplanation() {
    hideExplanationModal();
    // Автоматически запускаем таймер после закрытия пояснения
    startTimer();
}

function handleSkipFromExplanation() {
    hideExplanationModal();
    // Останавливаем таймер и показываем модальное окно пропуска
    stopTimer();
    showSkipModal();
}

function handleLeaderboard() {
    window.open('leaderboard.html', '_blank');
}

function handleLeaderboardFromModal() {
    window.open('leaderboard.html', '_blank');
}

function handleSubmitFeedback() {
    const feedbackInput = document.getElementById('feedback');
    if (feedbackInput) {
        feedback = feedbackInput.value.trim();
        
        if (!feedback) {
            alert('Пожалуйста, заполните поле обратной связи.');
            feedbackInput.focus();
            return;
        }
        
        // Сохраняем результаты в файл (с обратной связью)
        saveGameResultsToFile();
        
        // Отправляем итоговые данные в Google Таблицы (с обратной связью)
        sendSummaryToGoogleSheets();
        
        hideFeedbackModal();
        
        // Показываем сообщение об успешном завершении
        alert('Игра завершена! Результаты сохранены.');
    }
}
