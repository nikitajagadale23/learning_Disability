document.addEventListener('DOMContentLoaded', () => {
    if (!localStorage.getItem('currentUser') || !localStorage.getItem('assessmentResponses') || !localStorage.getItem('studentData')) {
        showNotification('Please complete the assessment first', true);
        setTimeout(() => window.location.href = 'index.html', 1000);
        return;
    }

    const user = JSON.parse(localStorage.getItem('currentUser'));
    const responses = JSON.parse(localStorage.getItem('assessmentResponses'));
    const studentData = JSON.parse(localStorage.getItem('studentData'));
    const riskIndicators = document.getElementById('risk-indicators');
    const recommendations = document.getElementById('recommendations');
    const chartCanvas = document.getElementById('result-chart');
    const chartContext = chartCanvas.getContext('2d');

    const scores = calculateScores(responses);
    generateRiskIndicators(scores);
    generateRecommendations(scores);

    let chartInstance = null;
    function generateChart(scores) {
        if (chartInstance) chartInstance.destroy();
        chartInstance = new Chart(chartContext, {
            type: 'bar',
            data: {
                labels: ['Reading', 'Writing', 'Math'],
                datasets: [{
                    label: 'Risk Percentage (%)',
                    data: [
                        scores.reading.overall * 20,
                        scores.writing.overall * 20,
                        scores.math.overall * 20
                    ],
                    backgroundColor: ['#007bff', '#ff6b00', '#28a745'],
                    borderColor: ['#0056b3', '#e65c00', '#218838'],
                    borderWidth: 3,
                    borderRadius: 10,
                    barThickness: 60
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        title: { display: true, text: 'Percentage (%)', font: { size: 16 } },
                        ticks: { stepSize: 20, font: { size: 14 } }
                    },
                    x: {
                        title: { display: true, text: 'Categories', font: { size: 16 } },
                        ticks: { font: { size: 14 } }
                    }
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        enabled: true,
                        callbacks: {
                            label: (context) => `${context.label}: ${context.raw}%`
                        },
                        backgroundColor: '#fff',
                        titleColor: '#000',
                        bodyColor: '#000',
                        borderColor: '#ddd',
                        borderWidth: 1,
                        bodyFont: { size: 16 },
                        titleFont: { size: 16 }
                    },
                    hover: {
                        mode: 'nearest',
                        intersect: true
                    }
                },
                layout: { padding: { top: 30, bottom: 30, left: 30, right: 30 } }
            }
        });
        console.log('Chart generated:', chartInstance);
    }

    generateChart(scores);

    const downloadButton = document.getElementById('download-report');
    if (downloadButton) {
        downloadButton.style.display = 'block';
        downloadButton.addEventListener('click', () => {
            setTimeout(() => {
                try {
                    if (chartInstance && chartInstance.toBase64Image) {
                        generatePDFReport(user, studentData, scores, chartInstance);
                    } else {
                        console.error('Chart not ready:', chartInstance);
                        showNotification('Chart failed to render. Please try again.', true);
                    }
                } catch (error) {
                    console.error('PDF generation error:', error);
                    showNotification('Failed to generate PDF. Check console for details.', true);
                }
            }, 3000);
        });
    }

    // Detect Ctrl + P and trigger PDF download
    document.addEventListener('keydown', (event) => {
        if (event.ctrlKey && event.key === 'p') {
            event.preventDefault(); // Prevent default print dialog
            setTimeout(() => {
                try {
                    if (chartInstance && chartInstance.toBase64Image) {
                        generatePDFReportOnCtrlP(user, studentData, scores, chartInstance);
                    } else {
                        console.error('Chart not ready:', chartInstance);
                        showNotification('Chart failed to render. Please try again.', true);
                    }
                } catch (error) {
                    console.error('PDF generation error:', error);
                    showNotification('Failed to generate PDF. Check console for details.', true);
                }
            }, 1000); // Slight delay to ensure chart is ready
        }
    });

    function calculateScores(responses) {
        const categoryScores = {
            reading: { fluency: 0, comprehension: 0, overall: 0 },
            writing: { handwriting: 0, spelling: 0, overall: 0 },
            math: { numberSense: 0, problemSolving: 0, overall: 0 }
        };

        categoryScores.reading.fluency = responses.reading.slice(0, 5).reduce((a, b) => a + (b || 0), 0) / 5 || 0;
        categoryScores.reading.comprehension = responses.reading.slice(5, 10).reduce((a, b) => a + (b || 0), 0) / 5 || 0;
        categoryScores.writing.handwriting = responses.writing.slice(0, 5).reduce((a, b) => a + (b || 0), 0) / 5 || 0;
        categoryScores.writing.spelling = responses.writing.slice(5, 10).reduce((a, b) => a + (b || 0), 0) / 5 || 0;
        categoryScores.math.numberSense = responses.math.slice(0, 5).reduce((a, b) => a + (b || 0), 0) / 5 || 0;
        categoryScores.math.problemSolving = responses.math.slice(5, 10).reduce((a, b) => a + (b || 0), 0) / 5 || 0;

        categoryScores.reading.overall = (categoryScores.reading.fluency + categoryScores.reading.comprehension) / 2;
        categoryScores.writing.overall = (categoryScores.writing.handwriting + categoryScores.writing.spelling) / 2;
        categoryScores.math.overall = (categoryScores.math.numberSense + categoryScores.math.problemSolving) / 2;

        const overallScore = (categoryScores.reading.overall + categoryScores.writing.overall + categoryScores.math.overall) / 3 * 20;
        return { ...categoryScores, overall: overallScore };
    }

    function generateRiskIndicators(scores) {
        riskIndicators.innerHTML = '';
        const categories = [
            { name: 'Reading Skills', data: scores.reading.overall * 20 },
            { name: 'Writing Skills', data: scores.writing.overall * 20 },
            { name: 'Math Skills', data: scores.math.overall * 20 }
        ];

        categories.forEach(cat => {
            riskIndicators.innerHTML += `
                <div class="result-card ${getRiskClass(cat.data)}">
                    <div class="category-header">
                        <h3>${cat.name}</h3>
                    </div>
                    <p>Percentage: ${cat.data.toFixed(1)}%</p>
                </div>
            `;
        });
    }

    function getRiskClass(data) {
        return data >= 60 ? 'result-high' : data >= 40 ? 'result-medium' : 'result-low';
    }

    function generateRecommendations(scores) {
        recommendations.innerHTML = '';
        const recs = [
            'Schedule a comprehensive evaluation with a learning specialist',
            'Consider requesting accommodations in the classroom',
            'Implement targeted interventions for identified areas',
            'Follow up assessment in 6 months to track progress'
        ];
        const overallRisk = scores.overall >= 60 ? 'high' : scores.overall >= 40 ? 'medium' : 'low';
        if (overallRisk === 'high') recs.unshift('Immediate professional evaluation is recommended.');
        else if (overallRisk === 'medium') recs.unshift('Monitoring and possible early intervention are suggested.');
        recs.forEach(rec => recommendations.innerHTML += `<li>${rec}</li>`);
    }

    function generatePDFReport(user, studentData, scores, chartInstance) {
        const chartImage = chartInstance.toBase64Image();
        const status = scores.overall >= 60 ? 'Requires Attention' : scores.overall >= 40 ? 'Monitor Closely' : 'Typical Development';

        const reportContent = `
            <div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; color: #333; padding: 15px; width: 100%;">
                <h1 style="font-size: 18px; text-align: center; color: #003087; margin-bottom: 10px;">Dyslexia Assessment Report</h1>
                <hr style="border: 1px solid #007bff; margin: 10px 0;">
                <p style="margin: 5px 0;"><strong>Student Name:</strong> ${studentData.name}</p>
                <p style="margin: 5px 0;"><strong>Student Age:</strong> ${studentData.age} years</p>
                <p style="margin: 5px 0;"><strong>Grade:</strong> ${studentData.grade || 'Not specified'}</p>
                <p style="margin: 5px 0;"><strong>Parent/Teacher Name:</strong> ${user.name}</p>
                <p style="margin: 5px 0;"><strong>Assessment Date:</strong> ${new Date().toLocaleDateString()}</p>
                <p style="margin: 5px 0;"><strong>Overall Score:</strong> ${Math.round(scores.overall)}/100</p>
                <p style="margin: 5px 0;"><strong>Status:</strong> ${status}</p>

                <h2 style="font-size: 14px; margin-top: 15px; color: #007bff;">Skill Assessment</h2>
                <p style="margin: 3px 0;">Reading Skills: ${Math.round(scores.reading.overall * 20)}%</p>
                <p style="margin: 3px 0;">Writing Skills: ${Math.round(scores.writing.overall * 20)}%</p>
                <p style="margin: 3px 0;">Math Skills: ${Math.round(scores.math.overall * 20)}%</p>

                <h2 style="font-size: 14px; margin-top: 15px; color: #007bff;">Graphical Analysis of Disability Risk</h2>
                <img src="${chartImage}" style="width: 600px; height: auto; display: block; margin: 10px auto; border: 1px solid #ddd;">

                <h2 style="font-size: 14px; margin-top: 15px; color: #007bff;">Recommendations</h2>
                <ul style="list-style-type: disc; margin-left: 20px; margin-top: 5px; margin-bottom: 10px;">
                    ${recommendations.innerHTML.replace(/<li>/g, '<li style="margin: 3px 0;">')}
                </ul>

                <p style="text-align: center; margin-top: 10px; font-size: 10px; font-style: italic;">This report is generated by the Dyslexia Assessment Tool.</p>
            </div>
        `;

        if (!reportContent || reportContent.trim() === '') {
            console.error('Report content is empty or invalid');
            showNotification('Invalid report content. Please try again.', true);
            return;
        }

        html2pdf().from(reportContent).set({
            margin: 0.2,
            filename: `Assessment_Report_${studentData.name}_${new Date().toLocaleDateString().replace(/\//g, '-')}.pdf`,
            html2canvas: { scale: 2, useCORS: true, logging: true },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        }).toPdf().get('pdf').then((pdf) => {
            pdf.save();
            showNotification('Report downloaded successfully');
        }).catch((error) => {
            console.error('html2pdf error:', error);
            showNotification('Failed to generate PDF. Check console for details.', true);
        });
    }
    function generatePDFReportOnCtrlP(user, studentData, scores, chartInstance) {
        const chartImage = chartInstance.toBase64Image();
        const status = scores.overall >= 60 ? 'Requires Attention' : scores.overall >= 40 ? 'Monitor Closely' : 'Typical Development';
    
        const pageContent = document.querySelector('.card').innerHTML;
        const customHeader = `
            <div style="font-family: Arial, sans-serif; font-size: 14px; line-height: 1.6; color: #333; padding: 20px; width: 100%; border-bottom: 2px solid #007bff; page-break-inside: avoid;">
                <h1 style="font-size: 20px; text-align: center; color: #003087; margin-bottom: 15px;">Dyslexia Assessment Report</h1>
                <p style="margin: 10px 0;"><strong>Student Name:</strong> ${studentData.name}</p>
                <p style="margin: 10px 0;"><strong>Student Age:</strong> ${studentData.age} years</p>
                <p style="margin: 10px 0;"><strong>Grade:</strong> ${studentData.grade || 'Not specified'}</p>
                <p style="margin: 10px 0;"><strong>Parent/Teacher Name:</strong> ${user.name}</p>
                <p style="margin: 10px 0;"><strong>Assessment Date:</strong> ${new Date().toLocaleDateString()}</p>
                <p style="margin: 10px 0;"><strong>Overall Score:</strong> ${Math.round(scores.overall)}/100</p>
                <p style="margin: 10px 0;"><strong>Status:</strong> ${status}</p>
            </div>
        `;
    
        const fullContent = `
            <div style="width: 1000px; padding: 20px; page-break-inside: avoid;">
                ${customHeader}
                ${pageContent.replace('<canvas id="result-chart"', `<img src="${chartImage}" style="width: 800px; height: auto; display: block; margin: 20px auto; border: 1px solid #ddd;"`)}
            </div>
        `;
    
        html2pdf().from(fullContent).set({
            margin: 0,
            filename: `Assessment_Report_${studentData.name}_${new Date().toLocaleDateString().replace(/\//g, '-')}.pdf`,
            html2canvas: { scale: 2, useCORS: true, logging: false },
            jsPDF: {
                unit: 'pt',
                format: [1000, 1000], // custom width x height in points (1pt = 1/72 inch)
                orientation: 'portrait'
            }
        }).toPdf().get('pdf').then((pdf) => {
            pdf.save();
            showNotification('Report downloaded successfully via Ctrl + P');
        }).catch((error) => {
            console.error('html2pdf error:', error);
            showNotification('Failed to generate PDF. Check console for details.', true);
        });
    }
    })
    
