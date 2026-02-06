import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import nodemailer from "nodemailer";
import { prisma } from "./prisma";
import config from "../config";
import { UserRole } from "../generated/prisma/enums";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: config.appUser,
    pass: config.appPass,
  },
});

const isProd = process.env.NODE_ENV === "production";

export const auth = betterAuth({
  baseURL: config.authUrl,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  trustedOrigins: [
    config.appUrl!,
    config.authUrl!,
    "http://localhost:3000",
  ],
  advanced: {
    defaultCookieAttributes: {
      sameSite: isProd ? "none" : "lax",
      secure: isProd,
    },
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: UserRole.CUSTOMER,
      },
      phone: {
        type: "string",
        required: false,
      },
      status: {
        type: "string",
        defaultValue: "ACTIVE",
      },
    },
  },

  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
  },

  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, token }) => {
      const verificationUrl = `${config.appUrl}/verify-email?token=${token}`;

      await transporter.sendMail({
        from: '"Health Mart" <no-reply@healthmart.com>',
        to: user.email,
        subject: "Verify Your Health Mart Account",
        html: `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Verify Your Email - Health Mart</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        background-color: #f4f6f8;
        font-family: Arial, Helvetica, sans-serif;
      }
      .container {
        max-width: 600px;
        margin: 40px auto;
        background-color: #ffffff;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }
      .header {
        background-color: #16a34a;
        color: #ffffff;
        padding: 24px;
        text-align: center;
      }
      .header h1 {
        margin: 0;
        font-size: 24px;
      }
      .content {
        padding: 30px;
        color: #333333;
        line-height: 1.6;
      }
      .content h2 {
        margin-top: 0;
      }
      .button-wrapper {
        text-align: center;
        margin: 30px 0;
      }
      .verify-button {
        background-color: #16a34a;
        color: #ffffff;
        text-decoration: none;
        padding: 14px 28px;
        border-radius: 6px;
        font-size: 16px;
        font-weight: bold;
        display: inline-block;
      }
      .verify-button:hover {
        background-color: #15803d;
      }
      .footer {
        background-color: #f9fafb;
        text-align: center;
        padding: 20px;
        font-size: 13px;
        color: #6b7280;
      }
      .link {
        word-break: break-all;
        color: #2563eb;
      }
    </style>
  </head>

  <body>
    <div class="container">
      <div class="header">
        <h1>Health Mart 💊</h1>
        <p>Your Trusted Online Medicine Platform</p>
      </div>

      <div class="content">
        <h2>Hello ${user.name || "there"},</h2>

        <p>
          Thank you for registering at <strong>Health Mart</strong>.
          To keep your account secure and start using our services,
          please verify your email address.
        </p>

        <div class="button-wrapper">
          <a href="${verificationUrl}" class="verify-button">
            Verify Email Address
          </a>
        </div>

        <p>
          If the button above does not work, copy and paste the following
          link into your browser:
        </p>

        <p class="link">${verificationUrl}</p>

        <p>
          This verification link will expire soon for security reasons.
          If you did not create this account, you can safely ignore this email.
        </p>

        <p>
          Stay healthy,<br />
          <strong>The Health Mart Team</strong>
        </p>
      </div>

      <div class="footer">
        © ${new Date().getFullYear()} Health Mart. All rights reserved.
      </div>
    </div>
  </body>
</html>
        `,
      });
    },
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
});
