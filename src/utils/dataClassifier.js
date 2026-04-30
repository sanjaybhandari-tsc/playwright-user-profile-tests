function classify(value, isProvided, isSystemGenerated = false) {
  if (isSystemGenerated) return 'system';
  if (isProvided) return 'input';
  if (value !== undefined && value !== null && value !== '') return 'fallback';
  return 'system';
}

module.exports = { classify };

//How to import 
//const { classify } = require('../utils/dataClassifier');