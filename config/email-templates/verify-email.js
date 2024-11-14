module.exports = (user, verificationUrl) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    .container { 
      padding: 20px;
      font-family: Arial, sans-serif;
    }
    .button {
      background-color: #4CAF50;
      color: white;
      padding: 15px 32px;
      text-decoration: none;
      display: inline-block;
      border-radius: 4px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Email Verification</h1>
    <p>Hello ${user.name},</p>
    <p>Please verify your email address by clicking the button below:</p>
    <a href="${verificationUrl}" class="button">Verify Email</a>
    <p>If you did not create an account, please ignore this email.</p>
    <p>This link will expire in 24 hours.</p>
  </div>
</body>
</html>
`;
