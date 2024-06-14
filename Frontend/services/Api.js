import Toast from "react-native-toast-message";
import {
  addStockFromSupplierOrder,
  getOrdersForSupplier,
  markSentSupplierOrder,
} from "../service_db/DBQuerys";

const API_URL = process.env.MAIL_KEY || "https://foodpass.onrender.com";
const MAIL_KEY = process.env.MAIL_KEY || null;
const RECIPIENT = process.env.RECIPIENT || null;

export const getDescriptors = async (base64Image) => {
  if (!base64Image)
    throw new error("Error: Tried to recognize faces with no image");
  try {
    const response = await fetch(API_URL + "/recognizeFaces", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ base64Image }),
    });
    if (response.ok) {
      const responseData = await response.json();
      return responseData;
    } else {
      Toast.show({
        type: "error",
        text1: "Failed to upload image",
        text2: `Error status: ${response.status}`,
      });
    }
  } catch (error) {
    Toast.show({
      type: "error",
      text1: "Error uploading image:",
      text2: error.message,
    });
  }
};

export const sendRestockEmail = async () => {
  if (!MAIL_KEY || !RECIPIENT) {
    return;
  }
  //Hacemos el pedido de restock pasado el horario de cierre para no enviar mas de un mail
  const isRestockTime = 22 <= new Date().getHours();
  if (!isRestockTime) return false;
  const orders = await getOrdersForSupplier();
  if (orders.length == 0) return false;
  const orderList = orders.reduce(
    (acc, val) => `${acc}\n- ${val.amount}x ${val.name}`,
    ""
  );
  try {
    const response = await fetch(API_URL + "/mail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        key: MAIL_KEY,
        mailOptions: {
          to: RECIPIENT,
          subject: "Food Restock",
          text: `Se solicita reponer el stock de los productos:${orderList}`,
        },
      }),
    });
    if (response.ok) {
      console.log("Email sent successfully");
      orders.forEach((order) => {
        markSentSupplierOrder(order.id);
        addStockFromSupplierOrder(order.id);
      });
      return true;
    } else {
      console.error("Email sending failed:", response.status);
    }
  } catch (error) {
    console.error("Error sending email:", error);
  }
  return false;
};

export const sendGuestEmail = async (recipient, dni, password) => {
  if (!MAIL_KEY) {
    return;
  }
  if (!recipient || !dni || !password) {
    console.error("Missing email, dni or password");
    return false;
  }
  try {
    const response = await fetch(API_URL + "/mail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        key: MAIL_KEY,
        mailOptions: {
          to: recipient,
          subject: "Estas invitad@ a usar FoodPass",
          text: `Has sido registrad@ en FoodPass, podras realizar y retirar pedidos desde las tablets del comedor con los siguientes datos.
          DNI: ${dni}
          CONTRASEÑA: ${password}`,
        },
      }),
    });
    if (response.ok) {
      console.log("Email sent successfully");
      return true;
    } else {
      console.error("Email sending failed:", response.status);
    }
  } catch (error) {
    console.error("Error sending email:", error);
  }
  return false;
};
