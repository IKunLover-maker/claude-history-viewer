/**
 * XML parsing utilities for extracting summary content from user messages.
 * Uses regex-based parsing to work in both server and client environments.
 */

export interface ParsedXmlContent {
  summaries: string[]      // Extracted <summary> text content
  nonXmlContent: string    // Text outside XML tags
  hasXmlStructure: boolean // Whether XML structure was detected
  rawContent: string       // Original content
}

/**
 * Extracts <summary> content from XML-structured text.
 * Supports multiple <root> elements and extracts all <summary> tags.
 *
 * @param content - The content to parse
 * @returns ParsedContent with summaries and non-XML content
 */
export function parseXmlSummaries(content: string): ParsedXmlContent {
  // If not a string, return empty result
  if (typeof content !== 'string') {
    return {
      summaries: [],
      nonXmlContent: String(content),
      hasXmlStructure: false,
      rawContent: String(content)
    }
  }

  const trimmedContent = content.trim()

  // Check if content contains XML-like tags
  if (!trimmedContent.includes('<') || !trimmedContent.includes('>')) {
    return {
      summaries: [],
      nonXmlContent: content,
      hasXmlStructure: false,
      rawContent: content
    }
  }

  try {
    // Extract all <summary>...</summary> content using regex
    // This pattern matches <summary> tags with any content inside
    const summaryRegex = /<summary>([\s\S]*?)<\/summary>/gi
    const summaries: string[] = []
    let match: RegExpExecArray | null

    // Extract all summaries
    while ((match = summaryRegex.exec(trimmedContent)) !== null) {
      const summaryText = match[1]?.trim()
      if (summaryText) {
        summaries.push(summaryText)
      }
    }

    // Extract non-XML content by removing all XML-tagged sections
    // This regex matches complete XML tags with their content
    let nonXmlContent = content

    // Remove all <tag>content</tag> patterns
    nonXmlContent = nonXmlContent.replace(/<[^>]+>[\s\S]*?<\/[^>]+>/g, '')
    // Remove any remaining self-closing or unclosed tags
    nonXmlContent = nonXmlContent.replace(/<[^>]+>/g, '')
    // Clean up whitespace
    nonXmlContent = nonXmlContent.trim()

    return {
      summaries,
      nonXmlContent,
      hasXmlStructure: summaries.length > 0,
      rawContent: content
    }
  } catch (error) {
    // If parsing fails, return original content as non-XML
    return {
      summaries: [],
      nonXmlContent: content,
      hasXmlStructure: false,
      rawContent: content
    }
  }
}

/**
 * Checks if content contains XML structure with <summary> tags.
 *
 * @param content - The content to check
 * @returns true if content has XML with summary tags
 */
export function hasXmlSummaries(content: string): boolean {
  const parsed = parseXmlSummaries(content)
  return parsed.hasXmlStructure
}
