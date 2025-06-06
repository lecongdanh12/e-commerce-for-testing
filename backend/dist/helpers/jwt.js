"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _jsonwebtoken = require('jsonwebtoken'); var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);
var _boom = require('@hapi/boom'); var _boom2 = _interopRequireDefault(_boom);


const signAccessToken = (data) => {
	return new Promise((resolve, reject) => {
		const payload = {
			...data,
		};
		const options = {
			expiresIn: "10d",
			issuer: "ecommerce.app",
			algorithm: "HS256",
		};

		_jsonwebtoken2.default.sign(payload, process.env.JWT_SECRET, options, (err, token) => {
			if (err) {
				console.log(err);
				reject(_boom2.default.internal());
			}

			resolve(token);
		});
	});
};

const verifyAccessToken = (req, res, next) => {
	const authorizationToken = req.headers["authorization"];
	if (!authorizationToken) {
		next(_boom2.default.unauthorized());
	}

	_jsonwebtoken2.default.verify(authorizationToken, process.env.JWT_SECRET, { algorithms: ["HS256"] }, (err, payload) => {
		if (err) {
			return next(
				_boom2.default.unauthorized(
					err.name === "JsonWebTokenError" ? "Unauthorized" : err.message
				)
			);
		}

		req.payload = payload;
		next();
	});
};

const signRefreshToken = (user_id) => {
	return new Promise((resolve, reject) => {
		const payload = {
			user_id,
		};
		const options = {
			expiresIn: "180d",
			issuer: "ecommerce.app",
		};

		_jsonwebtoken2.default.sign(payload, process.env.JWT_REFRESH_SECRET, options, (err, token) => {
			if (err) {
				console.log(err);
				reject(_boom2.default.internal());
			}

			// redis.set(user_id, token, "EX", 180 * 24 * 60 * 60);

			resolve(token);
		});
	});
};

const verifyRefreshToken = async (refresh_token) => {
	return new Promise(async (resolve, reject) => {		_jsonwebtoken2.default.verify(
			refresh_token,
			process.env.JWT_REFRESH_SECRET,
			{ algorithms: ["HS256"] },
			async (err, payload) => {
				if (err) {
					return reject(_boom2.default.unauthorized());
				}

				const { user_id } = payload;
				// const user_token = await redis.get(user_id);

				// if (!user_token) {
				// 	return reject(Boom.unauthorized());
				// }

				// if (refresh_token === user_token) {
				// 	return resolve(user_id);
				// }
			}
		);
	});
};






exports.signAccessToken = signAccessToken; exports.verifyAccessToken = verifyAccessToken; exports.signRefreshToken = signRefreshToken; exports.verifyRefreshToken = verifyRefreshToken;
