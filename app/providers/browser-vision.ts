import { places } from "./mock";
import type { VisionResult } from "./types";

const TRANSFORMERS_MODULE_URL = "https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.8.1/+esm";
const MODEL_ID = "Xenova/clip-vit-base-patch32";

export const VISION_PLACE_PROMPTS: Record<string, string> = {
  gwangalli: "Gwangalli Beach in Busan with the long illuminated Gwangan suspension bridge, sandy shore, and city skyline",
  gamcheon: "Gamcheon Culture Village in Busan with dense colorful houses stacked on a steep hillside and narrow painted alleys",
  haeundae: "Haeundae Beach in Busan with a wide sandy beach, tall modern skyscrapers, and a curved urban coastline",
  taejongdae: "Taejongdae in Busan with dramatic rocky sea cliffs, dense coastal forest, lighthouse, and open ocean",
  songdo: "Songdo Beach in Busan with colorful cable cars crossing above the sea and a curved urban beach",
  oryukdo: "Oryukdo Skywalk in Busan with a glass observation platform above rocky cliffs and small offshore islands",
  jagalchi: "Jagalchi fish market in Busan with seafood stalls, fishing harbor, boats, and a large waterfront market building",
  yongdusan: "Yongdusan Park in Busan with the tall white Busan Tower observation tower above a downtown park",
  dadaepo: "Dadaepo Beach in Busan with a vast tidal flat, shallow reflective water, reeds, and orange sunset",
  huinnyeoul: "Huinnyeoul Culture Village in Busan with white hillside alleys, blue sea walls, stairs, and ocean views",
  dongbaek: "Dongbaekseom in Busan with a wooded coastal path, Nurimaru APEC House, rocky shore, and Gwangan Bridge view",
  "busan-citizens-park": "Busan Citizens Park with broad green lawns, walking paths, trees, fountains, and modern city buildings",
  f1963: "F1963 in Busan with a renovated industrial wire factory, exposed concrete and steel, bamboo garden, books, and art",
  "haedong-yonggungsa": "Haedong Yonggungsa coastal Buddhist temple in Busan with traditional tiled roofs on rocky cliffs above the sea",
  "busan-x-the-sky": "BUSAN X the SKY and Haeundae LCT Landmark Tower beside Haeundae Beach with a very tall modern skyscraper",
  cheongsapo: "Cheongsapo Daritdol Observatory in Busan with a long blue skywalk above the rocky sea and fishing village",
  "blueline-park": "Haeundae Blue Line Park with colorful sky capsule trains or beach train running beside the ocean",
  "cinema-center": "Busan Cinema Center with its huge curved cantilever roof, outdoor plaza, and colorful architectural lighting",
  "maritime-museum": "National Maritime Museum of Korea in Busan with maritime exhibits, ships, aquarium, and ocean displays",
  igidae: "Igidae coastal trail in Busan with forest paths, rocky shoreline, blue sea, and Gwangan Bridge views",
  hwangnyeongsan: "panoramic Busan city skyline viewed from Hwangnyeongsan mountain and beacon mound",
  "busan-museum": "Busan Museum building or Korean historical artifacts displayed inside the museum",
  "un-memorial": "United Nations Memorial Cemetery in Busan with rows of graves, national flags, green lawns, and memorial walls",
  "gukje-market": "Gukje Market in Busan with dense traditional market alleys, Korean signs, shops, and street vendors",
  "biff-square": "BIFF Square in Busan with film handprints, movie street signs, theaters, and busy food stalls",
  "bosu-book-street": "Bosu-dong Bookstore Alley in Busan with narrow stairs, old bookstores, and stacks of books",
  "bupyeong-market": "Bupyeong Kkangtong Market in Busan with covered market aisles, street food stalls, and night market lights",
  "nakdong-eco-center": "Nakdong Estuary Eco-Center and Eulsukdo wetland in Busan with migratory birds, reeds, river, and observation facilities",
  "samnak-eco-park": "Samnak Ecological Park beside the Nakdong River in Busan with wetlands, reeds, bicycle paths, and open grass",
  beomeosa: "Beomeosa Buddhist temple in Busan with traditional colorful wooden halls, stone stairs, lanterns, and mountain forest",
};

interface Classification {
  label: string;
  score: number;
}

interface ProgressEvent {
  status?: string;
  progress?: number;
  file?: string;
}

type Classifier = (imageSource: string, labels: string[]) => Promise<Classification[] | Classification[][]>;
type ProgressReporter = (message: string) => void;

interface TransformersModule {
  env: { allowLocalModels: boolean };
  pipeline: (
    task: "zero-shot-image-classification",
    model: string,
    options: { progress_callback: (event: ProgressEvent) => void },
  ) => Promise<Classifier>;
}

const importRemoteModule = new Function("url", "return import(url)") as (url: string) => Promise<TransformersModule>;
let classifierPromise: Promise<Classifier> | null = null;

function progressMessage(event: ProgressEvent) {
  if (event.status === "progress" && Number.isFinite(event.progress)) {
    return `무료 AI 모델 다운로드 ${Math.round(event.progress ?? 0)}%`;
  }
  if (event.status === "ready") return "사진 특징을 비교하고 있어요…";
  if (event.status === "initiate" || event.status === "download") return "무료 AI 모델을 준비하고 있어요…";
  return "사진 분석 모델을 불러오고 있어요…";
}

async function loadClassifier(reportProgress: ProgressReporter) {
  if (!classifierPromise) {
    classifierPromise = importRemoteModule(TRANSFORMERS_MODULE_URL)
      .then((transformers) => {
        transformers.env.allowLocalModels = false;
        return transformers.pipeline("zero-shot-image-classification", MODEL_ID, {
          progress_callback: (event) => reportProgress(progressMessage(event)),
        });
      })
      .catch((error) => {
        classifierPromise = null;
        throw error;
      });
  }
  return classifierPromise;
}

export const browserVisionProvider = {
  async analyzeImage(imageSource: string, reportProgress: ProgressReporter = () => undefined): Promise<VisionResult> {
    const promptEntries = places
      .map((place) => ({ place, prompt: VISION_PLACE_PROMPTS[place.id] }))
      .filter((entry): entry is { place: typeof places[number]; prompt: string } => Boolean(entry.prompt));

    if (!promptEntries.length) throw new Error("분석할 장소 후보가 없습니다.");

    const classifier = await loadClassifier(reportProgress);
    reportProgress("등록된 부산 명소와 사진을 비교하고 있어요…");
    const rawOutput = await classifier(imageSource, promptEntries.map((entry) => entry.prompt));
    const output = (Array.isArray(rawOutput[0]) ? rawOutput[0] : rawOutput) as Classification[];
    const promptToPlace = new Map(promptEntries.map((entry) => [entry.prompt, entry.place]));
    const candidates = output
      .map((item) => ({ place: promptToPlace.get(item.label), confidence: Number(item.score) }))
      .filter((item): item is { place: typeof places[number]; confidence: number } => Boolean(item.place) && Number.isFinite(item.confidence))
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 3);

    if (!candidates.length) throw new Error("사진에서 장소 후보를 찾지 못했습니다.");
    return { place: candidates[0].place, confidence: candidates[0].confidence, candidates, source: "browser-clip" };
  },
};
