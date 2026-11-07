import type { SourceAdapter } from "../types";
import { filmibeatAdapter } from "./filmibeat";
import { news18Adapter } from "./news18";
import { vijayakarnatakaAdapter } from "./vijayakarnataka";

export const SOURCE_ADAPTERS: SourceAdapter[] = [
  filmibeatAdapter,
  vijayakarnatakaAdapter,
  news18Adapter,
];
