import auth from 'basic-auth';
import db from '../db.js';

const basicauth = async (req,res)=>{

        var encoded = req.headers.authorization.split(' ')[1];
		// decode it using base64
		var decoded = new Buffer(encoded,'base64').toString();
		var name = decoded.split(':')[0];
		var password = decoded.split(':')[1];

        //console.log(name,password)

        db.query("SELECT * FROM user1 WHERE username = ?",[name], function(err, rows){
            if (err)
                return done(err);
            if (!rows.length) {
                return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
            }

            // if the user is found but the password is wrong
            if (!bcrypt.compareSync(password, rows[0].password))
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

            // all is well, return successful user
            return done(null, rows[0]);
        });


}

export default basicauth;