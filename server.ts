import express from "express";
import path from "path";
import fs from "fs/promises";
import { createServer as createViteServer } from "vite";

const PORT = 3000;
const BOOKINGS_FILE = path.join(process.cwd(), "bookings.json");

// Helper to ensure bookings.json exists
async function ensureFileExists() {
  try {
    await fs.access(BOOKINGS_FILE);
  } catch {
    await fs.writeFile(BOOKINGS_FILE, JSON.stringify([], null, 2), "utf-8");
  }
}

async function readBookings() {
  await ensureFileExists();
  try {
    const data = await fs.readFile(BOOKINGS_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading bookings file, resetting to empty list", error);
    return [];
  }
}

async function writeBookings(bookings: any[]) {
  await fs.writeFile(BOOKINGS_FILE, JSON.stringify(bookings, null, 2), "utf-8");
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // API Route: Health Check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // API Route: Get all bookings
  app.get("/api/bookings", async (req, res) => {
    try {
      const bookings = await readBookings();
      res.json(bookings);
    } catch (err: any) {
      res.status(500).json({ error: "Failed to read bookings", message: err.message });
    }
  });

  // API Route: Create a booking
  app.post("/api/bookings", async (req, res) => {
    try {
      const { id, name, phone, preferredDate, preferredTime, serviceType, notes, bookingSource } = req.body;
      
      if (!name || !phone || !preferredDate || !preferredTime || !serviceType) {
        return res.status(400).json({ error: "Missing required booking variables" });
      }

      const bookings = await readBookings();
      
      // Prevent Double Booking Check
      const { overrideBooking } = req.body;
      const isAlreadyBooked = !overrideBooking && bookings.some((b: any) => 
        b.preferredDate === preferredDate && 
        b.preferredTime === preferredTime && 
        b.status !== "Cancelled"
      );

      const ALL_SLOTS = [
        "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
        "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM",
        "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM",
        "06:00 PM", "06:30 PM", "07:00 PM", "07:30 PM"
      ];

      if (isAlreadyBooked) {
        // Calculate next available slots chronology on this date
        const bookedTimes = new Set(
          bookings
            .filter((b: any) => b.preferredDate === preferredDate && b.status !== "Cancelled")
            .map((b: any) => b.preferredTime)
        );

        const currentIndex = ALL_SLOTS.indexOf(preferredTime);
        const suggestions: string[] = [];
        
        // Find next 3 available slots
        let searchIndex = currentIndex === -1 ? 0 : currentIndex + 1;
        while (suggestions.length < 3 && searchIndex < ALL_SLOTS.length) {
          const slot = ALL_SLOTS[searchIndex];
          if (!bookedTimes.has(slot)) {
            suggestions.push(slot);
          }
          searchIndex++;
        }

        // If not enough future slots, look from the beginning of the day
        if (suggestions.length < 3) {
          let fallbackIndex = 0;
          while (suggestions.length < 3 && fallbackIndex < ALL_SLOTS.length) {
            const slot = ALL_SLOTS[fallbackIndex];
            if (!bookedTimes.has(slot) && !suggestions.includes(slot) && slot !== preferredTime) {
              suggestions.push(slot);
            }
            fallbackIndex++;
          }
        }

        return res.status(409).json({
          error: "This time slot is already booked.",
          suggestions
        });
      }
      
      const newBooking = {
        id: id || "APT-" + Date.now().toString().slice(-6),
        name: name.trim(),
        phone: phone.trim(),
        preferredDate,
        preferredTime,
        serviceType,
        notes: (notes || "").trim(),
        status: 'Pending',
        bookingSource: bookingSource || 'Website Booking',
        createdAt: new Date().toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        }),
        timestamp: Date.now()
      };

      const updatedBookings = [newBooking, ...bookings];
      await writeBookings(updatedBookings);

      console.log(`[Clinic Notification] New appointment request received! ID: ${newBooking.id}, Patient: ${newBooking.name}, Phone: ${newBooking.phone}`);

      res.status(201).json(newBooking);
    } catch (err: any) {
      res.status(500).json({ error: "Failed to create booking", message: err.message });
    }
  });

  // API Route: Update booking status
  app.put("/api/bookings/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { status, notificationStatus, notificationHistory } = req.body;

      const bookings = await readBookings();
      const bookingIndex = bookings.findIndex((b: any) => b.id === id);

      if (bookingIndex === -1) {
        return res.status(404).json({ error: "Booking not found" });
      }

      if (status !== undefined) {
        bookings[bookingIndex].status = status;
      }
      if (notificationStatus !== undefined) {
        bookings[bookingIndex].notificationStatus = notificationStatus;
      }
      if (notificationHistory !== undefined) {
        bookings[bookingIndex].notificationHistory = notificationHistory;
      }

      await writeBookings(bookings);
      res.json(bookings[bookingIndex]);
    } catch (err: any) {
      res.status(500).json({ error: "Failed to update booking status", message: err.message });
    }
  });

  // API Route: Delete a booking page
  app.delete("/api/bookings/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const bookings = await readBookings();
      const filtered = bookings.filter((b: any) => b.id !== id);
      
      await writeBookings(filtered);
      res.json({ success: true, message: `Booking ${id} deleted successfully` });
    } catch (err: any) {
      res.status(500).json({ error: "Failed to delete booking", message: err.message });
    }
  });

  // Vite Middleware configuration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Clinic full-stack server active at http://localhost:${PORT}`);
  });
}

startServer();
