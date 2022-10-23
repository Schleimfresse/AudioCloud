import lib from "../lib/lib.mjs";
import nodemailer from "nodemailer";
let Verify = {};
export default Verify;
Verify.root = async (req, res) => {
    const code = lib.random6DigitNum();
    lib.code_database.insert({ code: code });
    const Account = await nodemailer.createTestAccount();
    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        name: 'example.com',
        auth: {
            user: Account.user,
            pass: Account.pass,
        },
    });
    let info = await transporter.sendMail({
        from: '"AudioCloud" <no-reply@audiocloud.com>',
        to: "linuslinuxgenz@gmail.com" /*req.user.email*/,
        subject: "Hello ✔",
        text: "Hello world?",
        html: `<b>Hello world? Your verification code is ${code}</b>`,
    });
    console.log("Message sent: %s", info.messageId);
    res.status(200).sendFile(__dirname + "/public/html/verify.html");
};
Verify.post = async (req, res) => {
    const Account = await nodemailer.createTestAccount();
    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
            user: Account.user,
            pass: Account.pass,
        },
    });
    let info = await transporter.sendMail({
        from: '"AudioCloud" <no-reply@audiocloud.com>',
        to: req.user.email,
        subject: "Hello ✔",
        text: "Hello world?",
        html: "<b>Hello world?</b>",
    });
    console.log("Message sent: %s", info.messageId);
};
Verify.activate = (req, res) => {
    let code = req.body.code;
    console.log(code);
};
//# sourceMappingURL=verify.mjs.map