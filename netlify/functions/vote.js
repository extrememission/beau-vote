// Example using a simple in-memory store
let votes = { thumbsUp: 0, thumbsDown: 0 };

exports.handler = async (event) => {
  const { type } = JSON.parse(event.body);

  if (type === 'thumbsUp') {
    votes.thumbsUp++;
  } else if (type === 'thumbsDown') {
    votes.thumbsDown++;
  }

  return {
    statusCode: 200,
    body: JSON.stringify(votes)
  };
};
