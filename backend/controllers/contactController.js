import Contact from "../models/contactModel.js";
import { sendEmail } from "../utils/sendEmail.js";

export const submitContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // validation
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    //  Save message in DB
    await Contact.create({ name, email, message });

    //  Emit socket event (safe)
    const io = req.app.get("io");
    if (io) {
      io.emit("new_contact_message");
    }

    //  SEND EMAIL TO ADMIN 
    await sendEmail({
      to: process.env.MAIL_USER,  
      subject: "New Contact Message - Homespace",
      text: `
Name: ${name}
Email: ${email}

Message:
${message}
      `,
    });

    // success response
    res.status(201).json({
      success: true,
      message: "Message sent successfully",
    });
  } catch (err) {
    console.error("CONTACT ERROR:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
