import * as React from "react";
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text
} from "@react-email/components";

export type VerifyEmailProps = {
  otp: string;
  expiresInMinutes?: number;
};

const colors = {
  ink: "#0b1220",
  muted: "#526071",
  border: "#d8dee8",
  panel: "#f6f8fb",
  brand: "#155eef",
  success: "#087f5b"
};

export const VerifyEmail = ({ otp, expiresInMinutes = 5 }: VerifyEmailProps) => (
  <Html>
    <Head />
    <Preview>Your Dectra verification code is {otp}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={brandBar}>
          <Text style={brand}>Dectra</Text>
          <Text style={brandSubline}>Document trust infrastructure</Text>
        </Section>

        <Heading style={heading}>Verify your email</Heading>
        <Text style={paragraph}>
          Use this one-time password to continue secure onboarding with Dectra.
        </Text>

        <Section style={otpBox}>
          <Text style={otpLabel}>Verification code</Text>
          <Text style={otpText}>{otp}</Text>
        </Section>

        <Button href="#" style={button}>
          Expires in {expiresInMinutes} minutes
        </Button>

        <Hr style={hr} />

        <Text style={securityTitle}>Security notice</Text>
        <Text style={small}>
          Dectra will never ask for this code over phone, chat, or support channels. If you did not request this
          email, ignore it and consider reviewing your account activity.
        </Text>

        <Text style={footer}>
          Dectra Trust Systems<br />
          Transactional security email
        </Text>
      </Container>
    </Body>
  </Html>
);

export const verifyEmailText = ({ otp, expiresInMinutes = 5 }: VerifyEmailProps) =>
  [
    "Dectra email verification",
    "",
    `Your verification code is: ${otp}`,
    `This code expires in ${expiresInMinutes} minutes.`,
    "",
    "Security notice: Dectra will never ask for this code over phone, chat, or support channels.",
    "If you did not request this email, ignore it."
  ].join("\n");

const main = {
  margin: 0,
  backgroundColor: "#eef2f7",
  color: colors.ink,
  fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
};

const container = {
  width: "100%",
  maxWidth: "560px",
  margin: "32px auto",
  padding: "32px",
  backgroundColor: "#ffffff",
  border: `1px solid ${colors.border}`,
  borderRadius: "8px"
};

const brandBar = {
  marginBottom: "28px"
};

const brand = {
  margin: 0,
  color: colors.brand,
  fontSize: "22px",
  fontWeight: 700,
  letterSpacing: "0"
};

const brandSubline = {
  margin: "4px 0 0",
  color: colors.muted,
  fontSize: "13px"
};

const heading = {
  margin: "0 0 12px",
  color: colors.ink,
  fontSize: "28px",
  lineHeight: "36px",
  fontWeight: 700
};

const paragraph = {
  margin: "0 0 24px",
  color: colors.muted,
  fontSize: "16px",
  lineHeight: "24px"
};

const otpBox = {
  margin: "0 0 22px",
  padding: "24px",
  backgroundColor: colors.panel,
  border: `1px solid ${colors.border}`,
  borderRadius: "8px",
  textAlign: "center" as const
};

const otpLabel = {
  margin: "0 0 8px",
  color: colors.muted,
  fontSize: "12px",
  textTransform: "uppercase" as const
};

const otpText = {
  margin: 0,
  color: colors.ink,
  fontSize: "36px",
  lineHeight: "44px",
  fontWeight: 800,
  letterSpacing: "6px"
};

const button = {
  width: "100%",
  padding: "12px 0",
  borderRadius: "6px",
  backgroundColor: colors.success,
  color: "#ffffff",
  fontSize: "14px",
  textAlign: "center" as const,
  textDecoration: "none"
};

const hr = {
  margin: "28px 0",
  borderColor: colors.border
};

const securityTitle = {
  margin: "0 0 8px",
  color: colors.ink,
  fontSize: "14px",
  fontWeight: 700
};

const small = {
  margin: 0,
  color: colors.muted,
  fontSize: "13px",
  lineHeight: "20px"
};

const footer = {
  margin: "28px 0 0",
  color: "#7a8699",
  fontSize: "12px",
  lineHeight: "18px"
};

export default VerifyEmail;
