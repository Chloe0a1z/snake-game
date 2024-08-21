document.addEventListener('DOMContentLoaded', () => {
    const leaderboardTable = document.getElementById('leaderboard-table');
    const leaderboardBody = leaderboardTable.querySelector('tbody');

    // Fetch leaderboard data from the server
    fetchLeaderboardData();

    function fetchLeaderboardData() {
        // Fetch data from your server using AJAX or any preferred method
        // For demonstration purposes, let's assume we have a function fetchLeaderboardFromDatabase()
        fetchLeaderboardFromDatabase()
            .then(leaderboardData => {
                // Populate leaderboard table with fetched data
                populateLeaderboardTable(leaderboardData);
            })
            .catch(error => {
                console.error('Error fetching leaderboard data:', error);
            });
    }

    function populateLeaderboardTable(data) {
        // Clear existing table rows
        leaderboardBody.innerHTML = '';

        // Populate table rows with fetched data
        data.forEach((entry, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${entry.playerName}</td>
                <td>${entry.score}</td>
                <td>${formatTime(entry.time)}</td>
            `;
            leaderboardBody.appendChild(row);
        });
    }

    // Function to fetch leaderboard data from the database
    function fetchLeaderboardFromDatabase() {
        // Return a Promise that fetches leaderboard data from the database
        return new Promise((resolve, reject) => {
            // Establish MySQL connection
            const mysql = require('mysql');
            const connection = mysql.createConnection({
                host: 'localhost', // Replace 'localhost' with your host name
                user: 'your_username', // Replace 'your_username' with your MySQL username
                password: 'your_password', // Replace 'your_password' with your MySQL password
                database: 'snake' // Database name
            });

            // Connect to MySQL
            connection.connect(err => {
                if (err) {
                    reject(err);
                    return;
                }

                // Query the leaderboard table
                connection.query('SELECT * FROM leaderboard ORDER BY score DESC', (err, rows) => {
                    connection.end(); // Close MySQL connection
                    if (err) {
                        reject(err);
                        return;
                    }

                    resolve(rows); // Resolve with the fetched leaderboard data
                });
            });
        });
    }

    function formatTime(timeString) {
        const time = new Date(timeString);
        return time.toLocaleString();
    }
});

