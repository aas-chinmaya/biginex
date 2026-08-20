export interface Module {
  id?: string;
  name: string;
  route: string;
  description: string;
  priority: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Submodule {
  id?: string;
  name: string;
  route: string;
  description: string;
  priority: number;
  moduleId: string;
  module?: Module | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface Feature {
  id?: string | number;
  name: string;
  route: string;
  description: string;
  priority: number;
  moduleId: string | number;
  subModuleId: string | number;
  module?: Module | null;
  subModule?: Submodule | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface API {
  id?: string | number;
  name: string;
  method: string;
  route: string;
  description: string;
  priority: number;
  featureId: string | number;
  subModuleId: string | number;
  moduleId: string | number;
  module?: Module | null;
  subModule?: Submodule | null;
  feature?: Feature | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface Role {
  id?: string | number;
  name: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
}
