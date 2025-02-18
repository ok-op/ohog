function fetchVideo() {
    const url = document.getElementById('urlInput').value;
    const videoResults = document.getElementById('videoResults');

    // Clear previous results
    videoResults.innerHTML = '<p>Loading...</p>';

    // API Request
    fetch('https://oapi-ok-ops-projects.vercel.app/fetch-video/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url })
    })
    .then(response => response.json())
    .then(data => {
        videoResults.innerHTML = ''; // Clear loading text

        if (data.video || data.image) {
            const videoCard = document.createElement('div');
            videoCard.classList.add('video-card');

            if (data.video) {
                const videoWrapper = document.createElement('div');
                videoWrapper.classList.add('video-wrapper');

                const videoTag = document.createElement('video');
                videoTag.controls = true;
                videoTag.src = data.video;
                videoTag.innerHTML = 'Your browser does not support the video tag.';

                videoWrapper.appendChild(videoTag);
                videoCard.appendChild(videoWrapper);

                const downloadLink = document.createElement('a');
                downloadLink.href = data.video;
                downloadLink.classList.add('btn');
                downloadLink.setAttribute('download', '');
                downloadLink.textContent = 'Download Video';
                videoCard.appendChild(downloadLink);
            }

            if (data.image) {
                const imgTag = document.createElement('img');
                imgTag.src = data.image;
                imgTag.alt = 'Thumbnail';
                videoCard.appendChild(imgTag);

                const imgDownloadLink = document.createElement('a');
                imgDownloadLink.href = data.image;
                imgDownloadLink.classList.add('btn');
                imgDownloadLink.setAttribute('download', '');
                imgDownloadLink.textContent = 'Download Thumbnail';
                videoCard.appendChild(imgDownloadLink);
            }

            videoResults.appendChild(videoCard);
        } else {
            videoResults.innerHTML = '<div class="alert">No video found or invalid URL.</div>';
        }
    })
    .catch(error => {
        console.error('Error fetching video:', error);
        videoResults.innerHTML = '<div class="alert">Error fetching video. Please try again.</div>';
    });
}
