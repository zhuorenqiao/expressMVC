// Example model

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/*var ObjectId = Schema.ObjectId;*/

var RolesSchema = new Schema({
  status: {
    type: Number,
    default: 1
  },
  roleName: String,
  remark: String,
  createTime: {
    type: Date,
    default: Date.now
  }


});


 var Roles = mongoose.model('Roles', RolesSchema);

module.exports = Roles;

