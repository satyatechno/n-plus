import { isIos } from '@src/utils/platformCheck';

interface Fonts {
  franklinGothicURW: string;
  superclarendon: string;
  mongoose: string;
  notoSerif: string;
  notoSerifExtraCondensed: string;
}

export const fonts: Fonts = {
  franklinGothicURW: 'FranklinGothicURW',
  superclarendon: 'Superclarendon',
  mongoose: 'Mongoose',
  notoSerif: 'NotoSerif',
  notoSerifExtraCondensed: isIos ? 'NotoSerifExtraCondensed' : 'NotoSerif_ExtraCondensed'
};
