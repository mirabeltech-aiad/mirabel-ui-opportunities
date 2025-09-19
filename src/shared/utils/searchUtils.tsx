/**
 * Advanced search utilities for column selector
 */

export interface SearchMatch {
  field: string
  value: string
  matchedText: string
  startIndex: number
  endIndex: number
  score: number
}

export interface SearchResult {
  item: any
  matches: SearchMatch[]
  totalScore: number
}

/**
 * Calculate Levenshtein distance for fuzzy matching
 */
export function levenshteinDistance(str1: string, str2: string): number {
  const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null))
  
  for (let i = 0; i <= str1.length; i++) {
    matrix[0][i] = i
  }
  
  for (let j = 0; j <= str2.length; j++) {
    matrix[j][0] = j
  }
  
  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1, // deletion
        matrix[j - 1][i] + 1, // insertion
        matrix[j - 1][i - 1] + indicator // substitution
      )
    }
  }
  
  return matrix[str2.length][str1.length]
}

/**
 * Calculate fuzzy match score (0-1, higher is better)
 */
export function fuzzyMatchScore(searchTerm: string, text: string): number {
  if (!searchTerm || !text) return 0
  
  const searchLower = searchTerm.toLowerCase()
  const textLower = text.toLowerCase()
  
  // Exact match gets highest score
  if (textLower === searchLower) return 1
  
  // Starts with gets high score
  if (textLower.startsWith(searchLower)) return 0.9
  
  // Contains gets medium score
  if (textLower.includes(searchLower)) return 0.7
  
  // Fuzzy match based on Levenshtein distance
  const distance = levenshteinDistance(searchLower, textLower)
  const maxLength = Math.max(searchLower.length, textLower.length)
  const similarity = 1 - (distance / maxLength)
  
  // Only consider it a match if similarity is above threshold
  return similarity > 0.6 ? similarity * 0.5 : 0
}

/**
 * Find all matches of search term in text
 */
export function findMatches(searchTerm: string, text: string): { start: number; end: number }[] {
  if (!searchTerm || !text) return []
  
  const matches: { start: number; end: number }[] = []
  const searchLower = searchTerm.toLowerCase()
  const textLower = text.toLowerCase()
  
  let startIndex = 0
  while (startIndex < textLower.length) {
    const index = textLower.indexOf(searchLower, startIndex)
    if (index === -1) break
    
    matches.push({
      start: index,
      end: index + searchTerm.length
    })
    
    startIndex = index + 1
  }
  
  return matches
}

/**
 * Highlight search matches in text
 */
export function highlightMatches(text: string, searchTerm: string): React.ReactNode[] {
  if (!searchTerm || !text) return [text]
  
  const matches = findMatches(searchTerm, text)
  if (matches.length === 0) return [text]
  
  const result: React.ReactNode[] = []
  let lastIndex = 0
  
  matches.forEach((match, index) => {
    // Add text before match
    if (match.start > lastIndex) {
      result.push(text.substring(lastIndex, match.start))
    }
    
    // Add highlighted match
    result.push(
      <mark key={`match-${index}`} className="bg-yellow-200 text-yellow-900 px-0.5 rounded">
        {text.substring(match.start, match.end)}
      </mark>
    )
    
    lastIndex = match.end
  })
  
  // Add remaining text
  if (lastIndex < text.length) {
    result.push(text.substring(lastIndex))
  }
  
  return result
}

/**
 * Advanced search function with fuzzy matching and scoring
 */
export function advancedSearch<T>(
  items: T[],
  searchTerm: string,
  searchFields: (keyof T)[],
  options: {
    fuzzySearch?: boolean
    maxResults?: number
    minScore?: number
  } = {}
): SearchResult[] {
  if (!searchTerm.trim()) return []
  
  const { fuzzySearch = false, maxResults = 50, minScore = 0.1 } = options
  
  const results: SearchResult[] = []
  
  items.forEach(item => {
    const matches: SearchMatch[] = []
    let totalScore = 0
    
    searchFields.forEach(field => {
      const value = item[field]
      if (!value) return
      
      let fieldValue: string
      if (Array.isArray(value)) {
        fieldValue = value.join(' ')
      } else {
        fieldValue = String(value)
      }
      
      let score = 0
      if (fuzzySearch) {
        score = fuzzyMatchScore(searchTerm, fieldValue)
      } else {
        // Simple contains match
        score = fieldValue.toLowerCase().includes(searchTerm.toLowerCase()) ? 1 : 0
      }
      
      if (score > 0) {
        const matchPositions = findMatches(searchTerm, fieldValue)
        matches.push({
          field: String(field),
          value: fieldValue,
          matchedText: searchTerm,
          startIndex: matchPositions[0]?.start || 0,
          endIndex: matchPositions[0]?.end || 0,
          score
        })
        totalScore += score
      }
    })
    
    if (totalScore >= minScore) {
      results.push({
        item,
        matches,
        totalScore
      })
    }
  })
  
  // Sort by score (highest first)
  results.sort((a, b) => b.totalScore - a.totalScore)
  
  return results.slice(0, maxResults)
}

/**
 * Search history management
 */
export class SearchHistory {
  private history: string[] = []
  private maxSize: number
  
  constructor(maxSize: number = 10) {
    this.maxSize = maxSize
  }
  
  add(searchTerm: string): void {
    if (!searchTerm.trim()) return
    
    // Remove if already exists
    this.history = this.history.filter(term => term !== searchTerm)
    
    // Add to beginning
    this.history.unshift(searchTerm)
    
    // Limit size
    if (this.history.length > this.maxSize) {
      this.history = this.history.slice(0, this.maxSize)
    }
  }
  
  getHistory(): string[] {
    return [...this.history]
  }
  
  clear(): void {
    this.history = []
  }
  
  remove(searchTerm: string): void {
    this.history = this.history.filter(term => term !== searchTerm)
  }
}