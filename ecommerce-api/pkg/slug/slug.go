package slug

import (
	"fmt"
	"regexp"
	"strings"
	"time"
	"unicode"

	"golang.org/x/text/unicode/norm"
)

var (
	reNonAlphanumeric = regexp.MustCompile(`[^a-z0-9\-]+`)
	reMultipleDash    = regexp.MustCompile(`-{2,}`)
)

// Make converts a title string to a URL-friendly slug.
// e.g. "Sepatu Nike Air Max" → "sepatu-nike-air-max"
func Make(title string) string {
	// Normalize unicode characters (decompose accented chars)
	normalized := norm.NFKD.String(title)

	// Remove non-ASCII letters that are not basic latin
	var sb strings.Builder
	for _, r := range normalized {
		if unicode.IsLetter(r) || unicode.IsDigit(r) {
			if r < 128 {
				sb.WriteRune(unicode.ToLower(r))
			}
			// Skip non-ASCII after decomposition
		} else if unicode.IsSpace(r) || r == '-' {
			sb.WriteRune('-')
		}
	}

	s := sb.String()
	s = reNonAlphanumeric.ReplaceAllString(s, "-")
	s = reMultipleDash.ReplaceAllString(s, "-")
	s = strings.Trim(s, "-")
	return s
}

// MakeUnique appends a short timestamp suffix to ensure uniqueness.
func MakeUnique(title string) string {
	base := Make(title)
	suffix := fmt.Sprintf("%d", time.Now().UnixNano()%100000)
	if base == "" {
		return suffix
	}
	return base + "-" + suffix
}
