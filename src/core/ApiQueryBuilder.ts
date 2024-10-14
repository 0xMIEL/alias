import { Document, Query } from 'mongoose';

type ApiQueryBuilderProps<T> = {
  query: Query<T[], T>;
  queryParams: Record<string, unknown>;
};

const defaultLimit = 10;
const defaultPage = 1;

export class ApiQueryBuilder<T extends Document> {
  query;
  private queryParams;

  constructor({ query, queryParams }: ApiQueryBuilderProps<T>) {
    this.query = query;
    this.queryParams = queryParams;
  }

  filter() {
    const queryObjectWithFilterOnly = { ...this.queryParams };

    const excludedFields = ['sort', 'limit', 'page', 'fields'];

    excludedFields.forEach((field) => delete queryObjectWithFilterOnly[field]);
    Object.keys(queryObjectWithFilterOnly).forEach((key) => {
      if (!queryObjectWithFilterOnly[key]) {
        delete queryObjectWithFilterOnly[key];
      }
    });

    this.query.find(queryObjectWithFilterOnly);
    return this;
  }

  sort() {
    const sortBy =
      (this.queryParams.sort as string)?.split(',').join(' ') || '-createdAt';
    this.query.sort(sortBy);

    return this;
  }

  paginate() {
    const page = (this.queryParams.page as number) || defaultPage;
    const limit = (this.queryParams.limit as number) || defaultLimit;
    const skip = limit * (page - 1);

    this.query = this.query.limit(limit).skip(skip);

    return this;
  }
}
