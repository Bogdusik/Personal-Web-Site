#!/bin/bash

# Функция для очистки при выходе
cleanup() {
    echo "🛑 Останавливаем сервер разработки..."
    pkill -f "react-scripts start" 2>/dev/null
    echo "✅ Порт 3000 освобожден!"
    exit 0
}

# Устанавливаем обработчик сигналов
trap cleanup SIGINT SIGTERM EXIT

echo "🚀 Запускаем сервер разработки..."
echo "💡 Для остановки нажмите Ctrl+C"

# Запускаем React приложение
npm start

# Если npm start завершился, выполняем очистку
cleanup
