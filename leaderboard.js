/* leaderboard.css - Полная версия стилей для таблицы лидеров */

* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

body {
    background: linear-gradient(135deg, rgba(106, 17, 203, 0.8) 0%, rgba(37, 117, 252, 0.8) 100%), url('background.png') no-repeat center center fixed;
    background-size: cover;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    color: white;
}

/* Фон для мобильных устройств */
@media (max-width: 768px) {
    body {
        background: linear-gradient(135deg, rgba(106, 17, 203, 0.8) 0%, rgba(37, 117, 252, 0.8) 100%), url('background-mobile.jpg') no-repeat center center fixed;
        background-size: cover;
        padding: 15px;
    }
}

@media (max-width: 480px) {
    body {
        padding: 10px;
    }
}

.container {
    width: 100%;
    max-width: 1200px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 15px;
    padding: 20px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(10px);
}

/* Адаптивность контейнера */
@media (max-width: 768px) {
    .container {
        padding: 18px;
        border-radius: 12px;
    }
}

@media (max-width: 480px) {
    .container {
        padding: 15px;
        border-radius: 10px;
    }
}

header {
    text-align: center;
    margin-bottom: 25px;
}

h1 {
    font-size: 2.2rem;
    margin-bottom: 10px;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.subtitle {
    font-size: 1.1rem;
    opacity: 0.9;
    margin-bottom: 20px;
    line-height: 1.4;
}

/* Адаптивность заголовков */
@media (max-width: 768px) {
    h1 {
        font-size: 2rem;
    }
    
    .subtitle {
        font-size: 1rem;
    }
}

@media (max-width: 480px) {
    h1 {
        font-size: 1.8rem;
    }
    
    .subtitle {
        font-size: 0.95rem;
        margin-bottom: 15px;
    }
}

@media (max-width: 360px) {
    h1 {
        font-size: 1.6rem;
    }
    
    .subtitle {
        font-size: 0.9rem;
    }
}

/* Стили для контейнера управления в header */
.header-controls {
    margin: 15px 0;
    text-align: center;
}

/* Стили для кнопки обновления */
.refresh-btn {
    background: linear-gradient(45deg, #4CAF50 0%, #45a049 100%);
    border: none;
    padding: 12px 20px;
    border-radius: 25px;
    font-size: 1rem;
    color: white;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    margin: 10px 0;
}

.refresh-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
    background: linear-gradient(45deg, #45a049 0%, #4CAF50 100%);
}

.refresh-btn:active {
    transform: translateY(1px);
}

.refresh-btn:disabled {
    background: #cccccc;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
}

/* Анимация для обновления */
.refresh-btn.loading {
    position: relative;
    color: transparent;
}

.refresh-btn.loading::after {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    top: 50%;
    left: 50%;
    margin-left: -10px;
    margin-top: -10px;
    border: 2px solid #ffffff;
    border-radius: 50%;
    border-top-color: transparent;
    animation: spin 1s ease-in-out infinite;
}

/* Адаптивность для кнопки обновления */
@media (max-width: 768px) {
    .refresh-btn {
        padding: 10px 16px;
        font-size: 0.95rem;
    }
}

@media (max-width: 480px) {
    .refresh-btn {
        padding: 8px 14px;
        font-size: 0.9rem;
        width: 100%;
        max-width: 200px;
    }
}

.leaderboard-type-selector {
    display: flex;
    justify-content: center;
    gap: 15px;
    margin-bottom: 20px;
    flex-wrap: wrap;
}

.type-btn {
    background: rgba(255, 255, 255, 0.2);
    border: 2px solid rgba(255, 255, 255, 0.3);
    padding: 12px 20px;
    border-radius: 25px;
    font-size: 1rem;
    color: white;
    cursor: pointer;
    transition: all 0.3s ease;
    min-width: 180px;
}

.type-btn.active {
    background: rgba(255, 255, 255, 0.9);
    color: #333;
    border-color: rgba(255, 255, 255, 0.9);
}

.type-btn:hover {
    background: rgba(255, 255, 255, 0.3);
}

.type-btn.active:hover {
    background: rgba(255, 255, 255, 0.9);
}

/* Адаптивность кнопок выбора типа */
@media (max-width: 768px) {
    .leaderboard-type-selector {
        flex-direction: column;
        align-items: center;
        gap: 10px;
    }
    
    .type-btn {
        width: 100%;
        max-width: 300px;
        padding: 10px 15px;
    }
}

@media (max-width: 480px) {
    .type-btn {
        min-width: auto;
        padding: 10px 12px;
        font-size: 0.95rem;
    }
}

.filters {
    display: flex;
    gap: 12px;
    margin-bottom: 20px;
    flex-wrap: wrap;
    justify-content: center;
}

.filter-select {
    background: rgba(255, 255, 255, 0.9);
    border: none;
    padding: 10px 15px;
    border-radius: 25px;
    font-size: 1rem;
    color: #333;
    min-width: 140px;
    flex: 1;
    max-width: 200px;
}

/* Адаптивность фильтров */
@media (max-width: 768px) {
    .filters {
        flex-direction: column;
        align-items: center;
        gap: 10px;
    }
    
    .filter-select {
        width: 100%;
        max-width: 300px;
    }
}

@media (max-width: 480px) {
    .filter-select {
        padding: 8px 12px;
        font-size: 0.95rem;
        min-width: 120px;
    }
}

.category-selector {
    display: none;
    justify-content: center;
    margin-bottom: 20px;
}

.category-select {
    background: rgba(255, 255, 255, 0.9);
    border: none;
    padding: 10px 15px;
    border-radius: 25px;
    font-size: 1rem;
    color: #333;
    min-width: 300px;
    text-align: center;
}

/* Адаптивность выбора категории */
@media (max-width: 768px) {
    .category-selector {
        width: 100%;
    }
    
    .category-select {
        width: 100%;
        max-width: 300px;
    }
}

@media (max-width: 480px) {
    .category-select {
        min-width: auto;
        width: 100%;
        padding: 8px 12px;
        font-size: 0.95rem;
    }
}

/* Стили для секции поиска */
.search-section {
    margin-bottom: 25px;
}

.search-form {
    background: rgba(255, 255, 255, 0.1);
    padding: 25px;
    border-radius: 15px;
    margin-bottom: 25px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.search-form .form-group {
    margin-bottom: 20px;
}

.search-form label {
    display: block;
    margin-bottom: 8px;
    font-weight: bold;
    font-size: 1rem;
    color: white;
}

.search-form input {
    width: 100%;
    padding: 12px 15px;
    border: none;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.95);
    font-size: 1rem;
    transition: all 0.3s ease;
    border: 2px solid transparent;
}

.search-form input:focus {
    outline: none;
    border-color: #4CAF50;
    box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.3);
}

.search-btn {
    background: linear-gradient(45deg, #2196F3 0%, #1976D2 100%);
    border: none;
    padding: 15px 30px;
    border-radius: 25px;
    font-size: 1.1rem;
    color: white;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    width: 100%;
    font-weight: bold;
}

.search-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
    background: linear-gradient(45deg, #1976D2 0%, #1565C0 100%);
}

.search-btn:active {
    transform: translateY(-1px);
}

.search-btn:disabled {
    background: #cccccc;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
}

.search-btn.loading {
    position: relative;
    color: transparent;
}

.search-btn.loading::after {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    top: 50%;
    left: 50%;
    margin-left: -10px;
    margin-top: -10px;
    border: 2px solid #ffffff;
    border-radius: 50%;
    border-top-color: transparent;
    animation: spin 1s ease-in-out infinite;
}

.participant-info {
    background: linear-gradient(45deg, rgba(76, 175, 80, 0.2) 0%, rgba(33, 150, 243, 0.2) 100%);
    padding: 20px;
    border-radius: 10px;
    margin-bottom: 25px;
    text-align: center;
    font-size: 1.2rem;
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.participant-info strong {
    color: #4CAF50;
    font-weight: bold;
}

.search-results-table {
    width: 100%;
    border-collapse: collapse;
    min-width: 650px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 10px;
    overflow: hidden;
}

.search-results-table th,
.search-results-table td {
    padding: 15px 12px;
    text-align: left;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.search-results-table th {
    background: rgba(255, 255, 255, 0.15);
    font-weight: bold;
    font-size: 1rem;
    color: white;
}

.search-results-table tr:hover {
    background: rgba(255, 255, 255, 0.08);
}

.search-results-table .rank {
    font-weight: bold;
    text-align: center;
    font-size: 1.1rem;
}

/* Адаптивность для поиска */
@media (max-width: 768px) {
    .search-form {
        padding: 20px;
    }
    
    .search-results-table {
        min-width: 550px;
        font-size: 0.9rem;
    }
    
    .search-results-table th,
    .search-results-table td {
        padding: 12px 8px;
    }
    
    .participant-info {
        padding: 15px;
        font-size: 1.1rem;
    }
}

@media (max-width: 480px) {
    .search-form {
        padding: 15px;
    }
    
    .search-results-table {
        min-width: 500px;
    }
    
    .search-btn {
        padding: 12px 20px;
        font-size: 1rem;
    }
}

.table-container {
    overflow-x: auto;
    margin-top: 20px;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.05);
    -webkit-overflow-scrolling: touch; /* Плавная прокрутка на iOS */
}

/* Улучшение отображения скролла на мобильных */
@media (max-width: 768px) {
    .table-container {
        margin-left: -5px;
        margin-right: -5px;
        width: calc(100% + 10px);
        border-radius: 8px;
    }
}

.leaderboard-table {
    width: 100%;
    border-collapse: collapse;
    min-width: 600px;
}

/* Адаптивность таблицы */
@media (max-width: 768px) {
    .leaderboard-table {
        min-width: 550px;
        font-size: 0.95rem;
    }
}

@media (max-width: 480px) {
    .leaderboard-table {
        min-width: 500px;
        font-size: 0.9rem;
    }
}

@media (max-width: 360px) {
    .leaderboard-table {
        min-width: 450px;
    }
}

th, td {
    padding: 14px 12px;
    text-align: left;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

th {
    background: rgba(255, 255, 255, 0.15);
    font-weight: bold;
    font-size: 1rem;
    position: sticky;
    top: 0;
}

/* Адаптивность ячеек таблицы */
@media (max-width: 768px) {
    th, td {
        padding: 12px 10px;
        font-size: 0.95rem;
    }
}

@media (max-width: 480px) {
    th, td {
        padding: 10px 8px;
        font-size: 0.9rem;
    }
}

@media (max-width: 360px) {
    th, td {
        padding: 8px 6px;
        font-size: 0.85rem;
    }
}

tr:hover {
    background: rgba(255, 255, 255, 0.05);
}

.rank {
    font-weight: bold;
    font-size: 1.1rem;
    text-align: center;
    width: 60px;
}

.rank-1 { color: #FFD700; }
.rank-2 { color: #C0C0C0; }
.rank-3 { color: #CD7F32; }

/* Адаптивность колонки с рангом */
@media (max-width: 480px) {
    .rank {
        font-size: 1rem;
        width: 50px;
    }
}

@media (max-width: 360px) {
    .rank {
        font-size: 0.95rem;
        width: 45px;
    }
}

.participant-name {
    font-weight: bold;
    font-size: 1.05rem;
}

/* Адаптивность имени участника */
@media (max-width: 480px) {
    .participant-name {
        font-size: 1rem;
    }
}

.loading {
    text-align: center;
    padding: 40px;
    font-size: 1.2rem;
}

.loading-spinner {
    border: 4px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top: 4px solid white;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
    margin: 0 auto 20px;
}

.no-data {
    text-align: center;
    padding: 40px;
    font-size: 1.2rem;
    opacity: 0.8;
}

/* Адаптивность состояний загрузки и отсутствия данных */
@media (max-width: 768px) {
    .loading, .no-data {
        padding: 30px;
        font-size: 1.1rem;
    }
    
    .loading-spinner {
        width: 35px;
        height: 35px;
    }
}

@media (max-width: 480px) {
    .loading, .no-data {
        padding: 25px;
        font-size: 1rem;
    }
    
    .loading-spinner {
        width: 30px;
        height: 30px;
    }
}

.back-btn {
    background: linear-gradient(45deg, #ff9a9e 0%, #fad0c4 100%);
    border: none;
    padding: 12px 25px;
    border-radius: 50px;
    font-size: 1rem;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    color: #333;
    margin-top: 25px;
    text-decoration: none;
    display: inline-block;
    text-align: center;
    width: 100%;
    max-width: 250px;
}

.back-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
}

.back-btn-container {
    display: flex;
    justify-content: center;
    width: 100%;
}

/* Адаптивность кнопки возврата */
@media (max-width: 768px) {
    .back-btn {
        padding: 10px 20px;
        font-size: 0.95rem;
        margin-top: 20px;
    }
}

@media (max-width: 480px) {
    .back-btn {
        padding: 10px 15px;
        font-size: 0.9rem;
        max-width: 220px;
    }
}

/* Стили для кнопки закрытия вкладки */
#closeTabBtn {
    background: linear-gradient(45deg, #ff6b6b 0%, #ff8e8e 100%);
    border: none;
    padding: 12px 25px;
    border-radius: 50px;
    font-size: 1rem;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    color: white;
    margin-top: 25px;
    text-align: center;
    width: 100%;
    max-width: 250px;
}

#closeTabBtn:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
    background: linear-gradient(45deg, #ff5252 0%, #ff7b7b 100%);
}

/* Адаптивность кнопки закрытия вкладки */
@media (max-width: 768px) {
    #closeTabBtn {
        padding: 10px 20px;
        font-size: 0.95rem;
        margin-top: 20px;
    }
}

@media (max-width: 480px) {
    #closeTabBtn {
        padding: 10px 15px;
        font-size: 0.9rem;
        max-width: 220px;
    }
}

/* Стили для временных сообщений */
.temp-message {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 25px;
    border-radius: 8px;
    color: white;
    font-weight: bold;
    z-index: 10000;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(10px);
}

.temp-message-success {
    background: linear-gradient(45deg, #4CAF50 0%, #45a049 100%);
    border-left: 4px solid #2E7D32;
}

.temp-message-error {
    background: linear-gradient(45deg, #f44336 0%, #d32f2f 100%);
    border-left: 4px solid #C62828;
}

.temp-message-info {
    background: linear-gradient(45deg, #2196F3 0%, #1976D2 100%);
    border-left: 4px solid #1565C0;
}

/* Адаптивность для сообщений */
@media (max-width: 768px) {
    .temp-message {
        top: 10px;
        right: 10px;
        left: 10px;
        text-align: center;
    }
}

/* Анимации */
@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
}

.search-results {
    animation: fadeIn 0.5s ease-out;
}

/* Стили для состояния загрузки в поиске */
.search-loading {
    text-align: center;
    padding: 40px;
    font-size: 1.1rem;
}

.search-loading .loading-spinner {
    margin-bottom: 15px;
}

/* Портретная ориентация на мобильных */
@media (max-width: 768px) and (orientation: portrait) {
    .table-container {
        margin-left: -10px;
        margin-right: -10px;
        width: calc(100% + 20px);
    }
}

/* Ландшафтная ориентация на мобильных */
@media (max-width: 768px) and (orientation: landscape) {
    .container {
        padding: 15px;
    }
    
    .leaderboard-type-selector {
        flex-direction: row;
        gap: 10px;
    }
    
    .type-btn {
        min-width: 150px;
    }
}

/* Дополнительные улучшения для accessibility */
@media (prefers-reduced-motion: reduce) {
    * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
}

/* Улучшение фокуса для доступности */
button:focus,
input:focus,
select:focus {
    outline: 2px solid #4CAF50;
    outline-offset: 2px;
}

/* Стили для скрытых элементов */
[style*="display: none"] {
    display: none !important;
}

/* Улучшение читаемости текста */
p, td, th {
    line-height: 1.5;
}

/* Стили для иконок */
.fas, .fab {
    margin-right: 8px;
}

/* Улучшение отображения на очень маленьких экранах */
@media (max-width: 320px) {
    .container {
        padding: 10px;
    }
    
    h1 {
        font-size: 1.5rem;
    }
    
    .type-btn {
        padding: 8px 10px;
        font-size: 0.85rem;
    }
}

/* Стили для состояния ховера на тач-устройствах */
@media (hover: none) {
    .type-btn:hover,
    .refresh-btn:hover,
    .search-btn:hover,
    .back-btn:hover,
    #closeTabBtn:hover {
        transform: none;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }
    
    tr:hover {
        background: rgba(255, 255, 255, 0.02);
    }
}

/* Поддержка темной темы */
@media (prefers-color-scheme: dark) {
    .filter-select,
    .category-select,
    .search-form input {
        background: rgba(255, 255, 255, 0.95);
        color: #333;
    }
}

/* Улучшение производительности анимаций */
.refresh-btn,
.search-btn,
.back-btn,
#closeTabBtn,
.type-btn {
    transform: translateZ(0);
    backface-visibility: hidden;
    perspective: 1000px;
}
