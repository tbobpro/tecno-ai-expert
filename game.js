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

// Пояснения к карточкам
window.cardExplanations = {
    "Ассистент Ella (Где найти помощника)": "Ассистент Ella доступен через иконку на главном экране или по долгому нажатию кнопки домой. Он помогает управлять устройством, находить информацию и выполнять команды.",
    "Ассистент Ella (Умный поиск)": "Ella может искать информацию в интернете, приложениях и на устройстве. Просто спросите её о чём угодно, и она найдёт наиболее релевантные ответы.",
    "Помощник по работе с документами": "ИИ помогает создавать, редактировать и форматировать документы. Может предлагать структуру, исправлять ошибки и оптимизировать содержание.",
    "Редактор AI": "Интеллектуальный редактор для текстов, который может перефразировать, улучшать стиль, проверять грамматику и адаптировать текст под разные цели.",
    "Работа с документами (Картинка в документ)": "Функция позволяет преобразовать изображение с текстом в редактируемый документ. Система распознает текст и сохраняет его в выбранном формате.",
    "Работа с документами (Расшифровка записей диктофона)": "AI преобразует голосовые записи в текст с высокой точностью, распознавая разных говорящих и сохраняя структуру разговора.",
    "Круг для поиска": "Инновационная функция поиска, где пользователь рисует круг вокруг интересующего объекта на экране, и система находит похожие или связанные элементы.",
    "Интеграция с сервисами Яндекс": "Глубокая интеграция с экосистемой Яндекс, включая поиск, карты, музыку и другие сервисы для удобства пользователя.",
    "Решение математических задач": "AI может решать математические задачи разных уровней сложности - от простых арифметических операций до сложных уравнений.",
    "Студия AI (Удаление объекта с фотографии)": "Мощный инструмент для удаления нежелательных объектов с фотографий с сохранением естественного фона.",
    "Студия AI (Расширение границ кадра)": "Функция позволяет увеличить размер фотографии, интеллектуально дорисовывая недостающие части изображения.",
    "Студия AI (AI Доска для рисования)": "Интеллектуальный холст для рисования, где AI помогает создавать художественные работы, предлагая стили и улучшения.",
    "Студия AI (AI Генератор обоев)": "Создание уникальных обоев для рабочего стола на основе предпочтений пользователя и текущих тенденций дизайна.",
    "Студия AI (Улучшение групповых портретов)": "Автоматическое улучшение групповых фотографий - выравнивание лиц, улучшение качества и ретушь.",
    "Умный переводчик (Перевод разговора)": "Режим перевода диалога между двумя людьми, говорящими на разных языках, с сохранением контекста разговора.",
    "Умный переводчик (Синхронный перевод)": "Перевод речи в реальном времени с минимальной задержкой, идеально подходит для живого общения.",
    "Умный переводчик (Перевод изображений)": "Распознавание и перевод текста на изображениях, фотографиях и в реальном времени через камеру.",
    "Телефонный помощник (Сводка и расшифровка звонков)": "AI анализирует телефонные разговоры, создаёт краткие сводки и расшифровывает содержание звонков.",
    "Телефонный помощник (Автоответчик AI)": "Интеллектуальный автоответчик, который может вести осмысленные диалоги с звонящими и передавать важную информацию.",
    "Телефонный помощник (Перевод звонков в реальном времени)": "Перевод телефонных разговоров в реальном времени, позволяя общаться с людьми на разных языках.",
    "Телефонный помощник (ИИ Шумоподавление)": "Продвинутая система шумоподавления, которая очищает голос собеседника от фоновых шумов во время звонков."
};

// URL скрипта Google Apps
const scriptURL = 'https://script.google.com/macros/s/AKfycbxzxiv4waOxmee0yT9K7gsZUr1lCbcDl6dGWv6XHVB7M57lwAeLqcDsW5SVmFJYebGq/exec';

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
    }
    
    const now = new Date();
    const gameDate = now.toISOString().split('T')[0]; // Дата в формате YYYY-MM-DD
    const roundTime = now.toTimeString().split(' ')[0]; // Время в формате HH:MM:SS
    
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
    
    if (!participantNameInput || !participantRoleInput || !hostNameInput || 
        !networkInput || !cityInput || !storeAddressInput || !storeCodeInput) {
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
    
    if (participantName && participantRole && hostName && network && city && storeAddress && storeCode) {
        hideNamesModal();
        gameStarted = true;
        gameStartTime = new Date();
        const roundInfo = document.getElementById('roundInfo');
        if (roundInfo) roundInfo.style.display = 'block';
        createCards();
    } else {
        alert('Пожалуйста, заполните все поля.');
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
        
        // Сохраняем результаты в файл (с обратной связью)
        saveGameResultsToFile();
        
        // Отправляем итоговые данные в Google Таблицы (с обратной связью)
        sendSummaryToGoogleSheets();
        
        hideFeedbackModal();
        
        // Показываем сообщение об успешном завершении
        alert('Игра завершена! Результаты сохранены.');
    }
}
