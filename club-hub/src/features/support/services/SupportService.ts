// src/features/support/services/SupportService.ts

export class SupportService {
  static async sendFeedback(
    subject: string,
    email: string,
    message: string
  ): Promise<void> {
    return new Promise(resolve =>
      setTimeout(() => {
        console.log('Support request:', { subject, email, message });
        resolve();
      }, 200)
    );
  }
}
