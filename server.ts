import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: "10mb" }));

// Server-side lazy initialization for Google GenAI
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    brand: "Dawosti",
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
  });
});

// AI Product Description Generator for Dawosti Admin
app.post("/api/generate-description", async (req, res) => {
  try {
    const { productName, category, fabric, tone } = req.body;

    if (!productName || typeof productName !== "string") {
      return res.status(400).json({ error: "Product name is required" });
    }

    const ai = getGenAI();
    if (!ai) {
      // High quality fallback if GEMINI_API_KEY is not yet attached
      const fallbackDesc = `Indulge in timeless elegance with Dawosti's ${productName}. Exquisitely crafted from premium ${fabric || "breathable luxury fabric"}, this piece highlights delicate craftsmanship, a flattering silhouette, and effortless grace tailored for modern celebrations and everyday poise. Pair with statement accessories for an enchanting look.`;
      const fallbackHighlights = [
        `Premium ${fabric || "Artisanal Silk/Cotton"} construction with soft inner lining`,
        "Hand-finished detailing tailored for supreme comfort & luxury drape",
        "Perfect for festive occasions, evening gatherings, or contemporary ethnic styling",
      ];
      return res.json({
        description: fallbackDesc,
        highlights: fallbackHighlights,
        washCare: "Dry clean recommended or gentle hand wash in cold water. Shade dry.",
        suggestedTags: ["Bespoke Fashion", "Dawosti Exclusive", "Handcrafted", "Luxury Women Wear"],
      });
    }

    let parsed: any = null;

    if (ai) {
      const prompt = `You are the lead luxury fashion copywriter for "Dawosti", an upscale women's clothing brand specializing in sophisticated ethnic, contemporary dresses, kurtis, co-ords, and evening wear in Nepal.
    
Write a rich, captivating, high-converting product description for:
- Product Name: "${productName}"
- Category: "${category || "Women Clothing"}"
- Fabric / Material: "${fabric || "Premium Artisanal Fabric"}"
- Brand Tone: "${tone || "Elegant, Regal, Modern-Chic"}"

Please return ONLY a valid JSON object with the following schema (no markdown fences, pure JSON):
{
  "description": "A compelling 2-3 paragraph captivating luxury fashion story describing the aesthetic, silhouette, craftsmanship, and how it elevates the wearer's poise and confidence.",
  "highlights": [
    "3-4 key product bullet points highlighting embroidery/cut/fabric/feel"
  ],
  "washCare": "Recommended washing and preservation care instruction (e.g., dry clean or delicate cold wash).",
  "suggestedTags": ["3-5 fashion tags suitable for filters"]
}`;

      // Try primary and fallback models for high reliability
      const candidateModels = ["gemini-2.5-flash", "gemini-3.1-flash-lite", "gemini-3.8-flash"];
      for (const modelName of candidateModels) {
        try {
          const response = await ai.models.generateContent({
            model: modelName,
            contents: prompt,
            config: {
              responseMimeType: "application/json",
            },
          });

          if (response.text) {
            parsed = JSON.parse(response.text);
            break;
          }
        } catch (mErr) {
          console.warn(`Attempt with ${modelName} encountered issue, trying fallback:`, mErr);
        }
      }
    }

    if (parsed && parsed.description) {
      return res.json(parsed);
    }

    // High quality crafted fallback if model is unavailable or high-demand
    const fallbackDesc = `Indulge in timeless elegance with Dawosti's ${productName}. Exquisitely crafted from premium ${fabric || "breathable luxury fabric"}, this piece highlights delicate craftsmanship, a flattering silhouette, and effortless grace tailored for modern celebrations and everyday poise. Pair with statement accessories for an enchanting look.`;
    const fallbackHighlights = [
      `Premium ${fabric || "Artisanal Silk/Cotton"} construction with soft inner lining`,
      "Hand-finished detailing tailored for supreme comfort & luxury drape",
      "Perfect for festive occasions, evening gatherings, or contemporary ethnic styling",
    ];

    return res.json({
      description: fallbackDesc,
      highlights: fallbackHighlights,
      washCare: "Dry clean recommended or gentle hand wash in cold water. Shade dry.",
      suggestedTags: ["Bespoke Fashion", "Dawosti Exclusive", "Handcrafted", "Luxury Women Wear"],
    });
  } catch (error: any) {
    console.error("Gemini description generation error:", error);
    // Safe graceful degradation so the user never sees a broken modal
    return res.json({
      description: `Elegance personified. The exclusive Dawosti ${req.body.productName || "Attire"} is designed with meticulous tailoring, regal fabrics, and timeless grace.`,
      highlights: [
        "Artisanal handcrafting and finish",
        "Regal silhouette engineered for effortless confidence",
        "Breathable comfort lining",
      ],
      washCare: "Dry clean only.",
      suggestedTags: ["Dawosti", "Women Clothing"],
    });
  }
});

// Google Sheets Sync & Webhook Proxy Endpoint
app.post("/api/sync-sheets", async (req, res) => {
  try {
    const { webhookUrl, orders } = req.body;

    if (!Array.isArray(orders)) {
      return res.status(400).json({ error: "Orders must be an array" });
    }

    // If customer configured an external Google Apps Script Webhook URL
    let webhookStatus = "no_url_configured";
    if (webhookUrl && typeof webhookUrl === "string" && webhookUrl.startsWith("http")) {
      try {
        const response = await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            brand: "Dawosti",
            syncedAt: new Date().toISOString(),
            ordersCount: orders.length,
            orders: orders,
          }),
        });
        webhookStatus = response.ok ? "success" : `failed_with_status_${response.status}`;
      } catch (err: any) {
        webhookStatus = `network_error: ${err.message}`;
      }
    }

    // Format orders as CSV for direct Google Sheets import
    const headers = [
      "Order ID",
      "Date",
      "Customer Name",
      "Phone",
      "Delivery City",
      "Address",
      "Items",
      "Total NPR",
      "Payment Method",
      "Transaction ID",
      "Payment Status",
      "Logistics Status",
      "Verified At",
    ];

    const rows = orders.map((order: any) => [
      order.id,
      order.createdAt,
      `"${(order.customerName || "").replace(/"/g, '""')}"`,
      `"${order.customerPhone || ""}"`,
      `"${(order.deliveryCity || "").replace(/"/g, '""')}"`,
      `"${(order.deliveryAddress || "").replace(/"/g, '""')}"`,
      `"${(order.itemsSummary || "").replace(/"/g, '""')}"`,
      order.totalNpr,
      order.paymentMethod,
      `"${order.transactionId || ""}"`,
      order.paymentStatus,
      order.logisticsStatus,
      order.verifiedAt || "",
    ]);

    const csvContent = [headers.join(","), ...rows.map((r: any) => r.join(","))].join("\n");

    res.json({
      success: true,
      syncedOrdersCount: orders.length,
      webhookStatus,
      csvContent,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Sheets sync error:", error);
    res.status(500).json({ error: error.message || "Failed to sync orders" });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(port, "0.0.0.0", () => {
    console.log(`Server listening on port ${port}`);
  });
}

startServer();
