module.exports = (user) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    .container { 
      padding: 20px;
      font-family: Arial, sans-serif;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Welcome to Our Platform!</h1>
    <p>Hello ${user.name},</p>
    <p>Thank you for joining our platform. We're excited to have you on board!</p>
    <p>If you have any questions, feel free to reply to this email.</p>
  </div>
</body>
</html>
`;
