
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailData {
  user: {
    email: string;
    user_metadata: {
      full_name?: string;
    };
  };
  template: string;
  redirect_to?: string;
}

function getEmailHTML(emailData: EmailData) {
  const userName = emailData.user.user_metadata?.full_name || "Investor";
  
  switch(emailData.template) {
    case "signup":
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Confirm Your VAIOT Account</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(to right, #1a365d, #3182ce);
              color: white;
              padding: 20px;
              text-align: center;
            }
            .content {
              padding: 20px;
              background: #f8f9fa;
            }
            .button {
              display: inline-block;
              background: #3182ce;
              color: white;
              text-decoration: none;
              padding: 12px 20px;
              border-radius: 4px;
              margin: 20px 0;
              font-weight: bold;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              padding-top: 20px;
              border-top: 1px solid #ddd;
              font-size: 0.9em;
              color: #666;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>VAIOT Investment Platform</h1>
            </div>
            <div class="content">
              <h2>Confirm Your Email, ${userName}</h2>
              <p>Thank you for signing up for VAIOT Investment Platform. To complete your registration, please click the button below to confirm your email address:</p>
              <p style="text-align: center;">
                <a href="${emailData.redirect_to}" class="button">Confirm My Email</a>
              </p>
              <p>If you didn't create an account on VAIOT Investment Platform, you can safely ignore this email.</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} VAIOT Investment. All rights reserved.</p>
              <p>This is an automated message, please do not reply to this email.</p>
            </div>
          </div>
        </body>
        </html>
      `;
    case "magic_link":
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>VAIOT Login Link</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(to right, #1a365d, #3182ce);
              color: white;
              padding: 20px;
              text-align: center;
            }
            .content {
              padding: 20px;
              background: #f8f9fa;
            }
            .button {
              display: inline-block;
              background: #3182ce;
              color: white;
              text-decoration: none;
              padding: 12px 20px;
              border-radius: 4px;
              margin: 20px 0;
              font-weight: bold;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              padding-top: 20px;
              border-top: 1px solid #ddd;
              font-size: 0.9em;
              color: #666;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>VAIOT Investment Platform</h1>
            </div>
            <div class="content">
              <h2>Login Link, ${userName}</h2>
              <p>You requested a magic link to sign in to your VAIOT Investment Platform account. Click the button below to login:</p>
              <p style="text-align: center;">
                <a href="${emailData.redirect_to}" class="button">Sign In to VAIOT</a>
              </p>
              <p>If you didn't request this link, you can safely ignore this email.</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} VAIOT Investment. All rights reserved.</p>
              <p>This is an automated message, please do not reply to this email.</p>
            </div>
          </div>
        </body>
        </html>
      `;
    default:
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>VAIOT Investment Platform</title>
        </head>
        <body>
          <h1>VAIOT Investment Platform</h1>
          <p>Please follow this link to continue: <a href="${emailData.redirect_to}">Continue</a></p>
        </body>
        </html>
      `;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }
  
  try {
    const emailData: EmailData = await req.json();
    const html = getEmailHTML(emailData);
    
    // In a real implementation, you would send this HTML via an email service
    // For now, we just return it to demonstrate the template
    
    return new Response(
      JSON.stringify({
        html,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  }
});
