export interface TokenAttribute {
  trait_type: string;
  value: string;
  display_type?:
    | 'number'
    | 'boost_number'
    | 'boost_percentage'
    | 'date';
};

export interface TokenData {
  name: string;
  description: string;
  image: string;
  external_url?: string;
  background_color?: string;
  animation_url?: string;
  youtube_url?: string;
  attributes?: TokenAttribute[];
}

export interface StayToken {
  tokenId: string;
  owner: string;
  tokenUri: string;
  status?: string;
  data: TokenData;
}
