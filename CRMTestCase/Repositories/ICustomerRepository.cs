using CRMTestCase.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CRMTestCase.Repositories
{
    public interface ICustomerRepository
    {
        Task<IEnumerable<Customer>> GetAllAsync();
        Task<Customer> GetByIdAsync(int id);
        Task<IEnumerable<Customer>> SearchAsync(string name = null, string email = null, string region = null, DateTime? fromDate = null, DateTime? toDate = null);
        Task<Customer> AddAsync(Customer customer);
        Task UpdateAsync(Customer customer);
        Task DeleteAsync(int id);
    }
}
