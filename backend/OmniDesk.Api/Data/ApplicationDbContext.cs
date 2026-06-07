using Microsoft.EntityFrameworkCore;
using OmniDesk.Api.Models;

namespace OmniDesk.Api.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Role> Roles { get; set; }
    public DbSet<Ticket> Tickets { get; set; }
    public DbSet<Category> Categories { get; set; }
    public DbSet<Priority> Priorities { get; set; }
    public DbSet<Status> Statuses { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Role>().HasData(
            new Role { Id = 1, Name = "Admin" },
            new Role { Id = 2, Name = "Employee" },
            new Role { Id = 3, Name = "IT Support Agent" },
            new Role { Id = 4, Name = "Manager" }
        );

        modelBuilder.Entity<Category>().HasData(
            new Category { Id = 1, Name = "Hardware" },
            new Category { Id = 2, Name = "Software" },
            new Category { Id = 3, Name = "Network" },
            new Category { Id = 4, Name = "Email" },
            new Category { Id = 5, Name = "Access Request" },
            new Category { Id = 6, Name = "Other" }
        );

        modelBuilder.Entity<Priority>().HasData(
            new Priority { Id = 1, Name = "Low" },
            new Priority { Id = 2, Name = "Medium" },
            new Priority { Id = 3, Name = "High" },
            new Priority { Id = 4, Name = "Critical" }
        );

        modelBuilder.Entity<Status>().HasData(
            new Status { Id = 1, Name = "Open" },
            new Status { Id = 2, Name = "In Progress" },
            new Status { Id = 3, Name = "Pending" },
            new Status { Id = 4, Name = "Resolved" },
            new Status { Id = 5, Name = "Closed" }
        );
    }
}