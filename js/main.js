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
var names = ['Иван', 'Хуан Себастьян', 'Мария', 'Кристоф', 'Виктор', 'Юлия', 'Люпита', 'Вашингтон',
  'да Марья', 'Верон', 'Мирабелла', 'Вальц', 'Онопко', 'Топольницкая', 'Нионго', 'Ирвинг'
];

// Количество случайных данных для моки
var photoCount = 25;
// Минимальное кол-во лайков
var minLikesCount = 15;
// Максимальное кол-во лайков
var maxLikesCount = 200;
// Максимальное кол-во комментариев
var maxCommentsCount = 7;
// Кол-во доступных аватарок
var commentatorsAvatarCount = 6;
// Массив индексов для заполнения случайными данными
var indexes = [];

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
 * @return {string}
 */
function getCommentMessage() {
  // Минимальное кол-во сообщений
  var minMessageCount = 1;
  // Максимальное кол-во сообщений
  var maxMessageCount = 2;
  // Число сообщениий
  var messageCount = minMessageCount + Math.floor(Math.random() * maxMessageCount);
  // Возвращаемое сообщение
  var message = '';

  for (var k = 1; k <= messageCount; k++) {
    if (k > 1) {
      message += ' ';
    }
    message += getRandomArraysElement(commentMessages, false);
  }

  return message;
}

/**
 * Возвращает массив объектов комментариев
 * @return {Array}
 */
function getComments() {
  var comments = [];
  var commentsCount = Math.floor(Math.random() * maxCommentsCount);
  for (var j = 0; j < commentsCount; j++) {
    var comment = {};
    // Аватарка автора комментрия
    comment.avatar = 'img/avatar-' + Math.floor(Math.random() * commentatorsAvatarCount + 1) + '.svg';
    // Сообщение коментатора
    comment.message = getCommentMessage();
    // Имя комментатора
    comment.name = getRandomArraysElement(names, false);
    comments.push(comment);
  }

  return comments;
}

/**
 * Возвращает объект описания фотографии
 * @return {{comments: Array, description: string, url: string, likes: number}}
 */
function getRandomPhotoDescription() {
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
 *
 * @param {number} count количество фотографий для показа
 * @return {Array}
 */
function getPhotoDescriptions(count) {
  var photoDescriptions = [];
  for (var n = 0; n < count; n++) {
    photoDescriptions.push(getRandomPhotoDescription());
  }

  return photoDescriptions;
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
 */
function renderPictures() {
  // Заполнение массива индексов
  for (var i = 1; i <= photoCount; i++) {
    indexes.push(i);
  }

  // массив объектов фотографий
  var photoDescriptions = getPhotoDescriptions(photoCount);
  // Фрагмент для вставки
  var fragment = document.createDocumentFragment();
  for (var p = 0; p < photoDescriptions.length; p++) {
    fragment.appendChild(renderPicture(photoDescriptions[p]));
  }

  // Элемент в который будем вставлять фотографии
  var similarListElement = document.querySelector('.pictures');
  similarListElement.appendChild(fragment);
}

renderPictures();
