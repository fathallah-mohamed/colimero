import { Json } from './tables';
import type { DatabaseFunctions } from './functions';
import type { DatabaseEnums } from './enums';
import type { Tables } from './tables';

export interface Database {
  public: {
    Tables: Tables;
    Views: {
      [_ in never]: never;
    };
    Functions: DatabaseFunctions;
    Enums: DatabaseEnums;
  };
}

export type { Json } from './tables';
export type { Tables } from './tables';
export type { DatabaseFunctions } from './functions';
export type { DatabaseEnums } from './enums';