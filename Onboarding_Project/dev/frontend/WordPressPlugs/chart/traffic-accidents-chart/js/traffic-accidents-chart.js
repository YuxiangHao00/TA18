document.addEventListener('DOMContentLoaded', function() {
    let chart;
    let allData = [];
    let currentDataset = [];
    let currentStartIndex = 0;

    // Force English locale for date inputs
    document.getElementById('startDate').lang = 'en-US';
    document.getElementById('endDate').lang = 'en-US';

    // Set placeholder text in English
    document.getElementById('startDate').placeholder = 'Start Date';
    document.getElementById('endDate').placeholder = 'End Date';

    fetch(chartData.csvUrl)
        .then(response => response.text())
        .then(data => {
            const rows = data.split('\n').slice(1);
            
            rows.forEach(row => {
                const columns = row.split(',');
                const date = new Date(columns[1]);
                const lga = columns[5];
                
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
        currentDataset = Object.entries(lgaData)
            .sort((a, b) => sortOrder === 'asc' ? a[1] - b[1] : b[1] - a[1]);

        renderChart(currentStartIndex);
    }

    function renderChart(startIndex) {
        const displayData = currentDataset.slice(startIndex, startIndex + 20);
        const labels = displayData.map(item => item[0]);
        const values = displayData.map(item => item[1]);

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
                    },
                    y: {
                        barThickness: 40  // Increase bar thickness
                    }
                },
                maintainAspectRatio: false
            }
        });

        updateScrollFeedback();
    }

    function updateScrollFeedback() {
        const totalItems = currentDataset.length;
        const currentPosition = currentStartIndex + 1;
        const endPosition = Math.min(currentStartIndex + 20, totalItems);
        
        const feedbackElement = document.getElementById('scrollFeedback');
        feedbackElement.textContent = `Showing ${currentPosition}-${endPosition} of ${totalItems} items`;
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

    document.getElementById('chartContainer').addEventListener('wheel', function(e) {
        e.preventDefault();
        if (e.deltaY > 0 && currentStartIndex + 20 < currentDataset.length) {
            currentStartIndex++;
        } else if (e.deltaY < 0 && currentStartIndex > 0) {
            currentStartIndex--;
        }
        renderChart(currentStartIndex);
    });
});