import { Injectable } from '@nestjs/common';
import passport from 'passport';
import { Resend } from 'resend';

@Injectable()
export class MailService {



    private resend = new Resend(process.env.RESEND_API_KEY);


    async sendChangePasswordEmail(to: string, resetLink: string) {
        const { data, error } = await this.resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: [to],
            subject: `Plan'it - Réinitialisation de votre mot de passe`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #104e64;">Réinitialisation de mot de passe</h2>
                
                <p>Vous avez demandé à réinitialiser votre mot de passe.</p>
                
                <p>Cliquez sur le bouton ci-dessous pour choisir un nouveau mot de passe :</p>
                
                <a href="${resetLink}" 
                   style="background-color: #4f9288; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">
                    Réinitialiser mon mot de passe
                </a>

                <p style="color: #879191; font-size: 12px; margin-top: 24px;">
                    Ce lien expire dans 1 heure.
                </p>
                <p style="color: #879191; font-size: 12px;">
                    Si vous n'avez pas fait cette demande, ignorez cet email.
                </p>
            </div>
            `,
        });

        if (error) {
            return console.error({ error });
        }

        return data

    }

    async sendWelcomeEmail(to: string, firstname: string, password: string) {
        const { data, error } = await this.resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: [to],
            subject: `Plan'it - Bienvenue chez nous !`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #104e64;">Bienvenue sur Plan'it, ${firstname} !</h2>
                
                <p>Votre compte a été créé par un administrateur du club.</p>
                
                <p>Voici vos identifiants de connexion :</p>
                <ul>
                    <li><strong>Email :</strong> ${to}</li>
                    <li><strong>Mot de passe temporaire :</strong> ${password}</li>
                </ul>

                <p>Pour finaliser votre inscription, cliquez sur le lien ci-dessous :</p>
                
                <a href="http://localhost:5173/login" 
                   style="background-color: #4f9288; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">
                    Accéder à mon compte
                </a>

                <p style="color: #879191; font-size: 12px; margin-top: 24px;">
                    Pour des raisons de sécurité, vous devrez changer votre mot de passe lors de votre première connexion.
                </p>
            </div>
            `,
        });

        if (error) {
            return console.error({ error });
        }

        return data
    }


    async sendPasswordChangeConfirmation(to: string, firstname: string) {
        await this.resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: [to],
            subject: `Plan'it - Votre mot de passe a été modifié`,
            html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #104e64;">Mot de passe modifié</h2>
                <p>Bonjour ${firstname},</p>
                <p>Votre mot de passe a bien été modifié.</p>
                <p style="color: #879191; font-size: 12px;">Si vous n'êtes pas à l'origine de cette modification, contactez un administrateur immédiatement.</p>
            </div>
        `
        })
    }


}

