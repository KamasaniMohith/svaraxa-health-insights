import { PredictionResult } from "./api";

// Simple in-memory store to pass results between pages
let currentResult: PredictionResult | null = null;

export function setResult(result: PredictionResult) {
  currentResult = result;
}

export function getResult(): PredictionResult | null {
  return currentResult;
}