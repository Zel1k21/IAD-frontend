import { dest_api } from "./target_config";

export interface StageRequestInfo {
  request_id: number;
  items_count: number;
}

export interface Stages {
  id: number;
  title: string;
  image_url: string;
  description?: string;
}

export interface StageSearchResult {
  results: Stages[];
}

const MOCK_STAGES: Stages[] = [
  {
    id: 1,
    title: "Добыча",
    image_url: "stock.jpg",
    description: "Этап добычи полезных ископаемых.",
  },
  {
    id: 2,
    title: "Переработка",
    image_url: "stock.jpg",
    description: "Переработка сырья на заводах.",
  },
  {
    id: 3,
    title: "Транспортировка",
    image_url: "stock.jpg",
    description: "Доставка продукции к потребителю.",
  },
];

export const getStageByName = async (
  stageName = "",
): Promise<StageSearchResult> => {
  try {
    console.log(
      "Making API request to:",
      `${dest_api}/stages?title=${stageName}`,
    );
    const response = await fetch(`${dest_api}/stages?title=${stageName}`, {
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("Response status:", response.status, response.ok);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Response data:", data);
    if (Array.isArray(data)) {
      const resultsWithFallback = data.map((stage: Stages) => ({
        ...stage,
        image_url: stage.image_url || "stock.jpg",
      }));
      return {
        results: resultsWithFallback,
      };
    } else {
      const resultsWithFallback = (data.results || []).map((stage: Stages) => ({
        ...stage,
        image_url: stage.image_url || "stock.jpg",
      }));
      return {
        results: resultsWithFallback,
      };
    }
  } catch (error) {
    console.error("API Error in getStageByName:", error);
    const mockStagesWithFallback = MOCK_STAGES.map((stage) => ({
      ...stage,
      image_url: stage.image_url || "stock.jpg",
    }));
    return {
      results: mockStagesWithFallback,
    };
  }
};

export const getStageByID = async (id: number): Promise<Stages | null> => {
  try {
    console.log("Making API request to:", `${dest_api}/stages/${id}`);
    const response = await fetch(`${dest_api}/stages/${id}`, {
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("Response status:", response.status, response.ok);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: Stages = await response.json();
    console.log("Response data:", data);
    const stageWithFallback = {
      ...data,
      image_url: data.image_url || "stock.jpg",
    };
    return stageWithFallback;
  } catch (error) {
    console.error("API Error in getStageByID:", error);
    const mockStage = MOCK_STAGES.find((stage) => stage.id === id) || null;
    if (mockStage) {
      return {
        ...mockStage,
        image_url: mockStage.image_url || "stock.jpg",
      };
    }
    return mockStage;
  }
};

export const getStageRequestInfo = async (): Promise<StageRequestInfo> => {
  try {
    console.log(
      "Making API request to:",
      `${dest_api}/stage-requests/stageRequestInfo`,
    );
    const response = await fetch(
      `${dest_api}/stage-requests/stageRequestInfo`,
      {
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    console.log("Response status:", response.status, response.ok);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: StageRequestInfo = await response.json();
    console.log("Response data:", data);
    return data;
  } catch (error) {
    console.error("API Error in getStageRequestInfo:", error);
    // Return mock data for development
    return {
      request_id: 1,
      items_count: 0,
    };
  }
};
