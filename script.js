function fetchVideo() {
    const url = document.getElementById('urlInput').value;  // Get the URL from the input
    const videoResults = document.getElementById('videoResults');  // Where the results will be displayed

    // Clear previous results
    videoResults.innerHTML = '<p>Loading...</p>';

    // API Request
    fetch('https://oapi-qtwajiyyh-ok-ops-projects.vercel.app/fetch-video', {
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
        if (data.videos && data.videos.length > 0) {
            data.videos.forEach(video => {
                const videoCard = document.createElement('div');
                videoCard.classList.add('video-card');

                if (video.src) {
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
                }

                if (video.poster) {
                    const imgTag = document.createElement('img');
                    imgTag.src = video.poster;
                    imgTag.alt = 'Thumbnail';
                    videoCard.appendChild(imgTag);

                    const imgDownloadLink = document.createElement('a');
                    imgDownloadLink.href = video.poster;
                    imgDownloadLink.classList.add('btn');
                    imgDownloadLink.setAttribute('download', '');
                    imgDownloadLink.textContent = 'Download Thumbnail';
                    videoCard.appendChild(imgDownloadLink);
                }

                videoResults.appendChild(videoCard);
            });
        } else {
            videoResults.innerHTML = '<div class="alert">No video found or invalid URL.</div>';
        }
    })
    .catch(error => {
        console.error('Error fetching video:', error);
        videoResults.innerHTML = '<div class="alert">Error fetching video. Please try again.</div>';
    });
}
