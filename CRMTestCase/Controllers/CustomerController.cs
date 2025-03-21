using CRMTestCase.Models;
using CRMTestCase.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CRMTestCase.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class CustomerController : ControllerBase
    {
        private readonly ICustomerRepository CustomerRepository;
        private readonly ILogger<CustomerController> Logger;

        public CustomerController(ICustomerRepository customerRepository, ILogger<CustomerController> logger)
        {
            CustomerRepository = customerRepository;
            Logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            Logger.LogInformation("GET/api/customer request received.");
            var customer = CustomerRepository.GetAllAsync();
            return Ok(customer);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            Logger.LogInformation($"GET/api/customer/{id} request received.");
            var customer = await CustomerRepository.GetByIdAsync(id);
            if (customer == null)
            {
                Logger.LogWarning($"Customer with ID {id} not found");
                return NotFound();
            }
            return Ok(customer);
        }

        [HttpGet("search")]
        public async Task<IActionResult> Search(
            [FromQuery] string name = null,
            [FromQuery] string email = null,
            [FromQuery] string region = null,
            [FromQuery] DateTime? fromDate = null,
            [FromQuery] DateTime? toDate = null)
        {
            Logger.LogInformation("Search request received with filters");
            var customers = await CustomerRepository.SearchAsync(name, email, region, fromDate, toDate);
            return Ok(customers);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create([FromBody] Customer customer)
        {
            if (!ModelState.IsValid)
            {
                Logger.LogWarning("Invalid model state for customer creation");
                return BadRequest(ModelState);
            }

            Logger.LogInformation("Creating new customer");
            var createdCustomer = await CustomerRepository.AddAsync(customer);
            return CreatedAtAction(nameof(GetById), new { id = createdCustomer.Id }, createdCustomer);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(int id, [FromBody] Customer customer)
        {
            if (id != customer.Id)
            {
                Logger.LogWarning("ID mismatch in update request");
                return BadRequest("ID mismatch");
            }

            if (!ModelState.IsValid)
            {
                Logger.LogWarning("Invalid model state for customer update");
                return BadRequest(ModelState);
            }

            try
            {
                Logger.LogInformation($"Updating customer with ID {id}");
                await CustomerRepository.UpdateAsync(customer);
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, $"Error updating customer with ID {id}");
                return StatusCode(500, "Internal server error");
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            Logger.LogInformation($"Deleting customer with ID {id}");
            await CustomerRepository.DeleteAsync(id);
            return NoContent();
        }
    }
}
