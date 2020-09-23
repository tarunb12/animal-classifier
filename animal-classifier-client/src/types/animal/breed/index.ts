import { DogBreed } from "./dog";
import { CatBreed } from "./cat";

type Breed =
  | DogBreed
  | CatBreed
  ;

export const ANIMALS_WITH_BREED = [
  'dog',
  'cat',
] as const;
export type AnimalWithBreed = typeof ANIMALS_WITH_BREED[number];

export type { Breed };
export { CATS } from './cat';
export { DOGS } from './dog';