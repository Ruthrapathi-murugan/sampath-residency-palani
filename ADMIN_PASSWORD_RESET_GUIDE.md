# Admin Password Reset Feature

## Overview
The admin login panel includes a **password reset via email** feature. If you forget your admin password, you can reset it using your admin email address.

---

## How to Use Password Reset

### Step 1: Go to Admin Login Page
Navigate to: `/admin` or your site's admin login page

### Step 2: Click "Forgot password?"
You'll see a password reset form appear below the login button.

### Step 3: Enter Your Admin Email
Enter the admin email address: `sampathresidencyatpalani@gmail.com`

### Step 4: Click "Send Password Reset Email"
A temporary password will be generated and sent to your email.

### Step 5: Check Your Email
Look for an email with the subject line containing your temporary password. This password will be valid immediately.

### Step 6: Use Temporary Password to Login
- Copy the temporary password from the email
- Paste it into the admin login form
- Click "Login"

---

## What if Email Doesn't Arrive?

### Option 1: Reset to Default Password
In the password reset form, click the button:
**"Or Reset to Default Password (Sampath@1234)"**

This will clear the temporary password and reset it to: `Sampath@1234`

### Option 2: Clear Temporary Password
Click the "Clear Temp Password" button on the login page to reset the temporary password.

---

## Email Configuration

The password reset feature uses **EmailJS** to send emails. 

**Current Configuration:**
- ✅ Service ID: `service_i4eyrqb`
- ✅ Template ID: `template_ceqei4r`
- ✅ Admin Email: `sampathresidencyatpalani@gmail.com`

---

## Troubleshooting

### "Email service is not configured"
This means the EmailJS environment variables are missing. Ensure your `.env` file contains:
```
REACT_APP_EMAILJS_SERVICE_ID=service_i4eyrqb
REACT_APP_EMAILJS_ADMIN_RESET_TEMPLATE_ID=template_ceqei4r
REACT_APP_EMAILJS_PUBLIC_KEY=uYO9ihoUL-BDHOxMO
REACT_APP_ADMIN_EMAIL=sampathresidencyatpalani@gmail.com
```

### Email not sending
1. Check if EmailJS template `template_ceqei4r` exists in your EmailJS account
2. Verify the email address `sampathresidencyatpalani@gmail.com` is correct
3. Check browser console for errors (F12 > Console tab)

### Still can't reset?
Use the default password: `Sampath@1234`

---

## Password Reset Process Diagram

```
Admin goes to /admin
    ↓
Clicks "Forgot password?"
    ↓
Enters admin email
    ↓
Clicks "Send Password Reset Email"
    ↓
EmailJS generates temp password
    ↓
Email sent to admin
    ↓
Admin checks email inbox
    ↓
Admin copies temp password
    ↓
Admin enters temp password in login form
    ↓
✅ Login successful
```

---

## Security Notes

- Temporary passwords are valid only after the email is sent successfully
- Temporary passwords are stored in your browser's localStorage
- For production, ensure HTTPS is enabled to protect the password in transit
- Admin email should be a secure inbox you have access to

---

## Changing the Permanent Admin Password

To change the permanent admin password, update the `.env` file:

```env
REACT_APP_ADMIN_PASSWORD=YourNewPassword123
```

Then restart your React development server:
```bash
npm start
```

**Important:** Keep this password secure and change it regularly!
