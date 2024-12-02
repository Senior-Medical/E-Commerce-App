import { NextFunction, Request, Response } from 'express';
import { Model } from 'mongoose';

/**
 * Middleware to set the API feature variables (`model` and `searchArray`) on the request object.
 * 
 * @param service - Service that provides the model and searchable fields.
 * @returns Middleware function that sets `req.apiFeature` with the model and search keys.
 */
export const setApiFeatureVariables = (service: any) => {
  return (req: Request & { apiFeature: { model: Model<any>, searchArray: string[] } }, res: Response, next: NextFunction) => {
    req.apiFeature = {
      model: service.getModel(),
      searchArray: service.getSearchKeys()
    }
    next();
  }
}
