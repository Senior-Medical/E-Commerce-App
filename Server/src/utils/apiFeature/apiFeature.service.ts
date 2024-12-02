import { Injectable } from "@nestjs/common";
import { Query, Types } from "mongoose";
import { QueryDto } from "./dto/query.dto";

/**
 * Service providing utility methods to apply API features (filtering, pagination, sorting, field selection, and search) to Mongoose queries.
 */
@Injectable()
export class ApiFeatureService {
  /**
   * Applies filtering to the query based on query string parameters.
   * 
   * @param query - The Mongoose query object.
   * @param requestQuery - Parsed query string object.
   * @returns The modified Mongoose query.
   */
  filter(query: Query<any, any>, requestQuery: QueryDto) {
    const filterObj = { ...requestQuery };
    delete filterObj.page;
    delete filterObj.pageSize;
    delete filterObj.sort;
    delete filterObj.fields;
    delete filterObj.search;

    for (const e of Object.entries(filterObj)) {
      if (e[1].startsWith("objectid:")) e[1] = new Types.ObjectId(e[1].replace("objectid:", "") as string);
      else if (e[1].startsWith("gt:")) e[1] = { $gt: e[1].replace("gt:", "") };
      else if(e[1].startsWith("gte:")) e[1] = { $gte: e[1].replace("gte:", "") };
      else if(e[1].startsWith("lt:")) e[1] = { $lt: e[1].replace("lt:", "") };
      else if(e[1].startsWith("lte:")) e[1] = { $lte: e[1].replace("lte:", "") };
      else if(e[1].startsWith("in:")) e[1] = { $in: e[1].replace("in:", "").split(",") };
      filterObj[e[0]] = e[1];
    }
    query.find(filterObj);
    return query;
  }
  
  /**
   * Applies pagination to the query.
   * 
   * @param query - The Mongoose query object.
   * @param requestQuery - Parsed query string object.
   * @returns The modified Mongoose query.
   */
  paginate(query: Query<any, any>, requestQuery: QueryDto) {
    const page = requestQuery.page && requestQuery.page > 0 ? requestQuery.page : 1;
    const pageSize = requestQuery.pageSize && requestQuery.pageSize > 0 ? requestQuery.pageSize : 10;
    const skip = (page - 1) * pageSize;

    query.skip(skip).limit(pageSize);
    return query;
  }

  /**
   * Applies sorting to the query.
   * 
   * @param query - The Mongoose query object.
   * @param requestQuery - Parsed query string object.
   * @returns The modified Mongoose query.
   */
  sort(query: Query<any, any>, requestQuery: QueryDto) {
    if (requestQuery.sort) {
      const sortBy = requestQuery.sort.replace(/,/g, ' ');
      query.sort(sortBy);
    }
    return query;
  }

  /**
   * Selects specific fields in the query results.
   * 
   * @param query - The Mongoose query object.
   * @param requestQuery - Parsed query string object.
   * @returns The modified Mongoose query.
   */
  selectFields(query: Query<any, any>, requestQuery: QueryDto) {
    if (requestQuery.fields) {
      const fields = requestQuery.fields.replace(/,/g, ' ');
      query.select(fields);
    }
    return query;
  }

  /**
   * Performs a search operation on specified fields.
   * 
   * @param query - The Mongoose query object.
   * @param searchField - Array of fields to perform the search on.
   * @param requestQuery - Parsed query string object.
   * @returns The modified Mongoose query.
   */
  search(query: Query<any, any>, searchField: string[], requestQuery: QueryDto) {
    if (requestQuery.search) {
      const searchRegex = new RegExp(requestQuery.search, 'i');
      let searchObject = searchField.map(field => ({ [field]: searchRegex }));
      query.find({ $or: searchObject });
    }
    return query;
  }
}