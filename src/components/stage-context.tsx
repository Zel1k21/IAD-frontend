import React from "react";

// Create context for stage data
interface StageContextType {
  stageTitle?: string;
}

export const StageContext = React.createContext<StageContextType>({});
