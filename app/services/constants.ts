export const BASE_URL = 'https://webdev-music-003b5b991590.herokuapp.com';

// Пути для API endpoints
export const API_ENDPOINTS = {
  // Аутентификация
  SIGNUP: '/user/signup/',
  LOGIN: '/user/login/',
  TOKEN: '/user/token/',
  TOKEN_REFRESH: '/user/token/refresh/',

  // Треки
  TRACKS_ALL: '/catalog/track/all/',
  TRACK_BY_ID: '/catalog/track/', // + id
  TRACK_FAVORITE_ALL: '/catalog/track/favorite/all/',
  TRACK_FAVORITE: '/catalog/track/', // + id + /favorite/

  // Подборки
  SELECTION_ALL: '/catalog/selection/all',
  SELECTION_BY_ID: '/catalog/selection/', // + id
  SELECTION_CREATE: '/catalog/selection',
};

// Время жизни токенов (в секундах)
export const TOKEN_EXPIRY = {
  ACCESS: 200, // Access токен живет 200 секунд
};

// Заголовки
export const HEADERS = {
  CONTENT_TYPE_JSON: {
    'content-type': 'application/json',
  },
};

// Коды ответов
export const STATUS_CODES = {
  SUCCESS: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};
