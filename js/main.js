function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomArrayElement(elements) {
  return elements[getRandomInt(0, elements.length - 1)];
}

const DESCRIPTIONS = [
  'это был большой путь!',
  'дома!',
  'я в nyc baby',
  'играю в гольф',
  '#программист #iqSwag',
  'улетел в тай',
  'my kitty gang: sara, lea, timosha',
];

const MESSAGES = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота.',
  'Лица у людей на фотке перекошены, как будто их избивают.',
];

const NAMES = ['Настя', 'Лера', 'Вика', 'Карина', 'Максим', 'Артём', 'Саша', 'Даша', 'Аркадий'];

function createComment(id) {
  const messageCount = getRandomInt(1, 2); 
  const message = Array.from({ length: messageCount }, () => getRandomArrayElement(MESSAGES)).join(' ');

  return {
    id,
    avatar: `img/avatar-${getRandomInt(1, 6)}.svg`,
    message,
    name: getRandomArrayElement(NAMES),
  };
}

function createPhoto(id) {
  const commentsCount = getRandomInt(0, 30);
  const comments = Array.from({ length: commentsCount }, (_, index) => createComment(id * 100 + index));

  return {
    id,
    url: `photos/${id}.jpg`,
    description: getRandomArrayElement(DESCRIPTIONS),
    likes: getRandomInt(15, 200),
    comments,
  };
}

function createPhotos() {
  return Array.from({ length: 25 }, (_, index) => createPhoto(index + 1));
}

import { renderPictures } from './picture-render.js';

const photos = createPhotos();
renderPictures(photos);