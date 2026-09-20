import React, { useState } from "react";
import { amountToWords } from "../utils/numberToWords.js";

// PDF (backend/utils/pdfGenerator.js) jaisa hi Tax Invoice layout - screen preview ke liye.
// Layout badlo to dono jagah badalna.
const ACCENT = "#6C5CE0";
const ACCENT_LIGHT = "#F3F1FD";
const MUTED = "#6B7280";
const DARK = "#1F2937";

const money = (n) => `₹${Number(n || 0).toFixed(2)}`;
const fmtDate = (d) =>
  new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kolkata", day: "2-digit", month: "2-digit", year: "numeric" })
    .format(new Date(d))
    .replace(/\//g, "-");

// Image na mile to chupchaap gayab (kuch tootta nahi)
const SafeImg = ({ src, style, alt }) => {
  const [failed, setFailed] = useState(false);
  if (!src || failed) return null;
  return <img src={src} alt={alt} style={style} onError={() => setFailed(true)} />;
};

const th = (align = "left", extra = {}) => ({
  padding: "8px 6px",
  textAlign: align,
  fontWeight: 700,
  fontSize: 12,
  color: "#fff",
  ...extra,
});

const InvoicePreview = ({ bill, shop }) => {
  const gst = !!shop.gstEnabled;
  const totalQty = bill.items.reduce((s, i) => s + i.quantity, 0);
  const sgst = bill.totalGst / 2;
  const rates = [...new Set(bill.items.map((i) => i.gstPercent).filter((p) => p > 0))];
  const half = rates.length === 1 ? `@${rates[0] / 2}%` : "";

  const sumRow = (label, value, opts = {}) => (
    <div
      key={label}
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "4px 8px",
        fontSize: opts.bold ? 13 : 12,
        fontWeight: opts.bold ? 700 : 400,
        background: opts.highlight ? ACCENT_LIGHT : "transparent",
        color: opts.red ? "#DC2626" : DARK,
      }}
    >
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );

  return (
    <div
      style={{
        width: 794,
        minHeight: 1123,
        boxSizing: "border-box",
        padding: 53,
        background: "#fff",
        color: DARK,
        fontFamily: "'DejaVu Sans', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        fontSize: 12,
        lineHeight: 1.45,
      }}
    >
      {/* ---------- Letterhead ---------- */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", paddingBottom: 12, borderBottom: `2px solid ${ACCENT}` }}>
        <div style={{ maxWidth: 480, color: MUTED, fontSize: 12 }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: DARK, marginBottom: 2 }}>{shop.name}</div>
          {shop.address && <div>{shop.address}</div>}
          {shop.phone && <div>Phone no.: {shop.phone}</div>}
          {shop.email && <div>Email: {shop.email}</div>}
          {gst && shop.gstin && <div>GSTIN: {shop.gstin}</div>}
          {gst && shop.state && <div>State: {shop.state}</div>}
        </div>
        <SafeImg src={shop.logoUrl} alt={shop.name} style={{ width: 100, height: 100, objectFit: "contain" }} />
      </div>

      <div style={{ textAlign: "center", fontSize: 21, fontWeight: 700, color: ACCENT, margin: "16px 0 22px" }}>
        {gst ? "Tax Invoice" : "Bill"}
      </div>

      {/* ---------- Bill To / Invoice Details ---------- */}
      <div style={{ display: "flex", justifyContent: "space-between", gap: 24, marginBottom: 24 }}>
        <div style={{ maxWidth: 380 }}>
          <div style={{ fontWeight: 700, fontSize: 13 }}>Bill To</div>
          <div style={{ fontWeight: 700, fontSize: 15, marginTop: 6 }}>{bill.customerName || "Walk-in Customer"}</div>
          {bill.customerAddress && <div style={{ color: MUTED, marginTop: 3, whiteSpace: "pre-line" }}>{bill.customerAddress}</div>}
          {bill.customerPhone && <div style={{ color: MUTED, marginTop: 3 }}>Contact No.: {bill.customerPhone}</div>}
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontWeight: 700, fontSize: 13 }}>Invoice Details</div>
          <div style={{ color: MUTED, marginTop: 6 }}>Invoice No.: {bill.billNumber}</div>
          <div style={{ color: MUTED, marginTop: 3 }}>Date: {fmtDate(bill.createdAt)}</div>
        </div>
      </div>

      {/* ---------- Items ---------- */}
      <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
        <colgroup>
          <col style={{ width: 30 }} />
          <col />
          {gst && <col style={{ width: 80 }} />}
          <col style={{ width: 62 }} />
          <col style={{ width: 52 }} />
          <col style={{ width: 88 }} />
          {gst && <col style={{ width: 100 }} />}
          <col style={{ width: 100 }} />
        </colgroup>
        <thead>
          <tr style={{ background: ACCENT }}>
            <th style={th("left", { paddingLeft: 8 })}>#</th>
            <th style={th()}>Item Name</th>
            {gst && <th style={th()}>HSN/SAC</th>}
            <th style={th("right")}>Qty</th>
            <th style={th("left", { paddingLeft: 12 })}>Unit</th>
            <th style={th("right")}>Price/Unit</th>
            {gst && <th style={th("right")}>GST</th>}
            <th style={th("right", { paddingRight: 8 })}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {bill.items.map((item, idx) => (
            <tr key={idx} style={{ background: idx % 2 === 1 ? ACCENT_LIGHT : "transparent", verticalAlign: "top" }}>
              <td style={{ padding: "8px 6px 8px 8px", fontWeight: 700 }}>{idx + 1}</td>
              <td style={{ padding: "8px 6px", fontWeight: 700, wordBreak: "break-word" }}>{item.name}</td>
              {gst && <td style={{ padding: "8px 6px" }}>{item.hsn || "-"}</td>}
              <td style={{ padding: "8px 6px", textAlign: "right" }}>{item.quantity}</td>
              <td style={{ padding: "8px 6px 8px 12px" }}>{item.unit}</td>
              <td style={{ padding: "8px 6px", textAlign: "right" }}>{money(item.price)}</td>
              {gst && (
                <td style={{ padding: "8px 6px", textAlign: "right", fontSize: 11 }}>
                  {money(item.gstAmount)}
                  <br />({item.gstPercent}%)
                </td>
              )}
              <td style={{ padding: "8px 8px 8px 6px", textAlign: "right" }}>{money(item.lineTotal + item.gstAmount)}</td>
            </tr>
          ))}
          <tr style={{ borderTop: "1px solid #D1D5DB", fontWeight: 700 }}>
            <td colSpan={gst ? 3 : 2} style={{ padding: "8px 6px 8px 8px" }}>Total</td>
            <td style={{ padding: "8px 6px", textAlign: "right" }}>{totalQty}</td>
            <td />
            <td />
            {gst && <td style={{ padding: "8px 6px", textAlign: "right" }}>{money(bill.totalGst)}</td>}
            <td style={{ padding: "8px 8px 8px 6px", textAlign: "right" }}>{money(bill.grandTotal)}</td>
          </tr>
        </tbody>
      </table>

      {/* ---------- Amount in words + Summary ---------- */}
      <div style={{ display: "flex", justifyContent: "space-between", gap: 24, marginTop: 22 }}>
        <div style={{ maxWidth: 340 }}>
          <div style={{ fontWeight: 700 }}>Invoice Amount In Words</div>
          <div style={{ color: MUTED, marginTop: 3 }}>{amountToWords(bill.grandTotal)}</div>
          {bill.payments?.length > 1 && (
            <div style={{ color: MUTED, fontSize: 11, marginTop: 14 }}>
              Paid via — {bill.payments.map((p) => `${p.mode}: ${money(p.amount)}`).join("  •  ")}
            </div>
          )}
        </div>

        <div style={{ width: 287 }}>
          {sumRow("Sub Total", money(bill.subtotal))}
          {gst && sumRow(`SGST${half}`, money(sgst))}
          {gst && sumRow(`CGST${half}`, money(sgst))}
          {bill.discount > 0 && sumRow("Discount", `- ${money(bill.discount)}`)}
          {sumRow("Total", money(bill.grandTotal), { bold: true, highlight: true })}
          {sumRow("Received", money(bill.amountPaid))}
          {bill.changeReturned > 0 && sumRow("Cash Given", money(bill.cashReceived))}
          {bill.changeReturned > 0 && sumRow("Change Returned", money(bill.changeReturned))}
          {sumRow("Balance", money(bill.balanceDue), bill.balanceDue > 0 ? { bold: true, red: true } : {})}

          {/* ---------- Signature ---------- */}
          <div style={{ textAlign: "center", marginTop: 40 }}>
            <div style={{ fontSize: 12 }}>For: {shop.name}</div>
            <div style={{ height: 72, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <SafeImg src={shop.signatureUrl} alt="Signature" style={{ maxWidth: 190, maxHeight: 66, objectFit: "contain" }} />
            </div>
            <div style={{ fontWeight: 700, fontSize: 12 }}>Authorized Signatory</div>
          </div>
        </div>
      </div>

      <div style={{ textAlign: "center", fontStyle: "italic", color: MUTED, marginTop: 36 }}>
        {shop.footer || "Thank you for your business!"}
      </div>
    </div>
  );
};

export default InvoicePreview;
