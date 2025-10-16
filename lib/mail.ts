import { Resend } from "resend";

const resend = new Resend(process.env.AUTH_RESEND_KEY);

export const sendEmailVerification = async (email: string, token: string) => {
  try {
    await resend.emails.send({
      from: `Sistema E.R.P. <info@werchow.store>`,
      to: email,
      subject: "Validación de correo electrónico",
      html: `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Validación de Correo Electrónico</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse; margin: 20px auto; border: 1px solid #cccccc; background-color: #ffffff;">
        <!-- Header -->
        <tr>
            <td align="center" bgcolor="#004AAD" style="padding: 40px 0 30px 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                Sistema E.R.P.
            </td>
        </tr>
        <!-- Body -->
        <tr>
            <td style="padding: 40px 30px 40px 30px;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                        <td style="color: #153643; font-size: 24px; font-weight: bold; text-align: center;">
                            Confirma tu dirección de correo
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 20px 0 30px 0; color: #153643; font-size: 16px; line-height: 24px; text-align: center;">
                            ¡Gracias por registrarte! Para completar tu registro y asegurar tu cuenta, por favor haz clic en el botón de abajo para verificar tu correo electrónico.
                        </td>
                    </tr>
                    <tr>
                        <td align="center">
                            <a href="${process.env.NEXTAUTH_URL}/api/auth/verify-email?token=${token}" style="background-color: #28a745; color: #ffffff; padding: 15px 25px; text-decoration: none; border-radius: 5px; display: inline-block; font-size: 16px; font-weight: bold;">Validar Correo Electrónico</a>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <!-- Footer -->
        <tr>
            <td bgcolor="#eeeeee" style="padding: 20px 30px; text-align: center; color: #666666; font-size: 12px;">
                Si no solicitaste este correo, puedes ignorarlo de forma segura.<br/>&copy; ${new Date().getFullYear()} Sistema E.R.P. Todos los derechos reservados.
            </td>
        </tr>
    </table>
</body>
</html>`,
    });

    return {
      success: true,
    };
  } catch (error) {
    console.log(error);
    return {
      error: true,
    };
  }
};
