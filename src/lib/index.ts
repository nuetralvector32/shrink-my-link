// place files you want to import through the `$lib` alias in this folder.
export interface LinkMetadata {
    longUrl: string;
    clickCount: number;
    clicks: number[];
    createdAt: number;
  }
  
  export interface LinkStats {
    slug: string;
    metadata: LinkMetadata;
  }