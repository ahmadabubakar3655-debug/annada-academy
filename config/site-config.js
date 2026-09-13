// ============================================
// SITE CONFIGURATION
// This is the ONLY file that should contain
// school-specific information.
// ============================================

const SITE_CONFIG = {
  // Basic identity
  orgName: "Halqatul Qur'anil Karim",
  orgNameArabic: "حَلْقَةُ الْقُرْآنِ الْكَرِيمِ",
  shortName: "Halqatul Qur'anil Karim",
  established: 2018,
  motto: "Faith • Qur'an • Knowledge",
  tagline: "Raising sound and moral Qur'anic memorizers.",
  
  // Location
  address: {
    line1: "Sabon Garin Kudan",
    line2: "Kudan LGA, Kaduna State, Nigeria"
  },

  // Contact
  contact: {
    phone1: "09136392655",
    phone2: "09015960031",
    email: "annadaacademy@gmail.com",
    whatsapp: ""
  },

  // Social media (leave blank until real links exist)
  social: {
    facebook: "",
    instagram: "",
    twitter: ""
  },

  // Mission / Vision
  mission: "To produce sound and moral Qur'anic memorizers and Islamic developers who will serve the Ummah with knowledge, character, and dedication.",
  vision: "To be a leading center of Qur'anic memorization and Islamic knowledge in Kaduna State and beyond, producing graduates equipped for both this world and the Hereafter.",

  // Statistics
  stats: {
    students: 20,
    teachers: "",
    years: ""
  },

  // Brand colors, pulled from the official logo
  colors: {
    navy: "#1B2A4A",
    gold: "#C9A24B",
    cream: "#F7F3EC",
    green: "#1E5631"
  }
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = SITE_CONFIG;
}