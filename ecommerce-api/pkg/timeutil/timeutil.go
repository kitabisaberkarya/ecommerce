package timeutil

import "time"

// WIB is the Jakarta / Indonesia Western time zone (UTC+7).
var WIB = mustLoadLocation("Asia/Jakarta")

func mustLoadLocation(name string) *time.Location {
	loc, err := time.LoadLocation(name)
	if err != nil {
		// Fallback to fixed offset if tz data not available
		loc = time.FixedZone("WIB", 7*3600)
	}
	return loc
}

// NowWIB returns the current time in WIB.
func NowWIB() time.Time {
	return time.Now().In(WIB)
}

// StartOfDay returns midnight of the given date in WIB.
func StartOfDay(t time.Time) time.Time {
	y, m, d := t.In(WIB).Date()
	return time.Date(y, m, d, 0, 0, 0, 0, WIB)
}

// EndOfDay returns 23:59:59.999 of the given date in WIB.
func EndOfDay(t time.Time) time.Time {
	y, m, d := t.In(WIB).Date()
	return time.Date(y, m, d, 23, 59, 59, int(time.Second-time.Nanosecond), WIB)
}

// IsExpired reports whether t is before now.
func IsExpired(t *time.Time) bool {
	if t == nil {
		return false
	}
	return time.Now().After(*t)
}

// FormatDate returns a date string in "02 Jan 2006" format.
func FormatDate(t time.Time) string {
	return t.In(WIB).Format("02 Jan 2006")
}

// FormatDateTime returns a datetime string in "02 Jan 2006 15:04" format.
func FormatDateTime(t time.Time) string {
	return t.In(WIB).Format("02 Jan 2006 15:04")
}
