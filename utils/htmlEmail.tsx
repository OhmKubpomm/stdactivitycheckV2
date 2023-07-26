export function html({url, text}: {url: string, text: string}) {
    return `
    <title>Welcome to stdActivitycheck</title>
    <table width="100%" border="0" cellspacing="0" cellpadding="0">
    <tr>
        <td>
            <table bgcolor="#4CAF50" align="center" cellspacing="0" cellpadding="0" border="0" style="margin: auto;">
                <tr>
                    <td bgcolor="#4CAF50" style="padding: 20px; text-align: center; color: white;">
                        <h1>Welcome to stdActivitycheck</h1>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 20px; text-align: center;">
                        <h2>Congratulations on signing up!</h2>
                        <p>Please click the button below to complete your signup.</p>
                    </td>
                </tr>
                <tr>
                    <td style="text-align: center;">
                        <table border="0" cellspacing="0" cellpadding="0" align="center">
                            <tr>
                                <td align="center" style="background-color: #008000; border-radius: 5px;">
                                    <a href="${url}" target="_blank" style="display: inline-block; padding: 12px 25px; font-family: Helvetica, Arial, sans-serif; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 5px;">
                                        ${text}
                                    </a>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 20px; text-align: center; background-color: #f5f5f5; font-size: 14px;">
                        <p>If the button doesn't work, you can click the link below:</p>
                        <a href="${url}">${url}</a>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>


    `
}