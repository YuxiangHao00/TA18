document.addEventListener('DOMContentLoaded', function() {
    let chart;
    let allData = [];

    fetch(chartData.csvUrl)
        .then(response => response.text())
        .then(data => {
            const rows = data.split('\n').slice(1); // Skip header row
            
            rows.forEach(row => {
                const columns = row.split(',');
                const date = new Date(columns[1]); // Assuming date is in the 2nd column
                const lga = columns[5]; // Assuming LGA is in the 6th column
                
                allData.push({date: date, lga: lga});
            });

            updateChart();
        });

    function updateChart(startDate = null, endDate = null) {
        const lgaData = {};
        let filteredData = allData;

        if (startDate && endDate) {
            filteredData = allData.filter(item => item.date >= startDate && item.date <= endDate);
        }

        filteredData.forEach(item => {
            if (item.lga in lgaData) {
                lgaData[item.lga]++;
            } else {
                lgaData[item.lga] = 1;
            }
        });

        const sortOrder = document.getElementById('sortOrder').value;
        const sortedData = Object.entries(lgaData)
            .sort((a, b) => sortOrder === 'asc' ? a[1] - b[1] : b[1] - a[1])
            .slice(0, 20);

        const labels = sortedData.map(item => item[0]);
        const values = sortedData.map(item => item[1]);

        const ctx = document.getElementById('trafficAccidentsChart').getContext('2d');

        if (chart) {
            chart.destroy();
        }

        chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Traffic Accidents by Local Government Area',
                    data: values,
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                indexAxis: 'y',
                scales: {
                    x: {
                        beginAtZero: true
                    }
                },
                maintainAspectRatio: false
            }
        });
    }

    document.getElementById('filterDates').addEventListener('click', function() {
        const startDate = new Date(document.getElementById('startDate').value);
        const endDate = new Date(document.getElementById('endDate').value);
        updateChart(startDate, endDate);
    });

    document.getElementById('resetDates').addEventListener('click', function() {
        document.getElementById('startDate').value = '';
        document.getElementById('endDate').value = '';
        updateChart();
    });

    document.getElementById('sortOrder').addEventListener('change', function() {
        updateChart();
    });
});