// ============================================
// SITE CONFIGURATION
// This is the ONLY file that should contain
// school-specific information. Every page pulls
// its content from here — to reuse this whole
// website for a different school later, you would
// only need to edit THIS file.
// ============================================

const SITE_CONFIG = {
  // Basic identity
  orgName: "Annada Qur'an & Science Academy",
  orgNameArabic: "أَنَدَة أكاديمية القرآن والعلوم",
  shortName: "Annada Academy",
  established: 2018,
  motto: "Faith • Learning • Discovery",
  tagline: "Qur'anic values. Scientific knowledge. Excellent character.",

  // Location
  address: {
    line1: "Kudan, Kudan LGA",
    line2: "Kaduna State, Nigeria"
  },

  // Contact
  contact: {
    phone1: "09136392655",
    phone2: "09015960031",
    email: "annadaacademy@gmail.com",
    whatsapp: "" // add once you confirm a WhatsApp business number
  },

  // Social media (leave blank until real links exist)
  social: {
    facebook: "",
    instagram: "",
    twitter: ""
  },

  // Mission / Vision (provisional — replace with official wording if available)
  mission: "Annada Qur'an & Science Academy exists to nurture children in the memorization and understanding of the Qur'an alongside a rigorous foundation in science and modern education, raising students of strong faith, sound character, and academic excellence.",
  vision: "To be a leading model in Kaduna State — and beyond — for Islamic education that integrates authentic Qur'anic learning with scientific inquiry, producing graduates equipped for both this world and the hereafter.",

  // Brand colors, pulled from the official logo
  colors: {
    navy: "#1B2A4A",
    gold: "#C9A24B",
    cream: "#F7F3EC",
    green: "#1E5631"
  }
};

// This last part makes SITE_CONFIG usable both in the
// browser (website pages) AND later in our backend code
// (Netlify Functions) — you don't need to understand the
// mechanics yet, just know it's what makes one file work
// in both places.
if (typeof module !== "undefined" && module.exports) {
  module.exports = SITE_CONFIG;
}