const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);

const firestore = admin.firestore();
const settings = { timestampsInSnapshots: true };
firestore.settings(settings);

exports.getAllPosts = functions.https.onRequest(async (request, response) => {
  const snapshot = await admin.firestore().collection("posts").get();
  const posts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

  response.json({ posts });
});

exports.incrementCommentCount = functions.firestore
  .document("posts/{postId}/comments/{commentId}")
  .onCreate(async (snapshot, context) => {
    const { postId } = context.params;
    const postRef = firestore.doc(`posts/${postId}`);

    const comments = await postRef.get("comments");
    return postRef.update({ comments: comments + 1 });
  });

exports.sanitizeContent = functions.firestore
  .document("posts/{postId}")
  .onWrite(async (change) => {
    if (!change.after.exists) return;

    const { content, sanitized } = change.after.data();

    if (content && !sanitized) {
      return change.after.ref.update({
        content: content.replace(/CoffeeScript/g, "***"),
        sanitized: true,
      });
    }

    return null;
  });

exports.updateUserInformation = functions.firestore
  .document("users/{userId}")
  .onUpdate(async (snapshot, context) => {
    const { displayName } = snapshot.data();

    const postsRef = firestore
      .collection("posts")
      .where("user.uid", "==", snapshot.id);

    return postsRef.get((postSnaps) => {
      postSnaps.forEach((doc) => {
        doc.ref.update({ "user.displayName": displayName });
      });
    });
  });
