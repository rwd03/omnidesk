import api from "./axios";

export const getReportSummary = () => {
  return api.get("/reports/summary");
};

export const exportReportExcel = () => {
  return api
    .get("/reports/export/excel", {
      responseType: "blob",
    })
    .then((response) =>
      downloadBlobResponse(response, "omnidesk-report.xlsx")
    );
};

export const exportReportPdf = () => {
  return api
    .get("/reports/export/pdf", {
      responseType: "blob",
    })
    .then((response) => downloadBlobResponse(response, "omnidesk-report.pdf"));
};

function downloadBlobResponse(response, fallbackName) {
  const contentDisposition = response.headers["content-disposition"];
  const fileName =
    getFilenameFromContentDisposition(contentDisposition) || fallbackName;

  const blob = new Blob([response.data], {
    type: response.headers["content-type"] || "application/octet-stream",
  });

  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);

  return response;
}

function getFilenameFromContentDisposition(contentDisposition) {
  if (!contentDisposition) {
    return "";
  }

  const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/i);
  return filenameMatch ? filenameMatch[1] : "";
}
