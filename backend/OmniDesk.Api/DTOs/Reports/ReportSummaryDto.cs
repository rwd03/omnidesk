namespace OmniDesk.Api.DTOs.Reports
{
    public class ReportSummaryDto
    {
        public int TotalTickets { get; set; }

        public int OpenTickets { get; set; }

        public int InProgressTickets { get; set; }

        public int PendingTickets { get; set; }

        public int ResolvedTickets { get; set; }

        public int ClosedTickets { get; set; }

        public List<ReportGroupItemDto> TicketsByCategory { get; set; } = [];

        public List<ReportGroupItemDto> TicketsByPriority { get; set; } = [];

        public List<ReportGroupItemDto> TicketsByStatus { get; set; } = [];
    }
}
