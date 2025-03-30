// EmailJS configuration for contact form
(function() {
    // Initialize EmailJS with your user ID
    emailjs.init("Ld-Ij-Yx-Yd-Ij-Yx"); // Replace with your actual EmailJS user ID
    
    document.addEventListener('DOMContentLoaded', function() {
        // Get the contact form element
        const contactForm = document.getElementById('contactForm');
        
        if (contactForm) {
            // Add submit event listener to the form
            contactForm.addEventListener('submit', function(event) {
                event.preventDefault();
                
                // Verify reCAPTCHA if it's being used
                const recaptchaResponse = grecaptcha ? grecaptcha.getResponse() : true;
                
                if (!recaptchaResponse && grecaptcha) {
                    alert('Please complete the reCAPTCHA verification.');
                    return;
                }
                
                // Show loading state
                const submitButton = contactForm.querySelector('button[type="submit"]');
                const originalButtonText = submitButton.innerHTML;
                submitButton.disabled = true;
                submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                
                // Prepare form data for EmailJS
                const templateParams = {
                    name: contactForm.name.value,
                    email: contactForm.email.value,
                    phone: contactForm.phone.value,
                    subject: contactForm.subject.value,
                    message: contactForm.message.value
                };
                
                // Send the email using EmailJS
                emailjs.send('service_id', 'template_id', templateParams)
                    .then(function(response) {
                        console.log('SUCCESS!', response.status, response.text);
                        
                        // Show success message
                        alert('Thank you for your message! We will get back to you soon.');
                        
                        // Reset the form
                        contactForm.reset();
                        if (grecaptcha) {
                            grecaptcha.reset();
                        }
                        
                        // Reset button state
                        submitButton.disabled = false;
                        submitButton.innerHTML = originalButtonText;
                    }, function(error) {
                        console.log('FAILED...', error);
                        
                        // Show error message
                        alert('Sorry, there was an error sending your message. Please try again later or contact us directly via email.');
                        
                        // Reset button state
                        submitButton.disabled = false;
                        submitButton.innerHTML = originalButtonText;
                    });
            });
        }
    });
})(); 