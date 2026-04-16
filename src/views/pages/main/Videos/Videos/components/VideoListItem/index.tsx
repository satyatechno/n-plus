import React from 'react';

import VideoCarouselCard from '@src/views/molecules/VideoCarouselCard';
import { VideoListItemProps } from '@src/models/main/Videos/Videos';

const VideoListItem: React.FC<VideoListItemProps> = ({
  item,
  onPress,
  onMenuPress,
  titleColor,
  menuIconColor,
  categoryColor,
  category,
  iconColor
}) => (
  <VideoCarouselCard
    item={{
      imageUrl: item.heroImages?.[0]?.url ?? undefined,
      category: category ?? item.category?.title ?? item.topics?.[0]?.title ?? '',
      title: item.title,
      progress: item.percentageWatched ? item.percentageWatched / 100 : 0
    }}
    onPress={() => onPress(item)}
    onMenuPress={() => onMenuPress(item?.id)}
    titleColor={titleColor}
    menuIconColor={menuIconColor}
    categoryColor={categoryColor}
    iconColor={iconColor}
  />
);

export default React.memo(VideoListItem);
