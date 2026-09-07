import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ChevronLeft, Save, RotateCcw } from "lucide-react";
import { Button } from "../components/ui/Button";
import { FieldLabel, Input, Select, Textarea, FormRow } from "../components/ui/Field";
import { FileDropField } from "../components/ui/FileDropField";
import { ConnectionBanner } from "../components/ui/ConnectionBanner";
import { ProjectInformationBlock } from "../features/enquiries/ProjectInformationBlock";
import { SiteVisitFormSection } from "../features/enquiries/SiteVisitFormSection";
import { useActivities } from "../hooks/useActivities";
import { useEnquiries } from "../hooks/useEnquiries";
import { enquiryApi, ApiError } from "../lib/api";
import { seedEnquiries } from "../data/mockEnquiries";
import { CURRENT_STATUSES, ENQUIRY_SOURCES, PROJECT_LEADS, PROJECT_STATUSES } from "../lib/constants";

const emptyProject = () => ({ projectName: "", country: "United Arab Emirates", emirate: "Dubai", scopeOfServices: [{ activityId: "", unit: "LS", quantity: 1, remarks: "" }] });

const emptyForm = () => ({
  enquiryType: "NEW",
  dateOfEnquiry: new Date().toISOString().slice(0, 10),
  companyName: "",
  customerName: "",
  customerEmail: "",
  contactPerson: "",
  contactNumber: "",
  projectReference: "",
  projectLead: "No Lead",
  currentStatus: "SELECT",
  projectStatus: "JOB_IN_HAND",
  remarks: "",
  deadlineOfSubmission: "",
  emailLink: "",
  fileTransferLink: "",
  source: ENQUIRY_SOURCES[0],
  siteVisit: { siteVisitRequired: false, gatePassRequired: false },
  projectInformations: [emptyProject()],
  attachments: [],
});

export default function EnquiryFormPage({ mode }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const { activities } = useActivities();
  const { createEnquiry, updateEnquiry, connected, refresh } = useEnquiries();

  const [form, setForm] = useState(emptyForm);
  const [permitFiles, setPermitFiles] = useState([]);
  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    if (mode !== "edit") return;
    (async () => {
      try {
        const data = await enquiryApi.getById(id);
        setForm({ ...emptyForm(), ...data });
      } catch {
        const fallback = seedEnquiries.find((e) => String(e.id) === String(id));
        if (fallback) setForm({ ...emptyForm(), ...fallback });
      } finally {
        setLoading(false);
      }
    })();
  }, [mode, id]);

  const set = (patch) => setForm((f) => ({ ...f, ...patch }));

  const updateProject = (index, project) => {
    setForm((f) => ({
      ...f,
      projectInformations: f.projectInformations.map((p, i) => (i === index ? project : p)),
    }));
  };

  const addProject = () => set({ projectInformations: [...form.projectInformations, emptyProject()] });
  const removeProject = (index) =>
    set({ projectInformations: form.projectInformations.filter((_, i) => i !== index) });

  const handleReset = () => {
    if (mode === "edit") return; // reset only makes sense for a fresh registration
    setForm(emptyForm());
    setPermitFiles([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSubmitError(null);
    const payload = {
      ...form,
      attachments: [...form.attachments, ...permitFiles],
    };
    try {
      if (mode === "edit") {
        await updateEnquiry(id, payload);
        navigate(`/enquiries/${id}`);
      } else {
        const created = await createEnquiry(payload);
        navigate(created?.id ? `/enquiries/${created.id}` : "/enquiries");
      }
    } catch (err) {
      setSubmitError(err instanceof ApiError ? err.message : "Could not save the enquiry.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-sm text-ink-400">Loading enquiry…</div>;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-16">
      <ConnectionBanner connected={connected} onRetry={refresh} />

      <div className="flex items-center gap-3">
        <Link to="/enquiries" className="rounded-lg p-1.5 text-ink-400 hover:bg-ink-50 hover:text-ink-900">
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="font-display text-xl font-semibold text-ink-950">
            {mode === "edit" ? "Edit enquiry" : "Enquiry registration"}
          </h1>
          <p className="text-sm text-ink-400">
            {mode === "edit" ? form.enquiryNumber : "Enquiry number will be generated automatically on save"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="rounded-xl bg-white p-5 ring-1 ring-ink-100">
          <FormRow>
            <div>
              <FieldLabel>Enquiry registration date</FieldLabel>
              <Input disabled value={form.enquiryRegistrationDate ? new Date(form.enquiryRegistrationDate).toLocaleString() : "Automated on save"} />
            </div>
            <div>
              <FieldLabel>Enquiry lead</FieldLabel>
              <Input list="project-leads" value={form.projectLead} onChange={(e) => set({ projectLead: e.target.value })} placeholder="Not mandatory" />
              <datalist id="project-leads">
                {PROJECT_LEADS.map((p) => (
                  <option key={p} value={p} />
                ))}
              </datalist>
            </div>
          </FormRow>

          <div className="mt-4">
            <FormRow>
              <div>
                <FieldLabel required>Enquiry date</FieldLabel>
                <Input required type="date" value={form.dateOfEnquiry} onChange={(e) => set({ dateOfEnquiry: e.target.value })} />
              </div>
              <div>
                <FieldLabel required>Enquiry source</FieldLabel>
                <Select value={form.source} onChange={(e) => set({ source: e.target.value })}>
                  {ENQUIRY_SOURCES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </Select>
              </div>
            </FormRow>
          </div>

          <div className="mt-4">
            <FormRow>
              <div>
                <FieldLabel>Deadline of submission</FieldLabel>
                <Input type="date" value={form.deadlineOfSubmission || ""} onChange={(e) => set({ deadlineOfSubmission: e.target.value })} />
              </div>
              <div>
                <FieldLabel>Project reference</FieldLabel>
                <Input value={form.projectReference} onChange={(e) => set({ projectReference: e.target.value })} placeholder="FAL-ENQ-0000" />
              </div>
            </FormRow>
          </div>
        </section>

        <section className="rounded-xl bg-white p-5 ring-1 ring-ink-100">
          <p className="mb-4 text-sm font-semibold text-ink-900">Customer details</p>
          <FormRow>
            <div>
              <FieldLabel required>Company name</FieldLabel>
              <Input required value={form.companyName} onChange={(e) => set({ companyName: e.target.value })} placeholder="Al Jawaher Engineering" />
            </div>
            <div>
              <FieldLabel required>Customer name</FieldLabel>
              <Input required value={form.customerName} onChange={(e) => set({ customerName: e.target.value })} />
            </div>
          </FormRow>
          <div className="mt-4">
            <FormRow>
              <div>
                <FieldLabel>Contact person</FieldLabel>
                <Input value={form.contactPerson} onChange={(e) => set({ contactPerson: e.target.value })} />
              </div>
              <div>
                <FieldLabel>Contact number</FieldLabel>
                <Input value={form.contactNumber} onChange={(e) => set({ contactNumber: e.target.value })} placeholder="+971 5X XXX XXXX" />
              </div>
            </FormRow>
          </div>
          <div className="mt-4">
            <FormRow>
              <div>
                <FieldLabel>Customer email</FieldLabel>
                <Input type="email" value={form.customerEmail} onChange={(e) => set({ customerEmail: e.target.value })} />
              </div>
              <div>
                <FieldLabel>Project status</FieldLabel>
                <Select value={form.projectStatus} onChange={(e) => set({ projectStatus: e.target.value })}>
                  {PROJECT_STATUSES.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </Select>
              </div>
            </FormRow>
          </div>
          <div className="mt-4">
            <FormRow>
              <div>
                <FieldLabel>Email link</FieldLabel>
                <Input value={form.emailLink} onChange={(e) => set({ emailLink: e.target.value })} placeholder="https://…" />
              </div>
              <div>
                <FieldLabel>File transfer link (if any)</FieldLabel>
                <Input value={form.fileTransferLink} onChange={(e) => set({ fileTransferLink: e.target.value })} placeholder="https://wetransfer.com/…" />
              </div>
            </FormRow>
          </div>
          {mode === "edit" && (
            <div className="mt-4">
              <FieldLabel>Current status</FieldLabel>
              <Select value={form.currentStatus} onChange={(e) => set({ currentStatus: e.target.value })}>
                {CURRENT_STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </Select>
            </div>
          )}
        </section>

        <section className="rounded-xl bg-white p-5 ring-1 ring-ink-100">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-semibold text-ink-900">Project information</p>
          </div>
          <div className="space-y-4">
            {form.projectInformations.map((project, i) => (
              <ProjectInformationBlock
                key={i}
                index={i}
                project={project}
                activities={activities}
                onChange={(p) => updateProject(i, p)}
                onRemove={() => removeProject(i)}
                removable={form.projectInformations.length > 1}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={addProject}
            className="mt-4 w-full rounded-lg bg-ink-950 py-2.5 text-sm font-medium text-white hover:bg-signal-600"
          >
            + Click here to add another project
          </button>
        </section>

        <section className="rounded-xl bg-white p-5 ring-1 ring-ink-100">
          <p className="mb-4 text-sm font-semibold text-ink-900">Site visit information</p>
          <SiteVisitFormSection
            siteVisit={form.siteVisit}
            onChange={(siteVisit) => set({ siteVisit })}
            permitFiles={permitFiles}
            onPermitFilesChange={setPermitFiles}
          />
        </section>

        <section className="rounded-xl bg-white p-5 ring-1 ring-ink-100">
          <p className="mb-4 text-sm font-semibold text-ink-900">Additional attachments &amp; remarks</p>
          <FileDropField files={form.attachments} onChange={(attachments) => set({ attachments })} />
          <div className="mt-4">
            <FieldLabel>Remarks</FieldLabel>
            <Textarea rows={3} value={form.remarks} onChange={(e) => set({ remarks: e.target.value })} />
          </div>
        </section>

        {submitError && (
          <p className="rounded-lg bg-signal-50 px-4 py-2.5 text-sm text-signal-700 ring-1 ring-inset ring-signal-200">
            {submitError}
          </p>
        )}

        <div className="flex items-center justify-end gap-2 border-t border-ink-100 pt-5">
          {mode !== "edit" && (
            <Button type="button" variant="secondary" onClick={handleReset}>
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          )}
          <Button type="submit" disabled={saving}>
            <Save className="h-4 w-4" />
            {saving ? "Saving…" : mode === "edit" ? "Save changes" : "Submit enquiry"}
          </Button>
        </div>
      </form>
    </div>
  );
}
