import { Circuit, CircuitFormData, City, CircuitScore, DayActivity, LearningGoal } from '../types';
import { CITIES_DATABASE } from '../data/cities';

// Generate unique circuit ID
export function generateCircuitId(): string {
  return `circuit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Filter cities based on academic year and learning goals
export function filterCitiesByAcademicCriteria(
  academicYear: number,
  learningGoals: LearningGoal[]
): City[] {
  return CITIES_DATABASE.filter(city => {
    // Check if city is suitable for the academic year
    const yearMatch = city.ideal_years.includes(academicYear as 1 | 2 | 3);
    
    // Check if city covers at least one of the selected learning goals
    const goalMatch = learningGoals.some(goal => 
      city.learning_focus.includes(goal)
    );
    
    return yearMatch && goalMatch;
  });
}

// Filter cities by geographic and preference constraints
export function filterCitiesByConstraints(
  cities: City[],
  formData: CircuitFormData
): City[] {
  const { constraints } = formData;
  
  return cities.filter(city => {
    // Region filter
    const regionMatch = constraints.regions.length === 0 || 
      constraints.regions.includes(city.region);
    
    // Travel mode filter
    const travelMatch = constraints.preferred_modes.length === 0 ||
      constraints.preferred_modes.some(mode => city.travel_nodes.includes(mode));
    
    // Urban-rural preference (tolerance: ±1 on scale)
    const urbanRuralMatch = Math.abs(city.urban_rural_index - constraints.urban_rural_preference) <= 2;
    
    // Heritage-contemporary preference (tolerance: ±1 on scale)
    const heritageMatch = Math.abs(city.heritage_contemporary_index - constraints.heritage_contemporary_preference) <= 2;
    
    return regionMatch && travelMatch && urbanRuralMatch && heritageMatch;
  });
}

// Group cities by region for geographic clustering
export function clusterCitiesByRegion(cities: City[]): Map<string, City[]> {
  const clusters = new Map<string, City[]>();
  
  cities.forEach(city => {
    const existing = clusters.get(city.region) || [];
    clusters.set(city.region, [...existing, city]);
  });
  
  return clusters;
}

// Calculate academic match score
function calculateAcademicMatch(
  cities: City[],
  learningGoals: LearningGoal[],
  academicYear: number
): number {
  let score = 0;
  const totalGoals = learningGoals.length;
  
  // Check how many learning goals are covered
  const coveredGoals = new Set<string>();
  cities.forEach(city => {
    city.learning_focus.forEach(focus => {
      if (learningGoals.includes(focus as LearningGoal)) {
        coveredGoals.add(focus);
      }
    });
  });
  
  // Coverage percentage (0-60 points)
  const coverageScore = (coveredGoals.size / totalGoals) * 60;
  
  // Year appropriateness (0-40 points)
  const yearAppropriateCount = cities.filter(city => 
    city.ideal_years.includes(academicYear as 1 | 2 | 3)
  ).length;
  const yearScore = (yearAppropriateCount / cities.length) * 40;
  
  score = coverageScore + yearScore;
  return Math.min(100, Math.round(score));
}

// Calculate travel efficiency score
function calculateTravelEfficiency(
  cities: City[],
  maxDailyTravelHours: number,
  duration: number
): number {
  // Simplified travel efficiency calculation
  // Factors: number of cities vs duration, geographic clustering
  
  const cityCount = cities.length;
  const daysPerCity = duration / cityCount;
  
  // Ideal is 1.5-2 days per city
  let paceScore = 0;
  if (daysPerCity >= 1.5 && daysPerCity <= 2.5) {
    paceScore = 50;
  } else if (daysPerCity >= 1 && daysPerCity < 1.5) {
    paceScore = 35;
  } else if (daysPerCity > 2.5 && daysPerCity <= 3) {
    paceScore = 40;
  } else {
    paceScore = 20;
  }
  
  // Geographic clustering bonus
  const regions = new Set(cities.map(c => c.region));
  let clusterScore = 0;
  if (regions.size === 1) {
    clusterScore = 50; // All in one region - very efficient
  } else if (regions.size === 2) {
    clusterScore = 35; // Two regions - good
  } else if (regions.size === 3) {
    clusterScore = 20; // Three regions - acceptable
  } else {
    clusterScore = 10; // Too scattered
  }
  
  return Math.min(100, Math.round(paceScore + clusterScore));
}

// Calculate pedagogical progression score
function calculatePedagogicalProgression(
  cities: City[],
  learningGoals: LearningGoal[],
  academicYear: number
): number {
  let score = 70; // Base score
  
  // Check if circuit has a logical progression
  // For 1st year: Should focus on observation and principles
  if (academicYear === 1) {
    const principlesCities = cities.filter(c => 
      c.learning_focus.includes('Architectural Principles')
    ).length;
    score += (principlesCities / cities.length) * 30;
  }
  
  // For 2nd year: Should balance technical and spatial
  if (academicYear === 2) {
    const hasClimate = cities.some(c => c.learning_focus.includes('Climate Responsiveness'));
    const hasSpatial = cities.some(c => c.learning_focus.includes('Spatial Organization'));
    if (hasClimate && hasSpatial) score += 30;
    else score += 15;
  }
  
  // For 3rd year: Should include professional practice sites
  if (academicYear === 3) {
    const hasProfessional = cities.some(c => 
      c.learning_focus.includes('Construction Practices') || 
      c.learning_focus.includes('Bye-laws & Regulations')
    );
    if (hasProfessional) score += 30;
    else score += 10;
  }
  
  return Math.min(100, Math.round(score));
}

// Calculate user preference match score
function calculateUserPreferenceMatch(
  cities: City[],
  formData: CircuitFormData
): number {
  const { constraints } = formData;
  let score = 0;
  
  // Region preference
  if (constraints.regions.length > 0) {
    const matchingRegions = cities.filter(c => 
      constraints.regions.includes(c.region)
    ).length;
    score += (matchingRegions / cities.length) * 40;
  } else {
    score += 40; // No preference specified
  }
  
  // Urban-rural preference
  const avgUrbanRural = cities.reduce((sum, c) => sum + c.urban_rural_index, 0) / cities.length;
  const urbanRuralDiff = Math.abs(avgUrbanRural - constraints.urban_rural_preference);
  score += Math.max(0, 30 - (urbanRuralDiff * 10));
  
  // Heritage-contemporary preference
  const avgHeritage = cities.reduce((sum, c) => sum + c.heritage_contemporary_index, 0) / cities.length;
  const heritageDiff = Math.abs(avgHeritage - constraints.heritage_contemporary_preference);
  score += Math.max(0, 30 - (heritageDiff * 10));
  
  return Math.min(100, Math.round(score));
}

// Calculate total circuit score
export function calculateCircuitScore(
  cities: City[],
  formData: CircuitFormData
): CircuitScore {
  const academicMatch = calculateAcademicMatch(
    cities,
    formData.learning_goals,
    formData.academic_year!
  );
  
  const travelEfficiency = calculateTravelEfficiency(
    cities,
    formData.constraints.max_daily_travel_hours,
    formData.duration
  );
  
  const pedagogicalProgression = calculatePedagogicalProgression(
    cities,
    formData.learning_goals,
    formData.academic_year!
  );
  
  const userPreferenceMatch = calculateUserPreferenceMatch(cities, formData);
  
  // Weighted total: (40% academic + 30% travel + 20% pedagogy + 10% preference)
  const total = Math.round(
    academicMatch * 0.4 +
    travelEfficiency * 0.3 +
    pedagogicalProgression * 0.2 +
    userPreferenceMatch * 0.1
  );
  
  return {
    academic_match: academicMatch,
    travel_efficiency: travelEfficiency,
    pedagogical_progression: pedagogicalProgression,
    user_preference_match: userPreferenceMatch,
    total
  };
}

// Generate day-wise academic plan
export function generateDayWisePlan(
  cities: City[],
  duration: number,
  learningGoals: LearningGoal[]
): DayActivity[] {
  const plan: DayActivity[] = [];
  let currentDay = 1;
  
  cities.forEach(city => {
    const daysInCity = Math.min(city.suggested_days, duration - currentDay + 1);
    
    for (let i = 0; i < daysInCity; i++) {
      if (currentDay > duration) break;
      
      const isFirstDayInCity = i === 0;
      const isLastDayInCity = i === daysInCity - 1;
      
      // Generate activities based on city and learning goals
      const relevantFocus = city.learning_focus.filter(f => 
        learningGoals.includes(f as LearningGoal)
      );
      
      let morning = '';
      let afternoon = '';
      let evening = '';
      
      if (isFirstDayInCity && i === 0) {
        // First day in city - orientation
        morning = `Travel to ${city.city}. Orientation and site introduction.`;
        afternoon = `Visit ${city.key_sites[0] || 'primary site'}. Documentation and sketching.`;
        evening = 'Group discussion on initial observations. Site context analysis.';
      } else if (isLastDayInCity && daysInCity > 1) {
        // Last day in city - synthesis
        morning = `Detailed study of ${city.key_sites[Math.min(i, city.key_sites.length - 1)] || 'key site'}. Measurements and analysis.`;
        afternoon = 'Comparative analysis session. Portfolio development.';
        evening = 'Synthesis presentation. Reflection on learning outcomes for this location.';
      } else {
        // Middle days - deep exploration
        morning = `Study ${city.key_sites[Math.min(i, city.key_sites.length - 1)] || 'architectural site'}. Focus on ${relevantFocus[0] || 'architectural principles'}.`;
        afternoon = `Site analysis and documentation. ${relevantFocus[1] ? `Explore ${relevantFocus[1]} aspects.` : 'Detailed sketching.'}`;
        evening = 'Faculty-led discussion on observed principles. Journal documentation.';
      }
      
      plan.push({
        day: currentDay,
        city: city.city,
        morning,
        afternoon,
        evening,
        learning_focus: relevantFocus.slice(0, 2)
      });
      
      currentDay++;
    }
  });
  
  return plan;
}

// Generate academic justification
export function generateAcademicJustification(
  cities: City[],
  formData: CircuitFormData,
  score: CircuitScore
): string {
  const yearText = formData.academic_year === 1 ? 'first' : formData.academic_year === 2 ? 'second' : 'third';
  const goalsText = formData.learning_goals.join(', ');
  const citiesText = cities.map(c => c.city).join(', ');
  
  let justification = `This ${formData.duration}-day circuit is designed for ${yearText}-year architecture students focusing on ${goalsText}. `;
  
  justification += `The sequence of cities (${citiesText}) provides a pedagogically progressive learning experience with ${score.academic_match}% coverage of targeted learning outcomes. `;
  
  if (score.travel_efficiency >= 70) {
    justification += `Geographic clustering ensures efficient travel (${score.travel_efficiency}% efficiency), allowing maximum time for site study. `;
  }
  
  justification += `Each location has been selected to demonstrate specific architectural principles relevant to the ${yearText}-year curriculum.`;
  
  return justification;
}

// Generate possible circuits from cities
function generateCircuitCombinations(
  cities: City[],
  duration: number
): City[][] {
  const circuits: City[][] = [];
  
  // Calculate how many cities we can visit based on duration
  const minDaysPerCity = 1;
  const maxDaysPerCity = 3;
  
  const maxCities = Math.floor(duration / minDaysPerCity);
  const minCities = Math.ceil(duration / maxDaysPerCity);
  
  // Generate circuits with different city counts
  for (let cityCount = minCities; cityCount <= Math.min(maxCities, 6); cityCount++) {
    // Try to create circuits with this many cities
    // Use geographic clustering to create logical routes
    
    const clusters = clusterCitiesByRegion(cities);
    
    // Create circuits from single or adjacent regions
    clusters.forEach((citiesInRegion, region) => {
      if (citiesInRegion.length >= cityCount) {
        // Create a circuit from this region
        const circuit = citiesInRegion.slice(0, cityCount);
        circuits.push(circuit);
      }
    });
    
    // Create multi-region circuits
    if (clusters.size >= 2 && cityCount >= 3) {
      const regionNames = Array.from(clusters.keys());
      
      for (let i = 0; i < regionNames.length - 1; i++) {
        const region1 = regionNames[i];
        const region2 = regionNames[i + 1];
        
        const cities1 = clusters.get(region1) || [];
        const cities2 = clusters.get(region2) || [];
        
        const split = Math.floor(cityCount / 2);
        const circuit = [
          ...cities1.slice(0, split),
          ...cities2.slice(0, cityCount - split)
        ];
        
        if (circuit.length === cityCount) {
          circuits.push(circuit);
        }
      }
    }
  }
  
  return circuits.slice(0, 10); // Limit to 10 possible combinations
}

// Main circuit generation function
export function generateCircuits(formData: CircuitFormData): Circuit[] {
  if (!formData.academic_year) {
    return [];
  }
  
  // Step 1: Filter cities by academic criteria
  let eligibleCities = filterCitiesByAcademicCriteria(
    formData.academic_year,
    formData.learning_goals
  );
  
  // Step 2: Apply constraints
  eligibleCities = filterCitiesByConstraints(eligibleCities, formData);
  
  if (eligibleCities.length === 0) {
    return [];
  }
  
  // Step 3: Generate possible circuit combinations
  const circuitCombinations = generateCircuitCombinations(
    eligibleCities,
    formData.duration
  );
  
  // Step 4: Score each circuit and create circuit objects
  const circuits: Circuit[] = circuitCombinations.map((cities, index) => {
    const score = calculateCircuitScore(cities, formData);
    const dayWisePlan = generateDayWisePlan(cities, formData.duration, formData.learning_goals);
    const justification = generateAcademicJustification(cities, formData, score);
    
    const cityNames = cities.map(c => c.city);
    const name = `${cityNames[0]} to ${cityNames[cityNames.length - 1]} Circuit`;
    
    return {
      id: generateCircuitId(),
      name,
      academic_year: formData.academic_year,
      semester: formData.semester || undefined,
      duration: formData.duration,
      learning_goals: formData.learning_goals,
      cities: cityNames,
      day_wise_plan: dayWisePlan,
      academic_justification: justification,
      status: 'Draft',
      created_at: new Date().toISOString(),
      constraints: formData.constraints,
      score
    };
  });
  
  // Step 5: Sort by total score and return top 5
  circuits.sort((a, b) => b.score.total - a.score.total);
  
  return circuits.slice(0, 5);
}

// Get city data by name
export function getCityByName(cityName: string): City | undefined {
  return CITIES_DATABASE.find(c => c.city === cityName);
}

// Find alternative cities for replacement
export function findAlternativeCities(
  currentCity: string,
  formData: CircuitFormData
): City[] {
  const current = getCityByName(currentCity);
  if (!current) return [];
  
  // Find cities with similar learning focus and characteristics
  const alternatives = CITIES_DATABASE.filter(city => {
    if (city.city === currentCity) return false;
    
    // Must be for same academic year
    const yearMatch = city.ideal_years.includes(formData.academic_year as 1 | 2 | 3);
    
    // Should have similar learning focus
    const focusMatch = city.learning_focus.some(f => current.learning_focus.includes(f));
    
    // Similar region preference
    const regionMatch = city.region === current.region;
    
    return yearMatch && focusMatch;
  });
  
  return alternatives.slice(0, 5);
}
