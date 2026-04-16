export interface ChannelItem {
  channelName: string;
  channelKey: string;
  channelId: string;
  channelLogo: React.FC<{ color?: string; width?: number; height?: number }>;
  assetKey: string;
  uniqueChannelId: string;
  params: string;
  blocked?: boolean;
  atom?: string;
}

export interface ProgramacionItem {
  airtime: string;
  duration: string;
  title: string;
  description: string;
}
