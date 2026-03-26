using Microsoft.EntityFrameworkCore;
using SIREN.Models;

namespace SIREN.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<ActivityLog> ActivityLogs { get; set; } = null!;
    }
}
