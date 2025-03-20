using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace CRMTestCase.Models
{
    public class ApplicationDbContext : IdentityDbContext<User>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }
        public DbSet<Customer> Customers { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Customer>().HasData(
                new Customer
                {
                    Id = 1,
                    FirstName = "John",
                    LastName = "Doe",
                    Email = "john.doe@example.com",
                    Region = "North America",
                    RegistrationDate = new DateTime(2023, 6, 15)
                },
                new Customer
                {
                    Id = 2,
                    FirstName = "Jane",
                    LastName = "Smith",
                    Email = "jane.smith@example.com",
                    Region = "Europe",
                    RegistrationDate = new DateTime(2023, 5, 10)
                },
                new Customer
                {
                    Id = 3,
                    FirstName = "Carlos",
                    LastName = "Gomez",
                    Email = "carlos.gomez@example.com",
                    Region = "South America",
                    RegistrationDate = new DateTime(2023, 7, 22)
                }
            );
        }
    }
}
