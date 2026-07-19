import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Shipment } from '../types';
import {
  Package, MapPin, Clock, AlertCircle, ArrowLeft, Share2, Printer,
  Truck, Box, Building, User, Mail, Phone, CheckCircle2,
  CalendarDays, Image, X, ChevronLeft, ChevronRight, Plus
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '../lib/utils';

export const ShipmentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);

  const printInvoice = () => {
    if (!shipment) return;
    const meta = shipment.metadata;
    const photos = meta?.photos || [];

    const photoHtml = photos.length > 0
      ? `<div style="margin-top:24px">
           <h3 style="font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#999;margin-bottom:12px">Package Photos</h3>
           <div style="display:flex;gap:12px;flex-wrap:wrap">
             ${photos.map(url => `<img src="${url}" style="width:140px;height:100px;object-fit:cover;border-radius:8px;border:1px solid #eee" />`).join('')}
           </div>
         </div>`
      : '';

    const charges = meta?.charges || [];
    const chargesTotal = charges.reduce((acc, c) => acc + c.amount, 0);

    const chargesHtml = charges.length > 0
      ? `<div style="margin-top:28px;padding:24px;background:#fefce8;border-radius:12px;border:1px solid #fef08a">
           <h3 style="font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#854d0e;margin-bottom:16px">Payment Details / Charges</h3>
           <table style="width:100%;border-collapse:collapse;margin-bottom:16px">
             ${charges.map(c => `
               <tr>
                 <td style="padding:6px 0;font-size:13px;color:#713f12">${c.label}</td>
                 <td style="padding:6px 0;font-size:13px;font-weight:700;color:#713f12;text-align:right">$ ${c.amount.toFixed(2)}</td>
               </tr>`).join('')}
             <tr style="border-top:1.5px solid #facc15">
               <td style="padding-top:14px;font-size:15px;font-weight:900;color:#451a03">TOTAL SHIPMENT VALUE</td>
               <td style="padding-top:14px;font-size:20px;font-weight:900;color:#451a03;text-align:right">$ ${chargesTotal.toFixed(2)}</td>
             </tr>
           </table>
           <div style="font-size:10px;color:#a16207;font-style:italic">This document serves as a summary of all billing activities associated with this tracking number.</div>
         </div>`
      : '';

    const historyHtml = shipment.history.map(h => `
      <tr>
        <td style="padding:8px 0;font-size:12px;color:#666;border-bottom:1px solid #f0f0f0">${format(new Date(h.timestamp), 'MMM dd, yyyy HH:mm')}</td>
        <td style="padding:8px 16px;font-size:12px;font-weight:bold;border-bottom:1px solid #f0f0f0">${h.status}</td>
        <td style="padding:8px 0;font-size:12px;color:#888;border-bottom:1px solid #f0f0f0">${h.location}</td>
        <td style="padding:8px 0 8px 16px;font-size:12px;color:#555;border-bottom:1px solid #f0f0f0">${h.description}</td>
      </tr>`).join('');

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <title>GSS Shipment Invoice – ${shipment.trackingNumber}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Arial', sans-serif; padding: 40px; color: #1a1a1a; background: #fff; }
          @media print { body { padding: 20px; } .no-print { display: none; } }
        </style>
      </head>
      <body>
        <!-- Header -->
        <div style="display:flex;justify-content:space-between;align-items:flex-start;padding-bottom:24px;border-bottom:3px solid #4B2E06;margin-bottom:32px">
          <div>
            <div style="display:flex;align-items:center;gap:12px;margin-bottom:8px">
              <div style="width:48px;height:48px;background:#4B2E06;border-radius:12px;display:flex;align-items:center;justify-content:center">
                <span style="color:#F5C40A;font-size:22px;font-weight:900">U</span>
              </div>
              <div>
                <div style="font-size:24px;font-weight:900;color:#4B2E06;letter-spacing:-1px">GSS</div>
                <div style="font-size:9px;font-weight:700;color:#888;letter-spacing:3px;text-transform:uppercase">Global Span Solutions</div>
              </div>
            </div>
            <div style="font-size:11px;color:#888;margin-top:4px">Shipment Tracking Invoice</div>
          </div>
          <div style="text-align:right">
            <div style="font-size:11px;color:#888;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px">Tracking Number</div>
            <div style="font-size:20px;font-weight:900;color:#4B2E06">${shipment.trackingNumber}</div>
            <div style="margin-top:8px;display:inline-block;padding:4px 12px;border-radius:20px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;background:${shipment.status === 'Delivered' ? '#d1fae5' : shipment.status === 'Out for Delivery' ? '#e0e7ff' : shipment.status === 'Active' ? '#dbeafe' : shipment.status === 'On Hold' ? '#fef3c7' : '#fee2e2'};color:${shipment.status === 'Delivered' ? '#065f46' : shipment.status === 'Out for Delivery' ? '#3730a3' : shipment.status === 'Active' ? '#1e40af' : shipment.status === 'On Hold' ? '#92400e' : '#991b1b'}">${shipment.status}</div>
            <div style="font-size:10px;color:#aaa;margin-top:8px">Generated: ${format(new Date(), 'MMM dd, yyyy HH:mm')}</div>
          </div>
        </div>

        <!-- Sender / Receiver -->
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:28px">
          <div style="padding:20px;background:#f9fafb;border-radius:12px;border:1px solid #eee">
            <div style="font-size:10px;font-weight:700;color:#999;text-transform:uppercase;letter-spacing:2px;margin-bottom:12px">From / Sender</div>
            <div style="font-size:14px;font-weight:700;margin-bottom:4px">${meta?.sender?.name || '—'}</div>
            ${meta?.sender?.address ? `<div style="font-size:12px;color:#555">${meta.sender.address}</div>` : ''}
            <div style="font-size:12px;color:#555">${meta?.sender?.city || ''} ${meta?.sender?.country || ''}</div>
            ${meta?.sender?.phone ? `<div style="font-size:12px;color:#555;margin-top:4px">${meta.sender.phone}</div>` : ''}
            ${meta?.sender?.email ? `<div style="font-size:12px;color:#555">${meta.sender.email}</div>` : ''}
            <div style="font-size:11px;font-weight:600;color:#4B2E06;margin-top:8px">${shipment.origin}</div>
          </div>
          <div style="padding:20px;background:#4B2E06;border-radius:12px;color:#fff">
            <div style="font-size:10px;font-weight:700;color:#F5C40A;text-transform:uppercase;letter-spacing:2px;margin-bottom:12px">To / Recipient</div>
            <div style="font-size:14px;font-weight:700;margin-bottom:4px">${shipment.receiverName}</div>
            ${meta?.receiver?.address ? `<div style="font-size:12px;color:#ddd">${meta.receiver.address}</div>` : ''}
            <div style="font-size:12px;color:#ddd">${meta?.receiver?.city || ''} ${meta?.receiver?.country || ''}</div>
            ${meta?.receiver?.phone ? `<div style="font-size:12px;color:#ddd;margin-top:4px">${meta.receiver.phone}</div>` : ''}
            <div style="font-size:12px;color:#ddd">${shipment.receiverEmail}</div>
            <div style="font-size:11px;font-weight:600;color:#F5C40A;margin-top:8px">${shipment.destination}</div>
          </div>
        </div>

        <!-- Package Info -->
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:28px">
          ${[
            ['Est. Delivery', format(new Date(shipment.estimatedDelivery), 'MMM dd, yyyy')],
            ['Current Location', shipment.currentLocation.address],
            ['Weight', meta?.weight ? `${meta.weight} kg` : '—'],
            ['Contents', meta?.description || '—'],
          ].map(([k, v]) => `
            <div style="padding:16px;background:#f9fafb;border-radius:10px;border:1px solid #eee">
              <div style="font-size:9px;font-weight:700;color:#aaa;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:6px">${k}</div>
              <div style="font-size:12px;font-weight:600;color:#1a1a1a">${v}</div>
            </div>`).join('')}
        </div>

        <!-- History -->
        <div style="margin-bottom:28px">
          <h3 style="font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#999;margin-bottom:12px">Shipment History</h3>
          <table style="width:100%;border-collapse:collapse">
            <thead>
              <tr style="background:#f9fafb">
                <th style="padding:10px 0;font-size:10px;text-align:left;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:1px;border-bottom:2px solid #eee">Date & Time</th>
                <th style="padding:10px 16px;font-size:10px;text-align:left;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:1px;border-bottom:2px solid #eee">Status</th>
                <th style="padding:10px 0;font-size:10px;text-align:left;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:1px;border-bottom:2px solid #eee">Location</th>
                <th style="padding:10px 0 10px 16px;font-size:10px;text-align:left;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:1px;border-bottom:2px solid #eee">Details</th>
              </tr>
            </thead>
            <tbody>${historyHtml}</tbody>
          </table>
        </div>

        ${chargesHtml}

        ${photoHtml}

        <!-- Footer -->
        <div style="margin-top:40px;padding-top:20px;border-top:1px solid #eee;display:flex;justify-content:space-between;align-items:center">
          <div style="font-size:10px;color:#bbb">© ${new Date().getFullYear()} Global Span Solutions, Inc. All rights reserved.</div>
          <div style="font-size:10px;color:#bbb">Document generated on ${format(new Date(), 'MMMM dd, yyyy')} at ${format(new Date(), 'HH:mm')}</div>
        </div>

        <script>window.onload = () => { window.print(); }</script>
      </body>
      </html>`;

    const win = window.open('', '_blank');
    if (win) {
      win.document.write(html);
      win.document.close();
    }
  };


  const fetchShipmentDetail = async () => {
    if (!id) return;
    try {
      const { data, error: err } = await supabase
        .from('shipments')
        .select('*')
        .eq('tracking_number', id)
        .single();

      if (err) throw err;

      if (data) {
        setShipment({
          id: data.id,
          trackingNumber: data.tracking_number,
          senderId: data.sender_id,
          receiverName: data.receiver_name,
          receiverEmail: data.receiver_email,
          origin: data.origin,
          destination: data.destination,
          status: data.status,
          currentLocation: data.current_location,
          history: data.history,
          estimatedDelivery: data.estimated_delivery,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
          metadata: data.metadata,
        } as Shipment);
        setError(null);
      }
    } catch {
      setError('Shipment not found. Please check your tracking number.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShipmentDetail();
    if (!id) return;

    const channel = supabase
      .channel('shipment-detail')
      .on('postgres_changes', {
        event: '*', schema: 'public', table: 'shipments',
        filter: `tracking_number=eq.${id}`,
      }, () => fetchShipmentDetail())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ups-brown mx-auto"></div>
          <p className="text-gray-400 font-medium">Fetching shipment data...</p>
        </div>
      </div>
    );
  }

  if (error || !shipment) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-ups-brown">Tracking Error</h2>
          <p className="text-gray-600 mb-8">{error}</p>
          <Link to="/" className="inline-flex items-center gap-2 bg-ups-brown text-ups-yellow px-8 py-3 rounded-full font-bold hover:bg-ups-brown/90 transition-all">
            <ArrowLeft className="w-5 h-5" /> Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const statusConfig = {
    Active:    { dot: 'bg-blue-500',    badge: 'bg-blue-50 text-blue-700',     label: 'In Transit' },
    'On Hold': { dot: 'bg-amber-500',   badge: 'bg-amber-50 text-amber-700',   label: 'On Hold' },
    'Out for Delivery': { dot: 'bg-indigo-500', badge: 'bg-indigo-50 text-indigo-700', label: 'Out for Delivery' },
    Delivered: { dot: 'bg-emerald-500', badge: 'bg-emerald-50 text-emerald-700', label: 'Delivered' },
    Cancelled: { dot: 'bg-red-500',     badge: 'bg-red-50 text-red-700',       label: 'Cancelled' },
  }[shipment.status] ?? { dot: 'bg-gray-400', badge: 'bg-gray-100 text-gray-600', label: shipment.status };

  const steps = ['Order Placed', 'Picked Up', 'In Transit', 'Out for Delivery', 'Delivered'];
  const stepIndex = { Active: 2, 'On Hold': 1, 'Out for Delivery': 3, Delivered: 4, Cancelled: 0 }[shipment.status] ?? 0;

  const meta = shipment.metadata;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* ── Header ── */}
      <div className="bg-white border-b border-gray-100 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8 sm:mb-10 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link to="/" className="p-2 hover:bg-gray-100 rounded-full transition-colors order-2 sm:order-1">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="order-1 sm:order-2">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Tracking Details</p>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <h1 className="text-xl sm:text-2xl font-black text-ups-brown tracking-tight">{shipment.trackingNumber}</h1>
                  <span className={cn('px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wide', statusConfig.badge)}>
                    {statusConfig.label}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2">

              <button className="p-3 bg-white border border-gray-200 rounded-2xl hover:bg-gray-50 transition-all">
                <Share2 className="w-5 h-5 text-gray-500" />
              </button>
              <button
                onClick={printInvoice}
                className="p-3 bg-white border border-gray-200 rounded-2xl hover:bg-gray-50 transition-all"
                title="Print Invoice"
              >
                <Printer className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="relative max-w-4xl py-6 overflow-x-auto sm:overflow-visible no-scrollbar">
            <div className="min-w-[400px] sm:min-w-0 pr-4 sm:pr-0">
              <div className="absolute top-4 left-0 right-0 h-1 bg-gray-100 rounded-full" />
              <div
                className="absolute top-4 left-0 h-1 bg-ups-yellow rounded-full transition-all duration-1000"
                style={{ width: `${(stepIndex / (steps.length - 1)) * 100}%` }}
              />
              <div className="relative flex justify-between">
                {steps.map((step, i) => {
                  const done = i < stepIndex;
                  const active = i === stepIndex;
                  return (
                    <div key={step} className="flex flex-col items-center gap-2">
                      <div className={cn(
                        'w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center border-4 border-white shadow-md z-10 text-[10px] sm:text-xs font-bold transition-all',
                        done ? 'bg-ups-yellow text-ups-brown' :
                        active ? 'bg-ups-brown text-ups-yellow' : 'bg-gray-200 text-gray-400'
                      )}>
                        {done ? <CheckCircle2 className="w-5 h-5" /> : i + 1}
                      </div>
                      <span className={cn('text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-center max-w-[72px]',
                        active || done ? 'text-ups-brown' : 'text-gray-300'
                      )}>{step}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-start">


          {/* LEFT — Stats + History */}
          <div className="lg:col-span-2 space-y-8">

            {/* Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center sm:flex-col sm:items-start gap-4 sm:gap-0">
                <CalendarDays className="text-gray-200 w-8 h-8 sm:mb-3" />
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Est. Delivery</p>
                  <p className="font-black text-ups-brown text-sm sm:text-base">{format(new Date(shipment.estimatedDelivery), 'MMM dd, yyyy')}</p>
                </div>
              </div>
              <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center sm:flex-col sm:items-start gap-4 sm:gap-0">
                <Box className="text-gray-200 w-8 h-8 sm:mb-3" />
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Origin</p>
                  <p className="font-black text-ups-brown text-sm sm:text-base truncate max-w-[150px]">{shipment.origin}</p>
                </div>
              </div>
              <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center sm:flex-col sm:items-start gap-4 sm:gap-0">
                <MapPin className="text-gray-200 w-8 h-8 sm:mb-3" />
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Destination</p>
                  <p className="font-black text-ups-brown text-sm sm:text-base truncate max-w-[150px]">{shipment.destination}</p>
                </div>
              </div>
            </div>

            {/* Package Content */}
            {(meta?.description || meta?.weight) && (
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex gap-6">
                {meta.description && (
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Contents</p>
                    <p className="font-semibold text-gray-800">{meta.description}</p>
                  </div>
                )}
                {meta.weight && (
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Weight</p>
                    <p className="font-semibold text-gray-800">{meta.weight} kg</p>
                  </div>
                )}
              </div>
            )}

            {/* Package Photos Gallery */}
            {meta?.photos && meta.photos.length > 0 && (
              <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-ups-brown">
                  <Image className="w-5 h-5" /> Package Photos
                  <span className="ml-auto text-xs text-gray-400 font-normal">{meta.photos.length} photos</span>
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {meta.photos.map((url, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedPhoto(i)}
                      className="group relative aspect-square rounded-2xl overflow-hidden border border-gray-100 hover:ring-4 hover:ring-ups-yellow/30 transition-all"
                    >
                      <img src={url} alt={`Package photo ${i+1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Plus className="text-white w-6 h-6" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* History Timeline */}
            <div className="bg-white p-6 sm:p-10 rounded-[2.5rem] border border-gray-100 shadow-sm">
              <h3 className="text-base sm:text-lg font-black mb-8 flex items-center gap-2 text-ups-brown uppercase tracking-tighter">
                <Truck className="w-5 h-5 text-ups-yellow-dark" /> Shipment Activity
                <span className="ml-auto text-[10px] text-gray-400 font-bold uppercase tracking-widest">{shipment.history.length} events</span>
              </h3>
              <div className="relative space-y-8 sm:space-y-10 before:absolute before:left-4 sm:before:left-5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-ups-brown/20 before:to-transparent">
                {shipment.history.map((item, index) => (
                  <div key={index} className="relative pl-12 sm:pl-16 group">
                    <div className={cn(
                      'absolute left-0 top-1 w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center z-10 shadow-sm transition-all duration-500 group-hover:scale-110',
                      index === 0 ? `bg-ups-brown text-ups-yellow shadow-lg shadow-ups-brown/20` : 'bg-white border-2 border-gray-100 text-gray-300'
                    )}>
                      {index === 0
                        ? <CheckCircle2 className="w-4 h-4 sm:w-5 h-5" />
                        : <div className="w-2 h-2 bg-gray-200 rounded-full" />
                      }
                    </div>
                    <div>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <p className="font-black text-ups-brown text-sm sm:text-base leading-none">{item.status}</p>
                        <time className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest">
                          {format(new Date(item.timestamp), 'MMM dd, HH:mm')}
                        </time>
                      </div>
                      <p className="text-[10px] sm:text-xs font-bold text-gray-400 flex items-center gap-1.5 mb-2">
                        <MapPin className="w-3 h-3 text-ups-yellow-dark" />{item.location}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500 leading-relaxed sm:max-w-2xl">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT — Sender / Receiver / Help */}
          <div className="space-y-6">

            {/* Sender */}
            <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
              <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-5 flex items-center gap-2">
                <Building className="w-4 h-4" /> Sender
              </h3>
              <div className="space-y-3">
                {meta?.sender?.name && (
                  <div className="flex gap-3 items-start">
                    <User className="w-4 h-4 text-gray-300 mt-0.5" />
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Name</p>
                      <p className="font-semibold text-gray-800 text-sm">{meta.sender.name}</p>
                    </div>
                  </div>
                )}
                {meta?.sender?.address && (
                  <div className="flex gap-3 items-start">
                    <MapPin className="w-4 h-4 text-gray-300 mt-0.5" />
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Address</p>
                      <p className="font-semibold text-gray-800 text-sm">{meta.sender.address}, {meta.sender.city}, {meta.sender.country}</p>
                    </div>
                  </div>
                )}
                {meta?.sender?.phone && (
                  <div className="flex gap-3 items-start">
                    <Phone className="w-4 h-4 text-gray-300 mt-0.5" />
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Phone</p>
                      <p className="font-semibold text-gray-800 text-sm">{meta.sender.phone}</p>
                    </div>
                  </div>
                )}
                {!meta?.sender?.name && (
                  <p className="text-sm text-gray-400">No sender details on file.</p>
                )}
              </div>
            </div>

            {/* Receiver */}
            <div className="bg-ups-brown text-ups-yellow p-6 rounded-[2rem] shadow-xl border border-ups-yellow/10">
              <h3 className="text-sm font-black text-ups-yellow/60 uppercase tracking-widest mb-5 flex items-center gap-2">
                <User className="w-4 h-4" /> Recipient
              </h3>
              <div className="space-y-3">
                <div className="flex gap-3 items-start">
                  <User className="w-4 h-4 text-ups-yellow/40 mt-0.5" />
                  <div>
                    <p className="text-[10px] text-ups-yellow/50 font-bold uppercase tracking-widest">Name</p>
                    <p className="font-bold text-sm">{shipment.receiverName}</p>
                  </div>
                </div>
                {meta?.receiver?.address && (
                  <div className="flex gap-3 items-start">
                    <MapPin className="w-4 h-4 text-ups-yellow/40 mt-0.5" />
                    <div>
                      <p className="text-[10px] text-ups-yellow/50 font-bold uppercase tracking-widest">Address</p>
                      <p className="font-bold text-sm">{meta.receiver.address}, {meta.receiver.city}, {meta.receiver.country}</p>
                    </div>
                  </div>
                )}
                {meta?.receiver?.phone && (
                  <div className="flex gap-3 items-start">
                    <Phone className="w-4 h-4 text-ups-yellow/40 mt-0.5" />
                    <div>
                      <p className="text-[10px] text-ups-yellow/50 font-bold uppercase tracking-widest">Phone</p>
                      <p className="font-bold text-sm">{meta.receiver.phone}</p>
                    </div>
                  </div>
                )}
                <div className="flex gap-3 items-start">
                  <Mail className="w-4 h-4 text-ups-yellow/40 mt-0.5" />
                  <div>
                    <p className="text-[10px] text-ups-yellow/50 font-bold uppercase tracking-widest">Email</p>
                    <p className="font-bold text-sm">{shipment.receiverEmail}</p>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <Clock className="w-4 h-4 text-ups-yellow/40 mt-0.5" />
                  <div>
                    <p className="text-[10px] text-ups-yellow/50 font-bold uppercase tracking-widest">Last Updated</p>
                    <p className="font-bold text-sm">{format(new Date(shipment.updatedAt), 'MMM dd, yyyy – HH:mm')}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Help */}
            <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
              <h3 className="text-sm font-bold mb-3 text-ups-brown flex items-center gap-2">
                <Package className="w-4 h-4" /> Need Help?
              </h3>
              <p className="text-gray-500 text-sm mb-4">Questions about your shipment? Our support team is available 24/7.</p>
              <button className="w-full bg-gray-100 text-ups-brown py-3 rounded-2xl font-bold hover:bg-gray-200 transition-all text-sm">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* ── Photo Lightbox ── */}
      {selectedPhoto !== null && meta?.photos && (
        <div className="fixed inset-0 bg-black/95 z-[2000] flex items-center justify-center p-4 sm:p-8 backdrop-blur-xl">
          <button
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all"
          >
            <X className="w-6 h-6" />
          </button>

          {meta.photos.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPhoto(prev => prev! === 0 ? meta.photos!.length - 1 : prev! - 1);
                }}
                className="absolute left-6 p-4 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPhoto(prev => prev! === meta.photos!.length - 1 ? 0 : prev! + 1);
                }}
                className="absolute right-6 p-4 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </>
          )}

          <div className="max-w-5xl w-full max-h-[80vh] flex flex-col items-center gap-6">
            <img
              src={meta.photos[selectedPhoto]}
              className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl border border-white/10"
              alt="Package Full Size"
            />
            <p className="text-white/60 font-medium tracking-widest text-xs uppercase">
              Photo {selectedPhoto + 1} of {meta.photos.length}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
