// Package currency provides utilities for handling monetary values.
// All amounts are stored as int64 in the smallest unit (cents / persen).
// For IDR: 1 IDR = 1 unit (no decimal).
package currency

import (
	"fmt"
	"strings"
)

// FormatIDR formats an integer amount as Indonesian Rupiah string.
// e.g. 150000 → "Rp 150.000"
func FormatIDR(amount int64) string {
	s := fmt.Sprintf("%d", amount)
	result := make([]byte, 0, len(s)+len(s)/3)
	for i, c := range s {
		if i > 0 && (len(s)-i)%3 == 0 {
			result = append(result, '.')
		}
		result = append(result, byte(c))
	}
	return "Rp " + string(result)
}

// ParseIDR parses an IDR string like "Rp 150.000" or "150000" into int64.
func ParseIDR(s string) (int64, error) {
	s = strings.ReplaceAll(s, "Rp", "")
	s = strings.ReplaceAll(s, ".", "")
	s = strings.TrimSpace(s)
	var amount int64
	_, err := fmt.Sscanf(s, "%d", &amount)
	return amount, err
}

// ApplyDiscount calculates the final price after applying a percentage discount.
// discount is 0-100.
func ApplyDiscount(price int64, discountPct float64) int64 {
	if discountPct <= 0 {
		return price
	}
	return price - int64(float64(price)*discountPct/100)
}
