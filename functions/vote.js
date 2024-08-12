import { getStore } from "@netlify/blobs";

const voteStore = getStore({ fetch, name: "vote-store" });

export default async (req) => {
    if (req.method === "POST") {
        try {
            const requestBody = await req.json();
            const voteType = requestBody.vote;  // Expecting { "vote": "thumbsUp" } or { "vote": "thumbsDown" }
            const blobKey = "votes.json";  // Blob key to store vote counts

            let voteCounts = { thumbsUp: 0, thumbsDown: 0 };

            // Retrieve existing votes
            try {
                const blob = await voteStore.get(blobKey);
                voteCounts = JSON.parse(blob);
            } catch (error) {
                // Initialize vote counts if blob doesn't exist
            }

            // Update votes based on the type
            if (voteType === 'thumbsUp') {
                voteCounts.thumbsUp++;
            } else if (voteType === 'thumbsDown') {
                voteCounts.thumbsDown++;
            }

            // Save updated votes
            await voteStore.put(blobKey, JSON.stringify(voteCounts));

            return new Response(JSON.stringify({ message: 'Vote received', voteCounts }), { status: 200 });
        } catch (error) {
            return new Response('Invalid request format', { status: 400 });
        }
    }

    return new Response('Method Not Allowed', { status: 405 });
};
