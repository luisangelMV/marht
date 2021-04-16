
// Models

const db = require('../database');
const AccountModel = require('../models/account.model');
// Modules

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require("crypto");
const Role = require('../models/role');
const sendEmail = require('../controllers/send-email.controller');

module.exports = {
  authenticate,
  refreshToken,
  revokeToken,
  register,
  verifyEmail,
  forgotPassword,
  validateResetToken,
  resetPassword,
  update
};


async function authenticate({ email, password, ipAddress }) {
  const account = await db.Account.findOne({ email });
  if (!account) throw 'Email is incorrect';
  if (!account.isVerified) throw 'no verified';
  const match = await account.matchPassword(password);
  if (!match) throw 'Password is incorrect';

  // authentication successful so generate jwt and refresh tokens
  const jwtToken = generateJwtToken(account);
  const refreshToken = generateRefreshToken(account, ipAddress);

  // save refresh token
  await refreshToken.save();

  // return basic details and tokens
  return {
    ...basicDetails(account),
    jwtToken,
    refreshToken: refreshToken.token
  };
}

async function refreshToken({ token, ipAddress }) {
  const refreshToken = await getRefreshToken(token);
  const { account } = refreshToken;
  const newRefreshToken = generateRefreshToken(account, ipAddress);

  // replace old refresh token with a new one and save
  refreshToken.revoked = Date.now();
  refreshToken.revokedByIp = ipAddress;
  refreshToken.replacedByToken = newRefreshToken.token;
  await refreshToken.save();
  await newRefreshToken.save();

  // generate new jwt
  const jwtToken = generateJwtToken(account);

  // return basic details and tokens
  return {
    ...basicDetails(account),
    jwtToken,
    refreshToken: newRefreshToken.token
  };
}

async function revokeToken({ token, ipAddress }) {
  const refreshToken = await getRefreshToken(token);

  // revoke token and save
  refreshToken.revoked = Date.now();
  refreshToken.revokedByIp = ipAddress;
  await refreshToken.save();
}

async function register(params, origin) {
  // validate
  if (await db.Account.findOne({ email: params.email })) {
    // send already registered error in email to prevent account enumeration
    throw 'Email in use';
  }

  // create account object
  const account = new db.Account(params);
  account.verificationToken = randomTokenString();
  account.password = await account.encryptPassword(params.password);

  // save account
  await account.save();

  // send email
  await sendVerificationEmail(account, origin);
}

async function verifyEmail({ email, token }) {
  const account = await db.Account.findOne({ email });
  if (!account) throw 'not found email';

  if (account.isVerified) throw 'is verified';

  if (account.verificationToken !== token) throw 'verification failed';

  account.verified = Date.now();
  account.verificationToken = undefined;
  await account.save();
}

async function forgotPassword({ email }, origin) {
  const account = await db.Account.findOne({ email });

  // always return ok response to prevent email enumeration
  if (!account) return;

  // create reset token that expires after 24 hours
  account.resetToken = {
    token: randomTokenString(),
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000)
  };
  await account.save();

  // send email
  await sendPasswordResetEmail(account, origin);
}

async function validateResetToken({ token }) {
  const account = await db.Account.findOne({
    'resetToken.token': token,
    'resetToken.expires': { $gt: Date.now() }
  });

  if (!account) throw 'Invalid token';
}

async function resetPassword({ token, password, confirmPassword, email }) {
  const account = await db.Account.findOne({ email: email });
  if (!account) throw 'account no found';
  if (!password === confirmPassword) throw 'password dont match';
  if (account.resetToken.token !== token) throw 'invalid Token';
  if (!account.resetToken.expires === { $gt: Date.now() }) throw 'time Expired';

  // update password and remove reset token
  account.password = await account.encryptPassword(password);
  account.passwordReset = Date.now();
  account.resetToken = undefined;

  await account.save();
}

async function update(id, params) {
  const account = await getAccount(id);

  // validate (if email was changed)
  if (params.email && account.email !== params.email && await db.Account.findOne({ email: params.email })) {
    throw 'Email "' + params.email + '" is already taken';
  }

  // hash password if it was entered
  if (params.password) {
    params.passwordHash = account.encryptPassword(params.password);
  }

  // copy params to account and save
  Object.assign(account, params);
  account.updated = Date.now();
  await account.save();

  return basicDetails(account);
}

// helper functions

async function getAccount(id) {
  if (!db.isValidId(id)) throw 'Account not found';
  const account = await db.Account.findById(id);
  if (!account) throw 'Account not found';
  return account;
}

async function getRefreshToken(token) {
  const refreshToken = await db.RefreshToken.findOne({ token }).populate('account');
  if (!refreshToken || !refreshToken.isActive) throw 'Invalid token';
  return refreshToken;
}

function generateJwtToken(account) {
  // create a jwt token containing the account id that expires in 15 minutes
  return jwt.sign({ sub: account.role, id: account.id }, process.env.secret, { expiresIn: '15m' });
}

function generateRefreshToken(account, ipAddress) {
  // create a refresh token that expires in 7 days
  return new db.RefreshToken({
    account: account.id,
    token: randomTokenString(),
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    createdByIp: ipAddress
  });
}

function randomTokenString() {
  return crypto.randomBytes(40).toString('hex');
}

function basicDetails(account) {
  const { id, name, lastName, email, role, createdAt, updatedAt, isVerified, phone, state, company } = account;
  return { id, name, lastName, email, role, createdAt, updatedAt, isVerified, phone, state, company };
}

async function sendVerificationEmail(account, origin) {
  const verifyUrl = `${origin}/account/verify-email?token=${account.verificationToken}&email=${account.email}`;
  await sendEmail({
    to: account.email,
    subject: 'MARHT - Verificacion de Email',
    html: `
    <!DOCTYPE html>
<html lang="es">

<head>
    <meta http-equiv="Content-Type" content="text/html" ; charset="utf-8" />
    <title>Verificacion de Email</title>
</head>

<body>
    <table align="center"
        style="Margin:0 auto;border-spacing:0;font-family:Arial,Helvetica,sans-serif;max-width:600px;width:100%">
        <tbody style="font-family:Lato,Arial,sans-serif">
            <tr style="font-family:Lato,Arial,sans-serif">
                <td style="font-family:Lato,Arial,sans-serif;padding:0">
                    <table border="0" cellPadding="0" cellSpacing="0" width="100%"
                        style="background:#007bff;border-spacing:0;font-family:Lato,Arial,sans-serif;height:55px">
                        <tbody>
                            <tr style="font-family:Lato,Arial,sans-serif">
                                <td vAlign="top"
                                    style="font-size: 25px !important; float:left;font-family:Lato,Arial,sans-serif;height:36px;line-height:100%;padding:9px 20px 8px 20px;vertical-align:middle">
                                    <a href="${origin}"
                                        style="color:#FFFFFF;font-family:Lato,Arial,sans-serif;margin:0;padding:0;text-decoration:none;word-break:normal;vertical-align:middle"
                                        target="_blank">Marht</a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div style="font-family:Lato,Arial,sans-serif;padding-top:40px"></div>
                    <table border="0" cellPadding="0" cellSpacing="0"
                        style="border-spacing:0;display:table;font-family:Lato,Arial,sans-serif;padding:0 10px;text-align:center;width:100%">
                        <tbody style="font-family:Lato,Arial,sans-serif">
                            <tr style="border:none;font-family:Lato,Arial,sans-serif;margin:0;padding:0">
                                <td
                                    style="border:none;box-sizing:border-box;font-family:Lato,Arial,sans-serif;margin:0;padding:0 10px">
                                    <h2
                                        style="border:none;color:#333333;display:block;font-family:Lato,Arial,sans-serif;font-size:28px;font-weight:400;letter-spacing:normal;line-height:normal;margin:0;padding:0;text-align:center;word-break:normal;word-spacing:normal">
                                        Este correo es enviado para la verificación de su Email, valide su correo para
                                        iniciar sesión.
                                    </h2>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div style="font-family:Lato,Arial,sans-serif;padding-top:35px; padding-bottom: 20px;"></div>
                    <table border="0" cellPadding="0" cellSpacing="0"
                        style="background-color:#ffffff;border-spacing:0;font-family:Lato,Arial,sans-serif;margin:0 auto;max-width:600px;text-align:center;width:auto">
                        <tbody>
                            <tr style="font-family:Lato,Arial,sans-serif">
                                <td style="font-family:Lato,Arial,sans-serif;padding:0">
                                    <a style="color:#007bff;display:block;font-family:Lato,Arial,sans-serif;font-weight:normal;margin:0;padding:0;padding-left:0;text-decoration:none;width:100%;word-break:normal" href="${verifyUrl}" target="_blanck">
                                        <table border="0" cellSpacing="0" cellPadding="0"
                                            style="border-spacing:0;display:table!important;font-family:Lato,Arial,sans-serif;height:48px;margin:0 auto;max-height:48px;width:280px">
                                            <tbody>
                                                <tr style="font-family:Lato,Arial,sans-serif">
                                                    <td align="center"
                                                        style="background-color:#007bff;border:0;border-radius:4px;color:#ffffff;font-family:Lato,Arial,sans-serif;font-size:18px;font-weight:400;height:48px;margin:5px 0;max-height:48px;max-width:280px;outline:0;padding:0 30px;text-align:center;text-decoration:none;width:100%">
                                                        Verificar Email
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
        </tbody>
    </table>
</body>`
  });
}

async function sendPasswordResetEmail(account, origin) {

  const resetUrl = `${origin}/account/reset-password?token=${account.resetToken.token}&email=${account.email}`;

  await sendEmail({
    to: account.email,
    subject: 'MARHT - Reset Password',
    html: `<!DOCTYPE html>
    <html lang="es">
    
    <head>
      <meta http-equiv="Content-Type" content="text/html" ; charset="utf-8" />
      <title>Restablecer Contraseña</title>
    </head>
    
    <body>
      <table align="center"
          style="Margin:0 auto;border-spacing:0;font-family:Arial,Helvetica,sans-serif;max-width:600px;width:100%">
          <tbody style="font-family:Lato,Arial,sans-serif">
              <tr style="font-family:Lato,Arial,sans-serif">
                  <td style="font-family:Lato,Arial,sans-serif;padding:0">
                      <table border="0" cellPadding="0" cellSpacing="0" width="100%"
                          style="background:#007bff;border-spacing:0;font-family:Lato,Arial,sans-serif;height:55px">
                          <tbody>
                              <tr style="font-family:Lato,Arial,sans-serif">
                                  <td vAlign="top"
                                      style="font-size: 25px !important; float:left;font-family:Lato,Arial,sans-serif;height:36px;line-height:100%;padding:9px 20px 8px 20px;vertical-align:middle">
                                      <a href="${origin}"
                                          style="color:#FFFFFF;font-family:Lato,Arial,sans-serif;margin:0;padding:0;text-decoration:none;word-break:normal;vertical-align:middle"
                                          target="_blank">Marht</a>
                                  </td>
                              </tr>
                          </tbody>
                      </table>
                      <div style="font-family:Lato,Arial,sans-serif;padding-top:40px"></div>
                      <table border="0" cellPadding="0" cellSpacing="0"
                          style="border-spacing:0;display:table;font-family:Lato,Arial,sans-serif;padding:0 10px;text-align:center;width:100%">
                          <tbody style="font-family:Lato,Arial,sans-serif">
                              <tr style="border:none;font-family:Lato,Arial,sans-serif;margin:0;padding:0">
                                  <td
                                      style="border:none;box-sizing:border-box;font-family:Lato,Arial,sans-serif;margin:0;padding:0 10px">
                                      <h2
                                          style="border:none;color:#333333;display:block;font-family:Lato,Arial,sans-serif;font-size:28px;font-weight:400;letter-spacing:normal;line-height:normal;margin:0;padding:0;text-align:center;word-break:normal;word-spacing:normal">
                                          ${account.name}, Haga clic en el boton a continuación para restablecer su contraseña, el enlace será válido por 1 día
                                      </h2>
                                  </td>
                              </tr>
                          </tbody>
                      </table>
                      <div style="font-family:Lato,Arial,sans-serif;padding-top:35px; padding-bottom: 20px;"></div>
                      <table border="0" cellPadding="0" cellSpacing="0"
                          style="background-color:#ffffff;border-spacing:0;font-family:Lato,Arial,sans-serif;margin:0 auto;max-width:600px;text-align:center;width:auto">
                          <tbody>
                              <tr style="font-family:Lato,Arial,sans-serif">
                                  <td style="font-family:Lato,Arial,sans-serif;padding:0">
                                      <a style="color:#007bff;display:block;font-family:Lato,Arial,sans-serif;font-weight:normal;margin:0;padding:0;padding-left:0;text-decoration:none;width:100%;word-break:normal" href="${resetUrl}" target="_blanck">
                                          <table border="0" cellSpacing="0" cellPadding="0"
                                              style="border-spacing:0;display:table!important;font-family:Lato,Arial,sans-serif;height:48px;margin:0 auto;max-height:48px;width:280px">
                                              <tbody>
                                                  <tr style="font-family:Lato,Arial,sans-serif">
                                                      <td align="center"
                                                          style="background-color:#007bff;border:0;border-radius:4px;color:#ffffff;font-family:Lato,Arial,sans-serif;font-size:18px;font-weight:400;height:48px;margin:5px 0;max-height:48px;max-width:280px;outline:0;padding:0 30px;text-align:center;text-decoration:none;width:100%">
                                                          Restablecer Contraseña
                                                      </td>
                                                  </tr>
                                              </tbody>
                                          </table>
                                      </a>
                                  </td>
                              </tr>
                          </tbody>
                      </table>
                  </td>
              </tr>
          </tbody>
      </table>
      </body>`
  });
}