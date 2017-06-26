// Example model

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/*var ObjectId = Schema.ObjectId;*/

var UsersSchema = new Schema({
  status: {
    type: Number,
    default: 1
  },
  userType: {
    type: Number,
    default: 1
  },
  inpatientAreaId: String,
  loginName: String,
  password: String,
  nickName: String,
  password: String,
  rfId: String,
  userGroupList: [Schema.Types.Mixed],
  userRoleList: [Schema.Types.Mixed],
  meta: {
    createTime: {
      type: Date,
      default: Date.now
    },
    updateTime: {
      type: Date,
      default: Date.now
    }
  }




});


 var Users = mongoose.model('Users', UsersSchema);

module.exports = Users;

