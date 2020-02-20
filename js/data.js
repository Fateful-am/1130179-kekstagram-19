'use strict';

/**
 * Модуль, который создаёт данные
 */
(function () {
  // секция с фильтрами
  var filterSection = document.querySelector('.img-filters');
  // элемент случайный фильтр
  var randomFilter = filterSection.querySelector('#filter-random');
  // элемент обсуждаемый фильтр
  var discussedFilter = filterSection.querySelector('#filter-discussed');
  // элемент фильтр по умолчанию
  var defaultFilter = filterSection.querySelector('#filter-default');
  // последний из запущенных таймеров
  var lastTimeout;

  // Массив доступных фильтров
  var filters = [
    defaultFilter,
    randomFilter,
    discussedFilter
  ];

  // объект с обработчиками клика по фильтрам
  var filterClick = {
    'filter-default': showDefaultPictures,
    'filter-random': showRandomPictures,
    'filter-discussed': showDiscussedPictures
  };

  // Данные фотографий загруженные с сервера
  var picturesFromServer;

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
    var message = [];

    for (var k = 1; k <= messageCount; k++) {
      message.push(window.utils.getRandomArraysElement(window.settings.commentMessages, false));
    }

    return message.join(' ');
  }

  /**
   * Возвращает массив объектов комментариев
   * @return {Array}
   */
  function getComments() {
    var comments = [];
    var commentsCount = Math.floor(Math.random() * window.settings.MAX_COMMENTS_COUNT);
    for (var j = 0; j < commentsCount; j++) {
      var comment = {};
      // Аватарка автора комментрия
      comment.avatar = 'img/avatar-' + Math.floor(Math.random() * window.settings.COMMENTATORS_AVATAR_COUNT + 1) + '.svg';
      // Сообщение коментатора
      comment.message = getCommentMessage(1, 2);
      // Имя комментатора
      comment.name = window.utils.getRandomArraysElement(window.settings.commentsNames, false);
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
      url: 'photos/' + window.utils.getRandomArraysElement(indexes, true) + '.jpg',
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
      returnArray.push(getRandomPhotoDescription(indexes, window.settings.MIN_LIKES_COUNT, window.settings.MAX_LIKES_COUNT));
    }

    return returnArray;
  }

  /**
   * Обработка сообщения об ошибке при общении с сервером  ---> Временная заглушка
   * @param {string} errorMessage сообщение об ошибке
   */
  function onErrorHandler(errorMessage) {
    var node = document.createElement('div');
    node.style = 'z-index: 100; margin: 0 auto; text-align: center; background-color: red;';
    node.style.position = 'absolute';
    node.style.left = 0;
    node.style.right = 0;
    node.style.fontSize = '30px';
    node.className = 'xhr-error-message';

    node.textContent = errorMessage;
    document.body.insertAdjacentElement('afterbegin', node);
  }

  /**
   * Переключаем текущий фильтр
   * @param {Element} activeFilter текущий фильтр
   */
  function toggleFilter(activeFilter) {
    // перебираем все фильтры
    filters.forEach(function (filter) {
      if (filter === activeFilter) {
        filter.classList.add('img-filters__button--active');
        filter.removeEventListener('click', onFilterClick);
        filter.style.cursor = 'default';
      } else {
        filter.classList.remove('img-filters__button--active');
        filter.addEventListener('click', onFilterClick);
        filter.style.cursor = 'pointer';
      }
    });
  }

  /**
   * Обработка клика по фильтру
   * @param {Event} evt
   */
  function onFilterClick(evt) {
    // переключаем фильтр
    toggleFilter(evt.target);
    // сбрасываем таймер при необходимости
    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }

    // выставляем новый таймер
    lastTimeout = window.setTimeout(function () {
      // фильтруем фотографии
      filterClick[evt.target.id]();
    }, window.settings.DEBOUNCE_INTERVAL);
  }

  /**
   * Загрузка случайных фотографий
   */
  function showRandomPictures() {
    // копируем оригинал
    var copiedPictures = picturesFromServer.slice();
    // массив с случайными фотограциями
    var randomPictures = [];

    // отбираем случайные фотографии
    for (var i = 0; i < window.settings.RANDOM_FILTER_COUNT; i++) {
      randomPictures.push(window.utils.getRandomArraysElement(copiedPictures, true));
    }

    window.gallery.renderPictures(randomPictures);
  }

  /**
   * Загрузка обсуждаемых фотографий
   */
  function showDiscussedPictures() {
    // копируем оригинал
    var copiedPictures = picturesFromServer.slice();
    // сортируем по количеству комментариев
    copiedPictures.sort(function (left, right) {
      if (right.comments.length > left.comments.length) {
        return 1;
      } else if (right.comments.length < left.comments.length) {
        return -1;
      } else {
        return 0;
      }
    });

    window.gallery.renderPictures(copiedPictures);
  }

  /**
   * Загрузка всех фотографий с сервера
   */
  function showDefaultPictures() {
    // отрисовываем фотографии с сервера
    window.gallery.renderPictures(picturesFromServer);
  }

  /**
   * Обработка успешного события загрузки данных с сервера
   * @param {Array} picturesData Массив магов с сервера
   */
  function onSuccessLoadData(picturesData) {
    // нативные данные с сервера
    picturesFromServer = picturesData;

    // показываем фильтры
    filterSection.classList.remove('img-filters--inactive');
    // навешиваем обработчики клика, нажатия по фильтрам
    toggleFilter(defaultFilter);

    // Отрисовка всех фотографий с сервера
    showDefaultPictures();
  }

  /**
   * Обработка ошибочного события загрузки данных с сервера
   * @param {String} errorMessage Сообщение об ошибке при загрузке данных с сервера
   */
  function onErrorLoadData(errorMessage) {
    onErrorHandler(errorMessage);

    return;
  }


  if (window.settings.IS_USE_ONLINE_DATA) {
    // Загрузка данных с сервера
    window.backend.load(window.settings.DATA_URL, onSuccessLoadData, onErrorLoadData);

    return;
  }

  // Загрузка случайных фотографий
  window.gallery.renderPictures(getPhotoDescriptions(window.settings.PHOTO_COUNT));
})();
