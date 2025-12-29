export type AcademicYear = 1 | 2 | 3;
export type Semester = 'Spring' | 'Fall' | 'Winter' | 'Summer';
export type Region = 'North' | 'South' | 'East' | 'West' | 'Northeast' | 'Islands';
export type TravelMode = 'Train' | 'Road' | 'Flight';

export type LearningGoal =
  | 'Architectural Principles'
  | 'Spatial Organization'
  | 'Climate Responsiveness'
  | 'Building Services'
  | 'Bye-laws & Regulations'
  | 'Construction Practices'
  | 'Heritage & Conservation';

export interface City {
  city: string;
  state: string;
  region: Region;
  categories: string[];
  ideal_years: AcademicYear[];
  learning_focus: string[];
  suggested_days: number;
  terrain: string;
  urban_rural_index: number; // 1-5: 1=rural, 5=urban
  heritage_contemporary_index: number; // 1-5: 1=heritage, 5=contemporary
  travel_nodes: TravelMode[];
  risk_notes?: string;
  key_sites: string[];
}

export interface DayActivity {
  day: number;
  city: string;
  morning: string;
  afternoon: string;
  evening: string;
  learning_focus: string[];
}

export interface Circuit {
  id: string;
  name: string;
  academic_year: AcademicYear;
  semester?: Semester;
  duration: number;
  learning_goals: LearningGoal[];
  cities: string[];
  day_wise_plan: DayActivity[];
  academic_justification: string;
  status: 'Draft' | 'Approved' | 'Exported';
  created_at: string;
  constraints: CircuitConstraints;
  score: CircuitScore;
}

export interface CircuitConstraints {
  regions: Region[];
  max_daily_travel_hours: number;
  preferred_modes: TravelMode[];
  urban_rural_preference: number; // 1-5: 1=rural, 5=urban
  heritage_contemporary_preference: number; // 1-5: 1=heritage, 5=contemporary
}

export interface CircuitScore {
  academic_match: number; // 0-100
  travel_efficiency: number; // 0-100
  pedagogical_progression: number; // 0-100
  user_preference_match: number; // 0-100
  total: number; // Weighted total
}

export interface CircuitFormData {
  academic_year: AcademicYear | null;
  semester: Semester | null;
  duration: number;
  starting_city: string;
  learning_goals: LearningGoal[];
  constraints: CircuitConstraints;
}
