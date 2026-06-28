import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import {
  sendAiChatMessage,
  suggestTicketCategory,
  suggestTicketPriority,
} from "../api/aiApi";
import AppLayout from "../components/layout/AppLayout";
import PageHeader from "../components/common/PageHeader";

function AiAssistant() {
  const navigate = useNavigate();
  const [ticketInput, setTicketInput] = useState({
    title: "",
    description: "",
  });
  const [categorySuggestion, setCategorySuggestion] = useState(null);
  const [prioritySuggestion, setPrioritySuggestion] = useState(null);
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([
    {
      role: "assistant",
      text: "Ask about password reset, VPN, email, internet, printer, or software installation.",
    },
  ]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const [loadingState, setLoadingState] = useState({
    category: false,
    priority: false,
    chat: false,
  });

  const handleTicketInputChange = (e) => {
    setTicketInput((current) => ({
      ...current,
      [e.target.name]: e.target.value,
    }));
    setCategorySuggestion(null);
    setPrioritySuggestion(null);
    setMessage("");
  };

  const handleSuggestCategory = async () => {
    if (!ticketInput.title.trim() && !ticketInput.description.trim()) {
      setMessageType("warning");
      setMessage("Enter a ticket title or description first.");
      return;
    }

    try {
      setLoadingState((current) => ({
        ...current,
        category: true,
      }));
      setMessage("");

      const response = await suggestTicketCategory(ticketInput);
      setCategorySuggestion(response.data);
    } catch (err) {
      console.error(err);
      setMessageType("error");
      setMessage("Failed to get category suggestion.");
    } finally {
      setLoadingState((current) => ({
        ...current,
        category: false,
      }));
    }
  };

  const handleSuggestPriority = async () => {
    if (!ticketInput.title.trim() && !ticketInput.description.trim()) {
      setMessageType("warning");
      setMessage("Enter a ticket title or description first.");
      return;
    }

    try {
      setLoadingState((current) => ({
        ...current,
        priority: true,
      }));
      setMessage("");

      const response = await suggestTicketPriority(ticketInput);
      setPrioritySuggestion(response.data);
    } catch (err) {
      console.error(err);
      setMessageType("error");
      setMessage("Failed to get priority suggestion.");
    } finally {
      setLoadingState((current) => ({
        ...current,
        priority: false,
      }));
    }
  };

  const handleChatSubmit = async (e) => {
    e.preventDefault();

    if (!chatMessage.trim()) {
      setMessageType("warning");
      setMessage("Enter a help desk question for the assistant.");
      return;
    }

    const nextMessage = chatMessage.trim();

    try {
      setLoadingState((current) => ({
        ...current,
        chat: true,
      }));
      setMessage("");

      setChatHistory((current) => [
        ...current,
        { role: "user", text: nextMessage },
      ]);

      setChatMessage("");

      const response = await sendAiChatMessage(nextMessage);

      setChatHistory((current) => [
        ...current,
        {
          role: "assistant",
          text: response.data.answer,
          topic: response.data.topic,
        },
      ]);
    } catch (err) {
      console.error(err);
      setMessageType("error");
      setMessage("Failed to get assistant response.");
    } finally {
      setLoadingState((current) => ({
        ...current,
        chat: false,
      }));
    }
  };

  return (
    <AppLayout>
      <PageHeader
        title="AI Assistant"
        subtitle="Use rule-based suggestions for ticket triage and quick IT help desk answers."
        action={
          <Button
            variant="outlined"
            onClick={() => navigate("/dashboard")}
            sx={outlinedButtonStyles}
          >
            Back to Dashboard
          </Button>
        }
      />

      {message && (
        <Alert severity={messageType} sx={{ mb: 3, borderRadius: 3 }}>
          {message}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Card
            elevation={0}
            sx={{
              border: "1px solid #E5E7EB",
              borderRadius: 4,
              bgcolor: "#FFFFFF",
              mb: 3,
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" fontWeight={800} sx={{ mb: 1 }}>
                Ticket Suggestions
              </Typography>

              <Typography variant="body2" sx={{ color: "#6B7280", mb: 3 }}>
                Enter a sample ticket title and description to get category and
                priority suggestions without calling an external AI service.
              </Typography>

              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="Ticket Title"
                  name="title"
                  value={ticketInput.title}
                  onChange={handleTicketInputChange}
                  placeholder="Example: VPN connection fails for remote employee"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 3,
                    },
                  }}
                />

                <TextField
                  fullWidth
                  multiline
                  minRows={5}
                  label="Ticket Description"
                  name="description"
                  value={ticketInput.description}
                  onChange={handleTicketInputChange}
                  placeholder="Describe the issue, affected service, and business impact."
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 3,
                    },
                  }}
                />

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <Button
                    variant="outlined"
                    disabled={loadingState.category}
                    onClick={handleSuggestCategory}
                    sx={outlinedButtonStyles}
                  >
                    {loadingState.category
                      ? "Suggesting..."
                      : "Suggest Category"}
                  </Button>

                  <Button
                    variant="contained"
                    disabled={loadingState.priority}
                    onClick={handleSuggestPriority}
                    sx={containedButtonStyles}
                  >
                    {loadingState.priority
                      ? "Suggesting..."
                      : "Suggest Priority"}
                  </Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>

          <Card
            elevation={0}
            sx={{
              border: "1px solid #E5E7EB",
              borderRadius: 4,
              bgcolor: "#FFFFFF",
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" fontWeight={800} sx={{ mb: 1 }}>
                Help Desk Chatbot
              </Typography>

              <Typography variant="body2" sx={{ color: "#6B7280", mb: 3 }}>
                Ask common support questions about password resets, VPN, email,
                internet, printers, and software installation.
              </Typography>

              <Box
                sx={{
                  border: "1px solid #E5E7EB",
                  borderRadius: 3,
                  p: 2,
                  bgcolor: "#FAFAFA",
                  minHeight: 280,
                  maxHeight: 360,
                  overflowY: "auto",
                  mb: 3,
                }}
              >
                <Stack spacing={2}>
                  {chatHistory.map((entry, index) => (
                    <Box
                      key={`${entry.role}-${index}`}
                      sx={{
                        alignSelf:
                          entry.role === "user" ? "flex-end" : "flex-start",
                        maxWidth: "85%",
                        border: entry.role === "user"
                          ? "none"
                          : "1px solid #E5E7EB",
                        borderRadius: 3,
                        px: 2,
                        py: 1.5,
                        bgcolor:
                          entry.role === "user" ? "#111111" : "#FFFFFF",
                        color:
                          entry.role === "user" ? "#FFFFFF" : "#111111",
                      }}
                    >
                      {entry.topic && (
                        <Typography
                          variant="caption"
                          sx={{
                            display: "block",
                            fontWeight: 800,
                            color:
                              entry.role === "user" ? "#E5E7EB" : "#6B7280",
                            mb: 0.5,
                          }}
                        >
                          {entry.topic}
                        </Typography>
                      )}

                      <Typography variant="body2">{entry.text}</Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>

              <Box component="form" onSubmit={handleChatSubmit}>
                <Stack spacing={2}>
                  <TextField
                    fullWidth
                    label="Ask the assistant"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    placeholder="Example: How do I reset my password?"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 3,
                      },
                    }}
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loadingState.chat}
                    sx={containedButtonStyles}
                  >
                    {loadingState.chat ? "Thinking..." : "Ask Assistant"}
                  </Button>
                </Stack>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Card
            elevation={0}
            sx={{
              border: "1px solid #E5E7EB",
              borderRadius: 4,
              bgcolor: "#FFFFFF",
              mb: 3,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={800} sx={{ mb: 2 }}>
                Suggestion Results
              </Typography>

              <Stack spacing={2}>
                <SuggestionPanel
                  label="Category"
                  suggestion={categorySuggestion}
                  chipStyles={{
                    bgcolor: "#F3F4F6",
                    color: "#111111",
                  }}
                  emptyText="No category suggestion yet."
                />

                <SuggestionPanel
                  label="Priority"
                  suggestion={prioritySuggestion}
                  chipStyles={getPriorityChipStyles(
                    prioritySuggestion?.suggestion
                  )}
                  emptyText="No priority suggestion yet."
                />
              </Stack>
            </CardContent>
          </Card>

          <Card
            elevation={0}
            sx={{
              border: "1px solid #E5E7EB",
              borderRadius: 4,
              bgcolor: "#FFFFFF",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={800} sx={{ mb: 2 }}>
                Supported Topics
              </Typography>

              <Stack spacing={2}>
                <SupportTopicBox
                  title="Password Reset"
                  description="Use for login, password reset, account lockout, or MFA access questions."
                />

                <SupportTopicBox
                  title="VPN and Internet"
                  description="Use for connectivity, remote access, Wi-Fi, or broader network issues."
                />

                <SupportTopicBox
                  title="Email and Printers"
                  description="Use for Outlook, mailbox delivery, printer queue, or scanner help."
                />

                <SupportTopicBox
                  title="Software Installation"
                  description="Use for application installs, approvals, and software access requests."
                />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </AppLayout>
  );
}

function SuggestionPanel({ label, suggestion, chipStyles, emptyText }) {
  return (
    <Box
      sx={{
        border: "1px solid #E5E7EB",
        borderRadius: 3,
        p: 2,
        bgcolor: "#FAFAFA",
      }}
    >
      <Typography variant="body2" sx={{ color: "#6B7280", mb: 1 }}>
        {label}
      </Typography>

      {suggestion ? (
        <>
          <Chip
            label={suggestion.suggestion}
            size="small"
            sx={{
              fontWeight: 800,
              borderRadius: 2,
              ...chipStyles,
            }}
          />

          <Typography variant="body2" sx={{ color: "#4B5563", mt: 1.5 }}>
            {suggestion.reason}
          </Typography>
        </>
      ) : (
        <Typography variant="body2" sx={{ color: "#6B7280" }}>
          {emptyText}
        </Typography>
      )}
    </Box>
  );
}

function SupportTopicBox({ title, description }) {
  return (
    <Box
      sx={{
        border: "1px solid #E5E7EB",
        borderRadius: 3,
        p: 2,
        bgcolor: "#FAFAFA",
      }}
    >
      <Typography fontWeight={800}>{title}</Typography>

      <Typography variant="body2" sx={{ color: "#6B7280", mt: 0.5 }}>
        {description}
      </Typography>
    </Box>
  );
}

function getPriorityChipStyles(priority) {
  const styles = {
    Low: {
      bgcolor: "#F3F4F6",
      color: "#111111",
    },
    Medium: {
      bgcolor: "#E5E7EB",
      color: "#111111",
    },
    High: {
      bgcolor: "#FFF7ED",
      color: "#9A3412",
    },
    Critical: {
      bgcolor: "#FEE2E2",
      color: "#991B1B",
    },
  };

  return styles[priority] || styles.Medium;
}

const containedButtonStyles = {
  bgcolor: "#111111",
  color: "#FFFFFF",
  borderRadius: 2,
  px: 3,
  py: 1,
  textTransform: "none",
  fontWeight: 700,
  "&:hover": {
    bgcolor: "#2A2A2A",
  },
};

const outlinedButtonStyles = {
  borderColor: "#D1D5DB",
  color: "#111111",
  borderRadius: 2,
  px: 3,
  py: 1,
  textTransform: "none",
  fontWeight: 700,
  "&:hover": {
    borderColor: "#111111",
    bgcolor: "#F9FAFB",
  },
};

export default AiAssistant;
