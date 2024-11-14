module.exports = (user, resetUrl) => `
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
    <h1>Password Reset</h1>
    <p>Hello ${user.name},</p>
    <p>You have requested to reset your password. Click the button below to set a new password:</p>
    <a href="${resetUrl}" class="button">Reset Password</a>
    <p>If you did not request a password reset, please ignore this email.</p>
    <p>This link will expire in 1 hour.</p>
  </div>
</body>
</html>
`;
