'use server';
/**
 * @fileOverview A flow for handling admin password reset requests.
 *
 * - sendPasswordReset - A function that simulates sending a password reset email to the admin.
 * - PasswordResetInput - The input type for the sendPasswordReset function.
 * - PasswordResetOutput - The return type for the sendPasswordReset function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';
import { PasswordResetInputSchema, PasswordResetOutputSchema, type PasswordResetInput, type PasswordResetOutput } from '@/lib/types';
import { dataStore } from '@/lib/store';

// This is the exported function that the client-side code will call.
export async function sendPasswordReset(input: PasswordResetInput): Promise<PasswordResetOutput> {
  return sendPasswordResetFlow(input);
}

// Define the main flow logic.
const sendPasswordResetFlow = ai.defineFlow(
  {
    name: 'sendPasswordResetFlow',
    inputSchema: PasswordResetInputSchema,
    outputSchema: PasswordResetOutputSchema,
  },
  async (input) => {
    const { adminUser } = dataStore.getState();
    const identifier = input.identifier.toLowerCase().trim();

    if (identifier === adminUser.nickname.toLowerCase() || (adminUser.email && identifier === adminUser.email.toLowerCase())) {
      // In a real application, you would integrate with an email service here.
      // For this prototype, we simulate a successful email dispatch.
      console.log(`✅ Simulating password reset email sent to admin with identifier: ${input.identifier}`);
      console.log(`New password would be sent from: super.moda@yahoo.com.br`);

      return {
        success: true,
        message: 'Um e-mail de redefinição de senha foi enviado para o administrador.',
      };
    } else {
       console.warn(`⚠️ Password reset attempt failed for identifier: ${input.identifier}`);
       return {
        success: false,
        message: 'Administrador não encontrado. Verifique o login ou email informado.',
      };
    }
  }
);
