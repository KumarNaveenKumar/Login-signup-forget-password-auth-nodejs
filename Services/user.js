const User = require('../Models/user');

const addOne = async (data, opts={}) => await User(data).save(opts);
const getOne = async (criteria, proj={}, opts={}, pop=[]) => User.findOne(criteria, proj, opts).populate(pop);
const get = async (criteria, proj={}, opts={}, pop=[]) => await User.find(criteria, proj, opts).populate(pop);
const updateOne = async (criteria, updates, opts={}) => User.updateOne(criteria, updates, opts);
const updateMany = async  (criteria, updates, opts={}) => User.updateOne(criteria, update, opts);

module.exports = {
    addOne,
    getOne,
    get,
    updateOne,
    updateMany,
}