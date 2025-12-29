// Core Type Definitions for ArchCircuit

export type AcademicYear = 1 | 2 | 3;
export type Semester = 1 | 2;
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
  id: string;
  city: string;
  state: string;
  region: Region;
  categories: string[];
  ideal_years: AcademicYear[];
  learning_focus: LearningGoal[];
  suggested_days: number;
  terrain: string;
  urban_rural_index: number; // 1-5: 1=rural, 5=urban
  heritage_contemporary_index: number; // 1-5: 1=heritage, 5=contemporary
  travel_nodes: TravelMode[];
  risk_notes?: string;
  coordinates?: { lat: number; lng: number };
}

export interface DayActivity {
  day: number;
  city: string;
  morning: string;
  afternoon: string;
  evening: string;
  learning_focus: LearningGoal[];
}

export interface Circuit {
  id: string;
  name: string;
  academic_year: AcademicYear;
  semester?: Semester;
  duration: number;
  learning_goals: LearningGoal[];
  cities: string[];
  day_plan: DayActivity[];
  academic_justification: string;
  status: 'Draft' | 'Approved' | 'Exported';
  created_at: string;
  updated_at: string;
  starting_city?: string;
  constraints: CircuitConstraints;
  score: CircuitScore;
}

export interface CircuitConstraints {
  regions: Region[];
  max_daily_travel_hours: number;
  preferred_modes: TravelMode[];
  urban_rural_balance: number; // 1-5
  heritage_contemporary_balance: number; // 1-5
}

export interface CircuitScore {
  total: number;
  academic_match: number;
  travel_efficiency: number;
  pedagogical_progression: number;
  user_preference: number;
}

export interface CircuitFormData {
  academic_year?: AcademicYear;
  semester?: Semester;
  duration: number;
  starting_city?: string;
  learning_goals: LearningGoal[];
  constraints: CircuitConstraints;
}
