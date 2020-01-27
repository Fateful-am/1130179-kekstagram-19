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

// массив объектов фотографий
var photoDescriptions = getPhotoDescriptions(PHOTO_COUNT);
// Отрисовка массива описаний фотографий
renderPictures(photoDescriptions);
