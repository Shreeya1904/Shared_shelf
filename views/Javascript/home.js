document.addEventListener("DOMContentLoaded", function() {
    const borrowButtons = document.querySelectorAll('.borrow-btn');
    
    borrowButtons.forEach(button => {
        button.addEventListener('click', function() {
            const bookId = button.getAttribute('data-book-id');
            borrowBook(bookId);
        });
    });

    function borrowBook(bookId) {
        fetch('/borrow', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ bookId })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to borrow book');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            // Optionally, you can update the UI to reflect the book's sold status
        })
        .catch(error => {
            console.error('Error borrowing book:', error);
        });
    }
});
