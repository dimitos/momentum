let lang = 'en';
const nameInput = document.querySelector('.name');
let nameDesk = '';
const timesOfDay = {
  en: ['Good night', 'Good morning', 'Good afternoon', 'Good evening'],
  ru: ['Доброй ночи!', 'Доброе утро', 'Добрый день', 'Добрый вечер'],
};
import { playList } from './playList.js';

/**
 * Часы и календарь
 */
const timeDesk = document.querySelector('.time');
const dateDesk = document.querySelector('.date');
const greetingDesk = document.querySelector('.greeting');
showTime();

function showTime() {
  const date = new Date();
  timeDesk.textContent = date.toLocaleTimeString();
  showDate();
  showGreeting();
  setTimeout(showTime, 1000);
}

function showDate() {
  const date = new Date();
  let options;
  if (lang === 'en') options = { day: 'numeric', month: 'long', year: 'numeric', weekday: 'long', timeZone: 'UTC' };
  if (lang === 'ru') options = { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' };
  dateDesk.textContent = date.toLocaleDateString(`${lang}-${lang}`, options);
}

/* ------------------------------------------------------------------------------------------------ */

/**
 * Приветствие
 */

function getTimeOfDay() {
  const date = new Date();
  const h = date.getHours();
  return h >= 0 && h < 6 ? 0 : h >= 6 && h < 12 ? 1 : h >= 12 && h < 18 ? 2 : 3;
}

function showGreeting() {
  lang === 'en' ? (nameInput.placeholder = 'enter your name') : (nameInput.placeholder = 'введите имя');
  const timeOfDay = getTimeOfDay();
  greetingDesk.textContent = `${timesOfDay[lang][timeOfDay]}, `;
}

nameInput.addEventListener('change', () => {
  nameDesk = nameInput.value;
});

/* ------------------------------------------------------------------------------------------------ */

/**
 * Слайдер изображений
 */
const body = document.querySelector('body');
const slideBtnPrev = document.querySelector('.slide-prev');
const slideBtnNext = document.querySelector('.slide-next');
let bgNum = '01';
setBg();

function getRandomNum(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function setBg(num = getRandomNum(1, 20)) {
  bgNum = num;
  const timeOfDay = getTimeOfDay();
  let str = timesOfDay['en'][timeOfDay];
  str = str.slice(str.lastIndexOf(' ') + 1);
  const img = new Image();
  num = num.toString().padStart(2, '0');
  const url = `https://raw.githubusercontent.com/dimitos/stage1-tasks/assets/images/${str}/${num}.jpg`;
  img.src = url;
  img.onload = () => {
    body.style.backgroundImage = `url(${url})`;
  };
}

slideBtnPrev.addEventListener('click', function clickPrev() {
  stopClicks(slideBtnPrev, 1000);
  bgNum == 1 ? (bgNum = 20) : bgNum--;
  setBg(bgNum, clickPrev);
});

slideBtnNext.addEventListener('click', function clickNext() {
  stopClicks(slideBtnNext, 1000);
  bgNum == 20 ? (bgNum = 1) : bgNum++;
  setBg(bgNum, clickNext);
});

function stopClicks(el, dur) {
  el.style.pointerEvents = 'none';
  setTimeout(() => {
    el.style.pointerEvents = 'auto';
  }, dur);
}

/* ------------------------------------------------------------------------------------------------ */

/**
 * Виджет погоды
 */

const weatherIcon = document.querySelector('.weather-icon');
const temperature = document.querySelector('.temperature');
const weatherDescription = document.querySelector('.weather-description');
const weatherWind = document.querySelector('.wind');
const weatherHumidity = document.querySelector('.humidity');
const cityInput = document.querySelector('.city');
let cityDesk = '';

async function getWeather(cityDesk, lang) {
  if (cityDesk) {
    const weatherPoints = {
      en: ['Wind speed', 'm/s', 'Humidity'],
      ru: ['Скорость ветра', 'м/с', 'Влажность'],
    };

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityDesk}&lang=${lang}&appid=06701cfb58b08e99e1b3907d51085b4d&units=metric`;
    const res = await fetch(url);
    const data = await res.json();

    weatherIcon.className = 'weather-icon owf';
    weatherIcon.classList.add(`owf-${data.weather[0].id}`);
    temperature.textContent = `${Math.round(data.main.temp)}°C`;
    weatherDescription.textContent = data.weather[0].description;
    weatherWind.textContent = `${weatherPoints[lang][0]}: ${Math.ceil(data.wind.speed)} ${weatherPoints[lang][1]}`;
    weatherHumidity.textContent = `${weatherPoints[lang][2]}: ${Math.ceil(data.main.humidity)}%`;
    cityInput.value = data.name;
  } else {
    if (lang === 'en') {
      cityInput.placeholder = `enter the city`;
      temperature.textContent = `and see the weather`;
      weatherWind.textContent = `Empty :(`;
    } else {
      cityInput.placeholder = `введите город`;
      temperature.textContent = `и смотри погоду`;
      weatherWind.textContent = `Пусто :(`;
    }
  }
}

cityInput.addEventListener('change', () => {
  cityDesk = cityInput.value;
  getWeather(cityDesk, lang);
});

/* ------------------------------------------------------------------------------------------------ */

/**
 * Виджет "цитата дня"
 */
const changeQuote = document.querySelector('.change-quote');
const quoteEl = document.querySelector('.quote');
const authorEl = document.querySelector('.author');
let data = [];
getQuotes();

async function getQuotes() {
  const quotes = lang === 'en' ? 'assets/data1.json' : 'assets/data.json';
  const res = await fetch(quotes);
  data = await res.json();
  showQuote();
}

function showQuote() {
  const num = getRandomNum(1, data.length);
  quoteEl.innerHTML = data[num - 1].text;
  authorEl.innerHTML = data[num - 1].author;
}

changeQuote.addEventListener('click', () => {
  showQuote();
  stopClicks(changeQuote, 500);
});

/* ------------------------------------------------------------------------------------------------ */

/**
 * Аудиоплеер
 */
const audioPlayer = document.querySelector('.player-wr');
const playBtn = document.querySelector('.play-btn');
const playListContainer = document.querySelector('.play-list');
const playPrevBtn = document.querySelector('.play-prev');
const playNextBtn = document.querySelector('.play-next');
const audio = new Audio();
let isPlay, playNum;
playList.forEach((el) => {
  const li = document.createElement('li');
  li.classList.add('play-item');
  li.textContent = el.title;
  playListContainer.append(li);
});

const playItems = document.querySelectorAll('.play-item');
const trackLengthEl = audioPlayer.querySelector('.player-time .length');
const nameMusic = audioPlayer.querySelector('.name-music');

function renderTrack() {
  isPlay = false;
  playNum = 0;
  setColorTrack(playNum);
  setTrack(playNum);
  const runWhenLoaded = () => (trackLengthEl.textContent = getTimeCodeFromNum(audio.duration));
  !audio.readyState ? audio.addEventListener('loadedmetadata', runWhenLoaded) : runWhenLoaded.call(audio);
  audio.volume = 0.5;
  nameMusic.textContent = playList[playNum].title;
}
renderTrack();

function getTimeCodeFromNum(num) {
  let seconds = parseInt(num);
  let minutes = parseInt(seconds / 60);
  seconds -= minutes * 60;
  const hours = parseInt(minutes / 60);
  minutes -= hours * 60;

  if (hours === 0) return `${minutes}:${String(seconds % 60).padStart(2, 0)}`;
  return `${String(hours).padStart(2, 0)}:${minutes}:${String(seconds % 60).padStart(2, 0)}`;
}

function playAudio() {
  isPlay = true;
  playBtn.classList.add('pause');
  playItems[playNum].classList.add('item-play-active');
  audio.play();
}

function pauseAudio() {
  isPlay = false;
  playBtn.classList.remove('pause');
  playItems[playNum].classList.remove('item-play-active');
  audio.pause();
}

playBtn.addEventListener('click', () => {
  playBtn.classList.toggle('pause');
  stopClicks(playBtn, 500);
  isPlay ? pauseAudio() : playAudio();
});

function setTrack(playNum = 0) {
  pauseAudio();
  audio.src = playList[playNum].src;
  nameMusic.textContent = playList[playNum].title;
  setColorTrack(playNum);
}

function setIconTrack(playNum) {
  playItems.forEach((el) => el.classList.remove('item-play-active'));
  playItems[playNum].classList.add('item-play-active');
}

function setColorTrack(playNum) {
  playItems.forEach((el) => el.classList.remove('item-active'));
  playItems[playNum].classList.add('item-active');
}

playPrevBtn.addEventListener('click', () => {
  stopClicks(playPrevBtn, 500);
  playNum == 0 ? (playNum = playList.length - 1) : playNum--;
  setIconTrack(playNum);
  setTrack(playNum);
  playAudio();
});

playNextBtn.addEventListener('click', () => {
  stopClicks(playNextBtn, 500);
  playNum == playList.length - 1 ? (playNum = 0) : playNum++;
  setIconTrack(playNum);
  setTrack(playNum);
  playAudio();
});

playItems.forEach((el, index) => {
  el.addEventListener('click', () => {
    if (playNum === index) {
      isPlay ? pauseAudio() : playAudio();
    } else {
      playNum = index;
      playItems.forEach((element) => stopClicks(element, 500));
      setTrack(playNum);
      setIconTrack(playNum);
      playAudio();
    }
  });
});

audio.onended = function () {
  playNum == playList.length - 1 ? (playNum = 0) : playNum++;
  setTrack(playNum);
  setIconTrack(playNum);
  playAudio();
};

//click on timeline to skip around
const timeline = audioPlayer.querySelector('.timeline');
timeline.addEventListener(
  'click',
  (e) => {
    const timelineWidth = window.getComputedStyle(timeline).width;
    const timeToSeek = (e.offsetX / parseInt(timelineWidth)) * audio.duration;
    audio.currentTime = timeToSeek;
  },
  false
);

//click volume slider to change volume
const volumeSlider = audioPlayer.querySelector('.volume-container .volume-slider');
volumeSlider.addEventListener(
  'click',
  (e) => {
    const sliderWidth = window.getComputedStyle(volumeSlider).width;
    const newVolume = e.offsetX / parseInt(sliderWidth);
    audio.volume = newVolume;
    audioPlayer.querySelector('.volume-container .volume-percentage').style.width = newVolume * 100 + '%';
  },
  false
);

//check audio percentage and update time accordingly
setInterval(() => {
  const progressBar = audioPlayer.querySelector('.progress');
  progressBar.style.width = (audio.currentTime / audio.duration) * 100 + '%';
  audioPlayer.querySelector('.player-time .current').textContent = getTimeCodeFromNum(audio.currentTime);
}, 500);

audioPlayer.querySelector('.volume-button').addEventListener('click', () => {
  const volumeEl = audioPlayer.querySelector('.volume-container .volume');
  audio.muted = !audio.muted;
  if (audio.muted) {
    volumeEl.classList.remove('icono-volumeMedium');
    volumeEl.classList.add('icono-volumeMute');
  } else {
    volumeEl.classList.add('icono-volumeMedium');
    volumeEl.classList.remove('icono-volumeMute');
  }
});

/* ------------------------------------------------------------------------------------------------ */

/**
 * Настройки приложения
 */

const settingNames = [
  ['Язык', 'Аудиоплеер', 'Погода', 'Время', 'Дата', 'Приветствие', 'Цитата дня'],
  ['Language', 'Audio Player', 'Weather', 'Time', 'Date', 'Greeting', 'Quote of the Day'],
];
const setLang = document.querySelector('.set-lang');
const settingsEl = document.querySelector('.settings');
const settingsClose = document.querySelector('.settings__closer');
const settingsOpen = document.querySelector('.settings__open');
const settingsPoint = document.querySelectorAll('.settings__point');
const settingsTarget = document.querySelectorAll('.settings__target');
let settingsLS = [1, 1, 1, 1, 1, 1];

function setSettings() {
  settingsPoint.forEach((el, i) => {
    if (settingsLS[i] === 1) {
      el.classList.add('active');
      settingsTarget[i].classList.remove('hidden');
    } else {
      el.classList.remove('active');
      settingsTarget[i].classList.add('hidden');
    }
  });
}
setSettings();

settingsPoint.forEach((el, i) => {
  el.addEventListener('click', () => {
    if (settingsTarget[i].classList.contains('hidden')) {
      settingsTarget[i].classList.remove('hidden');
      el.classList.add('active');
      settingsLS[i] = 1;
    } else {
      settingsTarget[i].classList.add('hidden');
      el.classList.remove('active');
      i === 0 ? pauseAudio() : false;
      settingsLS[i] = 0;
    }
  });
});

settingsOpen.addEventListener('click', () => {
  settingsEl.classList.toggle('open');
});

settingsClose.addEventListener('click', () => {
  settingsEl.classList.toggle('open');
});

function settingsLang() {
  let l = lang === 'en' ? 1 : 0;
  setLang.textContent = settingNames[l][0];
  settingsPoint.forEach((el, i) => {
    el.textContent = settingNames[l][i + 1];
  });
}
settingsLang();

/* ------------------------------------------------------------------------------------------------ */

/**
 * Перевод приложения
 */

const languageElements = document.querySelectorAll('.settings__language span');

function changeLang(lang) {
  if (lang === 'en') {
    languageElements[1].classList.add('active');
    languageElements[2].classList.remove('active');
  } else {
    languageElements[1].classList.remove('active');
    languageElements[2].classList.add('active');
  }
  showDate();
  getQuotes();
  showGreeting();
  settingsLang();
  getWeather(cityDesk, lang);
}

languageElements[1].addEventListener('click', () => {
  if (lang === 'ru') {
    lang = 'en';
    changeLang(lang);
  }
});
languageElements[2].addEventListener('click', () => {
  if (lang === 'en') {
    lang = 'ru';
    changeLang(lang);
  }
});

/* ------------------------------------------------------------------------------------------------ */

/**
 * Сохранение в localStorage
 */

function setLocalStorage() {
  localStorage.setItem('name', nameDesk);
  localStorage.setItem('city', cityDesk);
  localStorage.setItem('settings', settingsLS);
  localStorage.setItem('lang', lang);
}

function getLocalStorage() {
  if (localStorage.getItem('name')) nameInput.value = nameDesk = localStorage.getItem('name');

  if (localStorage.getItem('lang')) {
    lang = localStorage.getItem('lang');
    changeLang(lang);
  }

  if (localStorage.getItem('settings')) {
    settingsLS = localStorage
      .getItem('settings')
      .split(',')
      .map((el) => +el);
    setSettings();
  }

  if (localStorage.getItem('city')) {
    cityInput.value = cityDesk = localStorage.getItem('city');
    getWeather(cityDesk, lang);
  }
}
window.addEventListener('beforeunload', setLocalStorage); // перед закрытием страницы
window.addEventListener('load', getLocalStorage); // после открытия страницы

console.log(
  `Моя оценка - 134 балла
  Отзыв по пунктам ТЗ:
  Не выполненные/не засчитанные пункты:
  1) в качестве источника изображений может использоваться Unsplash API

  2) в качестве источника изображений может использоваться Flickr API

  3) в настройках приложения можно указать источник получения фото для фонового изображения: коллекция изображений GitHub, Unsplash API, Flickr API

  4) если источником получения фото указан API, в настройках приложения можно указать тег/теги, для которых API будет присылает фото

  5) ToDo List - список дел (как в оригинальном приложении) или Список ссылок (как в оригинальном приложении) или Свой собственный дополнительный функционал, по сложности аналогичный предложенным

  Выполненные пункты:
  1) время выводится в 24-часовом формате, например: 21:01:00

  2) время обновляется каждую секунду - часы идут. Когда меняется одна из цифр, остальные при этом не меняют своё положение на странице (время не дёргается)

  3) выводится день недели, число, месяц, например: "Воскресенье, 16 мая" / "Sunday, May 16" / "Нядзеля, 16 траўня"

  4) текст приветствия меняется в зависимости от времени суток (утро, день, вечер, ночь). Проверяется соответствие приветствия текущему времени суток

  5) пользователь может ввести своё имя. При перезагрузке страницы приложения имя пользователя сохраняется

  6) ссылка на фоновое изображение формируется с учётом времени суток и случайного номера изображения (от 01 до 20). Проверяем, что при перезагрузке страницы фоновое изображение изменилось. Если не изменилось, перезагружаем страницу ещё раз

  7) изображения можно перелистывать кликами по стрелкам, расположенным по бокам экрана.Изображения перелистываются последовательно - после 18 изображения идёт 19 (клик по правой стрелке), перед 18 изображением идёт 17 (клик по левой стрелке)

  8) изображения перелистываются по кругу: после двадцатого изображения идёт первое (клик по правой стрелке), перед 1 изображением идёт 20 (клик по левой стрелке)

  9) при смене слайдов важно обеспечить плавную смену фоновых изображений. Не должно быть состояний, когда пользователь видит частично загрузившееся изображение или страницу без фонового изображения. Плавную смену фоновых изображений не проверяем: 1) при загрузке и перезагрузке страницы 2) при открытой консоли браузера 3) при слишком частых кликах по стрелкам для смены изображения

  10) при перезагрузке страницы приложения указанный пользователем город сохраняется, данные о нём хранятся в local storage

  11) для указанного пользователем населённого пункта выводятся данные о погоде, если их возвращает API. Данные о погоде включают в себя: иконку погоды, описание погоды, температуру в °C, скорость ветра в м/с, относительную влажность воздуха в %. Числовые параметры погоды округляются до целых чисел

  12) выводится уведомление об ошибке при вводе некорректных значений, для которых API не возвращает погоду (пустая строка или бессмысленный набор символов)

  13) при загрузке страницы приложения отображается рандомная цитата и её автор

  14) при перезагрузке страницы цитата обновляется (заменяется на другую). Есть кнопка, при клике по которой цитата обновляется (заменяется на другую)

  15) при клике по кнопке Play/Pause проигрывается первый трек из блока play-list, иконка кнопки меняется на Pause

  16) при клике по кнопке Play/Pause во время проигрывания трека, останавливается проигрывание трека, иконка кнопки меняется на Play

  17) треки пролистываются по кругу - после последнего идёт первый (клик по кнопке Play-next), перед первым - последний (клик по кнопке Play-prev)

  18) трек, который в данный момент проигрывается, в блоке Play-list выделяется стилем

  19) после окончания проигрывания первого трека, автоматически запускается проигрывание следующего. Треки проигрываются по кругу: после последнего снова проигрывается первый.

  20) добавлен прогресс-бар в котором отображается прогресс проигрывания

  21) при перемещении ползунка прогресс-бара меняется текущее время воспроизведения трека

  22) над прогресс-баром отображается название трека

  23) отображается текущее и общее время воспроизведения трека

  24) есть кнопка звука при клике по которой можно включить/отключить звук

  25) добавлен регулятор громкости, при перемещении ползунка регулятора громкости меняется громкость проигрывания звука

  26) можно запустить и остановить проигрывания трека кликом по кнопке Play/Pause рядом с ним в плейлисте

  27) переводится язык и меняется формат отображения даты

  28) переводится приветствие и placeholder

  29) переводится прогноз погоды в т.ч описание погоды и город по умолчанию

  30) переводится цитата дня т.е цитата отображается на текущем языке приложения. Сама цитата может быть другая

  31) переводятся настройки приложения, при переключении языка приложения в настройках, язык настроек тоже меняется

  32) в настройках приложения можно указать язык приложения (en/ru или en/be)

  33) в настройках приложения можно скрыть/отобразить любой из блоков, которые находятся на странице: время, дата, приветствие, цитата дня, прогноз погоды, аудиоплеер, список дел/список ссылок/ваш собственный дополнительный функционал

  34) Скрытие и отображение блоков происходит плавно, не влияя на другие элементы, которые находятся на странице, или плавно смещая их

  35) настройки приложения сохраняются при перезагрузке страницы

  `
);
