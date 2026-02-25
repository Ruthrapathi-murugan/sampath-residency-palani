# Email Template Setup Guide - Price Variables

## Problem
The booking confirmation email is not showing the total price and night count because the EmailJS template doesn't have the new variables.

## Solution
You need to update your EmailJS email template to include the new variables.

---

## Variables Available in Booking Email

Your email template can now use these variables:

### Customer Information
- `{{from_name}}` - Customer name
- `{{from_email}}` - Customer email
- `{{phone}}` - Phone number
- `{{address}}` - Customer address

### Booking Details
- `{{check_in}}` - Check-in date (e.g., 2026-02-07)
- `{{check_out}}` - Check-out date (e.g., 2026-02-10)
- `{{number_of_nights}}` - **NEW:** Number of nights (e.g., 3)
- `{{room_category}}` - Room type (e.g., Double bed A/C)

### Pricing Information
- `{{price_per_night}}` - **NEW:** Price per night (e.g., Rs.1800/night)
- `{{total_price}}` - **NEW:** Total price for all nights (e.g., 5400)
- `{{special_requests}}` - Special requests from customer

### Status
- `{{booking_status}}` - APPROVED or REJECTED
- `{{rejection_reason}}` - Reason if rejected

---

## How to Update EmailJS Template

### Step 1: Log in to EmailJS
Go to https://dashboard.emailjs.com/

### Step 2: Open Your Email Template
Find the template ID: `template_9ltlctj` (Customer Booking Confirmation)

### Step 3: Update Template Content

**Example Email Template:**

```html
<h2>Booking Confirmation</h2>

<p>Dear {{from_name}},</p>

<p>Your booking has been {{booking_status}}.</p>

<h3>Booking Details:</h3>
<ul>
  <li><strong>Check-in:</strong> {{check_in}}</li>
  <li><strong>Check-out:</strong> {{check_out}}</li>
  <li><strong>Number of Nights:</strong> {{number_of_nights}}</li>
  <li><strong>Room Category:</strong> {{room_category}}</li>
</ul>

<h3>Pricing:</h3>
<ul>
  <li><strong>Price per Night:</strong> {{price_per_night}}</li>
  <li><strong>Total Price:</strong> Rs.{{total_price}}</li>
</ul>

<h3>Your Details:</h3>
<ul>
  <li><strong>Email:</strong> {{from_email}}</li>
  <li><strong>Phone:</strong> {{phone}}</li>
  <li><strong>Address:</strong> {{address}}</li>
</ul>

{{#if special_requests}}
<h3>Special Requests:</h3>
<p>{{special_requests}}</p>
{{/if}}

{{#if rejection_reason}}
<h3>Rejection Reason:</h3>
<p>{{rejection_reason}}</p>
{{/if}}

<p>Thank you for choosing Sampath Residency!</p>

<p>
  <strong>Contact Us:</strong><br>
  Email: sampathresidencyatpalani@gmail.com<br>
  Phone: 9626380310
</p>
```

### Step 4: Save Changes
Click "Save" in the EmailJS dashboard.

---

## Testing

After updating the template:

1. Go to your booking page
2. Fill in a booking form with:
   - Check-in: Any future date
   - Check-out: 3 days after check-in
   - All other required fields
3. Submit the booking
4. Admin approves the booking
5. **Check your email** - You should now see:
   - ✅ Number of nights (e.g., "3")
   - ✅ Price per night (e.g., "Rs.1800/night")
   - ✅ Total price (e.g., "Rs.5400")

---

## Current Template ID
- **Service ID:** service_i4eyrqb
- **Customer Template ID:** template_9ltlctj
- **Public Key:** uYO9ihoUL-BDHOxMO

**Do not change these - they are already configured in your `.env` file.**

---

## Need Help?
If the variables still don't appear:
1. Make sure you're using the correct template ID
2. Check that `{{}}` brackets are used (not `${}`)
3. Make sure you saved the template changes
4. Clear browser cache and try again
