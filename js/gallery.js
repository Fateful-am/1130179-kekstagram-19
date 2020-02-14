'use strict';

/**
 * Модуль, который работает с галереей изображений
 */
(function () {

  // Интерфейс модуля
  window.gallery = {
    renderPictures: renderPictures // Отрисовка всех фотографий
  };

  /**
   * Отрисовка всех фотографий
   * @param {Array} photoDescriptionsArray массив объектов с описанием фотографий
   */
  function renderPictures(photoDescriptionsArray) {
    // Фрагмент для вставки
    var fragment = document.createDocumentFragment();
    for (var p = 0; p < photoDescriptionsArray.length; p++) {
      fragment.appendChild(window.picture.renderPicture(photoDescriptionsArray[p]));
    }

    // Вставляем фотографии
    document.querySelector('.pictures').appendChild(fragment);
  }

})();
