import React, { useEffect, useState, useRef } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../components/AuthProvider";
import { usePhotoUpload } from "../lib/usePhotoUpload";
import { Shipment, ShipmentStatus, HistoryItem } from "../types";
import {
  Plus,
  MapPin,
  Truck,
  Box,
  User,
  Mail,
  Phone,
  Play,
  Pause,
  X,
  Check,
  Package,
  Edit2,
  Trash2,
  Building,
  Hash,
  ImagePlus,
  Loader2,
  DollarSign,
  Trash,
  AlertCircle,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "../lib/utils";
import athLogo from "../athlogo.svg";

const commonCountryCoords: Record<string, { lat: number; lng: number }> = {
  "united states": { lat: 37.0902, lng: -95.7129 },
  usa: { lat: 37.0902, lng: -95.7129 },
  "united kingdom": { lat: 55.3781, lng: -3.436 },
  uk: { lat: 55.3781, lng: -3.436 },
  canada: { lat: 56.1304, lng: -106.3468 },
  australia: { lat: -25.2744, lng: 133.7751 },
  germany: { lat: 51.1657, lng: 10.4515 },
  france: { lat: 46.2276, lng: 2.2137 },
  china: { lat: 35.8617, lng: 104.1954 },
  uae: { lat: 23.4241, lng: 53.8478 },
  "united arab emirates": { lat: 23.4241, lng: 53.8478 },
};

const US_STATES: Record<string, { lat: number; lng: number }> = {
  "Alabama": { lat: 32.806671, lng: -86.791130 },
  "Alaska": { lat: 61.370716, lng: -152.404419 },
  "Arizona": { lat: 33.729759, lng: -111.431221 },
  "Arkansas": { lat: 34.969704, lng: -92.373123 },
  "California": { lat: 36.116203, lng: -119.681564 },
  "Colorado": { lat: 39.059811, lng: -105.311104 },
  "Connecticut": { lat: 41.597782, lng: -72.755371 },
  "Delaware": { lat: 39.318523, lng: -75.507141 },
  "Florida": { lat: 27.766279, lng: -81.686783 },
  "Georgia": { lat: 33.040619, lng: -83.643074 },
  "Hawaii": { lat: 21.094318, lng: -157.498337 },
  "Idaho": { lat: 44.240459, lng: -114.478828 },
  "Illinois": { lat: 40.349457, lng: -88.986137 },
  "Indiana": { lat: 39.849426, lng: -86.258278 },
  "Iowa": { lat: 42.011539, lng: -93.210526 },
  "Kansas": { lat: 38.526600, lng: -96.726486 },
  "Kentucky": { lat: 37.668140, lng: -84.697304 },
  "Louisiana": { lat: 31.169546, lng: -91.867805 },
  "Maine": { lat: 44.693947, lng: -69.381927 },
  "Maryland": { lat: 39.063946, lng: -76.802101 },
  "Massachusetts": { lat: 42.230171, lng: -71.530106 },
  "Michigan": { lat: 43.326618, lng: -84.536095 },
  "Minnesota": { lat: 45.694454, lng: -93.900192 },
  "Mississippi": { lat: 32.741646, lng: -89.678696 },
  "Missouri": { lat: 38.456085, lng: -92.288368 },
  "Montana": { lat: 46.921925, lng: -110.454353 },
  "Nebraska": { lat: 41.125370, lng: -98.268082 },
  "Nevada": { lat: 38.313515, lng: -117.055374 },
  "New Hampshire": { lat: 43.452492, lng: -71.563896 },
  "New Jersey": { lat: 40.298904, lng: -74.521011 },
  "New Mexico": { lat: 34.840515, lng: -106.246597 },
  "New York": { lat: 42.165726, lng: -74.948051 },
  "North Carolina": { lat: 35.630066, lng: -79.806419 },
  "North Dakota": { lat: 47.528912, lng: -99.901810 },
  "Ohio": { lat: 40.388783, lng: -82.764915 },
  "Oklahoma": { lat: 35.565342, lng: -96.928917 },
  "Oregon": { lat: 44.572021, lng: -122.070938 },
  "Pennsylvania": { lat: 40.590752, lng: -77.209755 },
  "Rhode Island": { lat: 41.680893, lng: -71.511780 },
  "South Carolina": { lat: 33.856892, lng: -80.945007 },
  "South Dakota": { lat: 44.299782, lng: -99.438828 },
  "Tennessee": { lat: 35.747845, lng: -86.692345 },
  "Texas": { lat: 31.054487, lng: -97.563461 },
  "Utah": { lat: 40.150032, lng: -111.862434 },
  "Vermont": { lat: 44.045876, lng: -72.710686 },
  "Virginia": { lat: 37.769337, lng: -78.169968 },
  "Washington": { lat: 47.400902, lng: -121.490494 },
  "West Virginia": { lat: 38.491226, lng: -80.954453 },
  "Wisconsin": { lat: 44.268543, lng: -89.616508 },
  "Wyoming": { lat: 42.755966, lng: -107.302490 }
};

// Geocode any address/city string to real lat/lng using OpenStreetMap Nominatim (free, no key)
const geocodeAddress = async (
  address: string
): Promise<{ lat: number; lng: number } | null> => {
  if (!address || !address.trim() || address.trim().length < 2) return null;
  
  const lowerAddr = address.toLowerCase();

  // Explicit priority interception for US States to avoid Nominatim returning identically named locations in the UK (e.g. New York, Lincolnshire)
  const isUS = lowerAddr.includes("united states") || lowerAddr.includes("usa") || lowerAddr.includes("us");
  if (isUS) {
    for (const [stateName, coords] of Object.entries(US_STATES)) {
      if (lowerAddr.includes(stateName.toLowerCase())) {
        return coords;
      }
    }
    // If it mentions US / United states but no specific state match, immediately use standard US coordinates before it resolves differently
    return commonCountryCoords["united states"];
  }

  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1&email=admin@ath-holdings.com`;
    // Explicit User-Agent required by Nominatim usage policy
    const res = await fetch(url, {
      headers: {
        "Accept-Language": "en",
        "User-Agent": "GSS-Clone/1.0 (admin@gss-logistics.com)",
      },
    });
    const data = await res.json();
    if (data && data.length > 0) {
      return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
    }
  } catch (err) {
    console.warn("Geocoding failed:", err);
  }

  // Fallback to pre-defined centers if Nominatim fails
  for (const [country, coords] of Object.entries(commonCountryCoords)) {
    if (lowerAddr.includes(country)) return coords;
  }

  // Final attempt: search for just the country if the address contains a comma
  if (address.includes(",")) {
    const parts = address.split(",");
    const countryPart = parts[parts.length - 1].trim();
    if (countryPart.length >= 2) {
      return await geocodeAddress(countryPart); // Recursive call for just the country
    }
  }

  return null;
};

const SHIPMENT_STATUSES: ShipmentStatus[] = [
  "Active",
  "On Hold",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
];

const emptyForm = () => ({
  trackingNumber: `UPS-${Math.floor(100000 + Math.random() * 900000)}`,
  // Receiver
  receiverName: "",
  receiverEmail: "",
  receiverPhone: "",
  receiverAddress: "",
  receiverCity: "",
  receiverCountry: "",
  // Sender
  senderName: "",
  senderEmail: "",
  senderPhone: "",
  senderAddress: "",
  senderCity: "",
  senderCountry: "",
  // Shipment
  origin: "",
  destination: "",
  status: "Active" as ShipmentStatus,
  weight: "",
  description: "",
  estimatedDeliveryDays: "7",
});

export const Admin: React.FC = () => {
  const { user } = useAuth();
  const { uploadPhotos, uploading: photoUploading } = usePhotoUpload();
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingShipment, setEditingShipment] = useState<Shipment | null>(null);
  const [simulatingId, setSimulatingId] = useState<string | null>(null);
  const [newShipment, setNewShipment] = useState(emptyForm());
  const [createPhotoFiles, setCreatePhotoFiles] = useState<File[]>([]);
  const [createPhotoPreviews, setCreatePhotoPreviews] = useState<string[]>([]);
  const [updatePhotoFiles, setUpdatePhotoFiles] = useState<File[]>([]);
  const [updatePhotoPreviews, setUpdatePhotoPreviews] = useState<string[]>([]);
  const createFileRef = useRef<HTMLInputElement>(null);
  const updateFileRef = useRef<HTMLInputElement>(null);

  // Photo selection handlers
  const handleCreatePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setCreatePhotoFiles((prev) => [...prev, ...files]);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) =>
        setCreatePhotoPreviews((prev) => [
          ...prev,
          ev.target?.result as string,
        ]);
      reader.readAsDataURL(file);
    });
  };

  const handleUpdatePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setUpdatePhotoFiles((prev) => [...prev, ...files]);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) =>
        setUpdatePhotoPreviews((prev) => [
          ...prev,
          ev.target?.result as string,
        ]);
      reader.readAsDataURL(file);
    });
  };

  // Update modal state
  const [updateForm, setUpdateForm] = useState({
    status: "Active" as ShipmentStatus,
    currentLocationAddress: "",
    historyStatus: "",
    historyDescription: "",
  });
  const [updateHistory, setUpdateHistory] = useState<HistoryItem[]>([]);
  const [geocodingStatus, setGeocodingStatus] = useState<
    "idle" | "searching" | "success" | "failed"
  >("idle");
  const [manualCoords, setManualCoords] = useState(false);
  const [previewCoords, setPreviewCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const [createCharges, setCreateCharges] = useState<
    { label: string; amount: string }[]
  >([]);
  const [updateCharges, setUpdateCharges] = useState<
    { label: string; amount: string }[]
  >([]);

  const addCharge = (isUpdate: boolean) => {
    const set = isUpdate ? setUpdateCharges : setCreateCharges;
    set((prev) => [...prev, { label: "", amount: "" }]);
  };

  const removeCharge = (index: number, isUpdate: boolean) => {
    const set = isUpdate ? setUpdateCharges : setCreateCharges;
    set((prev) => prev.filter((_, i) => i !== index));
  };

  const updateCharge = (
    index: number,
    field: "label" | "amount",
    value: string,
    isUpdate: boolean
  ) => {
    const set = isUpdate ? setUpdateCharges : setCreateCharges;
    set((prev) =>
      prev.map((c, i) => (i === index ? { ...c, [field]: value } : c))
    );
  };

  const fetchShipments = async () => {
    try {
      const { data, error } = await supabase
        .from("shipments")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      const mapped = (data || []).map(
        (row) =>
          ({
            id: row.id,
            trackingNumber: row.tracking_number,
            senderId: row.sender_id,
            receiverName: row.receiver_name,
            receiverEmail: row.receiver_email,
            origin: row.origin,
            destination: row.destination,
            status: row.status,
            currentLocation: row.current_location,
            history: row.history,
            estimatedDelivery: row.estimated_delivery,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
            metadata: row.metadata,
          }) as Shipment
      );
      setShipments(mapped);
    } catch (err) {
      console.error("Error fetching admin shipments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShipments();
    const channel = supabase
      .channel("admin-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "shipments" },
        () => fetchShipments()
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const originAddress =
      newShipment.origin ||
      `${newShipment.senderCity}, ${newShipment.senderCountry}`;
    const geocoded = await geocodeAddress(originAddress);
    // Fallback to center of US if geocoding fails instead of Mali
    const originCoords = geocoded || { lat: 39.8283, lng: -98.5795 };
    const deliveryDate = new Date(
      Date.now() +
        parseInt(newShipment.estimatedDeliveryDays) * 24 * 60 * 60 * 1000
    );

    try {
      const shipmentData = {
        tracking_number: newShipment.trackingNumber,
        sender_id: user.id,
        receiver_name: newShipment.receiverName,
        receiver_email: newShipment.receiverEmail,
        origin:
          newShipment.origin ||
          `${newShipment.senderCity}, ${newShipment.senderCountry}`,
        destination:
          newShipment.destination ||
          `${newShipment.receiverCity}, ${newShipment.receiverCountry}`,
        status: newShipment.status,
        current_location: {
          lat: originCoords.lat,
          lng: originCoords.lng,
          address:
            newShipment.origin ||
            `${newShipment.senderCity}, ${newShipment.senderCountry}`,
        },
        history: [
          {
            timestamp: new Date().toISOString(),
            status: "Shipment Created",
            location:
              newShipment.origin ||
              `${newShipment.senderCity}, ${newShipment.senderCountry}`,
            description:
              `Package received and processed at origin facility. ${newShipment.description || ""}`.trim(),
          },
        ],
        estimated_delivery: deliveryDate.toISOString(),
        metadata: {
          sender: {
            name: newShipment.senderName,
            email: newShipment.senderEmail,
            phone: newShipment.senderPhone,
            address: newShipment.senderAddress,
            city: newShipment.senderCity,
            country: newShipment.senderCountry,
          },
          receiver: {
            name: newShipment.receiverName,
            email: newShipment.receiverEmail,
            phone: newShipment.receiverPhone,
            address: newShipment.receiverAddress,
            city: newShipment.receiverCity,
            country: newShipment.receiverCountry,
          },
          weight: newShipment.weight,
          description: newShipment.description,
          photos:
            createPhotoFiles.length > 0
              ? await uploadPhotos(createPhotoFiles)
              : [],
          charges: createCharges
            .filter((c) => c.label && c.amount)
            .map((c) => ({
              label: c.label,
              amount: parseFloat(c.amount) || 0,
            })),
        },
      };

      const { error } = await supabase.from("shipments").insert([shipmentData]);
      if (error) throw error;

      setShowAddModal(false);
      setNewShipment(emptyForm());
      setCreatePhotoFiles([]);
      setCreatePhotoPreviews([]);
      setCreateCharges([]);
    } catch (err: any) {
      console.error("Error creating shipment:", err);
      alert(
        "Error creating shipment: " +
          (err.message || "Check connection or constraints.")
      );
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingShipment) return;

    const locationText =
      updateForm.currentLocationAddress ||
      editingShipment.currentLocation.address;

    let newCoords = {
      lat: editingShipment.currentLocation.lat,
      lng: editingShipment.currentLocation.lng,
    };

    // Explicit Overwrite: Priority to manual or validated preview coordinates
    if (manualCoords && previewCoords) {
      newCoords = previewCoords;
    } else if (previewCoords && geocodingStatus === "success") {
      newCoords = previewCoords;
    } else if (
      updateForm.currentLocationAddress &&
      (updateForm.currentLocationAddress !==
        editingShipment.currentLocation.address ||
        (editingShipment.currentLocation.lat === 20 &&
          editingShipment.currentLocation.lng === 0))
    ) {
      // Force geocoding if address changed OR if it's currently at the Mali default (20,0)
      const g = await geocodeAddress(updateForm.currentLocationAddress);
      if (g) {
        newCoords = g;
      } else {
        const proceed = window.confirm(
          `System could not locate "${updateForm.currentLocationAddress}" on the map. \n\nClick OK to use default US coordinates (37.09, -95.71) instead of keeping the old location, or Cancel to stop.`
        );
        if (proceed) {
          // Force fallback to US or first country found in list
          const lowerAddr = updateForm.currentLocationAddress.toLowerCase();
          const countryMatch = Object.entries(commonCountryCoords).find(([c]) =>
            lowerAddr.includes(c)
          );
          newCoords = countryMatch
            ? countryMatch[1]
            : commonCountryCoords["united states"];
        } else {
          return;
        }
      }
    }

    // Stop simulation for this shipment if it was running, as we're setting a new manual point
    if (simulatingId === editingShipment.id) {
      setSimulatingId(null);
    }

    const historyToAdd =
      updateForm.historyStatus || updateForm.historyDescription
        ? [
            {
              timestamp: new Date().toISOString(),
              status: updateForm.historyStatus || updateForm.status,
              location:
                updateForm.currentLocationAddress ||
                editingShipment.currentLocation.address,
              description:
                updateForm.historyDescription ||
                `Status updated to ${updateForm.status}.`,
            },
          ]
        : [];

    try {
      const newPhotoUrls =
        updatePhotoFiles.length > 0 ? await uploadPhotos(updatePhotoFiles) : [];
      const existingPhotos = editingShipment.metadata?.photos || [];

      const { error } = await supabase
        .from("shipments")
        .update({
          status: updateForm.status,
          current_location: {
            lat: newCoords.lat,
            lng: newCoords.lng,
            address: locationText,
          },
          history: [...historyToAdd, ...updateHistory],
          updated_at: new Date().toISOString(),
          metadata: {
            ...(editingShipment.metadata || {}),
            photos: [...existingPhotos, ...newPhotoUrls],
            charges: updateCharges
              .filter((c) => c.label && c.amount)
              .map((c) => ({
                label: c.label,
                amount: parseFloat(c.amount) || 0,
              })),
          },
        })
        .eq("id", editingShipment.id);

      if (error) throw error;
      setEditingShipment(null);
      setUpdatePhotoFiles([]);
      setUpdatePhotoPreviews([]);
      setUpdateCharges([]);
    } catch (err: any) {
      console.error("Error updating shipment:", err);
      alert(
        "Failed to save update:\n" + (err.message || "Unknown error occurred.")
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this shipment permanently?")) return;
    await supabase.from("shipments").delete().eq("id", id);
  };

  // Simulation
  useEffect(() => {
    if (!simulatingId) return;
    const interval = setInterval(async () => {
      const shipment = shipments.find((s) => s.id === simulatingId);
      if (!shipment || shipment.status !== "Active") {
        setSimulatingId(null);
        return;
      }
      const newLat =
        shipment.currentLocation.lat + (Math.random() - 0.5) * 0.08;
      const newLng =
        shipment.currentLocation.lng + (Math.random() - 0.5) * 0.08;
      await supabase
        .from("shipments")
        .update({
          current_location: {
            lat: newLat,
            lng: newLng,
            address: `In Transit – ${newLat.toFixed(4)}, ${newLng.toFixed(4)}`,
          },
          updated_at: new Date().toISOString(),
        })
        .eq("id", shipment.id);
    }, 4000);
    return () => clearInterval(interval);
  }, [simulatingId, shipments]);

  const openUpdateModal = (shipment: Shipment) => {
    setEditingShipment(shipment);
    setUpdateHistory([...shipment.history]);
    setGeocodingStatus("idle");
    setManualCoords(false);
    setPreviewCoords(null);
    setUpdateForm({
      status: shipment.status,
      currentLocationAddress: shipment.currentLocation.address,
      historyStatus: "",
      historyDescription: "",
    });
    setUpdateCharges(
      (shipment.metadata?.charges || []).map((c) => ({
        label: c.label,
        amount: c.amount.toString(),
      }))
    );
  };

  const inputCls =
    "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-ups-brown focus:border-transparent transition-all outline-none text-sm";
  const labelCls =
    "block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1";

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-ups-brown">
              Admin Panel
            </h1>
            <p className="text-gray-500 mt-1">
              Create, track, and update shipments in real-time.
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-ups-brown text-ups-yellow px-8 py-4 rounded-2xl font-bold hover:bg-ups-brown/90 transition-all flex items-center gap-2 shadow-xl shadow-ups-brown/10 border border-ups-yellow/10"
          >
            <Plus className="w-5 h-5" /> New Shipment
          </button>
        </div>
      </div>

      {/* Shipments List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:mt-10">
        <div className="bg-white rounded-3xl sm:rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
          {/* Desktop Table - Hidden on Mobile */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Tracking #
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Receiver
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Route
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Status
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Location
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center text-gray-400"
                    >
                      Loading shipments...
                    </td>
                  </tr>
                ) : shipments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center">
                      <img
                        src={athLogo}
                        alt="UPS Logo"
                        className="w-16 h-16 mx-auto mb-3 object-contain opacity-20 grayscale"
                      />
                      <p className="text-gray-400 font-medium">
                        No shipments yet.
                      </p>
                    </td>
                  </tr>
                ) : (
                  shipments.map((s) => (
                    <tr
                      key={s.id}
                      className="hover:bg-gray-50/50 transition-colors group"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center p-1.5 transition-colors">
                            <img
                              src={athLogo}
                              alt="UPS Shield"
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div>
                            <p className="font-bold text-ups-brown text-sm">
                              {s.trackingNumber}
                            </p>
                            <p className="text-xs text-gray-400">
                              {format(new Date(s.createdAt), "MMM dd, yyyy")}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <p className="font-semibold text-gray-900 text-sm">
                          {s.receiverName}
                        </p>
                        <p className="text-xs text-gray-400">
                          {s.receiverEmail}
                        </p>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span className="font-medium">{s.origin}</span>
                          <span>→</span>
                          <span className="font-medium">{s.destination}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span
                          className={cn(
                            "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                            s.status === "Active"
                              ? "bg-blue-50 text-blue-700"
                              : s.status === "Out for Delivery"
                                ? "bg-indigo-50 text-indigo-700"
                                : s.status === "Delivered"
                                  ? "bg-emerald-50 text-emerald-700"
                                  : s.status === "On Hold"
                                    ? "bg-amber-50 text-amber-700"
                                    : "bg-red-50 text-red-700"
                          )}
                        >
                          {s.status}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <p className="text-xs text-gray-500 max-w-[180px] truncate flex items-center gap-1">
                          <MapPin className="w-3 h-3 flex-shrink-0" />
                          {s.currentLocation.address}
                        </p>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openUpdateModal(s)}
                            className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all"
                            title="Update"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              setSimulatingId(
                                simulatingId === s.id ? null : s.id
                              )
                            }
                            className={cn(
                              "p-2 rounded-lg transition-all",
                              simulatingId === s.id
                                ? "bg-amber-100 text-amber-600"
                                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                            )}
                          >
                            {simulatingId === s.id ? (
                              <Pause className="w-4 h-4" />
                            ) : (
                              <Play className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={() => handleDelete(s.id)}
                            className="p-2 bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List - Visible ONLY on Mobile */}
          <div className="md:hidden divide-y divide-gray-50">
            {loading ? (
              <div className="p-12 text-center text-gray-400">Loading...</div>
            ) : shipments.length === 0 ? (
              <div className="p-12 text-center text-gray-400">
                No shipments found.
              </div>
            ) : (
              shipments.map((s) => (
                <div key={s.id} className="p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-ups-brown text-ups-yellow rounded-xl flex items-center justify-center">
                        <Package className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-black text-ups-brown text-sm">
                          {s.trackingNumber}
                        </p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                          {format(new Date(s.createdAt), "MMM dd, yyyy")}
                        </p>
                      </div>
                    </div>
                    <span
                      className={cn(
                        "px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                        s.status === "Active"
                          ? "bg-blue-50 text-blue-700"
                          : s.status === "Out for Delivery"
                            ? "bg-indigo-50 text-indigo-700"
                            : s.status === "Delivered"
                              ? "bg-emerald-50 text-emerald-700"
                              : s.status === "On Hold"
                                ? "bg-amber-50 text-amber-700"
                                : "bg-red-50 text-red-700"
                      )}
                    >
                      {s.status}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400 font-bold uppercase">
                        Receiver
                      </span>
                      <span className="font-bold text-gray-900">
                        {s.receiverName}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400 font-bold uppercase">
                        Route
                      </span>
                      <span className="font-medium text-gray-500">
                        {s.origin} → {s.destination}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
                      <MapPin className="w-3 h-3 text-ups-yellow-dark" />
                      <span className="truncate">
                        {s.currentLocation.address}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => openUpdateModal(s)}
                      className="flex-1 py-3 bg-blue-50 text-blue-600 rounded-xl font-bold text-xs flex items-center justify-center gap-2"
                    >
                      <Edit2 className="w-3.5 h-3.5" /> Update
                    </button>
                    <button
                      onClick={() =>
                        setSimulatingId(simulatingId === s.id ? null : s.id)
                      }
                      className={cn(
                        "flex-1 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2",
                        simulatingId === s.id
                          ? "bg-amber-100 text-amber-600"
                          : "bg-gray-100 text-gray-500"
                      )}
                    >
                      {simulatingId === s.id ? (
                        <Pause className="w-3.5 h-3.5" />
                      ) : (
                        <Play className="w-3.5 h-3.5" />
                      )}{" "}
                      Move
                    </button>
                    <button
                      onClick={() => handleDelete(s.id)}
                      className="w-12 py-3 bg-red-50 text-red-500 rounded-xl flex items-center justify-center"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ─────────── CREATE SHIPMENT MODAL ─────────── */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center sm:p-4 p-0">
          <div className="bg-white w-full max-w-3xl sm:rounded-[2.5rem] rounded-none shadow-2xl overflow-hidden h-screen sm:h-auto sm:max-h-[90vh] flex flex-col">
            <div className="p-6 sm:p-8 bg-ups-brown text-ups-yellow flex justify-between items-center sticky top-0 z-10">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold leading-tight">
                  New Shipment
                </h2>
                <p className="text-ups-yellow/70 text-xs sm:text-sm mt-0.5">
                  Generate a tracking record instantly.
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
                title="Close"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form
              onSubmit={handleCreate}
              className="p-6 sm:p-8 space-y-8 flex-1 overflow-y-auto pb-32 sm:pb-8"
            >
              {/* Tracking ID */}
              <div className="flex items-center gap-4 p-4 bg-ups-brown/5 rounded-2xl border border-ups-brown/10">
                <Hash className="w-5 h-5 text-ups-brown" />
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                    Auto-Generated Tracking ID
                  </p>
                  <p className="font-black text-ups-brown text-lg">
                    {newShipment.trackingNumber}
                  </p>
                </div>
              </div>

              {/* Sender Section */}
              <div>
                <h3 className="text-xs font-black text-ups-brown uppercase tracking-widest mb-4 flex items-center gap-2 bg-gray-50 p-2 rounded-lg">
                  <Building className="w-4 h-4" /> Sender Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Full Name</label>
                    <input
                      className={inputCls}
                      required
                      placeholder="Jane Smith"
                      value={newShipment.senderName}
                      onChange={(e) =>
                        setNewShipment({
                          ...newShipment,
                          senderName: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Email</label>
                    <input
                      type="email"
                      className={inputCls}
                      placeholder="jane@company.com"
                      value={newShipment.senderEmail}
                      onChange={(e) =>
                        setNewShipment({
                          ...newShipment,
                          senderEmail: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Phone</label>
                    <input
                      className={inputCls}
                      placeholder="+1 555 000 0000"
                      value={newShipment.senderPhone}
                      onChange={(e) =>
                        setNewShipment({
                          ...newShipment,
                          senderPhone: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Street Address</label>
                    <input
                      className={inputCls}
                      placeholder="123 Main St"
                      value={newShipment.senderAddress}
                      onChange={(e) =>
                        setNewShipment({
                          ...newShipment,
                          senderAddress: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className={labelCls}>City / Origin</label>
                    <input
                      required
                      className={inputCls}
                      placeholder="New York"
                      value={newShipment.senderCity}
                      onChange={(e) =>
                        setNewShipment({
                          ...newShipment,
                          senderCity: e.target.value,
                          origin: `${e.target.value}, ${newShipment.senderCountry}`,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Country</label>
                    <input
                      required
                      className={inputCls}
                      placeholder="USA"
                      value={newShipment.senderCountry}
                      onChange={(e) =>
                        setNewShipment({
                          ...newShipment,
                          senderCountry: e.target.value,
                          origin: `${newShipment.senderCity}, ${e.target.value}`,
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Receiver Section */}
              <div>
                <h3 className="text-xs font-black text-ups-brown uppercase tracking-widest mb-4 flex items-center gap-2 bg-gray-50 p-2 rounded-lg">
                  <User className="w-4 h-4" /> Recipient Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Full Name</label>
                    <input
                      className={inputCls}
                      required
                      placeholder="John Doe"
                      value={newShipment.receiverName}
                      onChange={(e) =>
                        setNewShipment({
                          ...newShipment,
                          receiverName: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Email</label>
                    <input
                      type="email"
                      className={inputCls}
                      required
                      placeholder="john@email.com"
                      value={newShipment.receiverEmail}
                      onChange={(e) =>
                        setNewShipment({
                          ...newShipment,
                          receiverEmail: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Phone</label>
                    <input
                      className={inputCls}
                      placeholder="+44 7700 000000"
                      value={newShipment.receiverPhone}
                      onChange={(e) =>
                        setNewShipment({
                          ...newShipment,
                          receiverPhone: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Street Address</label>
                    <input
                      className={inputCls}
                      placeholder="45 Baker Street"
                      value={newShipment.receiverAddress}
                      onChange={(e) =>
                        setNewShipment({
                          ...newShipment,
                          receiverAddress: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className={labelCls}>City / Destination</label>
                    <input
                      required
                      className={inputCls}
                      placeholder="London"
                      value={newShipment.receiverCity}
                      onChange={(e) =>
                        setNewShipment({
                          ...newShipment,
                          receiverCity: e.target.value,
                          destination: `${e.target.value}, ${newShipment.receiverCountry}`,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Country</label>
                    <input
                      required
                      className={inputCls}
                      placeholder="UK"
                      value={newShipment.receiverCountry}
                      onChange={(e) =>
                        setNewShipment({
                          ...newShipment,
                          receiverCountry: e.target.value,
                          destination: `${newShipment.receiverCity}, ${e.target.value}`,
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Package Details */}
              <div>
                <h3 className="text-xs font-black text-ups-brown uppercase tracking-widest mb-4 flex items-center gap-2 bg-gray-50 p-2 rounded-lg">
                  <Box className="w-4 h-4" /> Package Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className={labelCls}>Initial Status</label>
                    <select
                      className={inputCls}
                      value={newShipment.status}
                      onChange={(e) =>
                        setNewShipment({
                          ...newShipment,
                          status: e.target.value as ShipmentStatus,
                        })
                      }
                    >
                      {SHIPMENT_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Weight (kg)</label>
                    <input
                      className={inputCls}
                      placeholder="2.5"
                      value={newShipment.weight}
                      onChange={(e) =>
                        setNewShipment({
                          ...newShipment,
                          weight: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Est. Delivery (days)</label>
                    <input
                      type="number"
                      className={inputCls}
                      min="1"
                      max="60"
                      value={newShipment.estimatedDeliveryDays}
                      onChange={(e) =>
                        setNewShipment({
                          ...newShipment,
                          estimatedDeliveryDays: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label className={labelCls}>Package Description</label>
                    <textarea
                      className={inputCls}
                      rows={2}
                      placeholder="e.g. Electronics, Documents..."
                      value={newShipment.description}
                      onChange={(e) =>
                        setNewShipment({
                          ...newShipment,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Package Photos */}
              <div>
                <h3 className="text-sm font-black text-ups-brown uppercase tracking-widest mb-4 flex items-center gap-2">
                  <ImagePlus className="w-4 h-4" /> Package Photos
                </h3>
                <input
                  ref={createFileRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleCreatePhotoSelect}
                />
                <button
                  type="button"
                  onClick={() => createFileRef.current?.click()}
                  className="w-full border-2 border-dashed border-gray-200 rounded-2xl py-5 text-sm text-gray-400 hover:border-ups-brown hover:text-ups-brown transition-all flex items-center justify-center gap-2"
                >
                  <ImagePlus className="w-5 h-5" /> Click to add package photos
                </button>
                {createPhotoPreviews.length > 0 && (
                  <div className="mt-3 grid grid-cols-4 gap-2">
                    {createPhotoPreviews.map((src, i) => (
                      <div key={i} className="relative group">
                        <img
                          src={src}
                          className="w-full h-20 object-cover rounded-xl border border-gray-100"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setCreatePhotoPreviews((p) =>
                              p.filter((_, j) => j !== i)
                            );
                            setCreatePhotoFiles((p) =>
                              p.filter((_, j) => j !== i)
                            );
                          }}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Optional Charges */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-black text-ups-brown uppercase tracking-widest flex items-center gap-2">
                    <DollarSign className="w-4 h-4" /> Additional Charges
                  </h3>
                  <button
                    type="button"
                    onClick={() => addCharge(false)}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <Plus className="w-3 h-3" /> Add Charge
                  </button>
                </div>

                {createCharges.length === 0 ? (
                  <div className="p-6 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl text-center">
                    <p className="text-xs text-gray-400 font-medium italic">
                      No charges added. These only appear on the printed
                      invoice.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {createCharges.map((charge, i) => (
                      <div
                        key={i}
                        className="flex gap-3 items-center animate-in fade-in slide-in-from-top-2 duration-300"
                      >
                        <div className="flex-1">
                          <input
                            className={inputCls}
                            placeholder="e.g. Service Fee"
                            value={charge.label}
                            onChange={(e) =>
                              updateCharge(i, "label", e.target.value, false)
                            }
                          />
                        </div>
                        <div className="w-32 relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                            $
                          </span>
                          <input
                            type="number"
                            step="0.01"
                            className={cn(inputCls, "pl-7")}
                            placeholder="0.00"
                            value={charge.amount}
                            onChange={(e) =>
                              updateCharge(i, "amount", e.target.value, false)
                            }
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeCharge(i, false)}
                          className="p-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <div className="flex justify-end pt-2 pr-12">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                        Total Charges:{" "}
                        <span className="text-ups-brown ml-1">
                          ${" "}
                          {createCharges
                            .reduce(
                              (acc, c) => acc + (parseFloat(c.amount) || 0),
                              0
                            )
                            .toFixed(2)}
                        </span>
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={photoUploading}
                className="w-full bg-ups-brown text-ups-yellow py-5 rounded-2xl font-bold hover:bg-ups-brown/90 transition-all flex items-center justify-center gap-2 border border-ups-yellow/10 text-base disabled:opacity-60"
              >
                {photoUploading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Uploading
                    photos...
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5" /> Create Shipment & Generate
                    Tracking
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ─────────── UPDATE SHIPMENT MODAL ─────────── */}
      {editingShipment && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center sm:p-4 p-0">
          <div className="bg-white w-full max-w-lg sm:rounded-[2.5rem] rounded-none shadow-2xl overflow-hidden h-screen sm:h-auto sm:max-h-[90vh] flex flex-col">
            <div className="p-6 sm:p-8 bg-ups-brown text-ups-yellow flex justify-between items-center sticky top-0 z-10 shadow-lg">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold leading-tight">
                  Update Shipment
                </h2>
                <p className="text-ups-yellow/70 text-xs sm:text-sm mt-0.5 font-mono">
                  {editingShipment.trackingNumber}
                </p>
              </div>
              <button
                onClick={() => setEditingShipment(null)}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
                title="Close"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form
              onSubmit={handleUpdate}
              className="p-6 sm:p-8 space-y-6 flex-1 overflow-y-auto pb-32 sm:pb-8"
            >
              <div>
                <label className={labelCls}>New Status</label>
                <select
                  className={inputCls}
                  value={updateForm.status}
                  onChange={(e) =>
                    setUpdateForm({
                      ...updateForm,
                      status: e.target.value as ShipmentStatus,
                    })
                  }
                >
                  {SHIPMENT_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls}>
                  Current Location (City, Country)
                </label>

                {editingShipment &&
                  editingShipment.currentLocation.lat === 20 &&
                  editingShipment.currentLocation.lng === 0 && (
                    <div className="bg-red-50 border border-red-100 p-2.5 rounded-xl mb-3 flex items-center gap-2 animate-pulse">
                      <AlertCircle className="w-4 h-4 text-red-500" />
                      <p className="text-[10px] font-bold text-red-600 uppercase flex-1">
                        Stuck at default coordinates (Mali). Search and Save to
                        fix.
                      </p>
                    </div>
                  )}

                <div className="flex gap-2 mb-2">
                  <select
                    className={cn(inputCls, "bg-blue-50/50 text-blue-700 font-bold border-blue-200 focus:ring-blue-500")}
                    defaultValue=""
                    onChange={(e) => {
                      const stateName = e.target.value;
                      if (!stateName) return;
                      const coords = US_STATES[stateName];
                      if (coords) {
                        const newAddress = `${stateName}, United States`;
                        setUpdateForm({
                          ...updateForm,
                          currentLocationAddress: newAddress,
                        });
                        setPreviewCoords(coords);
                        setGeocodingStatus("success");
                        setManualCoords(true); // Explicitly ensure we use these coords
                      }
                    }}
                  >
                    <option value="" disabled>⚡ Quick Select US State</option>
                    {Object.keys(US_STATES).map((state) => (
                      <option key={state} value={state}>
                        {state}, United States
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-2">
                  <input
                    className={cn(inputCls, "flex-1")}
                    placeholder="e.g. London, UK  or  Paris, FR"
                    value={updateForm.currentLocationAddress}
                    onChange={(e) => {
                      setUpdateForm({
                        ...updateForm,
                        currentLocationAddress: e.target.value,
                      });
                      setGeocodingStatus("idle");
                    }}
                  />
                  <button
                    type="button"
                    onClick={async () => {
                      if (!updateForm.currentLocationAddress) return;
                      setGeocodingStatus("searching");
                      const g = await geocodeAddress(
                        updateForm.currentLocationAddress
                      );
                      if (g) {
                        setPreviewCoords(g);
                        setGeocodingStatus("success");
                      } else {
                        setGeocodingStatus("failed");
                      }
                    }}
                    className={cn(
                      "px-4 rounded-xl font-bold text-xs transition-all flex items-center gap-2 flex-shrink-0",
                      geocodingStatus === "success"
                        ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                        : geocodingStatus === "failed"
                          ? "bg-red-50 text-red-600 border border-red-100"
                          : "bg-ups-brown text-ups-yellow"
                    )}
                  >
                    {geocodingStatus === "searching" ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <MapPin className="w-4 h-4" />
                    )}
                    {geocodingStatus === "success"
                      ? "Found"
                      : geocodingStatus === "failed"
                        ? "Not Found"
                        : "Search & Sync"}
                  </button>
                </div>

                {geocodingStatus === "success" && previewCoords && (
                  <p className="text-[10px] text-emerald-600 mt-1 font-bold">
                    Coordinates found: {previewCoords.lat.toFixed(4)},{" "}
                    {previewCoords.lng.toFixed(4)}
                  </p>
                )}

                <div className="mt-3">
                  <button
                    type="button"
                    onClick={() => {
                      setManualCoords(!manualCoords);
                      if (!previewCoords && editingShipment) {
                        setPreviewCoords({
                          lat: editingShipment.currentLocation.lat,
                          lng: editingShipment.currentLocation.lng,
                        });
                      }
                    }}
                    className="text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-ups-brown transition-colors flex items-center gap-1.5"
                  >
                    <Edit2 className="w-3 h-3" />{" "}
                    {manualCoords
                      ? "Use Auto-Geocoding"
                      : "Set Coordinates Manually"}
                  </button>

                  {manualCoords && (
                    <div className="grid grid-cols-2 gap-3 mt-2 animate-in fade-in slide-in-from-top-1">
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">
                          Latitude
                        </label>
                        <input
                          type="number"
                          step="any"
                          className={inputCls}
                          value={previewCoords?.lat || ""}
                          onChange={(e) =>
                            setPreviewCoords((prev) => ({
                              ...prev!,
                              lat: parseFloat(e.target.value),
                            }))
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">
                          Longitude
                        </label>
                        <input
                          type="number"
                          step="any"
                          className={inputCls}
                          value={previewCoords?.lng || ""}
                          onChange={(e) =>
                            setPreviewCoords((prev) => ({
                              ...prev!,
                              lng: parseFloat(e.target.value),
                            }))
                          }
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className={labelCls}>History Event Label</label>
                <input
                  className={inputCls}
                  placeholder="e.g. Arrived at Sorting Facility"
                  value={updateForm.historyStatus}
                  onChange={(e) =>
                    setUpdateForm({
                      ...updateForm,
                      historyStatus: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className={labelCls}>Event Description</label>
                <textarea
                  className={inputCls}
                  rows={3}
                  placeholder="e.g. Package has arrived at London Heathrow customs clearance."
                  value={updateForm.historyDescription}
                  onChange={(e) =>
                    setUpdateForm({
                      ...updateForm,
                      historyDescription: e.target.value,
                    })
                  }
                />
              </div>

              {/* History Editor */}
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                  Edit Past Events ({updateHistory.length})
                </p>
                <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                  {updateHistory.map((h, i) => (
                    <div
                      key={i}
                      className="bg-white p-3 rounded-xl border border-gray-200 relative group animate-in fade-in"
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setUpdateHistory((prev) =>
                            prev.filter((_, idx) => idx !== i)
                          )
                        }
                        className="absolute right-2 top-2 p-1.5 bg-red-50 text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Delete Event"
                      >
                        <Trash className="w-3.5 h-3.5" />
                      </button>
                      <div className="grid grid-cols-2 gap-2 mb-2 pr-8">
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-gray-400 mb-0.5">
                            Date & Time
                          </label>
                          <input
                            type="datetime-local"
                            className="w-full text-xs p-1.5 bg-gray-50 border border-gray-100 rounded-md outline-none focus:border-ups-brown"
                            value={new Date(
                              new Date(h.timestamp).getTime() -
                                new Date(h.timestamp).getTimezoneOffset() *
                                  60000
                            )
                              .toISOString()
                              .slice(0, 16)}
                            onChange={(e) => {
                              try {
                                const d = new Date(e.target.value);
                                if (!isNaN(d.getTime())) {
                                  const newHist = [...updateHistory];
                                  newHist[i].timestamp = d.toISOString();
                                  setUpdateHistory(newHist);
                                }
                              } catch (err) {}
                            }}
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-gray-400 mb-0.5">
                            Status Label
                          </label>
                          <input
                            className="w-full text-xs p-1.5 bg-gray-50 border border-gray-100 rounded-md outline-none focus:border-ups-brown"
                            value={h.status}
                            onChange={(e) => {
                              const newHist = [...updateHistory];
                              newHist[i].status = e.target.value;
                              setUpdateHistory(newHist);
                            }}
                          />
                        </div>
                      </div>
                      <div className="mb-2">
                        <label className="block text-[10px] uppercase font-bold text-gray-400 mb-0.5">
                          Location
                        </label>
                        <input
                          className="w-full text-xs p-1.5 bg-gray-50 border border-gray-100 rounded-md outline-none focus:border-ups-brown"
                          value={h.location}
                          onChange={(e) => {
                            const newHist = [...updateHistory];
                            newHist[i].location = e.target.value;
                            setUpdateHistory(newHist);
                          }}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-gray-400 mb-0.5">
                          Description
                        </label>
                        <textarea
                          rows={2}
                          className="w-full text-xs p-1.5 bg-gray-50 border border-gray-100 rounded-md outline-none focus:border-ups-brown"
                          value={h.description}
                          onChange={(e) => {
                            const newHist = [...updateHistory];
                            newHist[i].description = e.target.value;
                            setUpdateHistory(newHist);
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add More Photos */}
              <div>
                <label className={labelCls}>Add More Photos</label>
                <input
                  ref={updateFileRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleUpdatePhotoSelect}
                />
                <button
                  type="button"
                  onClick={() => updateFileRef.current?.click()}
                  className="w-full border-2 border-dashed border-gray-200 rounded-2xl py-4 text-sm text-gray-400 hover:border-ups-brown hover:text-ups-brown transition-all flex items-center justify-center gap-2"
                >
                  <ImagePlus className="w-4 h-4" /> Add photos to this update
                </button>
                {updatePhotoPreviews.length > 0 && (
                  <div className="mt-3 grid grid-cols-4 gap-2">
                    {updatePhotoPreviews.map((src, i) => (
                      <div key={i} className="relative group">
                        <img
                          src={src}
                          className="w-full h-16 object-cover rounded-xl border border-gray-100"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setUpdatePhotoPreviews((p) =>
                              p.filter((_, j) => j !== i)
                            );
                            setUpdatePhotoFiles((p) =>
                              p.filter((_, j) => j !== i)
                            );
                          }}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {/* Existing photos */}
                {editingShipment.metadata?.photos &&
                  editingShipment.metadata.photos.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">
                        Existing Photos (
                        {editingShipment.metadata.photos.length})
                      </p>
                      <div className="grid grid-cols-4 gap-2">
                        {editingShipment.metadata.photos.map((url, i) => (
                          <img
                            key={i}
                            src={url}
                            className="w-full h-16 object-cover rounded-xl border border-gray-100"
                          />
                        ))}
                      </div>
                    </div>
                  )}
              </div>

              {/* Optional Charges */}
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <h3 className="text-sm font-black text-ups-brown uppercase tracking-widest flex items-center gap-2">
                    <DollarSign className="w-4 h-4" /> Invoice Charges
                  </h3>
                  <button
                    type="button"
                    onClick={() => addCharge(true)}
                    className="w-full sm:w-auto text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-4 py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1.5 border border-blue-100"
                  >
                    <Plus className="w-4 h-4" /> Add Charge
                  </button>
                </div>

                {updateCharges.length === 0 ? (
                  <div className="p-4 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl text-center">
                    <p className="text-[10px] text-gray-400 font-medium italic">
                      No charges added to this shipment yet.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {updateCharges.map((charge, i) => (
                      <div
                        key={i}
                        className="flex gap-2 items-center animate-in fade-in slide-in-from-top-1 duration-300"
                      >
                        <div className="flex-1">
                          <input
                            className={cn(inputCls, "py-2 px-3")}
                            placeholder="Charge Label"
                            value={charge.label}
                            onChange={(e) =>
                              updateCharge(i, "label", e.target.value, true)
                            }
                          />
                        </div>
                        <div className="w-24 relative">
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                            $
                          </span>
                          <input
                            type="number"
                            step="0.01"
                            className={cn(inputCls, "pl-5 py-2 px-3")}
                            placeholder="0.00"
                            value={charge.amount}
                            onChange={(e) =>
                              updateCharge(i, "amount", e.target.value, true)
                            }
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeCharge(i, true)}
                          className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <div className="flex justify-end pt-1 pr-10">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        Total:{" "}
                        <span className="text-ups-brown ml-1">
                          ${" "}
                          {updateCharges
                            .reduce(
                              (acc, c) => acc + (parseFloat(c.amount) || 0),
                              0
                            )
                            .toFixed(2)}
                        </span>
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={photoUploading}
                className="w-full bg-ups-brown text-ups-yellow py-4 sm:py-5 rounded-xl sm:rounded-2xl font-bold hover:bg-ups-brown/90 transition-all flex items-center justify-center gap-2 border border-ups-yellow/10 text-base disabled:opacity-60 sticky bottom-0 z-10 shadow-2xl"
              >
                {photoUploading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Syncing data...
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5" /> Save Changes
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
