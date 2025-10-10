import { ethers } from "ethers";
import { ApiError } from "./apiError.js";

const CONTRACT_ABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "razorpay_order_id",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "razorpay_payment_id",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "currency",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "PaymentLogged",
    type: "event",
  },
  {
    inputs: [],
    name: "getPaymentsCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_razorpay_order_id",
        type: "string",
      },
      {
        internalType: "string",
        name: "_razorpay_payment_id",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "_currency",
        type: "string",
      },
    ],
    name: "logPayment",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "payments",
    outputs: [
      {
        internalType: "string",
        name: "razorpay_order_id",
        type: "string",
      },
      {
        internalType: "string",
        name: "razorpay_payment_id",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "currency",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
const { CONTRACT_ADDRESS, BLOCKCHAIN_RPC_URL, WALLET_PRIVATE_KEY } = process.env;

export const logPaymentToBlockchain = async (paymentData) => {
  if (!CONTRACT_ADDRESS || !BLOCKCHAIN_RPC_URL || !WALLET_PRIVATE_KEY) {
    console.warn("Blockchain environment variables are not configured. Skipping blockchain log.");
    return null;
  }

  try {
    const provider = new ethers.JsonRpcProvider(BLOCKCHAIN_RPC_URL);
    const wallet = new ethers.Wallet(WALLET_PRIVATE_KEY, provider);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet);

    const { razorpay_order_id, razorpay_payment_id, amount, currency } = paymentData;
    const amountInSmallestUnit = Math.round(amount * 100);

    const tx = await contract.logPayment(
      razorpay_order_id,
      razorpay_payment_id,
      amountInSmallestUnit,
      currency
    );

    await tx.wait();
    console.log("Payment logged to blockchain! Transaction hash:", tx.hash);
    return tx.hash;
  } catch (error) {
    throw new ApiError(500, "Error logging payment to blockchain", error);
  }
};
