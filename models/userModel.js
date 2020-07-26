
//setup schema
var Schema = mongoose.Schema;
var UserSchema = new Schema({
	fname: String,
  lname: String,
  email: String,
	password: String
}, {
	collection: 'users'
});

var Users = mongoose.model('Users', UserSchema);
