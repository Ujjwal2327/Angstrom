import { languages } from "@/data/codeSnapshotConfig";
import { create } from "zustand";
import { persist } from "zustand/middleware";
const useStore = create(
  persist(
    () => ({
      code: languages["c++"].codeSnippet,
      title: "main",
      theme: "bitmap",
      darkMode: true,
      showBackground: true,
      language: "c++",
      autoDetectLanguage: false,
      fontSize: 18,
      fontStyle: "jetBrainsMono",
      padding: 48,
    }),
    {
      name: "user-snapshot-preferences",
    }
  )
);
export default useStore;
