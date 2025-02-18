function fetchVideo() {
    const url = document.getElementById('urlInput').value;  // Get the URL from the input
    const videoResults = document.getElementById('videoResults');  // Where the results will be displayed

    // Clear previous results
    videoResults.innerHTML = '<p>Loading...</p>';

    // API Request
    fetch('https://oapi-ok-ops-projects.vercel.app:3000/fetch-video', {
        method: 'POST',  // Use POST method
        headers: { 'Content-Type': 'application/json' },  // Send content type as JSON
        body: JSON.stringify({ url: url })  // Send URL in request body
    })
    .then(response => response.json())  // Parse JSON response
    .then(data => {
        console.log(data);  // Log the response to check the structure

        // Clear the loading message
        videoResults.innerHTML = '';

        // Check if there are video results
        if ((data.videos && data.videos.length > 0) || (data.images && data.images.length > 0)) {
            // Display videos
            data.videos.forEach(video => {
                const videoCard = document.createElement('div');
                videoCard.classList.add('video-card');

                const videoWrapper = document.createElement('div');
                videoWrapper.classList.add('video-wrapper');

                const videoTag = document.createElement('video');
                videoTag.controls = true;
                videoTag.src = video.src;
                videoTag.innerHTML = 'Your browser does not support the video tag.';

                videoWrapper.appendChild(videoTag);
                videoCard.appendChild(videoWrapper);

                const downloadLink = document.createElement('a');
                downloadLink.href = video.src;
                downloadLink.classList.add('btn');
                downloadLink.setAttribute('download', '');
                downloadLink.textContent = 'Download Video';
                videoCard.appendChild(downloadLink);

                videoResults.appendChild(videoCard);
            });

            // Display images
            data.images.forEach(image => {
                const imageCard = document.createElement('div');
                imageCard.classList.add('video-card');

                const imgTag = document.createElement('img');
                imgTag.src = image.src;
                imgTag.alt = 'Image Thumbnail';
                imageCard.appendChild(imgTag);

                const imgDownloadLink = document.createElement('a');
                imgDownloadLink.href = image.src;
                imgDownloadLink.classList.add('btn');
                imgDownloadLink.setAttribute('download', '');
                imgDownloadLink.textContent = 'Download Image';
                imageCard.appendChild(imgDownloadLink);

                videoResults.appendChild(imageCard);
            });
        } else {
            videoResults.innerHTML = '<div class="alert">No media found on this page.</div>';
        }
    })
    .catch(error => {
        console.error('Error fetching video:', error);
        videoResults.innerHTML = '<div class="alert">Error fetching video. Please try again.</div>';
    });
}
