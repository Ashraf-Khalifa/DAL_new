import SQLite from 'react-native-sqlite-storage';

const database_name = "Locations.db";
const database_version = "1.0";
const database_displayname = "SQLite React Offline Database";
const database_size = 200000;

let db;

export const openDatabase = (callback) => {
  db = SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
    () => {
      console.log("Database opened");
      if (callback) callback();
    },
    (err) => {
      console.error("Error opening database: ", err);
      if (callback) callback(err); // Pass error to callback
    }
  );
};

export const createTables = (callback) => {
  if (!db) {
    console.error("Database is not initialized.");
    if (callback) callback(new Error("Database is not initialized."));
    return;
  }
  db.transaction(txn => {
    txn.executeSql(
      `CREATE TABLE IF NOT EXISTS Locations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userEmail VARCHAR(30),
        name VARCHAR(100),
        latitude REAL,
        longitude REAL,
        iconIndex INTEGER,
        category VARCHAR(30)
      )`,
      [],
      () => {
        console.log("Table created successfully");
        if (callback) callback();
      },
      (err) => {
        console.error("Error creating table: ", err);
        if (callback) callback(err); // Pass error to callback
      }
    );
  });
};


export const saveLocation = (location, userEmail, callback) => {
  if (!db) {
    console.error("Database is not initialized.");
    return;
  }
  db.transaction(txn => {
    txn.executeSql(
      `INSERT INTO Locations (userEmail, name, latitude, longitude, iconIndex, category) VALUES (?, ?, ?, ?, ?, ?)`,
      [userEmail, location.name, location.latitude, location.longitude, location.iconIndex, location.category],
      () => {
        console.log("Location saved successfully");
        if (callback) callback();
      },
      (err) => {
        console.error("Error saving location: ", err);
        if (callback) callback(null); // Call the callback with null on error
      }
    );
  });
};


export const fetchLocations = (userEmail, callback) => {
  if (!db) {
    console.error("Database is not initialized.");
    callback([]); // Return an empty array if the database is not initialized
    return;
  }
  db.transaction(txn => {
    txn.executeSql(
      `SELECT * FROM Locations WHERE userEmail = ?`,
      [userEmail],
      (tx, results) => {
        let locations = [];
        for (let i = 0; i < results.rows.length; i++) {
          let row = results.rows.item(i);
          locations.push(row);
        }
        console.log("Fetched locations: ", locations); // Log the fetched locations
        callback(locations); // Return locations
      },
      (err) => {
        console.error("Error fetching locations: ", err);
        callback([]); // Return an empty array in case of an error
      }
    );
  });
};




export const deleteLocation = (id, callback) => {
  if (!db) {
    console.error("Database is not initialized.");
    return;
  }
  db.transaction(txn => {
    txn.executeSql(
      `DELETE FROM Locations WHERE id = ?`,
      [id],
      () => {
        console.log("Location deleted successfully");
        callback();
      },
      (err) => {
        console.error("Error deleting location: ", err);
        callback(null); // Ensure callback is called on error
      }
    );
  });
};
