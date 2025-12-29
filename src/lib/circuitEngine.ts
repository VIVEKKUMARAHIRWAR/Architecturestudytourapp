// Rule-based Academic Circuit Generation Engine

import { Circuit, CircuitConstraints, CircuitScore, LearningGoal, AcademicYear, DayActivity, City } from './types';
import { CITIES } from './data';

interface CircuitCandidate {
  cities: City[];
  score: CircuitScore;
  academic_justification: string;
}

export class CircuitEngine {
  /**
   * Generate academic study tour circuits based on constraints and learning goals
   */
  static generateCircuits(
    academicYear: AcademicYear,
    duration: number,
    learningGoals: LearningGoal[],
    constraints: CircuitConstraints,
    startingCity?: string
  ): CircuitCandidate[] {
    // Step 1: Filter cities by academic year and learning goals
    const eligibleCities = this.filterCitiesByAcademicCriteria(
      academicYear,
      learningGoals,
      constraints
    );

    if (eligibleCities.length === 0) {
      return [];
    }

    // Step 2: Generate possible circuit combinations
    const possibleCircuits = this.generateCircuitCombinations(
      eligibleCities,
      duration,
      constraints,
      startingCity
    );

    // Step 3: Score each circuit
    const scoredCircuits = possibleCircuits.map(cities => ({
      cities,
      score: this.scoreCircuit(cities, academicYear, learningGoals, constraints, duration),
      academic_justification: this.generateAcademicJustification(cities, learningGoals, academicYear)
    }));

    // Step 4: Sort by total score and return top 5
    return scoredCircuits
      .sort((a, b) => b.score.total - a.score.total)
      .slice(0, 5);
  }

  /**
   * Filter cities based on academic year compatibility and learning goals
   */
  private static filterCitiesByAcademicCriteria(
    academicYear: AcademicYear,
    learningGoals: LearningGoal[],
    constraints: CircuitConstraints
  ): City[] {
    return CITIES.filter(city => {
      // Check if city is suitable for the academic year
      if (!city.ideal_years.includes(academicYear)) {
        return false;
      }

      // Check if city matches at least one learning goal
      const hasMatchingGoal = learningGoals.some(goal =>
        city.learning_focus.includes(goal)
      );
      if (!hasMatchingGoal) {
        return false;
      }

      // Check regional constraints
      if (constraints.regions.length > 0 && !constraints.regions.includes(city.region)) {
        return false;
      }

      // Check urban/rural balance (within 1 point tolerance)
      const urbanRuralDiff = Math.abs(city.urban_rural_index - constraints.urban_rural_balance);
      if (urbanRuralDiff > 2) {
        return false;
      }

      // Check heritage/contemporary balance (within 1 point tolerance)
      const heritageDiff = Math.abs(city.heritage_contemporary_index - constraints.heritage_contemporary_balance);
      if (heritageDiff > 2) {
        return false;
      }

      return true;
    });
  }

  /**
   * Generate possible circuit combinations
   */
  private static generateCircuitCombinations(
    cities: City[],
    duration: number,
    constraints: CircuitConstraints,
    startingCity?: string
  ): City[][] {
    const circuits: City[][] = [];
    
    // Determine number of cities based on duration
    const numCities = Math.min(Math.ceil(duration / 2), cities.length, 6);
    
    // Group cities by region for efficient routing
    const citiesByRegion = this.groupCitiesByRegion(cities);

    // Generate circuits focusing on 1-2 regions for travel efficiency
    for (const region of constraints.regions.length > 0 ? constraints.regions : ['North', 'South', 'East', 'West']) {
      const regionalCities = citiesByRegion[region] || [];
      
      if (regionalCities.length >= numCities) {
        // Single region circuit
        const circuit = this.selectBestCitiesFromPool(regionalCities, numCities, startingCity);
        if (circuit.length >= 2) {
          circuits.push(circuit);
        }
      }
    }

    // Generate multi-region circuits
    if (constraints.regions.length === 0 || constraints.regions.length > 1) {
      const allCitiesShuffled = [...cities].sort(() => Math.random() - 0.5);
      const multiRegionCircuit = this.selectBestCitiesFromPool(allCitiesShuffled, numCities, startingCity);
      if (multiRegionCircuit.length >= 2) {
        circuits.push(multiRegionCircuit);
      }
    }

    // If we have a starting city, generate circuits from there
    if (startingCity) {
      const startCity = cities.find(c => c.city.toLowerCase() === startingCity.toLowerCase());
      if (startCity) {
        const nearbyCircuit = this.generateCircuitFromStartingPoint(startCity, cities, numCities);
        if (nearbyCircuit.length >= 2) {
          circuits.push(nearbyCircuit);
        }
      }
    }

    return circuits.slice(0, 10); // Limit to 10 candidates before scoring
  }

  /**
   * Group cities by region
   */
  private static groupCitiesByRegion(cities: City[]): Record<string, City[]> {
    return cities.reduce((acc, city) => {
      if (!acc[city.region]) {
        acc[city.region] = [];
      }
      acc[city.region].push(city);
      return acc;
    }, {} as Record<string, City[]>);
  }

  /**
   * Select best cities from a pool ensuring diversity
   */
  private static selectBestCitiesFromPool(
    pool: City[],
    count: number,
    startingCity?: string
  ): City[] {
    const selected: City[] = [];
    const remaining = [...pool];

    // Add starting city first if specified
    if (startingCity) {
      const startIdx = remaining.findIndex(c => c.city.toLowerCase() === startingCity.toLowerCase());
      if (startIdx !== -1) {
        selected.push(remaining.splice(startIdx, 1)[0]);
      }
    }

    // Select cities ensuring learning focus diversity
    while (selected.length < count && remaining.length > 0) {
      const bestCity = this.selectNextBestCity(selected, remaining);
      if (bestCity) {
        selected.push(bestCity);
        const idx = remaining.indexOf(bestCity);
        remaining.splice(idx, 1);
      } else {
        break;
      }
    }

    return selected;
  }

  /**
   * Select next best city for diversity
   */
  private static selectNextBestCity(selected: City[], remaining: City[]): City | null {
    if (remaining.length === 0) return null;

    // Score each remaining city based on learning focus diversity
    const scored = remaining.map(city => {
      const existingFocus = new Set(selected.flatMap(c => c.learning_focus));
      const newFocusCount = city.learning_focus.filter(f => !existingFocus.has(f)).length;
      return { city, diversity_score: newFocusCount };
    });

    // Sort by diversity score
    scored.sort((a, b) => b.diversity_score - a.diversity_score);
    return scored[0].city;
  }

  /**
   * Generate circuit from a starting point
   */
  private static generateCircuitFromStartingPoint(
    start: City,
    allCities: City[],
    count: number
  ): City[] {
    const circuit: City[] = [start];
    const remaining = allCities.filter(c => c.id !== start.id);

    // Add cities from the same or nearby regions
    const sameRegion = remaining.filter(c => c.region === start.region);
    const nearbyRegions = this.getNearbyRegions(start.region);
    const nearbyRegionCities = remaining.filter(c => nearbyRegions.includes(c.region));

    const pool = [...sameRegion, ...nearbyRegionCities];
    return this.selectBestCitiesFromPool([start, ...pool], count);
  }

  /**
   * Get nearby regions for travel efficiency
   */
  private static getNearbyRegions(region: string): string[] {
    const regionMap: Record<string, string[]> = {
      'North': ['West', 'East'],
      'South': ['West', 'East'],
      'East': ['North', 'South', 'Northeast'],
      'West': ['North', 'South'],
      'Northeast': ['East'],
      'Islands': ['South']
    };
    return regionMap[region] || [];
  }

  /**
   * Score a circuit based on multiple criteria
   * Total = Academic Match (40) + Travel Efficiency (30) + Pedagogical Progression (20) + User Preference (10)
   */
  private static scoreCircuit(
    cities: City[],
    academicYear: AcademicYear,
    learningGoals: LearningGoal[],
    constraints: CircuitConstraints,
    duration: number
  ): CircuitScore {
    const academicMatch = this.scoreAcademicMatch(cities, learningGoals, academicYear);
    const travelEfficiency = this.scoreTravelEfficiency(cities, constraints, duration);
    const pedagogicalProgression = this.scorePedagogicalProgression(cities, academicYear);
    const userPreference = this.scoreUserPreference(cities, constraints);

    const total = (
      academicMatch * 0.4 +
      travelEfficiency * 0.3 +
      pedagogicalProgression * 0.2 +
      userPreference * 0.1
    );

    return {
      total: Math.round(total * 100) / 100,
      academic_match: Math.round(academicMatch * 100) / 100,
      travel_efficiency: Math.round(travelEfficiency * 100) / 100,
      pedagogical_progression: Math.round(pedagogicalProgression * 100) / 100,
      user_preference: Math.round(userPreference * 100) / 100
    };
  }

  /**
   * Score academic match (0-100)
   */
  private static scoreAcademicMatch(cities: City[], learningGoals: LearningGoal[], academicYear: AcademicYear): number {
    let score = 0;
    const maxScore = learningGoals.length * 100;

    // Check coverage of each learning goal
    learningGoals.forEach(goal => {
      const citiesCoveringGoal = cities.filter(c => c.learning_focus.includes(goal));
      const coverage = Math.min(citiesCoveringGoal.length / 2, 1); // Ideal: 2+ cities per goal
      score += coverage * 100;
    });

    // Check if cities are ideal for the academic year
    const yearMatchCount = cities.filter(c => c.ideal_years.includes(academicYear)).length;
    const yearMatchScore = (yearMatchCount / cities.length) * 100;

    return maxScore > 0 ? (score / learningGoals.length) * 0.7 + yearMatchScore * 0.3 : yearMatchScore;
  }

  /**
   * Score travel efficiency (0-100)
   */
  private static scoreTravelEfficiency(cities: City[], constraints: CircuitConstraints, duration: number): number {
    let score = 100;

    // Check regional clustering
    const regions = new Set(cities.map(c => c.region));
    if (regions.size > 3) {
      score -= 30; // Penalty for too many regions
    } else if (regions.size === 1) {
      score += 10; // Bonus for single region
    }

    // Check if duration matches suggested days
    const totalSuggestedDays = cities.reduce((sum, c) => sum + c.suggested_days, 0);
    const durationMatch = 1 - Math.abs(totalSuggestedDays - duration) / duration;
    score = score * 0.6 + durationMatch * 100 * 0.4;

    // Check travel mode compatibility
    const hasPreferredModes = cities.every(c =>
      c.travel_nodes.some(mode => constraints.preferred_modes.includes(mode))
    );
    if (!hasPreferredModes) {
      score -= 20;
    }

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Score pedagogical progression (0-100)
   */
  private static scorePedagogicalProgression(cities: City[], academicYear: AcademicYear): number {
    let score = 70; // Base score

    // Check for logical progression (simple to complex)
    // Heritage/historical first, contemporary later
    let heritageFirst = true;
    let lastHeritageIndex = 0;
    
    cities.forEach((city, index) => {
      if (city.heritage_contemporary_index <= 2) {
        lastHeritageIndex = index;
      }
      if (index > 0 && city.heritage_contemporary_index < cities[index - 1].heritage_contemporary_index - 2) {
        heritageFirst = false;
      }
    });

    if (heritageFirst || lastHeritageIndex < cities.length / 2) {
      score += 15;
    }

    // Check for learning focus diversity
    const uniqueFocus = new Set(cities.flatMap(c => c.learning_focus));
    const diversityScore = Math.min(uniqueFocus.size / 4, 1) * 15;
    score += diversityScore;

    return Math.min(100, score);
  }

  /**
   * Score user preference match (0-100)
   */
  private static scoreUserPreference(cities: City[], constraints: CircuitConstraints): number {
    let score = 0;
    const count = cities.length;

    // Urban/rural balance
    const avgUrbanRural = cities.reduce((sum, c) => sum + c.urban_rural_index, 0) / count;
    const urbanRuralMatch = 1 - Math.abs(avgUrbanRural - constraints.urban_rural_balance) / 5;
    score += urbanRuralMatch * 50;

    // Heritage/contemporary balance
    const avgHeritage = cities.reduce((sum, c) => sum + c.heritage_contemporary_index, 0) / count;
    const heritageMatch = 1 - Math.abs(avgHeritage - constraints.heritage_contemporary_balance) / 5;
    score += heritageMatch * 50;

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Generate academic justification for a circuit
   */
  private static generateAcademicJustification(
    cities: City[],
    learningGoals: LearningGoal[],
    academicYear: AcademicYear
  ): string {
    const yearText = academicYear === 1 ? 'first' : academicYear === 2 ? 'second' : 'third';
    const focusAreas = new Set(cities.flatMap(c => c.learning_focus));
    const matchedGoals = learningGoals.filter(g => focusAreas.has(g));

    let justification = `This circuit is designed for ${yearText} year architecture students, `;
    justification += `focusing on ${matchedGoals.slice(0, 3).join(', ')}. `;
    
    const regions = new Set(cities.map(c => c.region));
    if (regions.size === 1) {
      justification += `The circuit is concentrated in the ${Array.from(regions)[0]} region, ensuring travel efficiency and allowing deeper engagement with regional architectural typologies. `;
    } else {
      justification += `The circuit spans ${regions.size} regions, providing exposure to diverse architectural responses to climate, culture, and context. `;
    }

    const heritageCount = cities.filter(c => c.heritage_contemporary_index <= 2).length;
    const contemporaryCount = cities.filter(c => c.heritage_contemporary_index >= 4).length;

    if (heritageCount > contemporaryCount) {
      justification += `The emphasis on heritage architecture aligns with understanding fundamental principles and historical precedents.`;
    } else if (contemporaryCount > heritageCount) {
      justification += `The focus on contemporary architecture enables students to understand current practice, building technologies, and regulatory frameworks.`;
    } else {
      justification += `The balance between heritage and contemporary architecture provides a comprehensive understanding of architectural evolution.`;
    }

    return justification;
  }

  /**
   * Generate day-wise academic plan
   */
  static generateDayPlan(cities: City[], learningGoals: LearningGoal[], academicYear: AcademicYear): DayActivity[] {
    const plan: DayActivity[] = [];
    let currentDay = 1;

    cities.forEach((city, index) => {
      const daysInCity = city.suggested_days;
      const cityFocus = city.learning_focus.filter(f => learningGoals.includes(f));

      for (let d = 0; d < daysInCity; d++) {
        const isArrivalDay = d === 0;
        const isDepartureDay = d === daysInCity - 1 && index < cities.length - 1;

        const activity: DayActivity = {
          day: currentDay,
          city: city.city,
          morning: this.generateMorningActivity(city, cityFocus[d % cityFocus.length], isArrivalDay),
          afternoon: this.generateAfternoonActivity(city, cityFocus[(d + 1) % cityFocus.length]),
          evening: this.generateEveningActivity(academicYear, isDepartureDay),
          learning_focus: cityFocus.slice(0, 2)
        };

        plan.push(activity);
        currentDay++;
      }
    });

    return plan;
  }

  private static generateMorningActivity(city: City, focus: LearningGoal, isArrival: boolean): string {
    if (isArrival) {
      return `Arrive in ${city.city}. Orientation and site briefing.`;
    }

    const activities: Record<string, string[]> = {
      'Architectural Principles': [
        'Measured drawing session: Documenting proportion and scale',
        'Sketching exercise: Analyzing composition and form',
        'Site analysis: Understanding context and site response'
      ],
      'Spatial Organization': [
        'Space planning study: Analyzing circulation and hierarchy',
        'Functional zoning documentation',
        'Spatial sequence analysis and documentation'
      ],
      'Climate Responsiveness': [
        'Passive design strategies documentation',
        'Orientation and ventilation study',
        'Material and climate response analysis'
      ],
      'Building Services': [
        'MEP systems documentation',
        'Services integration study',
        'Building systems analysis'
      ],
      'Bye-laws & Regulations': [
        'Site visit: FSI and setback documentation',
        'Regulatory compliance study',
        'Building codes and approval process discussion'
      ],
      'Construction Practices': [
        'Active construction site visit',
        'Material assembly and joinery documentation',
        'Construction methodology study'
      ],
      'Heritage & Conservation': [
        'Heritage site documentation and measured drawing',
        'Conservation techniques study',
        'Historical architectural analysis'
      ]
    };

    const options = activities[focus] || ['Site visit and documentation'];
    return options[Math.floor(Math.random() * options.length)];
  }

  private static generateAfternoonActivity(city: City, focus: LearningGoal): string {
    const activities: Record<string, string[]> = {
      'Architectural Principles': [
        'Detailed documentation: Proportional systems and geometric analysis',
        'Comparative study of multiple buildings',
        'Contextual analysis and site mapping'
      ],
      'Spatial Organization': [
        'Spatial experience walkthrough and documentation',
        'Diagram development: Circulation and zoning',
        'User observation and behavioral mapping'
      ],
      'Climate Responsiveness': [
        'Climate data collection and analysis',
        'Vernacular building techniques study',
        'Environmental performance assessment'
      ],
      'Building Services': [
        'Technical systems deep dive',
        'Services coordination study',
        'Sustainable systems analysis'
      ],
      'Bye-laws & Regulations': [
        'Discussion with local architect on regulatory frameworks',
        'Case study: Development control regulations',
        'Site planning and bye-law compliance analysis'
      ],
      'Construction Practices': [
        'Discussion with site engineer / contractor',
        'Construction sequence documentation',
        'Quality control and site management observation'
      ],
      'Heritage & Conservation': [
        'Architectural photography and analysis',
        'Historical research and contextual study',
        'Material degradation and conservation study'
      ]
    };

    const options = activities[focus] || ['Continued site documentation'];
    return options[Math.floor(Math.random() * options.length)];
  }

  private static generateEveningActivity(academicYear: AcademicYear, isDeparture: boolean): string {
    if (isDeparture) {
      return 'Travel to next city';
    }

    const activities = [
      'Group discussion: Synthesizing observations and learnings',
      'Pin-up session: Sharing documentation and sketches',
      'Reflective journaling and sketch compilation',
      'Faculty-led discussion on key takeaways',
      'Peer review of documentation work',
      'Preparation for next day\'s site visits'
    ];

    return activities[Math.floor(Math.random() * activities.length)];
  }
}
