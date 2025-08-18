export type Address = {
  info: string;
  latitude: number;
  longitude: number;
};
export type User = {
 
  name: string;
  address: Address;
  age: Date;
  email: string;
  image:string
};
export type Property = {
  type: any;
  id: string;
  title: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  price: number;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  squareFootage: number;
  yearBuilt: number;
  description: string;
  amenities: string[];
  images: string[];
  coordinates: {
    latitude: number;
    longitude: number;
  };
  isAvailable: boolean;
  listingDate: string; 
  agentPhone: string;
  agentEmail: string;
};
