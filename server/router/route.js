import { Router } from 'express';

/**Import controllers */

import * as controller from '../controllers/appController.js';
import Auth, { localVariable } from '../middleware/auth.js';
import { registerMail } from '../controllers/mailer.js';

const router = Router();

/**Post Methods */
router.route('/register').post(controller.register);

router.route('/registerMail').post(registerMail);

router.route('/authenticate').post(controller.verifyUser, (req, res) => {
  //authenticate the user
  res.end();
});

router.route('/login').post(controller.verifyUser, controller.login);

/**Get Methods */
router.route('/user/:username').get(controller.getUser); //get the user using their uusername
router
  .route('/generateOTP')
  .get(controller.verifyUser, localVariable, controller.generateOTP); // generate the OTP
router.route('/verifyOTP').get(controller.verifyUser, controller.verifyOTP); //verify the generated OTP
router.route('/creatResetSession').get(controller.creatResetSession); //reset all variables

/**Put Methods */
router.route('/updateUser').put(Auth, controller.updateUser); // update the user profile
router
  .route('/resetPassword')
  .put(controller.verifyUser, controller.resetPassword); //rest the password

export default router;
