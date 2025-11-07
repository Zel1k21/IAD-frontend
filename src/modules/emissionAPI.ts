export interface Stages {
  id: number;
  title: string;
  image_url: string;
  description?: string;
}

export interface StageSearchResult {
  stagesCount: number;
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
    image_url: "/stock.jpg",
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
    console.log("Making API request to:", `/api/stages?title=${stageName}`);
    const response = await fetch(`/api/stages?title=${stageName}`, {
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
      // Ensure all stages have fallback images
      const resultsWithFallback = data.map((stage: Stages) => ({
        ...stage,
        image_url: stage.image_url || "stock.jpg",
      }));
      return {
        stagesCount: resultsWithFallback.length,
        results: resultsWithFallback,
      };
    } else {
      // Ensure all stages have fallback images
      const resultsWithFallback = (data.results || []).map((stage: Stages) => ({
        ...stage,
        image_url: stage.image_url || "stock.jpg",
      }));
      return {
        stagesCount: data.stagesCount || 0,
        results: resultsWithFallback,
      };
    }
  } catch (error) {
    console.error("API Error in getStageByName:", error);
    // Возвращаем mock-данные при ошибке
    // Ensure mock stages have fallback images
    const mockStagesWithFallback = MOCK_STAGES.map((stage) => ({
      ...stage,
      image_url: stage.image_url || "stock.jpg",
    }));
    return {
      stagesCount: mockStagesWithFallback.length,
      results: mockStagesWithFallback,
    };
  }
};

export const getStageByID = async (id: number): Promise<Stages | null> => {
  try {
    console.log("Making API request to:", `/api/stages/${id}`);
    const response = await fetch(`/api/stages/${id}`, {
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
    // Ensure image_url has fallback
    const stageWithFallback = {
      ...data,
      image_url: data.image_url || "stock.jpg",
    };
    return stageWithFallback;
  } catch (error) {
    console.error("API Error in getStageByID:", error);
    const mockStage = MOCK_STAGES.find((stage) => stage.id === id) || null;
    // Ensure mock stage also has fallback image
    if (mockStage) {
      return {
        ...mockStage,
        image_url: mockStage.image_url || "stock.jpg",
      };
    }
    return mockStage;
  }
};
