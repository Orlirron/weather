// 1. Твій унікальний ключ (встав сюди те, що скопіював на сайті)
const apiKey = '933540d1faaf81cc88ce121ca5b7c81b'; 

// 2. Знаходимо всі необхідні елементи на сторінці
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const weatherInfo = document.getElementById('weather-info');
const cityName = document.getElementById('city-name');
const tempElement = document.getElementById('temp');
const descElement = document.getElementById('desc');
const errorMsg = document.getElementById('error-msg');

// 3. Вішаємо "вухо" на кнопку "Знайти"
searchBtn.addEventListener('click', function() {
    const city = cityInput.value; // Читаємо, що ввів користувач
    
    // Якщо поле порожнє - нічого не робимо (зупиняємо функцію)
    if (city === '') {
        return; 
    }

    // 4. Формуємо адресу, куди піде наш "офіціант"
    // Зверни увагу на units=metric (щоб були градуси Цельсія) і lang=ua (щоб опис був українською)
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=ua`;

    // 5. ВІДПРАВЛЯЄМО ЗАПИТ НА СЕРВЕР (команда fetch)
    fetch(url)
        .then(function(response) {
            // response - це відповідь сервера. Перевіряємо, чи все добре (статус 200)
            if (!response.ok) {
                throw new Error('Місто не знайдено'); // Викидаємо помилку, якщо міста немає
            }
            // Просимо розпакувати дані з формату сервера в звичайний об'єкт JS
            return response.json(); 
        })
        .then(function(data) {
            // КОЛИ ДАНІ ПРИЙШЛИ ТА РОЗПАКОВАНІ:
            console.log(data); // Виводимо в консоль, щоб подивитися, що там є
            
            // Підставляємо дані в наш HTML
            cityName.textContent = data.name;
            // Math.round заокруглює температуру (щоб не було 25.43°C)
            tempElement.textContent = Math.round(data.main.temp) + '°C'; 
            descElement.textContent = data.weather[0].description;


            
// --- НОВИЙ КОД ДЛЯ ІКОНКИ ---
            const iconCode = data.weather[0].icon; // Дістаємо код (напр. "01d")
            // Збираємо повне посилання на картинку з сервера:
            
            // ПЕРЕВІРКА 1: Виведемо сам код в консоль (напр. "01d")
            console.log("Код іконки:", iconCode);

            const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;
            console.log("Повне посилання:", iconUrl);
            const weatherIcon = document.getElementById('weather-icon');
            weatherIcon.src = iconUrl; // Вставляємо картинку
            weatherIcon.style.display = 'block'; // Показуємо її
            // -----------------------------

            
            // НОВІ ДАНІ (витягуємо з об'єкта data)
            document.getElementById('feels-like').textContent = Math.round(data.main.feels_like) + '°C';
            document.getElementById('humidity').textContent = data.main.humidity + '%';
            document.getElementById('wind').textContent = data.wind.speed + ' м/с';

            // Показуємо блок з погодою і ховаємо текст помилки
            weatherInfo.style.display = 'block';
            errorMsg.textContent = '';
        })
        .catch(function(error) {
            // ЯКЩО ЩОСЬ ПІШЛО НЕ ТАК (наприклад, ввели "Абракадабра")
            errorMsg.textContent = 'Місто не знайдено. Спробуй ще раз!';
            weatherInfo.style.display = 'none'; // Ховаємо блок з погодою
        });
});


// Вішаємо "вухо" на поле вводу (cityInput)
cityInput.addEventListener('keydown', function(event) {
    // Об'єкт event містить інформацію про те, яку саме кнопку натиснули
    if (event.key === 'Enter') {
        // Замість того, щоб копіювати весь код запиту знову,
        // ми просто кажемо JavaScript: "Симулюй клік по кнопці пошуку"
        searchBtn.click();
    }
});


// === АВТОМАТИЧНА ГЕОЛОКАЦІЯ ===
// Цей код спрацьовує одразу при завантаженні сторінки

// Перевіряємо, чи взагалі браузер підтримує геолокацію
if ('geolocation' in navigator) {
    
    // Просимо в браузера поточні координати
    navigator.geolocation.getCurrentPosition(
        function(position) {
            // Якщо користувач натиснув "Дозволити"
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            
            // Збираємо посилання для пошуку ПО КООРДИНАТАХ
            const geoUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=ua`;
            
            fetch(geoUrl)
                .then(function(response) {
                    return response.json();
                })
                .then(function(data) {
                    // ХИТРИЙ ТРЮК:
                    // 1. Беремо назву міста, яку визначив сервер, і вставляємо в наш input
                    cityInput.value = data.name;
                    
                    // 2. Симулюємо клік по кнопці "Знайти" (ніби це зробив користувач)
                    // Це автоматично запустить і пошук поточної погоди, і прогноз на 5 днів!
                    searchBtn.click();
                    
                    // 3. Очищаємо поле вводу, щоб було красиво
                    cityInput.value = '';
                });
        }, 
        function(error) {
            // Якщо користувач натиснув "Блокувати" або координати не знайдено
            console.log("Локація недоступна:", error.message);
        }
    );
}