import React, { useEffect, useState } from "react";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

interface LostItem {
  _id: string;
  title: string;
  description?: string;
  image?: string;
  status: "lost" | "found" | "claimed";
  createdAt?: string;
  reportedBy?: string;
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
}

const LostFoundPage: React.FC = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<LostItem[]>([]);
  const [title, setTitle] = useState(() => localStorage.getItem("lf_title") || "");
  const [description, setDescription] = useState(() => localStorage.getItem("lf_desc") || "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [status, setStatus] = useState<"lost" | "found">(
    () => (localStorage.getItem("lf_status") as "lost" | "found") || "lost"
  );
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [faculties, setFaculties] = useState<{ _id: string; name: string }[]>([]);
  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [includeClaimed, setIncludeClaimed] = useState(true);
  const [isEditingData, setIsEditingData] = useState<LostItem | null>(null);

  const loadItems = () => {
    api
      .get("/lost-items", { params: includeClaimed ? { includeClaimed: "true" } : undefined })
      .then((res) => {
        setItems(res.data || []);
        setError(null);
      })
      .catch(() => {
        setError("Unable to load items. Please check your connection.");
      });
  };

  useEffect(() => {
    if (user?.role === "admin") {
      api.get("/faculties").then((res) => {
        setFaculties(res.data);
        if (res.data.length > 0) setSelectedFaculty(res.data[0]._id);
      }).catch(console.error);
    }
  }, [user]);

  useEffect(() => {
    loadItems();
  }, [includeClaimed]);

  useEffect(() => {
    if (user) {
      setContactName(user.name || "");
      setContactEmail(user.email || "");
      setContactPhone(user.phone || "");
    }
  }, [user]);

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  useEffect(() => {
    localStorage.setItem("lf_title", title);
    localStorage.setItem("lf_desc", description);
    localStorage.setItem("lf_status", status);
  }, [title, description, status]);

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("status", status);
      formData.append("contactName", contactName);
      formData.append("contactPhone", contactPhone);
      formData.append("contactEmail", contactEmail);
      if (selectedFaculty) {
        formData.append("faculty", selectedFaculty);
      }
      if (imageFile) {
        formData.append("image", imageFile);
      }
      const response = await api.post("/lost-items", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setTitle("");
      setDescription("");
      setImageFile(null);
      setImagePreview(null);
      setStatus("lost");
      localStorage.removeItem("lf_title");
      localStorage.removeItem("lf_desc");
      localStorage.removeItem("lf_status");
      if (response?.data) {
        setItems((prev) => [response.data, ...prev]);
      } else {
        loadItems();
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || "Unable to submit item");
    }
  };

  const handleClaim = async (id: string) => {
    await api.patch(`/lost-items/${id}`, { status: "claimed" });
    loadItems();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to remove this item?")) {
      try {
        await api.delete(`/lost-items/${id}`);
        setItems((prev) => prev.filter((item) => item._id !== id));
      } catch (err) {
        console.error("Delete failed", err);
      }
    }
  };

  const handleUpdate = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!isEditingData) return;
    try {
      await api.patch(`/lost-items/${isEditingData._id}`, {
        title: isEditingData.title,
        description: isEditingData.description,
        status: isEditingData.status,
        contactName: isEditingData.contactName,
        contactPhone: isEditingData.contactPhone,
        contactEmail: isEditingData.contactEmail
      });
      setIsEditingData(null);
      loadItems();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Update failed");
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setImageFile(null);
      setImagePreview(null);
      return;
    }
    const previewUrl = URL.createObjectURL(file);
    setImageFile(file);
    setImagePreview(previewUrl);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-2xl font-semibold text-slate-900">Lost & found</h3>
          <p className="text-sm text-slate-500">
            Items are visible only within your faculty.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setIncludeClaimed((prev) => !prev)}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs text-slate-600 shadow-sm"
          >
            {includeClaimed ? "Hide claimed" : "Show claimed"}
          </button>
          <span className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs text-slate-600 shadow-sm">
            {user?.role === "admin" ? "All faculties" : "Faculty isolated"}
          </span>
        </div>
      </div>

      {user?.role === "admin" && (
        <form onSubmit={handleCreate} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h4 className="text-sm font-semibold text-slate-900">Post an item</h4>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <input
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 md:col-span-2"
              placeholder="Item title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
            />
            <select
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
              value={selectedFaculty}
              onChange={(event) => setSelectedFaculty(event.target.value)}
              required
            >
              <option value="">Select Faculty</option>
              {faculties.map((f) => (
                <option key={f._id} value={f._id}>
                  {f.name}
                </option>
              ))}
            </select>
            <select
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
              value={status}
              onChange={(event) => setStatus(event.target.value as "lost" | "found")}
            >
              <option value="lost">Lost</option>
              <option value="found">Found</option>
            </select>
            <input
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 md:col-span-2"
              placeholder="Short description (optional)"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
            <div className="md:col-span-2 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4">
              <label className="text-xs font-semibold text-slate-600">Upload image (optional)</label>
              <input
                className="mt-2 w-full text-xs text-slate-500"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              {imagePreview && (
                <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-white">
                  <img src={imagePreview} alt="Preview" className="h-40 w-full object-cover" />
                </div>
              )}
            </div>
            <input
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
              placeholder="Contact name"
              value={contactName}
              onChange={(event) => setContactName(event.target.value)}
            />
            <input
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
              placeholder="Contact phone"
              value={contactPhone}
              onChange={(event) => setContactPhone(event.target.value)}
            />
            <input
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 md:col-span-2"
              placeholder="Contact email"
              value={contactEmail}
              onChange={(event) => setContactEmail(event.target.value)}
            />
          </div>
          {error && <p className="mt-3 text-xs text-rose-500">{error}</p>}
          <button
            type="submit"
            className="mt-4 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white"
          >
            Submit item
          </button>
        </form>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {error && items.length === 0 && (
          <p className="text-sm text-rose-500">{error}</p>
        )}
        {items.map((item) => (
          <div key={item._id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="text-lg font-semibold text-slate-900">{item.title}</h4>
                <p className="text-xs text-slate-500">{item.description || "No description provided."}</p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  item.status === "found"
                    ? "bg-emerald-50 text-emerald-600"
                    : item.status === "claimed"
                      ? "bg-slate-100 text-slate-500"
                      : "bg-rose-50 text-rose-600"
                }`}
              >
                {item.status}
              </span>
            </div>
            {user?.role === "admin" && (
              <div className="mt-2 flex gap-2">
                <button 
                  onClick={() => setIsEditingData(item)}
                  className="rounded-full bg-emerald-50 p-2 text-emerald-600 hover:bg-emerald-100 transition-colors"
                  title="Edit Item"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button 
                  onClick={() => handleDelete(item._id)}
                  className="rounded-full bg-rose-50 p-2 text-rose-600 hover:bg-rose-100 transition-colors"
                  title="Delete Item"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            )}

            {isEditingData?._id === item._id && (
              <form onSubmit={handleUpdate} className="mt-4 space-y-3 rounded-2xl bg-slate-50 p-4 border border-emerald-100">
                <input 
                  className="w-full rounded-xl border border-slate-200 p-2 text-xs" 
                  value={isEditingData.title}
                  onChange={e => setIsEditingData({...isEditingData, title: e.target.value} as LostItem)}
                  required
                />
                <textarea 
                  className="w-full rounded-xl border border-slate-200 p-2 text-xs" 
                  value={isEditingData.description || ""}
                  onChange={e => setIsEditingData({...isEditingData, description: e.target.value} as LostItem)}
                />
                <div className="flex gap-2">
                  <button type="submit" className="flex-1 rounded-xl bg-emerald-600 py-2 text-white text-xs font-bold">Save</button>
                  <button type="button" onClick={() => setIsEditingData(null)} className="flex-1 rounded-xl bg-slate-200 py-2 text-slate-600 text-xs font-bold">Cancel</button>
                </div>
              </form>
            )}

            {item.image && (
              <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
                <img src={item.image} alt={item.title} className="h-40 w-full object-cover" />
              </div>
            )}
            <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50 p-3 text-xs text-slate-600">
              <p className="font-semibold text-slate-700">Contact</p>
              <p>{item.contactName || "No name provided"}</p>
              <p>{item.contactPhone || "No phone provided"}</p>
              <p>{item.contactEmail || "No email provided"}</p>
            </div>
            {item.createdAt && (
              <p className="mt-3 text-[11px] text-slate-400">
                {new Date(item.createdAt).toLocaleString()}
              </p>
            )}
            {item.status !== "claimed" &&
              (user?.role === "admin" || item.reportedBy === user?.id) && (
                <button
                  className="mt-3 w-full rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-700"
                  onClick={() => handleClaim(item._id)}
                >
                  Mark as claimed
                </button>
              )}
          </div>
        ))}
        {items.length === 0 && <p className="text-sm text-slate-500">No items yet.</p>}
      </div>
    </div>
  );
};

export default LostFoundPage;
