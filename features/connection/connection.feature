# language: ru

Функционал: Управление соединением

  Сценарий: создание подключения с именем хранилища
    Допустим в конструктор передали объект соединения и заголовок "Images" вторым параметром
    Тогда соединение сохранится в поле "connection"
    И заголовок попадет в поле "options.title" и оно будет равно "Images"
