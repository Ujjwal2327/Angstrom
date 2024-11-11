import { languages } from "@/data/codeSnapshotConfig";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const commonDefaultSettings = {
  code: languages["c++"].codeSnippet,
  title: "main.cpp",
  theme: "bitmap",
  darkMode: true,
  showBackground: true,
  language: "c++",
  autoDetectLanguage: false,
  fontStyle: "jetBrainsMono",
  padding: 48,
};

const useStore = create(
  persist(
    (set, get) => ({
      userSettings: {
        ...commonDefaultSettings,
      },
      sharedSettings: {
        ...commonDefaultSettings,
      },
      isSharable: false,

      // Computed selector to get effective settings
      getEffectiveSettings: () => {
        const { isSharable, sharedSettings, userSettings } = get();
        return isSharable ? sharedSettings : userSettings;
      },

      // Function to update effective settings
      setEffectiveSettings: (newSettings) => {
        if (typeof newSettings !== "object") return; // Ensure the passed settings are an object

        const { isSharable: updatedIsSharable } = newSettings; // Extract isSharable from newSettings, if provided
        const { isSharable } = get(); // Get the current value of isSharable from the store

        // If updatedIsSharable is provided, use it; otherwise, fallback to the current store value
        const finalIsSharable =
          updatedIsSharable !== undefined ? updatedIsSharable : isSharable;
        set((state) => ({
          isSharable: finalIsSharable,
        }));
        if (finalIsSharable) {
          set((state) => ({
            sharedSettings: { ...state.sharedSettings, ...newSettings },
          }));
        } else {
          set((state) => ({
            userSettings: { ...state.userSettings, ...newSettings },
          }));
        }
      },
    }),
    {
      name: "snapshotSettings",
    }
  )
);

export default useStore;
