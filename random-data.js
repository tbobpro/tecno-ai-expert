// random-data.js - Случайные данные для тестового режима

const randomFirstNames = ['Александр', 'Дмитрий', 'Максим', 'Сергей', 'Андрей', 'Алексей', 'Артём', 'Илья', 'Кирилл', 'Михаил', 'Евгений', 'Константин', 'Владимир', 'Никита', 'Павел'];
const randomLastNames = ['Иванов', 'Петров', 'Сидоров', 'Смирнов', 'Кузнецов', 'Попов', 'Васильев', 'Соколов', 'Михайлов', 'Новиков', 'Фёдоров', 'Морозов', 'Волков', 'Алексеев', 'Лебедев'];
const randomCities = ['Москва', 'Санкт-Петербург', 'Новосибирск', 'Екатеринбург', 'Казань', 'Нижний Новгород', 'Челябинск', 'Самара', 'Омск', 'Ростов-на-Дону', 'Уфа', 'Красноярск', 'Воронеж', 'Пермь', 'Волгоград'];
const randomAddresses = [
    'ул. Ленина, д. 15', 'пр. Мира, д. 42', 'ул. Советская, д. 7', 
    'ул. Пушкина, д. 23', 'ул. Гагарина, д. 56', 'ул. Кирова, д. 31',
    'пр. Ленинградский, д. 89', 'ул. Центральная, д. 12', 'ул. Садовая, д. 45',
    'ул. Молодёжная, д. 67', 'ул. Школьная, д. 3', 'ул. Заречная, д. 78'
];

// Функция для генерации случайных данных
function generateRandomData() {
    const firstName = randomFirstNames[Math.floor(Math.random() * randomFirstNames.length)];
    const lastName = randomLastNames[Math.floor(Math.random() * randomLastNames.length)];
    const city = randomCities[Math.floor(Math.random() * randomCities.length)];
    const address = randomAddresses[Math.floor(Math.random() * randomAddresses.length)];
    const storeCode = Math.floor(1000 + Math.random() * 9000).toString();
    
    return {
        participant: `${firstName} ${lastName}`,
        participantRole: 'Продавец',
        host: 'Test',
        network: 'ДНС',
        city: city,
        storeAddress: address,
        storeCode: storeCode
    };
}