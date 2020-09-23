export const ANIMALS = [
  'butterfly',
  'cat',
  'chicken',
  'cow',
  'dog',
  'elephant',
  'horse',
  'sheep',
  'spider',
  'squirrel',
] as const;
export type Animal = typeof ANIMALS[number];

export type { AnimalWithBreed, Breed } from './breed';
