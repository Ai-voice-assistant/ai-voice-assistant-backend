import { generateOTP } from "../lib/generateOTP.js";
import { sendMail } from "../lib/sendMail.js";
import { prisma } from "../prisma/prisma.js";

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).send({ message: "body data is incomplete." });
    }
    const isThere = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (isThere) {
      if (!isThere.active) {
        const otp = await sendMail(email);
        await prisma.otp.update({
          where: {
            email,
          },
          data: {
            otp,
          },
        });
        return res.status(202).send({
          message: "please verify your email with otp.",
        });
      } else {
        return res.status(400).send({ message: "Email already exist" });
      }
    }
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password,
      },
    });
    console.log(email, "signup email");
    const otp = await sendMail(email);
    const emailIsThere = await prisma.otp.findUnique({
      where: {
        email,
      },
    });
    if (emailIsThere) {
    } else {
      await prisma.otp.create({
        data: {
          otp,
          email,
        },
      });
    }
    console.log(process.env.OTP);
    return res.status(201).send({ message: "user created.", user: newUser });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "server error." });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send({ message: "body data is incomplete." });
    }
    const isThere = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    console.log(isThere, "logged in user data");
    if (!isThere) {
      return res.status(404).send({ message: "Email not registered" });
    }
    if (password !== isThere.password) {
      return res.status(400).send({ message: "Invalid password" });
    }
    if (!isThere.active) {
      return res.status(400).send({ message: "Email is unverified" });
    }
    return res
      .status(200)
      .send({ message: "Login successfully !!", data: isThere });
  } catch (error) {
    return res.status(500).send({ message: "server error." });
  }
};

export const verify = async (req, res) => {
  const { otp, email } = req.body;
  const validotp = await prisma.otp.findFirst({
    where: {
      email,
    },
  });
  if (otp == validotp?.otp) {
    const user = await prisma.user.update({
      where: {
        email,
      },
      data: {
        active: true,
      },
    });
    res.send({ success: true, data: user });
  } else {
    res.send({ success: false });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.query;
  if (!id) {
    return res.status(404).send({ message: "id not given." });
  }
  const isThere = await prisma.user.findUnique({
    where: {
      id,
    },
  });
  if (isThere) {
    const user = await prisma.user.delete({
      where: {
        id,
      },
    });
    await prisma.otp.delete({
      where: {
        email: user.email,
      },
    });
    return res.status(200).send({ message: "user deleted successfully." });
  } else {
    return res.status(404).send({ message: "user not found." });
  }
};

export const getAllUser = async (req, res) => {
  const users = await prisma.user.findMany();
  return res.status(200).send(users);
};
