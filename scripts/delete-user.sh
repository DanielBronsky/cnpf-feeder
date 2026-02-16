#!/bin/bash
# Скрипт для удаления пользователя из MongoDB по email
# Использование: ./scripts/delete-user.sh <email>
# 
# Пример:
#   ./scripts/delete-user.sh danielbronsky4@gmail.com

if [ -z "$1" ]; then
  echo "Использование: $0 <email>"
  echo "Пример: $0 danielbronsky4@gmail.com"
  exit 1
fi

EMAIL="$1"

# Проверяем, запущен ли MongoDB в Docker
if ! docker compose ps mongo 2>/dev/null | grep -q "Up"; then
  echo "Ошибка: MongoDB контейнер не запущен"
  echo "Запустите: docker compose up -d mongo"
  exit 1
fi

# Удаляем пользователя
echo "Поиск пользователя с email: $EMAIL"
docker compose exec -T mongo mongosh cnpf_feeder --quiet --eval "
const user = db.users.findOne({ email: '$EMAIL' }, { email: 1, username: 1, _id: 1 });
if (user) {
  print('Найден пользователь:');
  print(JSON.stringify(user, null, 2));
  const result = db.users.deleteOne({ email: '$EMAIL' });
  print('Результат удаления:');
  print(JSON.stringify(result, null, 2));
} else {
  print('Пользователь с email \"$EMAIL\" не найден');
}
"
