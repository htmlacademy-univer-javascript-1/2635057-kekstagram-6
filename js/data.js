import { getRandomInt, getRandomArrayElement, createRandomIdFromRangeGenerator } from './util.js';

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

const NAMES = ['Настя', 'Лера', 'Вика', 'Карина', 'Максим', 'Артём', 'Миша', 'Саша', 'Даша', 'Аркадий'];

const generateRandomUniqueId = createRandomIdFromRangeGenerator(1, 1000);
const generatePhotoId = createRandomIdFromRangeGenerator(1, 25);

function createComment() {
  return {
    id: generateRandomUniqueId(),
    avatar: `img/avatar-${getRandomInt(1, 6)}.svg`,
    message: getRandomArrayElement(MESSAGES),
    name: getRandomArrayElement(NAMES)
  };
}

function createPhoto() {
  const id = generatePhotoId();
  const commentsCount = getRandomInt(0, 30);
  const comments = Array.from({ length: commentsCount }, createComment);

  return {
    id: id,
    url: `photos/${id}.jpg`,
    description: getRandomArrayElement(DESCRIPTIONS),
    likes: getRandomInt(15, 200),
    comments: comments
  };
}

function createPhotos() {
  return Array.from({ length: 25 }, createPhoto);
}

export { DESCRIPTIONS, MESSAGES, NAMES, createPhotos };
