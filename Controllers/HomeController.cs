using System;
using System.IO;
using System.Linq;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using SIREN.Models;

namespace SIREN.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly IWebHostEnvironment _hostingEnvironment;
        private readonly SIREN.Data.ApplicationDbContext _db;

        public HomeController(ILogger<HomeController> logger, IWebHostEnvironment hostingEnvironment, SIREN.Data.ApplicationDbContext db)
        {
            _logger = logger;
            _hostingEnvironment = hostingEnvironment;
            _db = db;
        }

        public IActionResult Portfolio()
        {
            return View();

        }

        public IActionResult Index()
        {
            return View();

        }

        public IActionResult TaskManager()
        {
            return View();

        }

        public ActionResult DisplayImage(string imageName)
        {
            string imagePath = Path.Combine(_hostingEnvironment.WebRootPath, "cards", imageName);
            return PhysicalFile(imagePath, "image/png");
        }

        public IActionResult Activity_Tracker()
        {
            return View();

        }

        public IActionResult CAD_Creations()
        {
            return View();

        }

        public IActionResult Blackjack()
        {
            return View();

        }

        public IActionResult Privacy()
        {
            return View();
        }

        public IActionResult Monthly_Tracker(int? month, int? year)
        {
            // Default to March 2026 to match the static calendar in the view
            int useMonth = month ?? 3;
            int useYear = year ?? 2026;

            ViewBag.Month = useMonth;
            ViewBag.Year = useYear;

            var activities = _db.ActivityLogs
                .Where(a => a.LogDate.Year == useYear && a.LogDate.Month == useMonth)
                .ToList();

            return View(activities);

        }

        //Attempting to adjust js modal saving to database
        [HttpPost]
        public IActionResult SaveActivity([FromBody] ActivityLog data)
        {
            if (data == null || string.IsNullOrEmpty(data.ActivityType))
            {
                return BadRequest(new { success = false, message = "Invalid data" });
            }

            // Ensure LogDate is set
            if (data.LogDate == default)
            {
                data.LogDate = DateTime.UtcNow;
            }

            // Preserve the ActivityType casing as provided by the client
            _db.ActivityLogs.Add(data);
            _db.SaveChanges();

            // Return the created entity so the client can append it without a full reload
            return Ok(new { success = true, activity = data });
        }

        // Delete an activity by id (posted as JSON { id: 123 })
        public class DeleteRequest { public int id { get; set; } }

        [HttpPost]
        public IActionResult DeleteActivity([FromBody] DeleteRequest req)
        {
            if (req == null || req.id <= 0)
            {
                return BadRequest(new { success = false, message = "Invalid id" });
            }

            var activity = _db.ActivityLogs.Find(req.id);
            if (activity == null)
            {
                return NotFound(new { success = false, message = "Not found" });
            }

            _db.ActivityLogs.Remove(activity);
            _db.SaveChanges();

            return Ok(new { success = true });
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}