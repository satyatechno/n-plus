export interface InteractiveVideo {
  id: string;
  title: string;
  fullPath: string;
  hero?: {
    media?: {
      sizes?: {
        landscape?: {
          url: string;
        };
      };
    };
  };
}

export interface InteractiveListingResponse {
  Pages: {
    docs: InteractiveVideo[];
    hasNextPage?: boolean;
    nextCursor?: string | null;
  };
}

export interface FormattedInteractiveVideo {
  id: string;
  title: string;
  url: string;
  width: number;
  height: number;
  externalURL: string;
}
