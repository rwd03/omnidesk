namespace OmniDesk.Api.Models
{
    public class Ticket
    {
        public int Id { get; set; }

        public string ReferenceNumber { get; set; } = string.Empty;

        public string Title { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public int CategoryId { get; set; }
        public Category? Category { get; set; }

        public int PriorityId { get; set; }
        public Priority? Priority { get; set; }

        public int StatusId { get; set; }
        public Status? Status { get; set; }

        public int CreatedByUserId { get; set; }
        public User? CreatedByUser { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }
    }
}