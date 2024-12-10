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
    const { userProfile } = req.body;
    const username = `${userProfile.firstName} ${userProfile.lastName}`;
    /* const disabilities = [];
    if (userProfile.isMental) disabilities.push("Mental");
    if (userProfile.isMotor) disabilities.push("Motor");
    if (userProfile.isHearing) disabilities.push("Hearing");
    if (userProfile.isVisual) disabilities.push("Visual");
    if (userProfile.isPsychological) disabilities.push("Psychological");
    let disabilitiesList = disabilities.join(", "); */
    const disabilities = [
      userProfile.isMental && "Mental",
      userProfile.isMotor && "Motor",
      userProfile.isHearing && "Hearing",
      userProfile.isVisual && "Visual",
      userProfile.isPsychological && "Psychological",
    ].filter(Boolean);
    const disabilitiesList = disabilities.join(", ");
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
    // Fetch previous chats from DB to build the conversation
    const previousChats = await AiChats.find({ userId }).sort({ createdAt: 1 });
    // System message
    const systemMessage = {
      role: "system",
      content: `You are an assistant called Tamkeen, specializing in information and advice related to disability. As the personal assistant for ${username}, who is interested in or affected by the following disabilities: ${disabilitiesList}, your role is to provide accurate and actionable guidance to help train, qualify, and employ them, improving their daily lives and fostering independence. If a question is outside your specialty, you should still attempt to provide general guidance, while prioritizing any connection to their disabilities or interests when possible. Kindly remind the user of your focus on disabilities but remain open to broader topics.`,
    };
    // Build chat messages
    const chats = [
      systemMessage,
      ...previousChats.map((chat) => ({
        role: chat.role,
        content: chat.content,
      })),
      { role: "user", content: message },
    ];
    // sent to the openai api
    //dangerouslyAllowBrowser: true,
    const openai = new OpenAI({ apiKey: process.env.OPEN_AI_SECRET });
    const completion = await openai.chat.completions.create({
      messages: chats,
      model: process.env.OPEN_AI_MODEL,
    });
    resAiChat.role = "assistant";
    resAiChat.content = completion.choices[0].message.content;

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
