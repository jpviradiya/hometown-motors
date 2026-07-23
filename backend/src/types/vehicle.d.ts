type Vehicle = {
  make: string;
  model: string;
  category: any;
  year: number;
  fuelType: any;
  color: string;
  transmission: any;
  price: number;
  quantity: number;
  description: string;
};

type FilterVehicle = {
  search?: string;
  category?: string;
  fuelType?: string;
  transmission?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
};
