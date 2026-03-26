<script>
    function prepareModal(dayNumber) {
        // Update the text in the modal header
        document.getElementById('selectedDateText').innerText = "March " + dayNumber;

    // Update a hidden input field so the form knows which day to save to the database
    document.getElementById('selectedDateValue').value = "2026-03-" + dayNumber;
    }
</script>

//Attempting to adjust js modal saving to database
