/**
 * Configuration globale du site Alassane Coaching.
 * Source unique pour les liens, réseaux, prix et infos de marque.
 * Voir CLAUDE.md §5, §6, §11.
 */

export const SITE = {
  name: 'Alassane Coaching',
  baseline: 'Coach en performance athlétique',
  description:
    "Les Secrets de la Détente Verticale : le livre et l'application Athletik Hub pour comprendre la science de l'explosivité et construire une vraie détente verticale.",
  url: 'https://alassanecoaching.com',
  locale: 'fr_FR',
  author: 'Alassane Ndiaye',
} as const;

export const NAV_LINKS = [
  { label: 'Accueil', href: '/' },
  { label: 'Le Livre', href: '/livre' },
  { label: 'Athletik Hub', href: '/application' },
  { label: 'Blog', href: '/blog' },
  { label: 'Réserver un bilan', href: '/bilan' },
  { label: 'À propos', href: '/a-propos' },
  { label: 'Contact', href: '/contact' },
] as const;

export const SOCIALS = {
  instagram: 'https://www.instagram.com/alassanecoaching',
  // TODO: liens YouTube et TikTok à fournir
  youtube: '#',
  tiktok: '#',
} as const;

/** Lien vers l'application Athletik Hub (à intégrer où tu veux). */
export const ATHLETIK_HUB_URL = 'https://athletikfondation.netlify.app/';

export const BOOK = {
  title: 'Les Secrets de la Détente Verticale',
  pages: 378,
  parts: 4,
  programs: 6,
  priceKindle: '39 €',
  pricePaper: '69 €',
  // Fiche Amazon (Kindle + papier sur la même page produit).
  amazon: 'https://amzn.eu/d/0fN500rk',
} as const;

/** Les 6 programmes Athletik Hub (FIGÉ — CLAUDE.md §6) */
export const PROGRAMS = [
  {
    id: 'elite-athlete',
    name: 'Elite Athlete',
    tagline: 'Athlètes confirmés qui veulent aller chercher leurs limites',
  },
  {
    id: 'vertical-dunk',
    name: 'Vertical Dunk',
    tagline: "Un seul objectif : t'amener à dunker",
  },
  {
    id: 'triphasique',
    name: 'Triphasique',
    tagline: '3 phases progressives, détente complète et durable',
  },
  {
    id: 'shred-explose',
    name: 'SHRED Explose',
    tagline: 'La fondation explosive pour bien démarrer',
  },
  {
    id: 'microtraining',
    name: 'Microtraining',
    tagline: 'Haute intensité, peu de temps, zéro compromis',
  },
  {
    id: 'explose-plus',
    name: 'EXPLOSE+',
    tagline: 'Puissance maximale pour athlètes avancés',
  },
] as const;
