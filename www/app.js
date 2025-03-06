// Theme switching functionality
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const themeToggleIcon = themeToggle.querySelector('.theme-toggle-icon');

    // Check for saved theme preference, default to dark if none saved
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.remove('dark-mode');
        document.querySelector('link[href="dark.css"]').disabled = true;
        themeToggleIcon.textContent = '🌙';
    }

    // Theme toggle handler
    themeToggle.addEventListener('click', () => {
        const darkThemeLink = document.querySelector('link[href="dark.css"]');

        if (document.body.classList.contains('dark-mode')) {
            document.body.classList.remove('dark-mode');
            darkThemeLink.disabled = true;
            localStorage.setItem('theme', 'light');
            themeToggleIcon.textContent = '🌙';
        } else {
            document.body.classList.add('dark-mode');
            darkThemeLink.disabled = false;
            localStorage.setItem('theme', 'dark');
            themeToggleIcon.textContent = '☀️';
        }
    });

    // Card flip functionality
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', (e) => {
            // Check if the click is on the PDF download button
            if (!e.target.closest('.pdf-download-btn')) {
                card.querySelector('.card-inner').classList.toggle('is-flipped');
            }
        });
    });

    // PDF Download button handlers
    document.querySelectorAll('.pdf-download-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent card flip when clicking the button

            const productName = button.getAttribute('data-product');
            const fileName = button.getAttribute('data-file');

            // Convert the markdown filename to the pdf filename
            // Change "filename.md" to "filename.pdf"
            const pdfFileName = fileName.replace('.md', '.pdf');

            // Create the path to the PDF file
            const pdfPath = `./product-sheets/pdf/${pdfFileName}`;

            // Show loading state
            const originalText = button.innerHTML;
            button.innerHTML = `<span class="download-icon">⏳</span> Downloading...`;
            button.disabled = true;

            try {
                // Create a link element to trigger the download
                const link = document.createElement('a');
                link.href = pdfPath;
                link.download = `${productName.toLowerCase().replace(/\s+/g, '-')}-datasheet.pdf`;
                link.target = '_blank'; // This will open in a new tab if the file can't be downloaded directly

                // Append to the document, click it, and remove it
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                // Success message
                button.innerHTML = `<span class="download-icon">✅</span> Downloaded!`;

                // Reset button state after a delay
                setTimeout(() => {
                    button.innerHTML = originalText;
                    button.disabled = false;
                }, 2000);
            } catch (error) {
                console.error('Error initiating download:', error);
                button.innerHTML = `<span class="download-icon">❌</span> Failed`;
                alert(`Error downloading PDF: ${error.message || 'Unknown error'}`);

                // Reset button state
                setTimeout(() => {
                    button.innerHTML = originalText;
                    button.disabled = false;
                }, 2000);
            }
        });
    });

    // Smooth scrolling for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Add animation to product cards on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    });

    document.querySelectorAll('.product-card').forEach((card) => {
        observer.observe(card);
    });
});