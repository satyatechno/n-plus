export interface PorElPlanetaDocumentaries {
  id: string;
  title: string;
  slug: string;
  content: {
    heroImage: {
      id: string;
      url: string;
      sizes?: {
        portrait?: {
          url: string;
        };
      };
    };
  };
  productions?: {
    specialImage?: {
      url: string;
      sizes?: {
        portrait?: {
          url: string;
        };
      };
    };
  };
}
