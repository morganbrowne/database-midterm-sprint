\c movierental;

-- Clear the tables before inserting new data
--TRUNCATE movies, customers, rentals RESTART IDENTITY CASCADE;

-------------------
-- Creating Tables 
-------------------

-- Movies Table 

CREATE TABLE IF NOT EXISTS movies (
    movie_id SERIAL PRIMARY KEY, 
    title VARCHAR(100) NOT NULL,
    release_year INT NOT NULL,
    genre VARCHAR(50),
    director VARCHAR(100)
);

-- Customers Table 

CREATE TABLE IF NOT EXISTS customers (
    customer_id SERIAL PRIMARY KEY,
    first_mane VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(75) UNIQUE NOT NULL,
    phone_number TEXT
);

-- Rentals Table 

CREATE TABLE IF NOT EXISTS rentals (
    rental_id SERIAL PRIMARY KEY,
    customer_id INT REFERENCES customers(customer_id) ON DELETE CASCADE,
    movie_id INT REFERENCES movie(movie_id),
    rental_date DATE NOT NULL,
    return_date DATE
); 

------------------------------
-- Inserting Data Into Tables 
------------------------------

-- Movies Table 

INSERT INTO movies (title, release_year, genre, director)
VALUES
    ('Lost In Translation', 2003, 'Fiction', 'Sofia Copplola'),
    ('Heat', 1995, 'Crime', 'Michael Mann'),
    ('American Graffiti', 1973, 'Fiction', 'George Lucas'),
    ('The Pianist', 2002, 'Drama','Roman Polanski'),
    ('The Derjeeling Limited', 2007, 'Adventure', 'Wes Anderson');


-------------------
-- Customers Table 
-------------------


INSERT INTO customers (first_name, last_name, email, phone_number)
VALUES 
    ('John', 'Doe', 'johndoe@examle.com', '123-4321'),
    ('Jane', 'Doe', 'janeD12@example.com', '724-2345'),
    ('Bem', 'Bob', 'BobBen23@examle.com', '654-0987'),
    ('Ava', 'Neal', 'AvaNmovie2@example.com', '890-0098'),
    ('James', 'Flow', 'flowJames@example.com', '234-6576');


----------------
-- Rentals Table
----------------

INSERT INTO rentals (customer_id, movie_id, rental_date, return_date)
VALUES 
    (1, 1, '2024-10-03', '2024-10-08')
    (1, 1, '2024-10-03', NULL)
    (1, 1, '2024-10-04', '2024-10-09')
    (1, 1, '2024-10-12', '2024-10-17')
    (1, 1, '2024-10-14', NULL);



-- Remove duplicate rows from the movies table
DELETE FROM movies
WHERE movie_id NOT IN (
    SELECT MIN(movie_id)
    FROM movies
    GROUP BY title, release_year, genre, director
);
