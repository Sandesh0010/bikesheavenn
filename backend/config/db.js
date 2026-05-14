const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;

    // #region agent log
    try {
      const safeInfo = {};
      if (uri) {
        safeInfo.isDefined = true;
        safeInfo.startsWithMongoSrv = uri.startsWith("mongodb+srv://");
        const atIndex = uri.indexOf("@");
        const hostStart = atIndex !== -1 ? atIndex + 1 : uri.indexOf("://") + 3;
        const slashIndex = uri.indexOf("/", hostStart);
        if (hostStart > 2 && slashIndex > hostStart) {
          safeInfo.host = uri.substring(hostStart, slashIndex);
        }
      } else {
        safeInfo.isDefined = false;
      }

      const payload = {
        sessionId: "d6e50a",
        runId: "pre-fix",
        hypothesisId: "A",
        location: "backend/config/db.js:connectDB:beforeConnect",
        message: "About to connect to MongoDB",
        data: safeInfo,
        timestamp: Date.now(),
      };

      // HTTP log
      fetch("http://127.0.0.1:7515/ingest/9a57699c-1f7d-430f-b442-e07e85fedfb7", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Debug-Session-Id": "d6e50a",
        },
        body: JSON.stringify(payload),
      }).catch(() => {});

      // File log (fallback)
      try {
        const logPath = path.join(__dirname, "..", "..", "debug-d6e50a.log");
        fs.appendFileSync(logPath, JSON.stringify(payload) + "\n");
      } catch {
        // ignore file logging failures
      }
    } catch {
      // ignore logging failures
    }
    // #endregion

    await mongoose.connect(uri);

    console.log("Database connected");
  } catch (error) {
    console.log(error.message);

    // #region agent log
    try {
      const payload = {
        sessionId: "d6e50a",
        runId: "pre-fix",
        hypothesisId: "B",
        location: "backend/config/db.js:connectDB:catch",
        message: "MongoDB connection error",
        data: {
          name: error.name,
          code: error.code,
          message: error.message,
        },
        timestamp: Date.now(),
      };

      // HTTP log
      fetch("http://127.0.0.1:7515/ingest/9a57699c-1f7d-430f-b442-e07e85fedfb7", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Debug-Session-Id": "d6e50a",
        },
        body: JSON.stringify(payload),
      }).catch(() => {});

      // File log (fallback)
      try {
        const logPath = path.join(__dirname, "..", "..", "debug-d6e50a.log");
        fs.appendFileSync(logPath, JSON.stringify(payload) + "\n");
      } catch {
        // ignore file logging failures
      }
    } catch {
      // ignore logging failures
    }
    // #endregion
  }
};

module.exports = connectDB;
