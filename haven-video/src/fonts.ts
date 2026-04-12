import { loadFont as loadFraunces } from '@remotion/google-fonts/Fraunces';
import { loadFont as loadInterTight } from '@remotion/google-fonts/InterTight';

const { fontFamily: serifFamily } = loadFraunces('normal', {
  weights: ['300', '400'],
  subsets: ['latin'],
});

const { fontFamily: sansFamily } = loadInterTight('normal', {
  weights: ['400', '500'],
  subsets: ['latin'],
});

export const serif = serifFamily;
export const sans = sansFamily;
