import { Animal } from '../types/animal';
import { CATS, DOGS } from '../types/animal/breed';

export const ANIMAL_TYPE_MAP: { [key in 'dog' | 'cat']: typeof CATS | typeof DOGS; } = {
  cat: CATS,
  dog: DOGS,
};

export const ANIMAL_TO_EMOJI: { [key in Animal]: string; } = {
  dog: '🐕',
  cat: '🐈',
  butterfly: '🦋',
  chicken: '🐔',
  cow: '🐄',
  elephant: '🐘',
  horse: '🐎',
  sheep: '🐑',
  spider: '🕷️',
  squirrel: '🐿️',
}

export { ANIMALS } from '../types/animal';
export { ANIMALS_WITH_BREED, CATS, DOGS } from '../types/animal/breed';
export { INFO, REPO } from './descriptions';
