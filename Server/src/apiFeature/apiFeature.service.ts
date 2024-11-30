import { Injectable } from "@nestjs/common";
import { Query } from "mongoose";

class QueryString {
  page?: number;
  pageSize?: number;
  sort?: string;
  fields?: string;
  search?: string;
  [key: string]: any;
}

@Injectable()
export class ApiFeatureService {
  filter(query: Query<any, any>, queryString: QueryString) {
    const filterObj = { ...queryString };
    delete filterObj.page;
    delete filterObj.pageSize;
    delete filterObj.sort;
    delete filterObj.fields;
    delete filterObj.search;

    const filterStr = JSON.stringify(filterObj).replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      match => `$${match}`,
    );

    query.find(JSON.parse(filterStr));
    return query;
  }
  
  paginate(query: Query<any, any>, queryString: QueryString) {
    const page = queryString.page && queryString.page > 0 ? queryString.page : 1;
    const pageSize = queryString.pageSize && queryString.pageSize > 0 ? queryString.pageSize : 10;
    const skip = (page - 1) * pageSize;

    query.skip(skip).limit(pageSize);
    return query;
  }

  sort(query: Query<any, any>, queryString: QueryString) {
    if (queryString.sort) {
      const sortBy = queryString.sort.replace(/,/g, ' ');
      query.sort(sortBy);
    }
    return query;
  }

  selectFields(query: Query<any, any>, queryString: QueryString) {
    if (queryString.fields) {
      const fields = queryString.fields.replace(/,/g, ' ');
      query.select(fields);
    }
    return query;
  }

  search(query: Query<any, any>, searchField: string[], queryString: QueryString) {
    if (queryString.search) {
      const searchRegex = new RegExp(queryString.search, 'i');
      let searchObject = searchField.map(field => ({ [field]: searchRegex }));
      query.find({ $or: searchObject });
    }
    return query;
  }
}