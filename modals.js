// modals.js - Вынесенный код для управления модальными окнами

// Глобальные переменные для модальных окон
let namesModal, skipModal, explanationModal;
let body;

// Инициализация переменных при загрузке DOM
document.addEventListener('DOMContentLoaded', function() {
    namesModal = document.getElementById('namesModal');
    skipModal = document.getElementById('skipModal');
    explanationModal = document.getElementById('explanationModal');
    body = document.body;
});

// Функция для показа модального окна ввода данных
function showNamesModal() {
    if (namesModal) {
        namesModal.style.display = 'flex';
        if (body) body.classList.add('modal-open');
    }
}

// Функция для скрытия модального окна ввода данных
function hideNamesModal() {
    if (namesModal) {
        namesModal.style.display = 'none';
        if (body) body.classList.remove('modal-open');
    }
}

// Функция для показа модального окна пропуска карточки
function showSkipModal() {
    if (skipModal) {
        skipModal.style.display = 'flex';
    }
}

// Функция для скрытия модального окна пропуска карточки
function hideSkipModal() {
    if (skipModal) {
        skipModal.style.display = 'none';
        const skipReasonInput = document.getElementById('skipReason');
        if (skipReasonInput) skipReasonInput.value = '';
    }
}

// Функция для показа модального окна с пояснением
function showExplanationModal(cardText) {
    if (explanationModal) {
        const explanationTitle = document.getElementById('explanationTitle');
        const explanationText = document.getElementById('explanationText');
        
        if (explanationTitle) explanationTitle.textContent = cardText;
        if (explanationText) {
            // Используем глобальный объект cardExplanations из game.js
            const explanation = window.cardExplanations ? window.cardExplanations[cardText] : null;
            explanationText.textContent = explanation || "Пояснение к этому заданию отсутствует.";
        }
        
        explanationModal.style.display = 'flex';
    }
}

// Функция для скрытия модального окна с пояснением
function hideExplanationModal() {
    if (explanationModal) {
        explanationModal.style.display = 'none';
    }
}

// Функция для настройки прокрутки полей ввода
function setupInputScrolling() {
    if (!namesModal) return;
    
    const inputs = namesModal.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    });
}

// Инициализация модальных окон
function initializeModals() {
    // Показать модальное окно с вводом имен при загрузке
    showNamesModal();
    
    // Настройка прокрутки для полей ввода
    setupInputScrolling();
}