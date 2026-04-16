export interface ProductionPagePost {
  id: string;
  title: string;
  slug: string;
  fullPath: string;
  publishedAt: string;
  readTime: number;
  heroImage: [
    {
      sizes: {
        landscape: {
          url: string;
        };
      };
    }
  ];
  category: {
    id: string;
    title: string;
    fullPath: string;
    slug: string;
  } | null;
  topics: {
    id: string;
    title: string;
    fullPath: string;
    slug: string;
  }[];
  isBookmarked: boolean;
}
