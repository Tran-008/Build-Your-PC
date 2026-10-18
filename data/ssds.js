// SSDs — ASINs are BLANK. Every capacity variant needs its own ASIN.
// Find each at amazon.in/s?k=<model+capacity> then verify the exact product page.
const ssds = [
  {
    id: "samsung-990-pro-1tb",
    manufacturer: "Samsung", model: "990 PRO", capacity: "1TB",
    interface: "PCIe 4.0 x4 NVMe", readSpeed: 7450, writeSpeed: 6900,
    formFactor: "M.2 2280", tier: "High-end",
    asin: "", asinStatus: "Missing – find on amazon.in", image: null
  },
  {
    id: "samsung-990-pro-2tb",
    manufacturer: "Samsung", model: "990 PRO", capacity: "2TB",
    interface: "PCIe 4.0 x4 NVMe", readSpeed: 7450, writeSpeed: 6900,
    formFactor: "M.2 2280", tier: "High-end",
    asin: "", asinStatus: "Missing – find on amazon.in", image: null
  },
  {
    id: "samsung-990-pro-4tb",
    manufacturer: "Samsung", model: "990 PRO", capacity: "4TB",
    interface: "PCIe 4.0 x4 NVMe", readSpeed: 7450, writeSpeed: 7450,
    formFactor: "M.2 2280", tier: "High-end",
    asin: "", asinStatus: "Missing – find on amazon.in", image: null
  },
  {
    id: "samsung-990-evo-plus-1tb",
    manufacturer: "Samsung", model: "990 EVO Plus", capacity: "1TB",
    interface: "PCIe 4.0/5.0 x4 NVMe", readSpeed: 7250, writeSpeed: 6300,
    formFactor: "M.2 2280", tier: "Mid-range",
    asin: "", asinStatus: "Missing – find on amazon.in", image: null
  },
  {
    id: "samsung-990-evo-plus-2tb",
    manufacturer: "Samsung", model: "990 EVO Plus", capacity: "2TB",
    interface: "PCIe 4.0/5.0 x4 NVMe", readSpeed: 7250, writeSpeed: 6300,
    formFactor: "M.2 2280", tier: "Mid-range",
    asin: "", asinStatus: "Missing – find on amazon.in", image: null
  },
  {
    id: "samsung-990-evo-plus-4tb",
    manufacturer: "Samsung", model: "990 EVO Plus", capacity: "4TB",
    interface: "PCIe 4.0/5.0 x4 NVMe", readSpeed: 7250, writeSpeed: 6300,
    formFactor: "M.2 2280", tier: "Mid-range",
    asin: "", asinStatus: "Missing – find on amazon.in", image: null
  },
  {
    id: "samsung-980-pro-1tb",
    manufacturer: "Samsung", model: "980 PRO", capacity: "1TB",
    interface: "PCIe 4.0 x4 NVMe", readSpeed: 7000, writeSpeed: 5000,
    formFactor: "M.2 2280", tier: "High-end",
    asin: "", asinStatus: "Missing – find on amazon.in", image: null
  },
  {
    id: "samsung-980-pro-2tb",
    manufacturer: "Samsung", model: "980 PRO", capacity: "2TB",
    interface: "PCIe 4.0 x4 NVMe", readSpeed: 7000, writeSpeed: 5100,
    formFactor: "M.2 2280", tier: "High-end",
    asin: "", asinStatus: "Missing – find on amazon.in", image: null
  },
  {
    id: "wd-black-sn850x-1tb",
    manufacturer: "WD", model: "Black SN850X", capacity: "1TB",
    interface: "PCIe 4.0 x4 NVMe", readSpeed: 7300, writeSpeed: 6300,
    formFactor: "M.2 2280", tier: "High-end",
    asin: "", asinStatus: "Missing – find on amazon.in", image: null
  },
  {
    id: "wd-black-sn850x-2tb",
    manufacturer: "WD", model: "Black SN850X", capacity: "2TB",
    interface: "PCIe 4.0 x4 NVMe", readSpeed: 7300, writeSpeed: 6600,
    formFactor: "M.2 2280", tier: "High-end",
    asin: "", asinStatus: "Missing – find on amazon.in", image: null
  },
  {
    id: "wd-black-sn850x-4tb",
    manufacturer: "WD", model: "Black SN850X", capacity: "4TB",
    interface: "PCIe 4.0 x4 NVMe", readSpeed: 7300, writeSpeed: 6600,
    formFactor: "M.2 2280", tier: "High-end",
    asin: "", asinStatus: "Missing – find on amazon.in", image: null
  },
  {
    id: "wd-black-sn770-1tb",
    manufacturer: "WD", model: "Black SN770", capacity: "1TB",
    interface: "PCIe 4.0 x4 NVMe", readSpeed: 5150, writeSpeed: 4900,
    formFactor: "M.2 2280", tier: "Mid-range",
    asin: "", asinStatus: "Missing – find on amazon.in", image: null
  },
  {
    id: "wd-black-sn770-2tb",
    manufacturer: "WD", model: "Black SN770", capacity: "2TB",
    interface: "PCIe 4.0 x4 NVMe", readSpeed: 5150, writeSpeed: 4850,
    formFactor: "M.2 2280", tier: "Mid-range",
    asin: "", asinStatus: "Missing – find on amazon.in", image: null
  },
  {
    id: "wd-blue-sn580-2tb",
    manufacturer: "WD", model: "Blue SN580", capacity: "2TB",
    interface: "PCIe 4.0 x4 NVMe", readSpeed: 4150, writeSpeed: 4150,
    formFactor: "M.2 2280", tier: "Budget",
    asin: "", asinStatus: "Missing – find on amazon.in", image: null
  },
  {
    id: "crucial-t500-1tb",
    manufacturer: "Crucial", model: "T500", capacity: "1TB",
    interface: "PCIe 4.0 x4 NVMe", readSpeed: 7400, writeSpeed: 7000,
    formFactor: "M.2 2280", tier: "High-end",
    asin: "", asinStatus: "Missing – find on amazon.in", image: null
  },
  {
    id: "crucial-t705-2tb",
    manufacturer: "Crucial", model: "T705", capacity: "2TB",
    interface: "PCIe 5.0 x4 NVMe", readSpeed: 14500, writeSpeed: 12700,
    formFactor: "M.2 2280", tier: "Enthusiast",
    asin: "", asinStatus: "Missing – find on amazon.in", image: null
  },
  {
    id: "crucial-p3-plus-1tb",
    manufacturer: "Crucial", model: "P3 Plus", capacity: "1TB",
    interface: "PCIe 4.0 x4 NVMe", readSpeed: 4700, writeSpeed: 1900,
    formFactor: "M.2 2280", tier: "Budget",
    asin: "", asinStatus: "Missing – find on amazon.in", image: null
  },
  {
    id: "crucial-p3-plus-2tb",
    manufacturer: "Crucial", model: "P3 Plus", capacity: "2TB",
    interface: "PCIe 4.0 x4 NVMe", readSpeed: 4800, writeSpeed: 1900,
    formFactor: "M.2 2280", tier: "Budget",
    asin: "", asinStatus: "Missing – find on amazon.in", image: null
  },
  {
    id: "kingston-kc3000-1tb",
    manufacturer: "Kingston", model: "KC3000", capacity: "1TB",
    interface: "PCIe 4.0 x4 NVMe", readSpeed: 7000, writeSpeed: 6000,
    formFactor: "M.2 2280", tier: "High-end",
    asin: "", asinStatus: "Missing – find on amazon.in", image: null
  },
  {
    id: "kingston-nv3-1tb",
    manufacturer: "Kingston", model: "NV3", capacity: "1TB",
    interface: "PCIe 4.0 x4 NVMe", readSpeed: 6000, writeSpeed: 4000,
    formFactor: "M.2 2280", tier: "Budget",
    asin: "", asinStatus: "Missing – find on amazon.in", image: null
  },
  {
    id: "kingston-nv3-2tb",
    manufacturer: "Kingston", model: "NV3", capacity: "2TB",
    interface: "PCIe 4.0 x4 NVMe", readSpeed: 6000, writeSpeed: 5000,
    formFactor: "M.2 2280", tier: "Budget",
    asin: "", asinStatus: "Missing – find on amazon.in", image: null
  }
];
