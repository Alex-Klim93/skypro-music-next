import { TrackType } from '../sharedTypes/sharedTypes';

export function getUniqueValuesByKey(
  arr: TrackType[],
  key: keyof TrackType,
): string[] {
  // Используем Set для хранения уникальных значений
  const uniqueValues = new Set<string>();

  //Проходим по каждому обьекту в массиве
  arr.forEach((item) => {
    const value = item[key];

    // Если значение - массив строк
    if (Array.isArray(value)) {
      value.forEach((v) => {
        if (v) {
          uniqueValues.add(v);
        }
      });
    }
    // Если значение - строка
    else if (typeof value === 'string') {
      uniqueValues.add(value);
    }
  });

  //Преобразуем Set обраатно в массив и возвращаем
  return Array.from(uniqueValues);
}

export function formatTime(time: number) {
  const minutes = Math.floor(time / 60);
  const inputSeconds = Math.floor(time % 60);
  const outputSeconds = inputSeconds < 10 ? `0${inputSeconds}` : inputSeconds;

  return `${minutes}:${outputSeconds}`;
}
