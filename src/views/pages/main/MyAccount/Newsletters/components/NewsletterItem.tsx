import React from 'react';
import { View, Pressable } from 'react-native';

import { actuatedNormalize, actuatedNormalizeVertical } from '@src/utils/pixelScaling';
import { fonts } from '@src/config/fonts';
import { CheckboxIcon, UncheckedBoxIcon } from '@src/assets/icons';
import { fontSize } from '@src/config/styleConsts';
import CustomText from '@src/views/atoms/CustomText';
import { themeStyles } from '@src/views/pages//main/MyAccount/Newsletters/styles';
import useNewslettersViewModel from '@src/viewModels/main/MyAccount/Newsletters/useNewslettersViewModel';
import CustomImage from '@src/views/atoms/CustomImage';
import { FallbackImage } from '@src/assets/images';

type Newsletter = {
  _id: string;
  name: string;
  desc: string;
  interval: string;
  thumbnail: string;
  isSubscribed: boolean;
};

type NewsletterSubscription = {
  newsletter: string;
  isSubscribed: boolean;
};

type NewsletterItemProps = {
  item: { item: Newsletter };
  newsletterSubscribed: NewsletterSubscription[];
  userNewslettersData: Newsletter[];
  mySubscriptions: boolean;
  onCheckBoxPress: (id: string) => void;
  onUnCheckBoxPress: (id: string) => void;
};

const NewsletterItem: React.FC<NewsletterItemProps> = ({
  item,
  newsletterSubscribed,
  mySubscriptions,
  onCheckBoxPress,
  onUnCheckBoxPress
}) => {
  const { theme } = useNewslettersViewModel();
  const styles = themeStyles(theme);

  const newsletter = item?.item;

  const isChecked = newsletterSubscribed.some((i) => i.newsletter === newsletter?._id);
  const alreadySubscribed = newsletter?.isSubscribed === true;
  const shouldBeChecked = isChecked || (!mySubscriptions && alreadySubscribed);

  return (
    <Pressable
      style={[
        styles.newsletterItemContainer,
        !mySubscriptions && { opacity: alreadySubscribed ? 0.5 : 1 }
      ]}
      onPress={() =>
        isChecked ? onCheckBoxPress(newsletter._id) : onUnCheckBoxPress(newsletter._id)
      }
      disabled={!mySubscriptions && alreadySubscribed}
    >
      <View style={styles.checkBox}>
        {shouldBeChecked ? (
          <CheckboxIcon
            height={actuatedNormalizeVertical(18)}
            width={actuatedNormalize(18)}
            stroke={theme.iconIconographyDisabledState2}
            fill={theme.iconIconographyDisabledState2}
            checkStroke={theme.mainBackgroundSecondary}
          />
        ) : (
          <UncheckedBoxIcon
            height={actuatedNormalizeVertical(18)}
            width={actuatedNormalize(18)}
            stroke={theme.iconIconographyDisabledState2}
          />
        )}
      </View>

      <View style={styles.descContainer}>
        <CustomText
          size={fontSize['xxs']}
          color={theme.sectionTextTitleSpecial}
          weight={'R'}
          fontFamily={fonts.superclarendon}
          textStyles={styles.nameTextStyle}
        >
          {newsletter.name}
        </CustomText>

        <CustomText
          size={fontSize['xs']}
          color={theme.newsTextPictureCarouselTitle}
          weight={'R'}
          fontFamily={fonts.notoSerif}
          textStyles={styles.desc}
        >
          {newsletter.desc}
        </CustomText>

        <CustomText
          size={fontSize['xxs']}
          color={theme.labelsTextLabelPlace}
          weight={'Med'}
          fontFamily={fonts.franklinGothicURW}
          textStyles={styles.nameTextStyle}
        >
          {newsletter.interval}
        </CustomText>
      </View>

      <CustomImage
        source={{ uri: newsletter.thumbnail }}
        style={styles.thumbnailImage}
        fallbackComponent={
          <View style={styles.thumbnailImage}>
            <FallbackImage width="100%" height="100%" preserveAspectRatio="xMidYMid slice" />
          </View>
        }
      />
    </Pressable>
  );
};

export default NewsletterItem;
