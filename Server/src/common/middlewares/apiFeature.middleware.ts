import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { NextFunction, Request, Response } from 'express';
import { Model } from 'mongoose';

export const setApiFeatureVariables = (service: any) => {
  return (req: Request & { apiFeature: { model: Model<any>, searchArray: string[] } }, res: Response, next: NextFunction) => {
    req.apiFeature = {
      model: service.getModel(),
      searchArray: service.getSearchKeys()
    }
    next();
  }
}
