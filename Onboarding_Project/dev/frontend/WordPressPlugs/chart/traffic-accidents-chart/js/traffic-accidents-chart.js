document.addEventListener('DOMContentLoaded', function() {
    fetch(chartData.csvUrl)
        .then(response => response.text())
        .then(data => {
            const rows = data.split('\n').slice(1); // Skip header row
            const lgaData = {};
            
            // Process CSV data
            rows.forEach(row => {
                const columns = row.split(',');
                const lga = columns[5]; // Assuming LGA is in the 6th column
                if (lga in lgaData) {
                    lgaData[lga]++;
                } else {
                    lgaData[lga] = 1;
                }
            });
            
            // Prepare data for chart
            const labels = Object.keys(lgaData);
            const values = Object.values(lgaData);
            
            // Create chart
            const ctx = document.getElementById('trafficAccidentsChart').getContext('2d');
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Traffic Accidents by LGA',
                        data: values,
                        backgroundColor: 'rgba(75, 192, 192, 0.6)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    indexAxis: 'y', // This makes the chart vertical
                    scales: {
                        x: {
                            beginAtZero: true
                        }
                    }
                }
            });
        });
});