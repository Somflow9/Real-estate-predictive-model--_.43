
interface PromptSuggestion {
  id: string;
  text: string;
  category: 'price' | 'location' | 'builder' | 'trend' | 'investment';
  priority: number;
}

export class PromptSuggestionsService {
  private suggestions: PromptSuggestion[] = [
    { id: '1', text: "What's trending in Mumbai?", category: 'trend', priority: 9 },
    { id: '2', text: "Should I buy now in Delhi?", category: 'investment', priority: 8 },
    { id: '3', text: "Compare builders in Bangalore", category: 'builder', priority: 7 },
    { id: '4', text: "Best areas in Pune under ₹80L", category: 'location', priority: 8 },
    { id: '5', text: "Price prediction for Hyderabad", category: 'price', priority: 9 },
    { id: '6', text: "Gurgaon vs Noida - which is better?", category: 'location', priority: 7 },
    { id: '7', text: "Is DLF reliable in NCR?", category: 'builder', priority: 6 },
    { id: '8', text: "Best time to buy in Chennai", category: 'investment', priority: 8 },
    { id: '9', text: "Affordable options in Ahmedabad", category: 'price', priority: 7 },
    { id: '10', text: "Price trends in IT corridors", category: 'trend', priority: 8 },
    { id: '11', text: "Safety ratings for localities", category: 'location', priority: 6 },
    { id: '12', text: "Metro connectivity impact on prices", category: 'trend', priority: 7 }
  ];

  getDynamicSuggestions(
    messageCount: number,
    lastQuery?: string,
    userInterests?: string[]
  ): PromptSuggestion[] {
    let filteredSuggestions = [...this.suggestions];

    // Behavior-based filtering
    if (messageCount === 0) {
      // First time users - show trending and popular queries
      filteredSuggestions = filteredSuggestions.filter(s => 
        s.category === 'trend' || s.priority >= 8
      );
    } else if (messageCount < 3) {
      // Early users - show diverse categories
      filteredSuggestions = this.diversifyCategories(filteredSuggestions);
    } else {
      // Returning users - personalize based on previous queries
      if (lastQuery) {
        filteredSuggestions = this.getRelatedSuggestions(lastQuery, filteredSuggestions);
      }
    }

    // Apply user interests if available
    if (userInterests && userInterests.length > 0) {
      filteredSuggestions = filteredSuggestions.filter(s =>
        userInterests.some(interest => 
          s.text.toLowerCase().includes(interest.toLowerCase())
        )
      );
    }

    // Sort by priority and return top 3-4 suggestions
    return filteredSuggestions
      .sort((a, b) => b.priority - a.priority)
      .slice(0, Math.min(4, filteredSuggestions.length));
  }

  private diversifyCategories(suggestions: PromptSuggestion[]): PromptSuggestion[] {
    const categoryCounts: Record<string, number> = {};
    const result: PromptSuggestion[] = [];

    for (const suggestion of suggestions.sort((a, b) => b.priority - a.priority)) {
      const count = categoryCounts[suggestion.category] || 0;
      if (count < 2) { // Max 2 per category
        result.push(suggestion);
        categoryCounts[suggestion.category] = count + 1;
      }
    }

    return result;
  }

  private getRelatedSuggestions(
    lastQuery: string,
    suggestions: PromptSuggestion[]
  ): PromptSuggestion[] {
    const query = lastQuery.toLowerCase();
    
    // Extract context from last query
    let relatedCategory: string | null = null;
    let cityMentioned: string | null = null;

    if (query.includes('price') || query.includes('cost') || query.includes('₹')) {
      relatedCategory = 'investment';
    } else if (query.includes('builder') || query.includes('dlf') || query.includes('godrej')) {
      relatedCategory = 'builder';
    } else if (query.includes('trend') || query.includes('growth') || query.includes('market')) {
      relatedCategory = 'trend';
    }

    const cities = ['mumbai', 'delhi', 'bangalore', 'pune', 'hyderabad', 'chennai', 'gurgaon'];
    cityMentioned = cities.find(city => query.includes(city)) || null;

    // Filter suggestions based on context
    return suggestions.filter(s => {
      if (relatedCategory && s.category === relatedCategory) return true;
      if (cityMentioned && s.text.toLowerCase().includes(cityMentioned)) return true;
      return s.priority >= 7; // Fallback to high priority suggestions
    });
  }

  addCustomSuggestion(text: string, category: PromptSuggestion['category']): void {
    const newSuggestion: PromptSuggestion = {
      id: Date.now().toString(),
      text,
      category,
      priority: 5
    };
    this.suggestions.push(newSuggestion);
  }
}

export const promptSuggestionsService = new PromptSuggestionsService();
