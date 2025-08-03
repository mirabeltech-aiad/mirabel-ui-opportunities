/**
 * @fileoverview Data Sanitization Patterns
 * 
 * Comprehensive data sanitization utilities for security and data quality.
 * Includes input sanitization, XSS prevention, and data normalization.
 * 
 * @author Security Team
 * @since 1.0.0
 */

/**
 * Sanitization configuration options
 */
export interface SanitizationConfig {
  /** Trim whitespace */
  trim?: boolean;
  /** Convert to lowercase */
  lowercase?: boolean;
  /** Remove HTML tags */
  stripHtml?: boolean;
  /** Escape HTML entities */
  escapeHtml?: boolean;
  /** Remove special characters */
  removeSpecialChars?: boolean;
  /** Allow specific characters */
  allowedChars?: string;
  /** Maximum length */
  maxLength?: number;
  /** Custom sanitizer function */
  customSanitizer?: (value: string) => string;
}

/**
 * HTML entity mapping for escaping
 */
const HTML_ENTITIES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;',
} as const;

/**
 * Base sanitization functions
 */
export const BaseSanitizers = {
  /**
   * Trim whitespace from string
   */
  trim: (value: string): string => value.trim(),

  /**
   * Convert string to lowercase
   */
  lowercase: (value: string): string => value.toLowerCase(),

  /**
   * Remove HTML tags from string
   */
  stripHtml: (value: string): string => {
    return value.replace(/<[^>]*>/g, '');
  },

  /**
   * Escape HTML entities
   */
  escapeHtml: (value: string): string => {
    return value.replace(/[&<>"'/]/g, (match) => HTML_ENTITIES[match] || match);
  },

  /**
   * Remove special characters (keep alphanumeric, spaces, basic punctuation)
   */
  removeSpecialChars: (value: string): string => {
    return value.replace(/[^\w\s\-.,!?@]/g, '');
  },

  /**
   * Keep only allowed characters
   */
  keepAllowedChars: (value: string, allowedChars: string): string => {
    const regex = new RegExp(`[^${allowedChars.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}]`, 'g');
    return value.replace(regex, '');
  },

  /**
   * Limit string length
   */
  limitLength: (value: string, maxLength: number): string => {
    return value.length > maxLength ? value.slice(0, maxLength) : value;
  },

  /**
   * Remove control characters
   */
  removeControlChars: (value: string): string => {
    return value.replace(/[\x00-\x1F\x7F]/g, '');
  },

  /**
   * Normalize whitespace (collapse multiple spaces)
   */
  normalizeWhitespace: (value: string): string => {
    return value.replace(/\s+/g, ' ').trim();
  },
} as const;

/**
 * Create a customizable sanitizer
 */
export function createSanitizer(config: SanitizationConfig = {}) {
  const {
    trim = true,
    lowercase = false,
    stripHtml = false,
    escapeHtml = false,
    removeSpecialChars = false,
    allowedChars,
    maxLength,
    customSanitizer,
  } = config;

  return (value: string): string => {
    let sanitized = value;

    // Apply sanitization steps in order
    if (trim) {
      sanitized = BaseSanitizers.trim(sanitized);
    }

    if (stripHtml) {
      sanitized = BaseSanitizers.stripHtml(sanitized);
    }

    if (escapeHtml) {
      sanitized = BaseSanitizers.escapeHtml(sanitized);
    }

    if (removeSpecialChars) {
      sanitized = BaseSanitizers.removeSpecialChars(sanitized);
    }

    if (allowedChars) {
      sanitized = BaseSanitizers.keepAllowedChars(sanitized, allowedChars);
    }

    if (lowercase) {
      sanitized = BaseSanitizers.lowercase(sanitized);
    }

    // Remove control characters
    sanitized = BaseSanitizers.removeControlChars(sanitized);

    // Normalize whitespace
    sanitized = BaseSanitizers.normalizeWhitespace(sanitized);

    if (maxLength) {
      sanitized = BaseSanitizers.limitLength(sanitized, maxLength);
    }

    if (customSanitizer) {
      sanitized = customSanitizer(sanitized);
    }

    return sanitized;
  };
}

/**
 * Domain-specific sanitizers
 */
export const DomainSanitizers = {
  /**
   * Sanitize email addresses
   */
  email: createSanitizer({
    trim: true,
    lowercase: true,
    allowedChars: 'a-zA-Z0-9@._-',
    maxLength: 254,
  }),

  /**
   * Sanitize usernames
   */
  username: createSanitizer({
    trim: true,
    lowercase: true,
    allowedChars: 'a-zA-Z0-9_-',
    maxLength: 50,
  }),

  /**
   * Sanitize names (first name, last name)
   */
  name: createSanitizer({
    trim: true,
    allowedChars: 'a-zA-ZÀ-ÿ\\s\\-\'.',
    maxLength: 100,
    customSanitizer: (value) => {
      // Capitalize first letter of each word
      return value.replace(/\b\w/g, (char) => char.toUpperCase());
    },
  }),

  /**
   * Sanitize phone numbers
   */
  phone: createSanitizer({
    trim: true,
    allowedChars: '0-9+()\\s-',
    maxLength: 20,
  }),

  /**
   * Sanitize search queries
   */
  searchQuery: createSanitizer({
    trim: true,
    stripHtml: true,
    maxLength: 100,
    customSanitizer: (value) => {
      // Remove SQL injection patterns
      return value.replace(/['";\\]/g, '');
    },
  }),

  /**
   * Sanitize URLs
   */
  url: createSanitizer({
    trim: true,
    lowercase: true,
    allowedChars: 'a-zA-Z0-9:/?#[]@!$&\'()*+,;=._~%-',
    maxLength: 2048,
  }),

  /**
   * Sanitize file names
   */
  filename: createSanitizer({
    trim: true,
    allowedChars: 'a-zA-Z0-9._-',
    maxLength: 255,
    customSanitizer: (value) => {
      // Ensure filename doesn't start with dot or dash
      return value.replace(/^[.-]/, '');
    },
  }),

  /**
   * Sanitize rich text content
   */
  richText: createSanitizer({
    trim: true,
    escapeHtml: true,
    maxLength: 10000,
    customSanitizer: (value) => {
      // Allow specific HTML tags for rich text
      const allowedTags = ['<p>', '</p>', '<br>', '<strong>', '</strong>', '<em>', '</em>'];
      let sanitized = value;
      
      // First escape all HTML
      sanitized = BaseSanitizers.escapeHtml(sanitized);
      
      // Then un-escape allowed tags
      allowedTags.forEach(tag => {
        const escaped = BaseSanitizers.escapeHtml(tag);
        sanitized = sanitized.replace(new RegExp(escaped, 'g'), tag);
      });
      
      return sanitized;
    },
  }),

  /**
   * Sanitize SQL input (for raw queries)
   */
  sqlInput: createSanitizer({
    trim: true,
    stripHtml: true,
    customSanitizer: (value) => {
      // Remove common SQL injection patterns
      const dangerousPatterns = [
        /['";]/g,                    // Quotes and semicolons
        /--/g,                       // SQL comments
        /\/\*[\s\S]*?\*\//g,        // Multi-line comments
        /\b(DROP|DELETE|INSERT|UPDATE|EXEC|EXECUTE)\b/gi,  // Dangerous SQL commands
      ];
      
      let sanitized = value;
      dangerousPatterns.forEach(pattern => {
        sanitized = sanitized.replace(pattern, '');
      });
      
      return sanitized;
    },
  }),
} as const;

/**
 * Batch sanitization for objects
 */
export function sanitizeObject<T extends Record<string, any>>(
  obj: T,
  sanitizers: Partial<Record<keyof T, (value: any) => any>>
): T {
  const sanitized = { ...obj } as T;

  Object.entries(sanitizers).forEach(([key, sanitizer]) => {
    if (key in sanitized && typeof (sanitized as any)[key] === 'string' && sanitizer) {
      (sanitized as any)[key] = sanitizer((sanitized as any)[key]);
    }
  });

  return sanitized;
}

/**
 * Array sanitization
 */
export function sanitizeArray<T>(
  array: T[],
  sanitizer: (item: T) => T
): T[] {
  return array.map(sanitizer);
}

/**
 * Pre-configured object sanitizers
 */
export const ObjectSanitizers = {
  /**
   * User profile sanitization
   */
  userProfile: (data: any) =>
    sanitizeObject(data, {
      email: DomainSanitizers.email,
      firstName: DomainSanitizers.name,
      lastName: DomainSanitizers.name,
      username: DomainSanitizers.username,
      phone: DomainSanitizers.phone,
    }),

  /**
   * Search filters sanitization
   */
  searchFilters: (data: any) =>
    sanitizeObject(data, {
      search: DomainSanitizers.searchQuery,
      category: createSanitizer({ trim: true, stripHtml: true, maxLength: 50 }),
      status: createSanitizer({ trim: true, allowedChars: 'a-zA-Z0-9_-', maxLength: 30 }),
    }),

  /**
   * Report parameters sanitization
   */
  reportParameters: (data: any) =>
    sanitizeObject(data, {
      title: createSanitizer({ trim: true, escapeHtml: true, maxLength: 200 }),
      description: createSanitizer({ trim: true, escapeHtml: true, maxLength: 1000 }),
      filename: DomainSanitizers.filename,
    }),
} as const;

/**
 * Validation and sanitization pipeline
 */
export function createValidationSanitizationPipeline<T>(config: {
  sanitizer?: (data: T) => T;
  validator?: (data: T) => { isValid: boolean; errors?: string[] };
}) {
  const { sanitizer, validator } = config;

  return (data: T) => {
    // First sanitize
    const sanitized = sanitizer ? sanitizer(data) : data;

    // Then validate
    const validation = validator ? validator(sanitized) : { isValid: true };

    return {
      sanitized,
      isValid: validation.isValid,
      errors: validation.errors || [],
    };
  };
}