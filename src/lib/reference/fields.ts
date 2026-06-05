export type FieldCategory = { id: string; label: string; subcategories: string[] };

/** 10 broad fields of study with subcategories (onboarding step 4). */
export const FIELD_CATEGORIES: FieldCategory[] = [
  { id: "business", label: "Business & Management", subcategories: ["Business Administration (MBA)", "Finance & Accounting", "Marketing", "International Business", "Supply Chain & Logistics", "Human Resources"] },
  { id: "computing", label: "Computer Science & IT", subcategories: ["Computer Science", "Data Science & AI", "Cybersecurity", "Software Engineering", "Information Systems", "Cloud Computing"] },
  { id: "engineering", label: "Engineering", subcategories: ["Mechanical", "Electrical & Electronic", "Civil", "Chemical", "Mechatronics", "Industrial"] },
  { id: "health", label: "Health & Medical Sciences", subcategories: ["Public Health", "Nursing", "Pharmacy", "Biomedical Sciences", "Healthcare Management", "Nutrition & Dietetics"] },
  { id: "sciences", label: "Natural & Physical Sciences", subcategories: ["Biology", "Chemistry", "Physics", "Environmental Science", "Mathematics & Statistics", "Biotechnology"] },
  { id: "social", label: "Social Sciences", subcategories: ["Economics", "Psychology", "Political Science", "International Relations", "Sociology", "Development Studies"] },
  { id: "arts", label: "Arts & Humanities", subcategories: ["Media & Communication", "Design", "English & Literature", "History", "Languages", "Film & Performing Arts"] },
  { id: "law", label: "Law", subcategories: ["LLB", "LLM", "International Law", "Business Law", "Human Rights Law"] },
  { id: "education", label: "Education", subcategories: ["TESOL", "Educational Leadership", "Early Childhood", "Curriculum & Instruction"] },
  { id: "agriculture", label: "Agriculture & Environment", subcategories: ["Agricultural Science", "Food Science", "Forestry", "Sustainability", "Marine Science"] },
];
