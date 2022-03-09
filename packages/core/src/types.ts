export interface TokenAttribute {
  trait_type: string;
  value: string;
}

export interface TokenData {
  id: number;
  owner?: string;
  image: string;
  name: string;
  description: string;
  attributes: TokenAttribute[];
}
