const { Pool } = require('pg');

// PostgreSQL connection
const pool = new Pool({
  user: 'postgres', //This _should_ be your username, as it's the default one Postgres uses
  host: 'localhost',
  database: 'movierental', //This should be changed to reflect your actual database
  password: 'MoiveRental100', //This should be changed to reflect the password you used when setting up Postgres
  port: 5432,
});

/**
 * Creates the database tables, if they do not already exist.
 */
async function createTable() {
  const createMoviesTable = `
    CREATE TABLE IF NOT EXISTS movies (
      movie_id SERIAL PRIMARY KEY,
      title VARCHAR(100) NOT NULL,
      release_year INT NOT NULL,
      genre VARCHAR(50),
      director VARCHAR(100)
    );
  `;

  const createCustomersTable = `
    CREATE TABLE IF NOT EXISTS customers (
      customer_id SERIAL PRIMARY KEY,
      first_name VARCHAR(100) NOT NULL,
      last_name VARCHAR(100) NOT NULL,
      email VARCHAR(75) UNIQUE NOT NULL,
      phone_number TEXT
    );
  `;

  const createRentalsTable = `
    CREATE TABLE IF NOT EXISTS rentals (
      rental_id SERIAL PRIMARY KEY,
      customer_id INT REFERENCES customers(customer_id) ON DELETE CASCADE,
      movie_id INT REFERENCES movie(movie_id),
      rental_date DATE NOT NULL,
      return_date DATE
    );
  `;

  try {
    await pool.query(createMoviesTable);
    await pool.query(createCustomersTable);
    await pool.query(createRentalsTable);
    console.log('Tables created successfully');
  } catch (err) {
    console.error('Error creating tables', err);
  }
}

/**
 * Inserts a new movie into the Movies table.
 *
 * @param {string} title Title of the movie
 * @param {number} year Year the movie was released
 * @param {string} genre Genre of the movie
 * @param {string} director Director of the movie
 */
async function insertMovie(title, year, genre, director) {
  // TODO: Add code to insert a new movie into the Movies table
  const query = `
    INSERT INTO movies (title, release_year, genre, director)
    VALUES ($1, $2, $3, $4) RETURNING *;
  `;

  try {
    const res = await pool.query(query, [title, year, genre, director]);
    console.log('Movie added: ', res.rows[0]);
  } catch (err) {
    console.error('Error adding movie: ', err);
  }
}

/**
 * Prints all movies in the database to the console
 */
async function displayMovies() {
  // TODO: Add code to retrieve and print all movies from the Movies table
  const query = `SELECT * FROM movies;`;
  try {
    const res = await pool.query(query);
    console.table(res.rows);
  } catch (err) {
    console.error('Error reteriving movies:', err);
  }
}

/**
 * Updates a customer's email address.
 *
 * @param {number} customerId ID of the customer
 * @param {string} newEmail New email address of the customer
 */
async function updateCustomerEmail(customerId, newEmail) {
  // TODO: Add code to update a customer's email address
  const query = `
    UPDATE customers
    SET email = $1
    WHERE customer_id = $2
    RETURNING *;
    `;

  try {
    const res = await pool.query(query, [newEmail, customer_id]);
    if (res.rowCount > 0) {
      console.log('Customer Email Updtated:', res.rows[0]);
    } else {
      console.log('Customer Not Found:');
    }
  } catch (err) {
    console.log('Error Updating Email:', err);
  }
}

/**
 * Removes a customer from the database along with their rental history.
 *
 * @param {number} customerId ID of the customer to remove
 */
async function removeCustomer(customerId) {
  // TODO: Add code to remove a customer and their rental history
  const deleteRentalsQuery = `DELETE FROM rentals WHERE customer_id = $1;`;
  const deleteCustomerQuery = ` DELETE FORM customers WHERE customer_id = $1 RETURNING *;`;

  try {
    await pool.query(deleteRentalsQuery, [customerId]);
    const res = await pool.query(deleteCustomerQuery, [customerId]);
    if (res.rowCount > 0) {
      console.log('Customer and rental history deleted:', res.rows[0]);
    } else {
      console.log('Customer not found');
    }
  } catch (err) {
    console.error('Error removing Customer:', err);
  }
}

/**
 * Prints a help message to the console
 */
function printHelp() {
  console.log('Usage:');
  console.log('  insert <title> <year> <genre> <director> - Insert a movie');
  console.log('  show - Show all movies');
  console.log("  update <customer_id> <new_email> - Update a customer's email");
  console.log('  remove <customer_id> - Remove a customer from the database');
}

/**
 * Runs our CLI app to manage the movie rentals database
 */
async function runCLI() {
  await createTable();

  const args = process.argv.slice(2);
  switch (args[0]) {
    case 'insert':
      if (args.length !== 5) {
        printHelp();
        return;
      }
      await insertMovie(args[1], parseInt(args[2]), args[3], args[4]);
      break;
    case 'show':
      await displayMovies();
      break;
    case 'update':
      if (args.length !== 3) {
        printHelp();
        return;
      }
      await updateCustomerEmail(parseInt(args[1]), args[2]);
      break;
    case 'remove':
      if (args.length !== 2) {
        printHelp();
        return;
      }
      await removeCustomer(parseInt(args[1]));
      break;
    default:
      printHelp();
      break;
  }
}

runCLI();
