# language: ru

Функционал: Управление файлами

  Сценарий: Запись файла
    Допустим есть файл "./test.txt"
    Если мы его запишем его через метод "write"
    То в Grid появляется файл "test.txt"

  Сценарий: Чтение файла
    Допустим в Grid есть файл "test.txt"
    Если мы прочитаем его через метод "read"
    То нам вернется поток и из него мы прочитаем "There is no spoon"

  Сценарий: Удаление файла
    Допустим в Grid есть файл "test.txt"
    Если мы удалим его через метод "remove"
    То файл удалиться, и мы не сможем его прочитать
