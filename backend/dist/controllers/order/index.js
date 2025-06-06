"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _user = require('../../models/user'); var _user2 = _interopRequireDefault(_user);
var _order = require('../../models/order'); var _order2 = _interopRequireDefault(_order);
var _boom = require('@hapi/boom'); var _boom2 = _interopRequireDefault(_boom);
var _validations = require('./validations'); var _validations2 = _interopRequireDefault(_validations);



/**
 * Create a new order.
 *
 * @async
 * @function Create
 * @param {Object} req - Express request object.
 * @param {Object} req.body - The request payload containing order details.
 * @param {string} req.body.address - The address for the order.
 * @param {string} req.body.items - The items in the order, in JSON string format.
 * @param {Object} req.payload - The payload containing user information.
 * @param {string} req.payload.user_id - The ID of the user creating the order.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>} - Returns a promise that resolves to void.
 * @throws {Error} - Throws an error if order creation fails.
 */
const Create = async (req, res, next) => {
  const input = req.body;
  input.items = input.items ? JSON.parse(input.items) : null;
  const { error } = _validations2.default.validate(input);

  if (error) {
    return next(_boom2.default.badRequest(error.details[0].message));
  }

  const { user_id } = req.payload;

  try {
    const order = new (0, _order2.default)({
      user: user_id,
      adress: input.address,
      items: input.items,
    });

    const savedData = await order.save();

    res.json(savedData);
  } catch (e) {
    next(e);
  }
};

const List = async (req, res, next) => {
  try {
    const orders = await _order2.default.find({}).populate('user', '-password -__v').populate('items');

    res.json(orders);
  } catch (e) {
    next(e);
  }
};

const GetMyOrders = async (req, res, next) => {
  const { user_id } = req.payload;

  try {
    const orders = await _order2.default.findById(user_id).populate('purchases.item');

    res.json(orders);
  } catch (e) {
    next(e);
  }
};

exports. default = {
  Create,
  List,
  GetMyOrders,
};
