# language: ru

Функционал: Управление файлами

  Сценарий: Запись файла
    Допустим есть файл "./test.txt"
    Если мы его запишем его через метод "write" в хранилище "Test", имя файла "test.txt"
    То в Grid появляется файл "Test-test.txt"

  Сценарий: Чтение файла
    Допустим в Grid есть файл "Test-test.txt"
    Если мы прочитаем файл "test.txt" из хранилища "Test" через метод "read"
    То нам вернется поток и из него мы прочитаем "There is no spoon"

  Сценарий: Удаление файла
    Допустим в Grid есть файл "Test-test.txt"
    Если мы удалим файл "test.txt" из хранилища "Test" через метод "remove"
    То "Test-test.txt" удалится из Grid, и мы не сможем его прочитать
