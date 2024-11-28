import AiChats from "../models/aiChatModel.js";
import { OpenAI } from "openai";

// get all AI chats
export const getAiChats = async (req, res, next) => {
  try {
    const { userId } = req.body.user;
    const aiChats = await AiChats.find({ userId: userId });
    res.status(200).json({
      sucess: true,
      message: "successfully",
      data: aiChats,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// create new AI chat
export const createAiChats = async (req, res, next) => {
  try {
    const { userId } = req.body.user;
    const { message } = req.body;

    const reqAiChat = {
      userId: userId,
      role: "user",
      content: message,
    };
   const resAiChat = {
      userId: userId,
      role: "",
      content: "",
    };
    // create a openai system assistant
    const chats = [
      {
        role: "system",
        content:
          "You are an assistant called Tamkeen, specializing in information and advice related to disability. As the personal assistant for people with disabilities, your role is to provide accurate and actionable guidance to help train, qualify, and employ them, improving their daily lives and fostering independence. If the question is outside your specialty, kindly remind the user of your area of expertise and redirect them appropriately.",
      },
    ];
    // push the new message from user
    chats.push({ role: "user", content: message });
    // sent to the openai api
    //dangerouslyAllowBrowser: true,
    const openai = new OpenAI({ apiKey: process.env.OPEN_AI_SECRET });
    const completion = await openai.chat.completions.create({
      messages: chats,
      model: process.env.OPEN_AI_MODEL,
    });
    if (completion.choices[0].message.content === "tmkhc") {
      resAiChat.role = "assistant";
      resAiChat.content =
        "Your question seems out of Tamkeen context, I remind you that I am a special assistant for people with disabilities";
    } else {
      resAiChat.role = "assistant";
      resAiChat.content = completion.choices[0].message.content;
    }

    // save both req and res chat in db
    await AiChats.insertMany([reqAiChat, resAiChat]);
    res.status(200).json({
      sucess: true,
      message: "aiChat created successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

//delete aiChat (one)
export const deleteAiChat = async (req, res, next) => {
  try {
    const { id } = req.params;

    await AiChats.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

//delete all aiChats
export const deleteAllAiChats = async (req, res, next) => {
  try {
    const { userId } = req.body.user;

    await AiChats.deleteMany({ userId: userId });
    res.status(200).json({
      success: true,
      message: "Deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
