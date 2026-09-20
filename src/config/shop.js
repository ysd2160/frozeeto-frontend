// Frontend ke default shop settings. Naam / GST / bill-output backend (/api/shop)
// se aakar overwrite ho jaate hain - asli settings backend/config/shop.js mein hain.
export const SHOP_DEFAULTS = {
  key: "frozen",
  name: "Frozetto",
  emoji: "❄️",
  logoUrl: "/logos/logo.png",
  signatureUrl: "", // backend se aata hai (backend/assets/logos/signature.png)
  address: "",
  phone: "",
  email: "",
  gstin: "",
  state: "",
  footer: "Thank you for your business!",
  requireCustomer: true, // naam + phone + address compulsory
  gstEnabled: true,
  output: { thermal: false, pdf: true, whatsapp: true },
  orderType: false, // Dine-in / Takeaway option billing par
};
