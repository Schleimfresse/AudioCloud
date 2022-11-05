import lib from "../lib/lib.mjs";
import authLib from "../UserAuth/Lib/lib.mjs";
import nodemailer from "nodemailer";
let Verify: any = {};
export default Verify;

Verify.root = async (req, res) => {
	const code = lib.random6DigitNum();
	lib.code_database.insert({ code: code, user: req.user.username });
	let transporter = nodemailer.createTransport({
		service: "gmail",
		host: "smtp.gmail.com",
		port: 587,
		secure: false,
		auth: {
			user: "linuxlinusgenz@gmail.com",
			pass: "elkxxmjyhdchntmb",
		},
	});
	let info = await transporter.sendMail({
		from: '"AudioCloud" <no-reply@audiocloud.com>',
		to: "linuslinuxgenz@gmail.com" /*req.user.email*/,
		subject: "Verification code for your AudioCloud account",
		text: "Your verification code is ${code}",
		html: `<h1>Verification code</h1><b>Your verification code is ${code}</b><p>If you have not made this request, you do not need to do anything.</p>AudioCloud`,
	});

	console.log("Message sent: %s", info.messageId);
	res.status(200).sendFile(__dirname + "/public/html/verify.html");
};

Verify.post = async (req, res) => {
	const code = lib.random6DigitNum();
	let transporter = nodemailer.createTransport({
		service: "gmail",
		host: "smtp.gmail.com",
		port: 587,
		secure: false,
		auth: {
			user: "linuxlinusgenz@gmail.com",
			pass: "elkxxmjyhdchntmb",
		},
	});

	let info = await transporter.sendMail({
		from: '"AudioCloud" <no-reply@audiocloud.com>',
		to: "linuslinuxgenz@gmail.com" /*req.user.email*/,
		subject: "Verification code for your AudioCloud account",
		text: "Your verification code is ${code}",
		html: `<h1>Verification code</h1><b>Your verification code is ${code}</b><p>If you have not made this request, you do not need to do anything.</p>AudioCloud`,
	});

	console.log("Message sent: %s", info.messageId);
};

Verify.activate = (req, res) => {
	let code = req.body.code;
	lib.code_database.findOne({ code: parseInt(code) }, (err: Error, data: any) => {
		if (err || data == "" || data == null) {
			return res.status(200).render(__dirname + "/public/views/auth.ejs", {
				heading: "Failed",
				desc: "Your authentication code has expired or you have entered an incorrect one!",
				type: "Back to Verify",
				link: "verify",
			});
		} else {
			lib.code_database.remove({ code: parseInt(code) });
			authLib.database.update(
				{ username: data.user },
				{ $set: { tfa: true } },
				{},
				(err: Error, count: number) => {
					if (err) {
						return res.status(200).render(__dirname + "/public/views/auth.ejs", {
							heading: "Internal Server Error",
							desc: "Could not access required recources",
							type: "Back to Verify",
							link: "verify",
						});
					}
				}
			);
			return res.status(200).render(__dirname + "/public/views/auth.ejs", {
				heading: "Success",
				desc: "You have been successfully two-factor authenticated!",
				type: "Home",
				link: "",
			});
		}
	});
};
