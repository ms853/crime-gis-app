const admin = require('firebase-admin');
const twilio = require('../twilio');
//const oneTimePassword = require('./requestOneTimePassword');

exports.signup = function(req, res) {
    //Verify the user provided a phone.
    if (!req.body.phone) {
       return res.status(422).send({ error: 'Bad Input' + '\nPlease provide a valid phone number to signup as a new user.'});
    }
   //With regex expression format users phone-number to remove dashes and parenthesis.
   const phone = String(req.body.phone).replace(/[^\d]/g, '');

   //Create a new user account using the phone number provided.
   //The phone number will serve as a unique id to identify each user.
   admin.auth().createUser({ uid: phone })
   .then(user => res.send({user_created: user})) //response to say that account has been created.
   .catch(error => res.status(422).send({ error: error}));

}

   //then request onetime password. 2FA
  exports.reqOneTimePassword = function (req, res, next) {
  
    if(!req.body.phone) {
        return res.status(422).send({ error: 'You must provide a valid phone number'});
    }
    //look at the phone number and take out any characters that are not digits.
    //and replace those characters with an empty string.
    const phone = String(req.body.phone).replace(/[^\d]/g, '');

    admin.auth().getUser(phone)
    .then(userRecord => {
      const code = Math.floor((Math.random() * 8999 + 1000));

      twilio.messages.create({
        body: 'Your code is ' + code,
        to: phone,
        from: '+441383630049'
      }, (err) => {
        if (err) { return res.status(422).send(err); }

        admin.database().ref('users/' + phone)
          .update({ code: code, codeValid: true }, () => {
            res.send({ success: true });
          });
      })
    })
    .catch((err) => {
      res.status(422).send({ error: err });
    });
  
};


exports.login = function(req, res, next) {
    
    if (!req.body.phone || !req.body.code) {
        return res.status(422).send({ error: 'Phone and code must be provided'});
        
    }

    var phone = String(req.body.phone).replace(/[^\d]/g, '');
    var code = parseInt(req.body.code);

    //Then retrieve user's code and phone number from firebase DB
    admin.auth().getUser(phone)
    .then(() => {
      const ref = admin.database().ref('users/' + phone);
      ref.on('value', snapshot => {
        ref.off();
        const user = snapshot.val();
        //check the code property and code to see if they match the values in the database.
        //if the code is invalid then the server will response with an error message. 
        if (user.code !== code || !user.codeValid) {
          return res.status(422).send({ error: 'Code not valid' });
        }else{ 
          //Once user is authenicated code status will no longer be valid.
        //This is to enforce security. 
          ref.update({ codeValid: false });
          admin.auth().createCustomToken(phone)
            .then(token => res.send({ token: token }))
            .catch((err) => res.status(422).send({ error: err}));
          }
        
      });
      
      return null;
    })
    .catch((err) => res.status(422).send({ error: err }));
}

