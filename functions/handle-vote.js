const { BlobStore } = require('@netlify/blob-store');

const blobStore = new BlobStore('your-blob-store-id'); // Replace with your blob store ID

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const formData = new URLSearchParams(event.body);
    const voteType = formData.get('vote');

    // Retrieve current vote counts
    let voteCounts = { thumbsUp: 0, thumbsDown: 0 };
    try {
        const blob = await blobStore.get('votes.json');
        voteCounts = JSON.parse(blob.data);
    } catch (error) {
        // Blob may not exist yet, initialize vote counts
    }

    // Update vote counts
    if (voteType === 'thumbsUp') {
        voteCounts.thumbsUp++;
    } else if (voteType === 'thumbsDown') {
        voteCounts.thumbsDown++;
    }

    // Save updated vote counts
    await blobStore.put('votes.json', JSON.stringify(voteCounts));

    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Vote received', voteCounts }),
    };
};
