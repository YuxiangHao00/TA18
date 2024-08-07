document.addEventListener('DOMContentLoaded', function() {
    let chart;
    let allData = [];
    let currentDataset = [];

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

        renderChart(0);
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
                        barThickness: 20  // 增加柱状图的粗细
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

    const scrollbar = document.getElementById('scrollbar');
    const scrollHandle = document.getElementById('scrollHandle');
    let isDragging = false;

    scrollbar.addEventListener('mousedown', (e) => {
        isDragging = true;
        updateScrollPosition(e);
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            updateScrollPosition(e);
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

    function updateScrollPosition(e) {
        const scrollbarRect = scrollbar.getBoundingClientRect();
        let position = (e.clientY - scrollbarRect.top) / scrollbarRect.height;
        position = Math.max(0, Math.min(position, 1));
        
        const maxStartIndex = Math.max(0, currentDataset.length - 20);
        const startIndex = Math.round(position * maxStartIndex);
        
        scrollHandle.style.top = `${position * (scrollbarRect.height - scrollHandle.offsetHeight)}px`;
        renderChart(startIndex);
    }
});