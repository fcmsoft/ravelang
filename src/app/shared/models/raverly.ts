// Ravelry API Response Types

export interface RavelryUser {
  id: number;
  username: string;
  first_name?: string;
  last_name?: string;
  tiny_photo_url?: string;
  small_photo_url?: string;
  large_photo_url?: string;
  photo_url?: string;
}

export interface RavelryPatternAuthor {
  id: number;
  name: string;
  permalink: string;
  crochet_pattern_count?: number;
  knitting_pattern_count?: number;
  patterns_count?: number;
  favorites_count?: number;
  notes?: string | null;
  notes_html?: string | null;
  users?: RavelryUser[];
}

export interface RavelryPhoto {
  id: number;
  sort_order: number;
  x_offset: number;
  y_offset: number;
  thumbnail_url: string;
  small_url: string;
  medium_url: string;
  medium2_url: string;
  square_url: string;
  shelved_url?: string;
}

export interface RavelryPattern {
  id: number;
  name: string;
  permalink: string;
  created_at: string;
  updated_at: string;
  published?: string;
  designer: {
    id: number;
    name: string;
    permalink: string;
  };
  pattern_author: RavelryPatternAuthor;
  photos: RavelryPhoto[];
  first_photo?: RavelryPhoto;
  difficulty_average?: number;
  difficulty_count?: number;
  rating_average?: number;
  rating_count?: number;
  yardage_max?: number;
  gauge?: number;
  gauge_divisor?: number;
  gauge_pattern?: string;
  sizes_available?: string;
  product_id?: number;
  currency?: string;
  price?: string;
  generally_available?: boolean;
  ravelry_download?: boolean;
  download_location?: {
    url: string;
  };
  pdf_url?: string;
  pattern_needle_sizes?: Array<{
    id: number;
    name: string;
    metric: number;
    us: string;
    hook: string;
  }>;
  pattern_categories?: Array<{
    id: number;
    name: string;
    permalink: string;
  }>;
  craft: {
    id: number;
    name: string;
    permalink: string;
  };
  pattern_attributes?: Array<{
    id: number;
    permalink: string;
  }>;
  yarn_weight?: {
    id: number;
    name: string;
    min_gauge: number;
    max_gauge: number;
  };
  personal_attributes?: any;
}

export interface RavelryYarn {
  id: number;
  name: string;
  permalink: string;
  yarn_company: {
    id: number;
    name: string;
  };
  yarn_weight: {
    id: number;
    name: string;
    ply: string;
    wpi: number;
    min_gauge: number;
    max_gauge: number;
  };
  yarn_fibers: Array<{
    id: number;
    fiber_type: {
      id: number;
      name: string;
      animal_fiber: boolean;
      permalink: string;
    };
    percentage: number;
  }>;
  texture?: string;
  yardage?: number;
  yardage_description?: string;
  meters?: number;
  grams?: number;
  grams_description?: string;
  ounces?: number;
  min_needle_size?: {
    id: number;
    us: string;
    metric: number;
    us_steel?: string;
    crochet: boolean;
    knitting: boolean;
    hook?: string;
    name: string;
    pretty_metric: string;
  };
  max_needle_size?: {
    id: number;
    us: string;
    metric: number;
    us_steel?: string;
    crochet: boolean;
    knitting: boolean;
    hook?: string;
    name: string;
    pretty_metric: string;
  };
  min_gauge?: number;
  max_gauge?: number;
  gauge?: number;
  gauge_divisor?: number;
  machine_washable?: boolean;
  milling?: string;
  dye?: string;
  photos?: RavelryPhoto[];
  first_photo?: RavelryPhoto;
  rating_average?: number;
  rating_count?: number;
  discontinued?: boolean;
  yarn_colorways?: Array<{
    id: number;
    name: string;
    color_family?: {
      id: number;
      name: string;
      permalink: string;
    };
    photos?: RavelryPhoto[];
  }>;
}

export interface RavelryDesigner {
  id: number;
  name: string;
  permalink: string;
  notes?: string;
  patterns_count?: number;
  favorites_count?: number;
  users: Array<RavelryUser>;
}

export interface RavelryProject {
  id: number;
  name?: string;
  pattern_id?: number;
  pattern_name?: string;
  user: RavelryUser;
  status_name: string;
  progress?: number;
  happiness?: number;
  started?: string;
  completed?: string;
  photos?: RavelryPhoto[];
  first_photo?: RavelryPhoto;
  notes?: string;
  tag_names?: string[];
}

export interface RavelryFavorite {
  id: number;
  favorited_id: number;
  type: string;
  created_at: string;
  comment?: string;
}

// API Response Wrappers
export interface RavelryPatternsResponse {
  patterns: RavelryPattern[];
  paginator: {
    page: number;
    page_size: number;
    page_count: number;
    results: number;
    sort: string;
  };
}

export interface RavelryPatternResponse {
  pattern: RavelryPattern;
}

export interface RavelryYarnsResponse {
  yarns: {
    [key: string]: RavelryYarn;
  };
  paginator: {
    page: number;
    page_size: number;
    page_count: number;
    results: number;
    sort: string;
  };
}

export interface RavelryUserResponse {
  user: RavelryUser;
}

export interface RavelryYarnResponse {
  yarn: RavelryYarn;
}

export interface RavelryProjectsResponse {
  projects: RavelryProject[];
  paginator: {
    page: number;
    page_size: number;
    page_count: number;
    results: number;
    sort: string;
  };
}

export interface RavelryDesignerDetails extends RavelryDesigner {
  patterns?: RavelryPattern[];
}

export interface RavelryDesignersResponse {
  designers: RavelryDesigner[];
  paginator: {
    page: number;
    page_size: number;
    page_count: number;
    results: number;
    sort: string;
  };
}

export interface RavelryDesignerResponse {
  pattern_author: RavelryDesignerDetails;
}

// Search Parameters
export interface PatternSearchParams {
  query?: string;
  sort?: 'best' | 'popularity' | 'date' | 'name' | 'difficulty';
  craft?: 'knitting' | 'crochet' | 'loom-knitting' | 'machine-knitting';
  weight?: string;
  difficulty?: string;
  availability?: 'free' | 'ravelry' | 'online' | 'inprint' | 'discontinued';
  page?: number;
  page_size?: number;
  pc?: string; // pattern category
  view?: 'captioned_thumbs' | 'thumbs';
}

export interface YarnSearchParams {
  query?: string;
  sort?: 'name' | 'company' | 'weight';
  weight?: string;
  fiber?: string; // fiber category
  company?: string; // filter by brand/company name
  page?: number;
  page_size?: number;
}
