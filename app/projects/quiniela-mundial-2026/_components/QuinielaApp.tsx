"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { DeviceFrame } from "./DeviceFrame";
import { ResetButton } from "./ResetButton";
import { QuestionFlow } from "./QuestionFlow";
import { Summary } from "./Summary";
import { Confirmation } from "./Confirmation";
import { LandingPage } from "./landing/LandingPage";
import { DemoControls } from "./landing/DemoControls";
import { TransitionSplash } from "./landing/TransitionSplash";
import { ResultsApp } from "./results/ResultsApp";
import { RegisterScreen } from "./auth/RegisterScreen";
import { LoginScreen } from "./auth/LoginScreen";
import { OnboardingCarousel } from "./auth/OnboardingCarousel";
import { MatchSelectionScreen } from "./matches/MatchSelectionScreen";
import { fadeOnlyVariants, fadeScaleVariants, slideVariants, slideTransition } from "./motion/variants";
import type { Direction } from "./motion/variants";
import { match as defaultMatch, questions, makeWindowInfo, makeUpcomingKickoff } from "../_data/mockData";
import type { SelectableMatch } from "../_data/matchesData";
import type { Answers, Match, MatchStatus, WindowInfo } from "../_lib/types";
import { clearState, loadState, saveState } from "../_lib/storage";

type Step =
  | "landing"
  | "register"
  | "login"
  | "onboarding"
  | "matchSelection"
  | "questions"
  | "summary"
  | "confirmation"
  | "results";

interface User {
  name: string;
  email: string;
}

const SPLASH_MS = 500;
const RESULTS_SPLASH_MS = 400;

function firstUnansweredIndex(answers: Answers): number {
  for (let i = 0; i < questions.length; i++) {
    if (!answers[questions[i].id]) return i;
  }
  return questions.length - 1;
}

// Wrap a SelectableMatch in the existing Match shape so QuestionFlow's MatchHeader
// shows the user's chosen teams. The question copy itself stays mock-static.
function toMatch(selectable: SelectableMatch): Match {
  const status: MatchStatus = selectable.status;
  return {
    id: selectable.id,
    homeTeam: selectable.homeTeam,
    awayTeam: selectable.awayTeam,
    score: selectable.score ?? { home: 0, away: 0 },
    status,
    minute: status === "halftime" ? 45 : status === "live" ? 67 : 0,
  };
}

export function QuinielaApp() {
  const reduced = useReducedMotion();
  const [hydrated, setHydrated] = useState(false);
  const [windowInfo, setWindowInfo] = useState<WindowInfo>(() => ({ type: "halftime", endsAt: 0 }));
  const [upcomingKickoffMs, setUpcomingKickoffMs] = useState(0);
  const [step, setStep] = useState<Step>("landing");
  const [answers, setAnswers] = useState<Answers>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [expired, setExpired] = useState(false);
  const [stepDirection, setStepDirection] = useState<Direction>(1);
  const [landingStatus, setLandingStatus] = useState<MatchStatus>("halftime");
  const [splashing, setSplashing] = useState<null | "questions" | "results">(null);
  const [user, setUser] = useState<User | null>(null);
  const [selectedMatch, setSelectedMatch] = useState<SelectableMatch | null>(null);

  // Hydrate state from localStorage and pin window endsAt on the client only.
  // setState-in-effect is the canonical pattern for hydrating from a non-SSR-safe
  // source (localStorage) on first mount; reading during render would cause a mismatch.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const stored = loadState(defaultMatch.id);
    if (stored && Object.keys(stored.answers).length > 0) {
      setAnswers(stored.answers);
      const allAnswered = questions.every((q) => stored.answers[q.id]);
      if (allAnswered) {
        setStep("summary");
        setCurrentIndex(questions.length - 1);
      } else {
        setStep("questions");
        setCurrentIndex(firstUnansweredIndex(stored.answers));
      }
    }
    setWindowInfo(makeWindowInfo());
    setUpcomingKickoffMs(makeUpcomingKickoff());
    setHydrated(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Persist whenever answers or currentIndex change post-hydration.
  useEffect(() => {
    if (!hydrated) return;
    if (Object.keys(answers).length === 0 && currentIndex === 0) return;
    saveState(defaultMatch.id, answers, currentIndex);
  }, [answers, currentIndex, hydrated]);

  const activeMatch = useMemo<Match>(
    () => (selectedMatch ? toMatch(selectedMatch) : defaultMatch),
    [selectedMatch],
  );

  const handleAnswer = useCallback((questionId: string, optionId: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  }, []);

  const handleAdvance = useCallback((nextIndex: number) => {
    setCurrentIndex(nextIndex);
  }, []);

  const handleGoBack = useCallback((prevIndex: number) => {
    setCurrentIndex(prevIndex);
  }, []);

  const handleComplete = useCallback(() => {
    setStepDirection(1);
    setStep("summary");
  }, []);

  const handleEdit = useCallback((questionIndex: number) => {
    setStepDirection(-1);
    setCurrentIndex(questionIndex);
    setStep("questions");
  }, []);

  const handleSubmit = useCallback(() => {
    setStepDirection(1);
    setStep("confirmation");
    clearState(defaultMatch.id);
  }, []);

  const handleExpired = useCallback(() => {
    setExpired(true);
    const allAnswered = questions.every((q) => answers[q.id]);
    if (allAnswered && step === "questions") {
      handleComplete();
    }
  }, [answers, step, handleComplete]);

  const handleReset = useCallback(() => {
    clearState(defaultMatch.id);
    setAnswers({});
    setCurrentIndex(0);
    setExpired(false);
    setStepDirection(1);
    setStep("landing");
    setLandingStatus("halftime");
    setWindowInfo(makeWindowInfo());
    setUpcomingKickoffMs(makeUpcomingKickoff());
    setUser(null);
    setSelectedMatch(null);
  }, []);

  const goToQuestionsWithSplash = useCallback(() => {
    if (splashing) return;
    setSplashing("questions");
    window.setTimeout(() => {
      setStepDirection(1);
      setStep("questions");
      setSplashing(null);
    }, SPLASH_MS);
  }, [splashing]);

  // Landing → Register (or directly to selection if already logged in).
  const handleParticipate = useCallback(() => {
    setStepDirection(1);
    if (user) {
      setStep("matchSelection");
    } else {
      setStep("register");
    }
  }, [user]);

  const handleLogin = useCallback(() => {
    setStepDirection(1);
    setStep(user ? "matchSelection" : "login");
  }, [user]);

  const handleViewResults = useCallback(() => {
    if (splashing) return;
    setSplashing("results");
    window.setTimeout(() => {
      setStepDirection(1);
      setStep("results");
      setSplashing(null);
    }, RESULTS_SPLASH_MS);
  }, [splashing]);

  // Register success → onboarding (new users).
  const handleRegisterSuccess = useCallback((u: User) => {
    setUser(u);
    setStepDirection(1);
    setStep("onboarding");
  }, []);

  // Login success → match selection (returning users skip onboarding).
  const handleLoginSuccess = useCallback((u: User) => {
    setUser(u);
    setStepDirection(1);
    setStep("matchSelection");
  }, []);

  const handleOnboardingDone = useCallback(() => {
    setStepDirection(1);
    setStep("matchSelection");
  }, []);

  const handleSelectMatch = useCallback(
    (m: SelectableMatch) => {
      setSelectedMatch(m);
      goToQuestionsWithSplash();
    },
    [goToQuestionsWithSplash],
  );

  const direction = stepDirection;
  const showDemoControls = step === "landing";

  return (
    <DeviceFrame
      caption="Quiniela Mundial 2026 — Prototipo UX"
      floatingSlot={<ResetButton onReset={handleReset} />}
      belowFrameSlot={
        showDemoControls ? (
          <DemoControls status={landingStatus} onChange={setLandingStatus} />
        ) : null
      }
    >
      <div lang="es" className="stadium-nights relative h-full bg-stadium-midnight text-stadium-text-primary">
        <AnimatePresence mode="wait" initial={false} custom={direction}>
          {step === "landing" && (
            <motion.div
              key="landing"
              custom={direction}
              variants={reduced ? fadeOnlyVariants : slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={reduced ? { duration: 0.18 } : slideTransition}
              className="absolute inset-0 overflow-y-auto"
            >
              <LandingPage
                status={landingStatus}
                upcomingKickoffMs={upcomingKickoffMs}
                onParticipate={handleParticipate}
                onLogin={handleLogin}
              />
            </motion.div>
          )}

          {step === "register" && (
            <motion.div
              key="register"
              variants={reduced ? fadeOnlyVariants : slideVariants}
              custom={1}
              initial="enter"
              animate="center"
              exit="exit"
              transition={reduced ? { duration: 0.18 } : { duration: 0.3, ease: "easeOut" }}
              className="absolute inset-0"
            >
              <RegisterScreen
                onRegister={handleRegisterSuccess}
                onGoToLogin={() => {
                  setStepDirection(1);
                  setStep("login");
                }}
                onBack={() => {
                  setStepDirection(-1);
                  setStep("landing");
                }}
              />
            </motion.div>
          )}

          {step === "login" && (
            <motion.div
              key="login"
              variants={reduced ? fadeOnlyVariants : slideVariants}
              custom={1}
              initial="enter"
              animate="center"
              exit="exit"
              transition={reduced ? { duration: 0.18 } : { duration: 0.3, ease: "easeOut" }}
              className="absolute inset-0"
            >
              <LoginScreen
                onLogin={handleLoginSuccess}
                onGoToRegister={() => {
                  setStepDirection(-1);
                  setStep("register");
                }}
                onBack={() => {
                  setStepDirection(-1);
                  setStep("landing");
                }}
              />
            </motion.div>
          )}

          {step === "onboarding" && (
            <motion.div
              key="onboarding"
              variants={reduced ? fadeOnlyVariants : fadeScaleVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="absolute inset-0"
            >
              <OnboardingCarousel
                onComplete={handleOnboardingDone}
                onSkip={handleOnboardingDone}
              />
            </motion.div>
          )}

          {step === "matchSelection" && (
            <motion.div
              key="matchSelection"
              variants={reduced ? fadeOnlyVariants : fadeScaleVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="absolute inset-0"
            >
              <MatchSelectionScreen
                onSelectMatch={handleSelectMatch}
                userName={user?.name.split(" ")[0]}
                windowEndsAt={windowInfo.endsAt > 0 ? windowInfo.endsAt : null}
              />
            </motion.div>
          )}

          {step === "questions" && (
            <motion.div
              key="questions"
              custom={direction}
              variants={reduced ? fadeOnlyVariants : slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={reduced ? { duration: 0.18 } : slideTransition}
              className="absolute inset-0"
            >
              {hydrated && windowInfo.endsAt > 0 ? (
                <QuestionFlow
                  match={activeMatch}
                  questions={questions}
                  windowInfo={windowInfo}
                  answers={answers}
                  currentIndex={currentIndex}
                  onAnswer={handleAnswer}
                  onAdvance={handleAdvance}
                  onComplete={handleComplete}
                  onExpired={handleExpired}
                  onGoBack={handleGoBack}
                  expired={expired}
                  onRetryNextMatch={handleReset}
                />
              ) : null}
            </motion.div>
          )}

          {step === "summary" && (
            <motion.div
              key="summary"
              custom={direction}
              variants={reduced ? fadeOnlyVariants : slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={reduced ? { duration: 0.18 } : slideTransition}
              className="absolute inset-0"
            >
              <Summary
                match={activeMatch}
                questions={questions}
                answers={answers}
                windowInfo={windowInfo}
                onEdit={handleEdit}
                onSubmit={handleSubmit}
                onExpired={handleExpired}
              />
            </motion.div>
          )}

          {step === "confirmation" && (
            <motion.div
              key="confirmation"
              variants={reduced ? fadeOnlyVariants : fadeScaleVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="absolute inset-0 overflow-y-auto"
            >
              <Confirmation
                match={activeMatch}
                questions={questions}
                answers={answers}
                onBackHome={handleReset}
                onViewResults={handleViewResults}
              />
            </motion.div>
          )}

          {step === "results" && (
            <motion.div
              key="results"
              variants={reduced ? fadeOnlyVariants : fadeScaleVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="absolute inset-0"
            >
              <ResultsApp />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {splashing && (
            <motion.div
              key="splash"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <TransitionSplash
                label={splashing === "results" ? "Calculando resultados…" : undefined}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DeviceFrame>
  );
}
