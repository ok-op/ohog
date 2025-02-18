const fetch = require('node-fetch');
const { JSDOM } = require('jsdom');

async function fetchSource(url) {
    // Validate URL
    try {
        new URL(url);
    } catch (error) {
        return { error: 'Invalid URL.' };
    }

    try {
        // Get the source code of the page
        const response = await fetch(url);
        if (!response.ok) {
            return { error: 'Error: Could not retrieve the webpage.' };
        }
        
        const html = await response.text();
        const dom = new JSDOM(html);
        const document = dom.window.document;

        // Initialize an array to store video data
        const videoData = [];
        const videos = document.querySelectorAll('video');

        if (videos.length === 0) {
            return { message: 'No video tags found on this page.' };
        }

        videos.forEach(video => {
            const poster = video.getAttribute('poster') || 'No poster attribute';
            let src = '';

            // Check for source tag inside video, else look for the src attribute
            const sourceTag = video.querySelector('source');
            if (sourceTag) {
                src = sourceTag.getAttribute('src');
            } else {
                src = video.getAttribute('src');
            }

            let modifiedSrc = 'No src attribute';
            if (src) {
                // Replace /hls/ with /720p/ and .m3u8 with .mp4
                modifiedSrc = src.replace('/iht/', '/mc/')
                                 .replace('/hls/', '/720p/')
                                 .replace('.m3u8', '.mp4');
            }

            // Append video data
            videoData.push({ poster, src: modifiedSrc });
        });

        return { videos: videoData };

    } catch (error) {
        return { error: 'An error occurred while processing the page.' };
    }
}

// Example usage
const url = 'https://example.com'; // এখানে URL দিন
fetchSource(url).then(console.log);
