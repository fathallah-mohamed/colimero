import { AuthFunctions } from './auth';
import { BookingFunctions } from './booking';
import { TourFunctions } from './tour';

export interface DatabaseFunctions extends 
  AuthFunctions,
  BookingFunctions,
  TourFunctions {}

export * from './auth';
export * from './booking';
export * from './tour';