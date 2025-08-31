export interface ValidateErrorJSON {
  message: 'Validation failed';
  details: { [name: string]: unknown };
}

export interface NotFoundErrorJSON {
  message: 'Not found';
  details: { [name: string]: unknown };
}
