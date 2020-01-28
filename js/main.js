'use strict';

// Тексты сообщений комментариев
var commentMessages = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];
// Имена коментаторов
var names = ['Иван',
  'Хуан Себастьян',
  'Мария',
  'Кристоф',
  'Виктор',
  'Юлия',
  'Люпита',
  'Вашингтон',
  'да Марья',
  'Верон',
  'Мирабелла',
  'Вальц',
  'Онопко',
  'Топольницкая',
  'Нионго',
  'Ирвинг'
];

// Количество случайных данных для моки
var PHOTO_COUNT = 25;
// Минимальное кол-во лайков
var MIN_LIKES_COUNT = 15;
// Максимальное кол-во лайков
var MAX_LIKES_COUNT = 200;
// Максимальное кол-во комментариев
var MAX_COMMENTS_COUNT = 7;
// Кол-во доступных аватарок
var COMMENTATORS_AVATAR_COUNT = 6;

/**
 * Включение и выключение видимости элемента
 * @param {Element} element элемент для которого переключается видимость
 * @param {boolean} isVisible Признак видимости элемента
 */
function visibleToggle(element, isVisible) {
  if (isVisible) {
    element.classList.remove('hidden');
  } else {
    element.classList.add('hidden');
  }
}

/**
 * Возвращает случайный элемент массива
 * @param {Array} array Входной массив
 * @param {boolean} doRemove Удалить или нет элемент массива
 * @return {*} случайный элемент массива
 */
function getRandomArraysElement(array, doRemove) {
  var index = Math.floor(Math.random() * array.length);
  var returnElement = array[index];
  if (doRemove) {
    array.splice(index, 1);
  }

  return returnElement;
}

/**
 * Возвращает случайное сообщение
 * @param {number} minMessageCount Минимальное кол-во сообщений (по умолчанию - 1)
 * @param {number} maxMessageCount Максимальное кол-во сообщений (по умолчанию - 2)
 * @return {string}
 */
function getCommentMessage(minMessageCount, maxMessageCount) {
  minMessageCount = minMessageCount || 1;
  maxMessageCount = maxMessageCount || 2;
  // Число сообщениий
  var messageCount = minMessageCount + Math.floor(Math.random() * maxMessageCount);
  // Возвращаемое сообщение
  var message = '';

  for (var k = 1; k <= messageCount; k++) {
    message += getRandomArraysElement(commentMessages, false) + ' ';
  }

  return message.trim();
}

/**
 * Возвращает массив объектов комментариев
 * @return {Array}
 */
function getComments() {
  var comments = [];
  var commentsCount = Math.floor(Math.random() * MAX_COMMENTS_COUNT);
  for (var j = 0; j < commentsCount; j++) {
    var comment = {};
    // Аватарка автора комментрия
    comment.avatar = 'img/avatar-' + Math.floor(Math.random() * COMMENTATORS_AVATAR_COUNT + 1) + '.svg';
    // Сообщение коментатора
    comment.message = getCommentMessage(1, 2);
    // Имя комментатора
    comment.name = getRandomArraysElement(names, false);
    comments.push(comment);
  }

  return comments;
}

/**
 * Возвращает объект описания фотографии
 * @param {Array} indexes Массив с индексами фотографий
 * @param {Number} minLikesCount Минимальное кол-во лайков
 * @param {Number} maxLikesCount Максимальное кол-во лайков
 * @return {{comments: Array, description: string, url: string, likes: number}}
 */
function getRandomPhotoDescription(indexes, minLikesCount, maxLikesCount) {
  return {
    // путь к фотографии
    url: 'photos/' + getRandomArraysElement(indexes, true) + '.jpg',
    // Описание фотографии
    description: 'Здесь должно быть описание фотографии',
    // Кол-во лайков
    likes: minLikesCount + Math.floor(Math.random() * (maxLikesCount - minLikesCount)),
    // Массив объектов комментариев
    comments: getComments()
  };
}

/**
 * Возвращает массив объектов с описаниями фотографий
 * @param {number} photoCount кол-во фотографий
 * @return {Array}
 */
function getPhotoDescriptions(photoCount) {
  // Массив индексов для заполнения случайными данными
  var indexes = [];
  // Заполнение массива индексов
  for (var i = 1; i <= photoCount; i++) {
    indexes.push(i);
  }
  // Возвращаемый массив описаний фотографий
  var returnArray = [];
  for (var n = 0; n < photoCount; n++) {
    returnArray.push(getRandomPhotoDescription(indexes, MIN_LIKES_COUNT, MAX_LIKES_COUNT));
  }

  return returnArray;
}

/**
 * Возвращает отрисованный узел с фотографиями согласно шаблона
 * @param {Object} picture Объект Описание к фотографии
 * @return {Node}
 */
function renderPicture(picture) {
  // Шаблон для фотографии
  var pictureTemplate = document.querySelector('#picture ')
    .content
    .querySelector('.picture');
  var pictureElement = pictureTemplate.cloneNode(true);
  pictureElement.querySelector('.picture__img').src = picture.url;
  pictureElement.querySelector('.picture__likes').textContent = picture.likes;
  pictureElement.querySelector('.picture__comments').textContent = picture.comments.length.toString();

  return pictureElement;
}

/**
 * Отрисовка всех фотографий
 * @param {Array} photoDescriptions массив объектов сописанием фотографий
 */
function renderPictures(photoDescriptions) {

  // массив объектов фотографий
  // Фрагмент для вставки
  var fragment = document.createDocumentFragment();
  for (var p = 0; p < photoDescriptions.length; p++) {
    fragment.appendChild(renderPicture(photoDescriptions[p]));
  }

  // Элемент в который будем вставлять фотографии
  var similarListElement = document.querySelector('.pictures');
  similarListElement.appendChild(fragment);
}

/**
 * Возвращает отрисованный комментарий
 * @param {Element} list Список-контейнер для комментариев
 * @param {Object} comment Объект с данными о коментарии
 * @return {HTMLLIElement} член списка с комментарием
 */
function renderComment(list, comment) {
  // член списка с комментарием
  var socialComment = document.createElement('li');
  socialComment.classList.add('social__comment');
  // Аватар коментатора
  var socialPicture = document.createElement('img');
  socialPicture.classList.add('social__picture');
  socialPicture.src = comment.avatar;
  socialPicture.alt = comment.name;
  socialPicture.width = 35;
  socialPicture.height = 35;
  socialComment.appendChild(socialPicture);
  // Текст комментария
  var socialText = document.createElement('p');
  socialText.classList.add('social__text');
  socialText.textContent = comment.message;
  socialComment.appendChild(socialText);
  return socialComment;
}

/**
 * Показывает полноэкранную фотографию на основе объекта Описание фотографии
 * @param {Object} photoDescription Объект с данными о фотографии
 * @param {Element} bigPictureElement Элемент-контейнер для показа большой фотографии
 */
function showBigPicture(photoDescription, bigPictureElement) {
  // Показываем контейнер для полноэкранной фотографии
  visibleToggle(bigPictureElement, true);
  // Выключаем видимость счетчика коментариев
  visibleToggle(document.querySelector('.social__comment-count'), false);
  // Выключаем видимость кнопки загрузки новых комментариев
  visibleToggle(document.querySelector('.comments-loader'), false);
  // Убираем прокрутку контейнера фотографий позади при скролле
  document.body.classList.add('modal-open');

  // Заменяем информацию для выбранной фотографии
  // url фотографии
  bigPictureElement.querySelector('img').src = photoDescription.url;
  // Кол-во лайков
  bigPictureElement.querySelector('.likes-count').textContent = photoDescription.likes;
  // Кол-во комментариев
  bigPictureElement.querySelector('.comments-count').textContent = photoDescription.comments.length.toString();
  // Описание фоторафии
  bigPictureElement.querySelector('.social__caption').textContent = photoDescription.description;

  // Список с коментариями
  var socialComments = bigPictureElement.querySelector('.social__comments');
  if (socialComments) {
    // Очистка предыдущих комментариев
    while (socialComments.firstChild) {
      socialComments.removeChild(socialComments.firstChild);
    }

    // Фрагмент для вставки
    var fragment = document.createDocumentFragment();
    // Генерация комментариев
    for (var li = 0; li < photoDescription.comments.length; li++) {
      fragment.appendChild(renderComment(socialComments, photoDescription.comments[li]));
    }

    socialComments.appendChild(fragment);
  }
}

// массив объектов фотографий
var photoDescriptions = getPhotoDescriptions(PHOTO_COUNT);
// Отрисовка массива описаний фотографий
renderPictures(photoDescriptions);

// Контейнер для отрисовки полноэкранной фотографии и инфомации о ней
var bigPicture = document.querySelector('.big-picture');

// Показ большой фотографии (по заданию 0 индекс)
if (bigPicture && photoDescriptions.length > 0) {
  showBigPicture(photoDescriptions[0], bigPicture);
}
