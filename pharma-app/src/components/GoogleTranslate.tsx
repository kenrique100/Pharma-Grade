"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    google?: {
      translate?: {
        TranslateElement?: new (
          options: { pageLanguage: string; includedLanguages: string; layout?: number; autoDisplay?: boolean },
          elementId: string
        ) => void;
      };
    };
    googleTranslateElementInit?: () => void;
  }
}

const SUPPORTED_LANGUAGES = [
  { code: "fr", label: "Français" },
  { code: "de", label: "Deutsch" },
  { code: "es", label: "Español" },
  { code: "ja", label: "日本語" },
];

export default function GoogleTranslate() {
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  useEffect(() => {
    if (loaded) return;

    window.googleTranslateElementInit = () => {
      if (window.google?.translate?.TranslateElement) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: "fr,de,es,ja",
            autoDisplay: false,
          },
          "google_translate_element"
        );
      }
    };

    const script = document.createElement("script");
    script.src =
      "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    scriptRef.current = script;
    document.body.appendChild(script);
    setLoaded(true);

    return () => {
      if (scriptRef.current && document.body.contains(scriptRef.current)) {
        document.body.removeChild(scriptRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {/* Hidden Google Translate element — required by the widget */}
      <div id="google_translate_element" className="hidden" />

      {/* Trigger button */}
      <div className="relative">
        <button
          onClick={() => setOpen((v) => !v)}
          className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-1"
          aria-label="Translate page"
          title="Translate page"
        >
          {/* Globe icon */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
          </svg>
          <span className="text-xs hidden sm:inline">Translate</span>
        </button>

        {open && (
          <div className="absolute right-0 mt-1 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1 z-50">
            {SUPPORTED_LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  // Trigger Google Translate by changing the select element
                  const select = document.querySelector<HTMLSelectElement>(
                    ".goog-te-combo"
                  );
                  if (select) {
                    select.value = lang.code;
                    select.dispatchEvent(new Event("change"));
                  }
                  setOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
              >
                {lang.label}
              </button>
            ))}
            <button
              onClick={() => {
                // Reset to English
                const select = document.querySelector<HTMLSelectElement>(
                  ".goog-te-combo"
                );
                if (select) {
                  select.value = "";
                  select.dispatchEvent(new Event("change"));
                }
                setOpen(false);
              }}
              className="block w-full text-left px-4 py-2 text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 border-t border-gray-100 dark:border-gray-700"
            >
              🇬🇧 English (reset)
            </button>
          </div>
        )}
      </div>
    </>
  );
}
