using CRMTestCase.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CRMTestCase.Repositories
{
    public class CustomerRepository : ICustomerRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<CustomerRepository> _logger;

        public CustomerRepository(ApplicationDbContext context, ILogger<CustomerRepository> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<IEnumerable<Customer>> GetAllAsync()
        {
            _logger.LogInformation("Fetching all customers");
            return await _context.Customers.ToListAsync();
        }

        public async Task<Customer> GetByIdAsync(int id)
        {
            _logger.LogInformation($"Fetching customer with ID: {id}");
            return await _context.Customers.FindAsync(id);
        }

        public async Task<IEnumerable<Customer>> SearchAsync(string name = null, string email = null, string region = null, DateTime? fromDate = null, DateTime? toDate = null)
        {
            _logger.LogInformation("Searching customers with filters");

            var query = _context.Customers.AsQueryable();

            if (!string.IsNullOrWhiteSpace(name))
            {
                query = query.Where(c => c.FirstName.Contains(name) || c.LastName.Contains(name));
            }

            if (!string.IsNullOrWhiteSpace(email))
            {
                query = query.Where(c => c.Email.Contains(email));
            }

            if (!string.IsNullOrWhiteSpace(region))
            {
                query = query.Where(c => c.Region == region);
            }

            if (fromDate.HasValue)
            {
                query = query.Where(c => c.RegistrationDate >= fromDate.Value);
            }

            if (toDate.HasValue)
            {
                query = query.Where(c => c.RegistrationDate <= toDate.Value);
            }

            return await query.ToListAsync();
        }

        public async Task<Customer> AddAsync(Customer customer)
        {
            _logger.LogInformation($"Adding new customer: {customer.FirstName} {customer.LastName}");
            _context.Customers.Add(customer);
            await _context.SaveChangesAsync();
            return customer;
        }

        public async Task UpdateAsync(Customer customer)
        {
            _logger.LogInformation($"Updating customer with ID: {customer.Id}");
            _context.Entry(customer).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            _logger.LogInformation($"Deleting customer with ID: {id}");
            var customer = await _context.Customers.FindAsync(id);
            if (customer != null)
            {
                _context.Customers.Remove(customer);
                await _context.SaveChangesAsync();
            }
        }
    }
}
