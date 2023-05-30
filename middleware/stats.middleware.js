const statisticsMiddleware = (req, res, next) => {
    const stats = {
      pathVariables: req.params,
      queryString: req.query
    };
  
    console.log("Statistics:", stats);
    next();
  };
  
  module.exports = statisticsMiddleware;