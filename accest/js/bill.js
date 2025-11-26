
        // Number to words conversion
      function numberToWords(num) {
            if (num === 0) return 'Zero';
            
            const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
            const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
            const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
            
            function convertLessThanThousand(n) {
                if (n === 0) return '';
                if (n < 10) return ones[n];
                if (n < 20) return teens[n - 10];
                if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + ones[n % 10] : '');
                return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' ' + convertLessThanThousand(n % 100) : '');
            }
            
            let integerPart = Math.floor(num); // <-- change to let
            const decimalPart = Math.round((num - integerPart) * 100);
            
            let result = '';

            if (integerPart >= 1000000) {
                result += convertLessThanThousand(Math.floor(integerPart / 1000000)) + ' Million ';
                integerPart %= 1000000;
            }
            if (integerPart >= 1000) {
                result += convertLessThanThousand(Math.floor(integerPart / 1000)) + ' Thousand ';
                integerPart %= 1000;
            }
            if (integerPart > 0) {
                result += convertLessThanThousand(integerPart);
            }

            result += ' Rupees';
            
            if (decimalPart > 0) {
                result += ' and ' + convertLessThanThousand(decimalPart) + ' Cents';
            }

            return result.trim() + ' Only';
        }


        // Load and display invoice data
        function loadInvoiceData() {
            try {
                const invoiceData = localStorage.getItem('currentInvoice');
                
                if (!invoiceData) {
                    Swal.fire({
                        icon: 'error',
                        title: 'No Invoice Data',
                        text: 'No invoice data found. Redirecting to POS...',
                        confirmButtonColor: '#667eea',
                        timer: 3000
                    }).then(() => {
                        window.location.href = 'index.html';
                    });
                    return;
                }

                const invoice = JSON.parse(invoiceData);

                // Validate invoice data
                if (!invoice.items || invoice.items.length === 0) {
                    throw new Error('Invoice has no items');
                }

                // Set invoice details
                document.getElementById('invoiceNo').textContent = invoice.id || 'N/A';
                document.getElementById('cashierName').textContent = invoice.cashier || 'Unknown';
                
                const date = new Date(invoice.date);
                document.getElementById('invoiceDate').textContent = date.toLocaleDateString('en-GB');
                document.getElementById('invoiceTime').textContent = date.toLocaleTimeString('en-GB');

                // Populate items table
                const itemsTable = document.getElementById('itemsTable');
                itemsTable.innerHTML = '';
                
                invoice.items.forEach((item, index) => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${index + 1}</td>
                        <td>${item.name || 'Unknown Item'}</td>
                        <td>${item.quantity || 0}</td>
                        <td>${(item.price || 0).toFixed(2)}</td>
                        <td>${((item.price || 0) * (item.quantity || 0)).toFixed(2)}</td>
                    `;
                    itemsTable.appendChild(row);
                });

                // Set totals
                document.getElementById('subTotal').textContent = (invoice.subtotal || 0).toFixed(2) + ' LKR';
                document.getElementById('taxAmount').textContent = (invoice.tax || 0).toFixed(2) + ' LKR';
                document.getElementById('totalAmount').textContent = (invoice.total || 0).toFixed(2) + ' LKR';

                // Set amount in words
                document.getElementById('amountInWords').textContent = numberToWords(invoice.total || 0);

                // Show success message
                Swal.fire({
                    icon: 'success',
                    title: 'Invoice Generated!',
                    text: 'Invoice has been generated successfully',
                    confirmButtonColor: '#667eea',
                    timer: 2000,
                    showConfirmButton: false
                });

            } catch (error) {
                console.error('Error loading invoice:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error Loading Invoice',
                    text: 'There was an error loading the invoice data: ' + error.message,
                    confirmButtonColor: '#667eea',
                    confirmButtonText: 'Go Back to POS'
                }).then(() => {
                    window.location.href = 'index.html';
                });
            }
        }

        // Print invoice
        function printInvoice() {
            Swal.fire({
                title: 'Print Invoice?',
                text: 'This will open the print dialog',
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#667eea',
                cancelButtonColor: '#6c757d',
                confirmButtonText: '<i class="fas fa-print me-2"></i>Print',
                cancelButtonText: 'Cancel'
            }).then((result) => {
                if (result.isConfirmed) {
                    window.print();
                }
            });
        }

        // Back to POS
        function backToPOS() {
            Swal.fire({
                title: 'Return to POS?',
                text: 'Do you want to go back to the POS system?',
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#667eea',
                cancelButtonColor: '#6c757d',
                confirmButtonText: 'Yes, Go Back',
                cancelButtonText: 'Stay Here'
            }).then((result) => {
                if (result.isConfirmed) {
                    // Clear the current invoice from localStorage
                    localStorage.removeItem('currentInvoice');
                    window.location.href = 'index.html';
                }
            });
        }

        // Load invoice data when page loads
        window.addEventListener('DOMContentLoaded', loadInvoiceData);

        // Warn before leaving page
        window.addEventListener('beforeunload', function (e) {
            // Don't show warning if already printed or explicitly going back
            const invoiceData = localStorage.getItem('currentInvoice');
            if (invoiceData) {
                e.preventDefault();
                e.returnValue = '';
            }
        });
