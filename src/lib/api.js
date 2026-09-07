// Talks to the Spring Boot backend described in CRM_APIS.pdf.
// Base URL is overridable via VITE_API_BASE_URL (e.g. when the backend
// isn't on localhost:8081) without touching this file.
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

async function handle(res) {
  if (!res.ok) {
    let detail = "";
    try {
      detail = await res.text();
    } catch {
      // ignore — body may be empty
    }
    throw new ApiError(detail || `Request failed (${res.status})`, res.status);
  }
  if (res.status === 204) return null;
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

function withTimeout(ms) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), ms);
  return { signal: controller.signal, clear: () => clearTimeout(id) };
}

async function request(path, options = {}) {
  const { signal, clear } = withTimeout(10000);
  try {
    const res = await fetch(`${API_BASE_URL}${path}`, { ...options, signal });
    return await handle(res);
  } catch (err) {
    if (err.name === "AbortError") {
      throw new ApiError(`Timed out reaching ${API_BASE_URL}${path}`, 0);
    }
    if (err instanceof ApiError) throw err;
    throw new ApiError(`Could not reach API at ${API_BASE_URL} — is the backend running?`, 0);
  } finally {
    clear();
  }
}

// --- Enquiry ---------------------------------------------------------------

/**
 * Builds the multipart/form-data body the backend expects for
 * POST /api/enquiry/save, including bracketed array keys for
 * projectInformations[i].scopeOfServices[j].* and dotted siteVisit.* keys.
 */
export function buildEnquiryFormData(enquiry) {
  const fd = new FormData();

  const scalarKeys = [
    "enquiryType",
    "selectedEnquiryId",
    "dateOfEnquiry",
    "companyName",
    "customerName",
    "customerEmail",
    "contactPerson",
    "contactNumber",
    "projectReference",
    "projectLead",
    "currentStatus",
    "projectStatus",
    "remarks",
    "deadlineOfSubmission",
    "emailLink",
    "fileTransferLink",
  ];
  for (const key of scalarKeys) {
    if (enquiry[key] !== undefined && enquiry[key] !== null && enquiry[key] !== "") {
      fd.append(key, enquiry[key]);
    }
  }

  const sv = enquiry.siteVisit || {};
  if (sv.siteVisitRequired) {
    fd.append("siteVisit.siteVisitRequired", "true");
    fd.append("siteVisit.gatePassRequired", String(Boolean(sv.gatePassRequired)));
    for (const key of ["siteVisitAssignedTo", "siteVisitDate", "contactPerson", "contactNumber", "googleMapLink"]) {
      if (sv[key]) fd.append(`siteVisit.${key}`, sv[key]);
    }
  }

  (enquiry.projectInformations || []).forEach((project, i) => {
    fd.append(`projectInformations[${i}].projectName`, project.projectName || "");
    fd.append(`projectInformations[${i}].country`, project.country || "");
    fd.append(`projectInformations[${i}].emirate`, project.emirate || "");
    (project.scopeOfServices || []).forEach((scope, j) => {
      fd.append(`projectInformations[${i}].scopeOfServices[${j}].activityId`, scope.activityId ?? "");
      fd.append(`projectInformations[${i}].scopeOfServices[${j}].unit`, scope.unit || "");
      fd.append(`projectInformations[${i}].scopeOfServices[${j}].quantity`, scope.quantity ?? "");
      fd.append(`projectInformations[${i}].scopeOfServices[${j}].remarks`, scope.remarks || "");
    });
  });

  (enquiry.attachments || []).forEach((att) => {
    if (att.file) {
      fd.append("files", att.file, att.file.name);
      fd.append("fileTypes", att.fileType || "OTHER");
    }
  });

  return fd;
}

export const enquiryApi = {
  save(enquiry) {
    return request("/api/enquiry/save", { method: "POST", body: buildEnquiryFormData(enquiry) });
  },
  searchExisting({ companyName = "", projectName = "" }) {
    return request("/api/enquiry/search-existing", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ companyName, projectName }),
    });
  },
  getById(id) {
    return request(`/api/enquiry/${id}`);
  },
  getAll({ page = 0, size = 20 } = {}) {
    return request(`/api/enquiry?page=${page}&size=${size}`);
  },
  update(id, enquiry) {
    return request(`/api/enquiry/${id}`, { method: "PUT", body: buildEnquiryFormData(enquiry) });
  },
  remove(id) {
    return request(`/api/enquiry/${id}`, { method: "DELETE" });
  },
};

// --- Activity master ---------------------------------------------------------
// Only POST /api/activity is documented so far. GET /api/activity is assumed
// (standard REST convention) for populating the Scope of Services dropdown —
// confirm the path once available; useActivities() falls back to a local
// list if this 404s or the backend is unreachable.
export const activityApi = {
  create({ activityName, active = true }) {
    return request("/api/activity", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ activityName, active }),
    });
  },
  getAll() {
    return request("/api/activity");
  },
};
