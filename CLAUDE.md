# CLAUDE.md — Contexte projet Alassane Coaching

> Ce fichier est la **source de vérité** du projet. En cas de doute, il prime sur tout
> autre fichier. Toute décision listée ici est **figée** : ne pas la remettre en question
> ni l'inventer autrement.

---

## 1. Le projet en une phrase

Site vitrine + blog en **français**, dont le but n°1 est de **vendre le livre
« Les Secrets de la Détente Verticale »** et de convertir les visiteurs vers
**Athletik Hub Gratuit (3 jours offerts)**.

Le site doit **vendre, rassurer et créer de la confiance** — pas seulement être beau.

---

## 2. Stack technique (FIGÉE)

| Outil | Rôle |
| --- | --- |
| **Astro** | Framework principal (SSG). Pages en `.astro`, blog en content collections Markdown. |
| **Netlify** | Hébergement + CI/CD + **Netlify Forms** pour le formulaire de contact. |
| **React (îlots Astro)** | UNIQUEMENT pour l'interactif : popup quiz Athletik Hub, formulaire. Pas ailleurs. |
| **Tailwind CSS** | Styling. Couleurs de marque en variables (voir §4). |

Contraintes : **français uniquement**, responsive mobile-first, rapide, code clair et
réutilisable, **Lighthouse 90+** visé sur toutes les catégories. Pas de code inutile.

> ⚠️ Il existe un ancien export Figma Make en **React/Vite** (dossier séparé). Il sert
> **uniquement de référence visuelle**. Ne pas l'importer ni le compiler. On reconstruit en Astro.

---

## 3. Arborescence (5 pages + blog dynamique)

| Page | URL | Objectif |
| --- | --- | --- |
| Accueil | `/` | Hook, histoire, livre, Athletik Hub, CTA vers /livre + popup quiz |
| Le Livre | `/livre` | **Page de vente principale** → achat Amazon KDP |
| À propos | `/a-propos` | Storytelling, crédibilité, confiance |
| Blog | `/blog` | **EN CONSTRUCTION** côté public (voir §7) |
| Contact | `/contact` | Formulaire Netlify + réseaux + FAQ |
| Article | `/blog/[slug]` | Template dynamique (préparé, non publié) |

Composants globaux : **Navbar** (logo gauche, menu, icônes Instagram/YouTube, CTA or
« Acheter le livre », hamburger mobile) et **Footer** (logo + baseline, liens, réseaux,
newsletter, mentions légales, © 2026).

---

## 4. Identité visuelle (FIGÉE)

| Élément | Valeur |
| --- | --- |
| Couleur primaire | **Navy `#1B2A4A`** — fonds sombres, titres, navbar |
| Couleur secondaire | **Or `#C5A44E`** — accents, CTA, liens |
| Fond clair | Blanc `#FFFFFF` / Crème `#F5F3EE` (alternance de sections) |
| Police titres | **Georgia** (serif) — H1/H2/H3 |
| Police corps | **Inter** (sans-serif) — paragraphes, boutons |

> Note typo : si tu veux aligner le site sur la couverture du livre et les apps, les titres
> peuvent passer en **Bebas Neue**. Par défaut on reste sur Georgia (cahier des charges).

Définir ces couleurs/polices en variables Tailwind/CSS dès le départ — ne JAMAIS coder une
couleur de marque en dur dans un composant.

---

## 5. Le livre & l'offre (FIGÉ)

- **Titre :** Les Secrets de la Détente Verticale
- **Format :** 378 pages · 4 parties · 6 programmes · 1 application incluse
- **Prix :** Kindle **39 €** · Papier **69 €** (Athletik Hub inclus dans les deux)
- **Boutons d'achat :** mode **« Bientôt disponible / Précommande »** tant que les liens
  Amazon ne sont pas fournis. Utiliser un placeholder de lien (`#` + commentaire `<!-- TODO: lien Amazon KDP -->`).

### Les 4 parties du livre
1. **Science du saut** — les 8 lois de la détente, anatomie/biomécanique/physiologie, triple extension, pliométrie, force/puissance/mobilité, nutrition/récupération/blessures.
2. **Les Méthodes** — la méthode **MENER**, le calcul du **NPI** (Niveau de Performance Individuel), création de programme sur mesure, tests & profils athlétiques.
3. **Les 6 Programmes** (voir §6).
4. **Ressources** — conseils de coach, annexes, glossaire, bibliographie scientifique.

---

## 6. Les 6 programmes Athletik Hub (FIGÉ)

1. **Elite Athlete** — athlètes confirmés qui veulent aller chercher leurs limites
2. **Vertical Dunk** — un seul objectif : t'amener à dunker
3. **Triphasique** — 3 phases progressives, détente complète et durable
4. **SHRED Explose** — la fondation explosive pour bien démarrer
5. **Microtraining** — haute intensité, peu de temps, zéro compromis
6. **EXPLOSE+** — puissance maximale pour athlètes avancés

---

## 7. Règles de contenu (IMPORTANT)

- **Blog : EN CONSTRUCTION.** Côté public, la page `/blog` affiche un titre + message
  « les articles arrivent bientôt ». **Aucun faux article visible.** Préparer en revanche
  la structure technique (content collection Markdown, template `/blog/[slug]`,
  catégories) prête à recevoir les vrais articles plus tard.
- **Vidéos : pas encore prêtes.** Créer un **composant vidéo réutilisable** avec des
  emplacements propres et un commentaire `<!-- TODO: lien YouTube -->`. **Aucune vidéo
  fictive affichée.** Ne pas bloquer le dev à cause des vidéos.
- **Pas de fausses preuves ni faux témoignages.** Les chiffres ci-dessous sont les vraies
  données d'Alassane et peuvent être utilisés :
  - 56 cm → 88 cm (progression personnelle sur 4 ans)
  - 10 000 € investis en formations
  - Certification **ISSA**
  - Formation privée aux **États-Unis avec des coachs NBA/NFL**
  - 900+ athlètes testés (challenge +7 cm)
- **Photos (vraies, à placer dans `/src/assets/`, optimisées WebP) :**
  - *Portrait pro* → page À propos (hero), section histoire, crédibilité.
  - *Photo action terrain 1* (démonstration d'exercice en extérieur, coaching) → section
    « Mon histoire » accueil ou crédibilité À propos.
  - *Photo action terrain 2* (postures explosives en extérieur) → Hero accueil ou section
    Athletik Hub (énergie, dynamisme).
  - Privilégier ces photos réelles partout où une « image d'athlète en action » est demandée.
    Aucune stock photo.

---

## 8. Lead magnet — Popup Athletik Hub

Popup qui apparaît après quelques secondes sur le site, premium et marketing.

- **Titre :** Quel programme est vraiment fait pour toi ?
- **Corps :** Tu veux améliorer ta détente, ton explosivité ou ton niveau athlétique, mais
  tu ne sais pas par où commencer ? Réponds à quelques questions rapides et découvre le
  programme Athletik Hub le plus adapté à ton profil. À la fin, tu testes gratuitement ton
  programme pendant **3 jours**.
- **CTA principal :** `Trouver mon programme`
- **Lien secondaire :** `Continuer ma lecture`
- Le quiz recommande **1 des 6 programmes** (§6). Composant React (îlot Astro).

---

## 9. Direction copywriting

Ton : **direct, humain, terrain, premium, clair, vendeur sans être agressif.** Phrases
courtes. On sent un coach qui a vécu ce qu'il enseigne, pas une marque froide.

Angle central : **« Un livre. Une app. Un système complet pour construire ta détente verticale. »**

Structure récurrente **BEFORE / AFTER / BRIDGE** :
- *Before* : l'athlète stagne, s'entraîne sans système.
- *After* : il comprend, mesure, progresse, sait quoi faire.
- *Bridge* : le livre + Athletik Hub.

Le copy final, page par page, est fourni dans le prompt principal (`PROMPT-CLAUDE-CODE.md`).

---

## 10. SEO & perf

- Meta `title` + `description` uniques par page · Open Graph + Twitter Card
- Sitemap XML auto (intégration Astro) · images **WebP** + lazy loading
- Schema.org : `Book` (page livre), `Person` (à propos), `BlogPosting` (articles)

---

## 11. Réseaux & contact

- Instagram : **@alassanecoaching**
- YouTube : (lien à fournir) · TikTok : (lien à fournir)
- Email pro : `<!-- TODO: email pro -->`
- Formulaire : Netlify Forms · champs Prénom, Email, Sujet (Commande / Athletik Hub /
  Programme / Autre), Message · message de confirmation après envoi.
