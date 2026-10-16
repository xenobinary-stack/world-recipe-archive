// Feedback Table
fetch('/api/admin/feedbacks')
    .then(res => res.json())
    .then(data => {
        const table = document.getElementById("feedbackTable");
        data.forEach(item => {
            const row = table.insertRow();
            row.innerHTML = `
                <td>${item.feedback_id}</td>
                <td>${item.first_name} ${item.last_name}</td>
                <td>${item.user_id}</td>
                <td>${item.comment}</td>
                <td>${item.created_at}</td>
            `;
        });
    });