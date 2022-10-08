const Tour = require('../models/tourModel');

exports.getAllTours = async (req, res) => {
  try {
    // Query building

    // 1.Filtering
    const queryObj = { ...req.query };
    const execluedFields = ['page', 'sort', 'limit', 'fields'];
    execluedFields.forEach(el => delete queryObj[el]);

    // 1.1 Advance Filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|let|lt)\b/g, match => `$${match}`);

    let query = Tour.find(JSON.parse(queryStr));

    //  2.Sorting
    if (req.query.sort) {
      // convert comma into space
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    //  3.Limiting Field
    if (req.query.fields) {
      // convert comma into space
      const fieldsBy = req.query.fields.split(',').join(' ');
      query = query.select(fieldsBy);
    } else {
      query = query.select('-__v');
    }

    // 4.Pagination
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const numTours = Tour.countDocuments();
      if (skip > numTours) {
        throw new Error('Page Not Exist');
      }
    }

    // Execute the query
    const tours = await query;

    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);

    res.status(200).json({
      status: 'success',
      data: {
        tour
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'invalid data set'
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.body, {
      new: true,
      runValidators: true
    });
    res.status(200).json({
      status: 'success',
      data: {
        tour
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(200).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};
