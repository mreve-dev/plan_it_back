import { Injectable } from '@nestjs/common';
import { TransactionalEmailsApi, TransactionalEmailsApiApiKeys, SendSmtpEmail } from '@getbrevo/brevo';

@Injectable()
export class MailService {

    private apiInstance = new TransactionalEmailsApi();

    constructor() {
        this.apiInstance.setApiKey(
            TransactionalEmailsApiApiKeys.apiKey,
            process.env.BREVO_API_KEY as string
        );
    }

    private async sendEmail(to: string, subject: string, html: string): Promise<void> {
        try {
            const email = new SendSmtpEmail();
            email.subject = subject;
            email.htmlContent = this.wrapTemplate(html);
            email.sender = { name: "Plan'it", email: 'morganereveau11@gmail.com' };
            email.to = [{ email: to }];

            await this.apiInstance.sendTransacEmail(email);
        } catch (error) {
            console.error('Erreur envoi email:', error);
        }
    }

    // Enveloppe commune : bandeau logo en haut, carte blanche centrale, pied de page
    private wrapTemplate(innerHtml: string): string {
        return `
        <!DOCTYPE html>
        <html>
        <body style="margin:0; padding:0; background-color:#ecece6; font-family: Arial, Helvetica, sans-serif;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#ecece6; padding: 32px 16px;">
                <tr>
                    <td align="center">
                        <table role="presentation" width="100%" style="max-width:480px;" cellpadding="0" cellspacing="0">

                            <!-- Bandeau logo -->
                            <tr>
                                <td align="center" style="padding-bottom:24px;">
                                    <span style="font-size:26px; font-weight:bold; color:#4f9288;">Plan</span><span style="font-size:26px; font-weight:bold; color:#9b6581;">'it</span>
                                    <span style="font-size:22px;">🏸</span>
                                </td>
                            </tr>

                            <!-- Carte principale -->
                            <tr>
                                <td style="background-color:#e6dabb; border-radius:16px; padding:32px 28px;">
                                    ${innerHtml}
                                </td>
                            </tr>

                            <!-- Pied de page -->
                            <tr>
                                <td align="center" style="padding-top:24px;">
                                    <p style="font-size:12px; color:#8a8f8f; margin:0;">
                                        Plan'it — gestion des bénévoles du club
                                    </p>
                                </td>
                            </tr>

                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
        `
    }

    // Bouton réutilisable, cohérent avec la charte
    private button(label: string, url: string): string {
        return `
        <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 24px 0;">
            <tr>
                <td style="background-color:#4f9288; border-radius:10px;">
                    <a href="${url}" style="display:inline-block; padding:13px 28px; font-size:15px; font-weight:bold; color:#ffffff; text-decoration:none;">
                        ${label}
                    </a>
                </td>
            </tr>
        </table>
        `
    }

    async sendWelcomeEmail(to: string, firstname: string, password: string) {
        const inner = `
            <span style="display:inline-block; background-color:rgba(79,146,136,0.18); color:#0f6e56; font-size:12px; font-weight:bold; padding:4px 12px; border-radius:999px;">
                Bienvenue
            </span>

            <h2 style="color:#104e64; font-size:21px; margin:14px 0 6px;">
                Salut ${firstname} !
            </h2>

            <p style="color:#104e64; font-size:14px; line-height:1.6; margin:0 0 18px;">
                Ton compte bénévole a été créé par un administrateur du club. Tu peux dès maintenant consulter les missions disponibles et t'inscrire aux créneaux qui t'intéressent.
            </p>

            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:12px; margin-bottom:6px;">
                <tr>
                    <td style="padding:16px 18px;">
                        <p style="margin:0 0 6px; font-size:12px; color:#5a7070; text-transform:uppercase; letter-spacing:0.04em;">Email</p>
                        <p style="margin:0 0 14px; font-size:14px; color:#104e64; font-weight:bold;">${to}</p>
                        <p style="margin:0 0 6px; font-size:12px; color:#5a7070; text-transform:uppercase; letter-spacing:0.04em;">Mot de passe temporaire</p>
                        <p style="margin:0; font-size:14px; color:#104e64; font-weight:bold;">${password}</p>
                    </td>
                </tr>
            </table>

            ${this.button('Accéder à mon compte', process.env.FRONTEND_URL as string)}

            <p style="color:#5a7070; font-size:12px; margin:0;">
                Pour des raisons de sécurité, il te sera demandé de changer ce mot de passe lors de ta première connexion.
            </p>
        `
        await this.sendEmail(to, `Plan'it - Bienvenue !`, inner)
    }

    async sendChangePasswordEmail(to: string, resetLink: string): Promise<void> {
        const inner = `
            <span style="display:inline-block; background-color:rgba(155,101,129,0.18); color:#7a3f5a; font-size:12px; font-weight:bold; padding:4px 12px; border-radius:999px;">
                Sécurité
            </span>

            <h2 style="color:#104e64; font-size:21px; margin:14px 0 6px;">
                Réinitialisation de mot de passe
            </h2>

            <p style="color:#104e64; font-size:14px; line-height:1.6; margin:0 0 18px;">
                Tu as demandé à réinitialiser ton mot de passe Plan'it. Clique sur le bouton ci-dessous pour en choisir un nouveau.
            </p>

            ${this.button('Réinitialiser mon mot de passe', resetLink)}

            <p style="color:#5a7070; font-size:12px; margin:0 0 4px;">
                Ce lien expire dans 1 heure.
            </p>
            <p style="color:#5a7070; font-size:12px; margin:0;">
                Si tu n'es pas à l'origine de cette demande, tu peux ignorer cet email.
            </p>
        `
        await this.sendEmail(to, `Plan'it - Réinitialisation de votre mot de passe`, inner)
    }

    async sendPasswordChangeConfirmation(to: string, firstname: string): Promise<void> {
        const inner = `
            <span style="display:inline-block; background-color:rgba(79,146,136,0.18); color:#0f6e56; font-size:12px; font-weight:bold; padding:4px 12px; border-radius:999px;">
                Confirmation
            </span>

            <h2 style="color:#104e64; font-size:21px; margin:14px 0 6px;">
                Mot de passe modifié
            </h2>

            <p style="color:#104e64; font-size:14px; line-height:1.6; margin:0 0 4px;">
                Bonjour ${firstname},
            </p>
            <p style="color:#104e64; font-size:14px; line-height:1.6; margin:0 0 18px;">
                Ton mot de passe Plan'it a bien été modifié.
            </p>

            <p style="color:#5a7070; font-size:12px; margin:0;">
                Si tu n'es pas à l'origine de cette modification, contacte un administrateur du club immédiatement.
            </p>
        `
        await this.sendEmail(to, `Plan'it - Votre mot de passe a été modifié`, inner)
    }

}