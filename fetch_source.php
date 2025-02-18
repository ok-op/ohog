<?php
if (isset($_POST['url'])) {
    $url = $_POST['url'];

    // Validate URL
    if (filter_var($url, FILTER_VALIDATE_URL)) {
        // Get the source code of the page
        $html = file_get_contents($url);

        if ($html === FALSE) {
            echo json_encode(['error' => 'Error: Could not retrieve the webpage.']);
            exit();
        }

        // Create a DOMDocument object to parse the HTML
        $doc = new DOMDocument();
        libxml_use_internal_errors(true); // Suppress parsing errors due to invalid HTML
        $doc->loadHTML($html);
        libxml_clear_errors();

        // Initialize an array to store video data
        $videoData = [];

        // Find all video tags
        $videos = $doc->getElementsByTagName('video');
        if ($videos->length == 0) {
            echo json_encode(['message' => 'No video tags found on this page.']);
        } else {
            foreach ($videos as $video) {
                $poster = $video->getAttribute('poster') ?: 'No poster attribute';

                // Check for source tag inside video, else look for the src attribute
                $sourceTag = $video->getElementsByTagName('source')->item(0);
                $src = ($sourceTag) ? $sourceTag->getAttribute('src') : $video->getAttribute('src');

                // If there's a valid src, apply the replacements
                if ($src) {
                    // Replace /hls/ with /720p/ and .m3u8 with .mp4
                    $modifiedSrc = str_replace(['/iht/', '/hls/', '.m3u8'], ['/mc/', '/720p/', '.mp4'], $src);
                } else {
                    $modifiedSrc = 'No src attribute';
                }

                // Append the video data to the array
                $videoData[] = [
                    'poster' => $poster,
                    'src' => $modifiedSrc
                ];
            }

            // Return the video data as a JSON response
            echo json_encode(['videos' => $videoData]);
        }
    } else {
        echo json_encode(['error' => 'Invalid URL.']);
    }
} else {
    echo json_encode(['error' => 'No URL provided.']);
}
