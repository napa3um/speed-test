# speed-test

CLI-утилита для тестирования скорости загрузки файлов через потоковый (чанковый) fetch.

[English version](./README_EN.md)

## Использование

```bash
# Запуск через npx (без установки)
npx napa3um/speed-test <url> [-n <count>]

# Или глобальная установка
npm install napa3um/speed-test -g
speed-test <url> [-n <count>]

# Или локальная установка
npm install napa3um/speed-test
npm exec speed-test <url> [-n <count>]
```
### Аргументы

| Аргумент | Описание | Обязательный |
|----------|----------|--------------|
| `<url>` | URL файла для загрузки | Да |
| `-n, --count <число>` | Количество последовательных запросов (по умолчанию: 10) | Нет |
| `-h, --help` | Показать справку | Нет |

## Примеры

```bash
# 10 запросов (по умолчанию)
npx napa3um/speed-test https://samplelib.com/png/sample-photo-3840x2160.png

# 5 запросов
npx napa3um/speed-test https://samplelib.com/png/sample-photo-3840x2160.png -n 5

# 20 запросов
npx napa3um/speed-test https://samplelib.com/png/sample-photo-3840x2160.png -count 20
```

## Вывод

```
──────────────────────────────────────────────────
#1:     16,8 MB / 01.234s
#2:     16,8 MB / 01.314s
#3:     16,8 MB / 01.386s
...
#10:    16,8 MB / 00.972s
──────────────────────────────────────────────────
Average: 13,3 MB/s
Done: 10 / 10 successful downloads
```

- **`16,8 MB`** — размер скачанного файла (B, kB, MB, GB) с точностью до 0.1
- **`01.386s`** — прошедшее время (дни, часы, минуты, секунды с миллисекундами)
- **`Average: 13,3 MB/s`** — средняя скорость по всем загрузкам (округлённая единица в секунду)
- **`Done: 10 / 10 successful downloads`** — итог теста

## Требования

- Node.js 18+ (для встроенного `fetch`)
