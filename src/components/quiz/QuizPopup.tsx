import { useEffect, useState } from 'react';

/*
  Popup Lead Magnet — Quiz Athletik Hub (CLAUDE.md §8)
  Îlot React monté dans le BaseLayout. Apparaît après ~5 s.
  Le quiz pose quelques questions et recommande 1 des 6 programmes.
*/

const STORAGE_KEY = 'athletik-quiz-seen';
const APPEAR_DELAY_MS = 5000;

type ProgramId =
  | 'elite-athlete'
  | 'vertical-dunk'
  | 'triphasique'
  | 'shred-explose'
  | 'microtraining'
  | 'explose-plus';

interface Program {
  id: ProgramId;
  name: string;
  tagline: string;
  why: string;
}

const PROGRAMS: Record<ProgramId, Program> = {
  'elite-athlete': {
    id: 'elite-athlete',
    name: 'Elite Athlete',
    tagline: 'Athlètes confirmés qui veulent aller chercher leurs limites',
    why: "Tu as déjà des bases solides : ce programme te pousse vers ton plafond athlétique.",
  },
  'vertical-dunk': {
    id: 'vertical-dunk',
    name: 'Vertical Dunk',
    tagline: "Un seul objectif : t'amener à dunker",
    why: "Ton objectif est clair : dunker. Tout est orienté vers ce résultat.",
  },
  triphasique: {
    id: 'triphasique',
    name: 'Triphasique',
    tagline: '3 phases progressives, détente complète et durable',
    why: 'Tu veux une progression structurée et durable, sans brûler les étapes.',
  },
  'shred-explose': {
    id: 'shred-explose',
    name: 'SHRED Explose',
    tagline: 'La fondation explosive pour bien démarrer',
    why: "Tu démarres : on construit d'abord une fondation explosive saine et solide.",
  },
  microtraining: {
    id: 'microtraining',
    name: 'Microtraining',
    tagline: 'Haute intensité, peu de temps, zéro compromis',
    why: 'Peu de temps disponible : des séances courtes, intenses, efficaces.',
  },
  'explose-plus': {
    id: 'explose-plus',
    name: 'EXPLOSE+',
    tagline: 'Puissance maximale pour athlètes avancés',
    why: 'Tu es avancé et tu veux pousser ta puissance maximale au niveau supérieur.',
  },
};

interface Option {
  label: string;
  value: string;
}

interface Question {
  id: 'niveau' | 'objectif' | 'temps';
  question: string;
  options: Option[];
}

const QUESTIONS: Question[] = [
  {
    id: 'niveau',
    question: 'Où en es-tu aujourd’hui ?',
    options: [
      { label: 'Je débute', value: 'debutant' },
      { label: 'J’ai déjà un peu d’expérience', value: 'intermediaire' },
      { label: 'Je suis confirmé', value: 'confirme' },
    ],
  },
  {
    id: 'objectif',
    question: 'Ton objectif principal ?',
    options: [
      { label: 'Dunker', value: 'dunk' },
      { label: 'Gagner une détente durable', value: 'durable' },
      { label: 'Puissance / explosivité max', value: 'puissance' },
      { label: 'Bien démarrer sans me blesser', value: 'demarrer' },
    ],
  },
  {
    id: 'temps',
    question: 'Combien de temps peux-tu y consacrer ?',
    options: [
      { label: 'Peu de temps, séances courtes', value: 'peu' },
      { label: 'Du temps, je suis disponible', value: 'normal' },
    ],
  },
];

type Answers = Partial<Record<Question['id'], string>>;

// TODO: affiner la logique de reco (scoring pondéré, NPI, etc.)
// Mapping simple réponses → programme, dans l'esprit des 6 programmes (CLAUDE.md §6).
function recommend(answers: Answers): ProgramId {
  const { niveau, objectif, temps } = answers;

  // Le manque de temps prime : Microtraining.
  if (temps === 'peu') return 'microtraining';

  // Objectif dunk explicite.
  if (objectif === 'dunk') return 'vertical-dunk';

  // Débutant ou volonté de bien démarrer.
  if (niveau === 'debutant' || objectif === 'demarrer') return 'shred-explose';

  // Recherche de puissance maximale chez un athlète avancé.
  if (objectif === 'puissance') {
    return niveau === 'confirme' ? 'explose-plus' : 'triphasique';
  }

  // Confirmé sans objectif spécifique → Elite Athlete.
  if (niveau === 'confirme') return 'elite-athlete';

  // Par défaut : progression complète et durable.
  return 'triphasique';
}

export default function QuizPopup() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [result, setResult] = useState<ProgramId | null>(null);
  // Programme calculé, en attente de l'email avant révélation (lead magnet).
  const [pendingResult, setPendingResult] = useState<ProgramId | null>(null);
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Ouverture manuelle via les boutons « Trouver mon programme »
    // (n'importe quel élément qui dispatch l'événement window 'open-athletik-quiz').
    const openNow = () => {
      restart();
      setOpen(true);
    };
    window.addEventListener('open-athletik-quiz', openNow);

    // Ouverture automatique après ~5 s, une seule fois par visiteur.
    let timer: number | undefined;
    if (!window.localStorage.getItem(STORAGE_KEY)) {
      timer = window.setTimeout(() => setOpen(true), APPEAR_DELAY_MS);
    }
    return () => {
      window.removeEventListener('open-athletik-quiz', openNow);
      if (timer) window.clearTimeout(timer);
    };
  }, []);

  function dismiss() {
    setOpen(false);
    try {
      window.localStorage.setItem(STORAGE_KEY, '1');
    } catch {
      /* localStorage indisponible : on ignore */
    }
  }

  function selectOption(value: string) {
    const q = QUESTIONS[step];
    const next = { ...answers, [q.id]: value };
    setAnswers(next);
    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      // Dernière question : on calcule le programme mais on demande l'email avant.
      setPendingResult(recommend(next));
    }
  }

  // Capture du lead via Netlify Forms (fire-and-forget), puis on révèle le programme.
  function submitEmail() {
    if (!pendingResult) return;
    try {
      const body = new URLSearchParams({
        'form-name': 'quiz-lead',
        email,
        programme: PROGRAMS[pendingResult].name,
        objectif: answers.objectif ?? '',
        niveau: answers.niveau ?? '',
      });
      void fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      }).catch(() => {});
    } catch {
      /* on ne bloque jamais l'affichage du résultat */
    }
    setResult(pendingResult);
  }

  function restart() {
    setStep(0);
    setAnswers({});
    setResult(null);
    setPendingResult(null);
    setEmail('');
  }

  // Fermeture clavier (Échap)
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dismiss();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  if (!open) return null;

  const program = result ? PROGRAMS[result] : null;
  const progress = result ? 100 : pendingResult ? 92 : (step / QUESTIONS.length) * 100;
  const emailValid = /.+@.+\..+/.test(email);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quiz-title"
    >
      {/* Overlay */}
      <button
        type="button"
        aria-label="Fermer"
        onClick={dismiss}
        className="absolute inset-0 bg-navy-dark/70 backdrop-blur-sm"
      />

      {/* Carte */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* En-tête navy */}
        <div className="relative bg-navy px-6 pb-5 pt-6 text-white">
          <button
            type="button"
            onClick={dismiss}
            aria-label="Fermer le quiz"
            className="absolute right-4 top-4 text-cream/70 transition-colors hover:text-gold"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-gold">
            Athletik Hub
          </p>
          <h2 id="quiz-title" className="pr-8 font-serif text-xl font-bold" style={{ fontFamily: 'Georgia, serif' }}>
            {result ? 'Ton programme recommandé' : 'Quel programme est vraiment fait pour toi ?'}
          </h2>
          {/* Barre de progression */}
          <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-white/15">
            <div
              className="h-full rounded-full bg-gold transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Corps */}
        <div className="px-6 py-6">
          {!result && !pendingResult && step === 0 && (
            <p className="mb-5 text-sm leading-relaxed text-navy/70">
              Tu veux améliorer ta détente, ton explosivité ou ton niveau athlétique,
              mais tu ne sais pas par où commencer ? Réponds à 3 questions rapides. À la
              fin, tu testes gratuitement ton programme pendant{' '}
              <strong className="text-navy">3 jours</strong>.
            </p>
          )}

          {/* Étape email — capture du prospect avant de révéler le programme. */}
          {!result && pendingResult && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submitEmail();
              }}
              className="text-center"
            >
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gold/15 ring-1 ring-gold/40">
                <svg className="h-6 w-6 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l9 6 9-6M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-navy" style={{ fontFamily: 'Georgia, serif' }}>
                Ton programme est prêt.
              </h3>
              <p className="mx-auto mt-2 max-w-sm text-sm text-navy/70">
                Laisse ton email pour découvrir ton programme et recevoir ton accès à
                <strong className="text-navy"> 3 jours gratuits</strong> + mes conseils détente verticale.
              </p>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ton@email.com"
                className="mt-4 w-full rounded-full border border-navy/15 px-5 py-3 text-navy placeholder:text-navy/40 focus:border-gold focus:outline-none"
              />
              <button
                type="submit"
                disabled={!emailValid}
                className="btn-gold mt-3 w-full disabled:cursor-not-allowed disabled:opacity-50"
              >
                Voir mon programme →
              </button>
              <button
                type="button"
                onClick={() => setResult(pendingResult)}
                className="mt-3 block w-full text-xs text-navy/45 transition-colors hover:text-navy"
              >
                Voir sans laisser d'email
              </button>
              <p className="mt-2 text-[11px] text-navy/40">Pas de spam. Désinscription en un clic.</p>
            </form>
          )}

          {!result && !pendingResult && (
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gold">
                Question {step + 1} / {QUESTIONS.length}
              </p>
              <h3
                className="mb-4 text-lg font-bold text-navy"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                {QUESTIONS[step].question}
              </h3>
              <div className="flex flex-col gap-2.5">
                {QUESTIONS[step].options.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => selectOption(opt.value)}
                    className="group flex items-center justify-between rounded-xl border border-navy/15 px-4 py-3 text-left text-navy transition-all hover:border-gold hover:bg-cream"
                  >
                    <span className="font-medium">{opt.label}</span>
                    <span className="text-navy/30 transition-colors group-hover:text-gold">
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m9 6 6 6-6 6" />
                      </svg>
                    </span>
                  </button>
                ))}
              </div>
              {step > 0 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="mt-4 text-sm text-navy/50 transition-colors hover:text-navy"
                >
                  ← Précédent
                </button>
              )}
            </div>
          )}

          {result && program && (
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gold/15 ring-1 ring-gold/40">
                <svg className="h-7 w-7 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />
                </svg>
              </div>
              <p className="text-sm text-navy/60">Ton profil correspond à</p>
              <h3 className="mt-1 text-2xl font-bold text-navy" style={{ fontFamily: 'Georgia, serif' }}>
                {program.name}
              </h3>
              <p className="mt-1 text-sm font-medium text-gold-dark">{program.tagline}</p>
              <p className="mt-4 rounded-xl bg-cream px-4 py-3 text-sm text-navy/75">
                {program.why}
              </p>
              <a href="/livre" className="btn-gold mt-6 w-full">
                Tester 3 jours gratuitement
              </a>
              <button
                type="button"
                onClick={restart}
                className="mt-3 block w-full text-sm text-navy/50 transition-colors hover:text-navy"
              >
                Refaire le quiz
              </button>
            </div>
          )}

          {!result && !pendingResult && (
            <button
              type="button"
              onClick={dismiss}
              className="mt-5 block w-full text-center text-sm text-navy/45 transition-colors hover:text-navy"
            >
              Continuer ma lecture
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
