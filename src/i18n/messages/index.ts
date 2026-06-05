import type { Locale } from "../config";
import en from "./en";
import bn from "./bn";
import hi from "./hi";
import ne from "./ne";

export const MESSAGES: Record<Locale, Record<string, string>> = { en, bn, hi, ne };
