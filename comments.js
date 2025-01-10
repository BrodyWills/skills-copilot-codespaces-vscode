// Create web server
// Create a new Router object
var express = require('express');
var router = express.Router();

// Create a new comment
router.post('/', function(req, res) {
  // Get the comment text from the request
  var commentText = req.body.text;

  // Get the user ID from the request
  var userId = req.body.userId;

  // Get the post ID from the request
  var postId = req.body.postId;

  // Create a new Comment object
  var comment = new Comment({
    text: commentText,
    user: userId,
    post: postId
  });

  // Save the new Comment object to the database
  comment.save(function(err) {
    if (err) {
      // If an error occurs, send an error status code
      res.status(500).send('Error saving comment');
      return;
    }
    // If the new Comment object was saved successfully, send a success status code
    res.status(200).send('Comment saved');
  });
});
// Export the router object
module.exports = router;