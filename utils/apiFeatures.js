class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    // 1.Filtering
    const queryObj = { ...this.queryString };
    const execluedFields = ['page', 'sort', 'limit', 'fields'];
    execluedFields.forEach(el => delete queryObj[el]);

    // 1.1 Advance Filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|let|lt)\b/g, match => `$${match}`);

    this.query.find(JSON.parse(queryStr));
    return this;
  }

  //  2.Sorting
  sort() {
    if (this.queryString.sort) {
      // convert comma into space
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  // 3.Limit
  limitFields() {
    if (this.queryString.fields) {
      // convert comma into space
      const fieldsBy = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fieldsBy);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  // 4.Pagination
  pagination() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = APIFeatures;
