export function userInvitationEmail(
  username: string,
  organisationName: string,
  inviterName: string,
  temporaryPassword: string,
  loginUrl: string
): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to ${organisationName}</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Welcome to KonfiDayPlaner!</h1>
  </div>
  
  <div style="background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
    <p style="font-size: 16px; margin-bottom: 20px;">Hi <strong>${username}</strong>,</p>
    
    <p style="font-size: 16px; margin-bottom: 20px;">
      Great news! <strong>${inviterName}</strong> has invited you to join <strong>${organisationName}</strong> on KonfiDayPlaner.
    </p>
    
    <div style="background: #f8f9fa; border-left: 4px solid #667eea; padding: 20px; margin: 25px 0; border-radius: 4px;">
      <h3 style="margin-top: 0; color: #667eea;">Your Login Credentials</h3>
      <p style="margin: 10px 0;"><strong>Username:</strong> ${username}</p>
      <p style="margin: 10px 0;"><strong>Temporary Password:</strong> <code style="background: #e9ecef; padding: 4px 8px; border-radius: 4px; font-size: 14px;">${temporaryPassword}</code></p>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${loginUrl}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 16px;">
        Login Now
      </a>
    </div>
    
    <div style="background: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 4px; margin: 25px 0;">
      <p style="margin: 0; font-size: 14px;">
        <strong>⚠️ Important:</strong> Please change your password after your first login for security purposes.
      </p>
    </div>
    
    <p style="font-size: 16px; margin-top: 25px;">
      If you have any questions or need assistance, please don't hesitate to reach out to your organisation administrator.
    </p>
    
    <p style="font-size: 16px; margin-top: 20px;">
      Best regards,<br>
      <strong>The KonfiDayPlaner Team</strong>
    </p>
  </div>
  
  <div style="text-align: center; margin-top: 30px; padding: 20px; color: #6c757d; font-size: 12px;">
    <p style="margin: 5px 0;">This is an automated message from KonfiDayPlaner</p>
    <p style="margin: 5px 0;">If you didn't expect this invitation, please ignore this email.</p>
  </div>
</body>
</html>
  `.trim();
}
