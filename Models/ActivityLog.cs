using System;

namespace SIREN.Models
{
    // Entity used to store activity logs
    public class ActivityLog
    {
        public int Id { get; set; }
        public DateTime LogDate { get; set; }
        public string ActivityType { get; set; } = string.Empty;
        public string? Description { get; set; }
    }

    // Attempting to adjust js modal saving to database
}
