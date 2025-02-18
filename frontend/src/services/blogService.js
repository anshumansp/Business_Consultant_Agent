import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  where,
  Timestamp,
  onSnapshot
} from 'firebase/firestore';
import { db, auth } from '../firebase.config';

/**
 * @typedef {Object} BlogPost
 * @property {string} title - The title of the blog post
 * @property {string} content - The content of the blog post
 * @property {string} authorId - The UID of the author
 * @property {Timestamp} createdAt - When the post was created
 * @property {Timestamp} updatedAt - When the post was last updated
 * @property {number} likes - Number of likes on the post
 */

const COLLECTION_NAME = 'blogs';

/**
 * Creates a new blog post
 * @param {string} title - The title of the blog post
 * @param {string} content - The content of the blog post
 * @returns {Promise<string>} The ID of the created blog post
 */
export const createBlogPost = async (title, content) => {
  try {
    if (!auth.currentUser) {
      throw new Error('User must be authenticated to create a blog post');
    }

    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      title,
      content,
      authorId: auth.currentUser.uid,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      likes: 0
    });

    return docRef.id;
  } catch (error) {
    console.error('Error creating blog post:', error);
    throw error;
  }
};

/**
 * Fetches all blog posts
 * @param {Function} onUpdate - Callback function to handle updates
 * @returns {Function} Unsubscribe function
 */
export const subscribeToBlogPosts = (onUpdate) => {
  const q = query(
    collection(db, COLLECTION_NAME),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(q, (querySnapshot) => {
    const blogs = [];
    querySnapshot.forEach((doc) => {
      blogs.push({ id: doc.id, ...doc.data() });
    });
    onUpdate(blogs);
  });
};

/**
 * Fetches a single blog post by ID
 * @param {string} id - The ID of the blog post
 * @returns {Promise<BlogPost>} The blog post data
 */
export const getBlogPost = async (id) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error('Blog post not found');
    }

    return { id: docSnap.id, ...docSnap.data() };
  } catch (error) {
    console.error('Error fetching blog post:', error);
    throw error;
  }
};

/**
 * Updates a blog post
 * @param {string} id - The ID of the blog post to update
 * @param {Partial<BlogPost>} updatedContent - The updated content
 * @returns {Promise<void>}
 */
export const updateBlogPost = async (id, updatedContent) => {
  try {
    if (!auth.currentUser) {
      throw new Error('User must be authenticated to update a blog post');
    }

    const blogRef = doc(db, COLLECTION_NAME, id);
    const blogSnap = await getDoc(blogRef);

    if (!blogSnap.exists()) {
      throw new Error('Blog post not found');
    }

    // Check if user is the author
    if (blogSnap.data().authorId !== auth.currentUser.uid) {
      throw new Error('Only the author can update this blog post');
    }

    await updateDoc(blogRef, {
      ...updatedContent,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error updating blog post:', error);
    throw error;
  }
};

/**
 * Deletes a blog post
 * @param {string} id - The ID of the blog post to delete
 * @returns {Promise<void>}
 */
export const deleteBlogPost = async (id) => {
  try {
    if (!auth.currentUser) {
      throw new Error('User must be authenticated to delete a blog post');
    }

    const blogRef = doc(db, COLLECTION_NAME, id);
    const blogSnap = await getDoc(blogRef);

    if (!blogSnap.exists()) {
      throw new Error('Blog post not found');
    }

    // Check if user is the author
    if (blogSnap.data().authorId !== auth.currentUser.uid) {
      throw new Error('Only the author can delete this blog post');
    }

    await deleteDoc(blogRef);
  } catch (error) {
    console.error('Error deleting blog post:', error);
    throw error;
  }
};

/**
 * Toggles like on a blog post
 * @param {string} id - The ID of the blog post
 * @returns {Promise<void>}
 */
export const toggleLike = async (id) => {
  try {
    if (!auth.currentUser) {
      throw new Error('User must be authenticated to like a blog post');
    }

    const blogRef = doc(db, COLLECTION_NAME, id);
    const blogSnap = await getDoc(blogRef);

    if (!blogSnap.exists()) {
      throw new Error('Blog post not found');
    }

    const currentLikes = blogSnap.data().likes || 0;
    await updateDoc(blogRef, {
      likes: currentLikes + 1
    });
  } catch (error) {
    console.error('Error toggling like:', error);
    throw error;
  }
};

/**
 * Fetches blog posts by author
 * @param {string} authorId - The author's UID
 * @param {Function} onUpdate - Callback function to handle updates
 * @returns {Function} Unsubscribe function
 */
export const subscribeToAuthorBlogPosts = (authorId, onUpdate) => {
  const q = query(
    collection(db, COLLECTION_NAME),
    where('authorId', '==', authorId),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(q, (querySnapshot) => {
    const blogs = [];
    querySnapshot.forEach((doc) => {
      blogs.push({ id: doc.id, ...doc.data() });
    });
    onUpdate(blogs);
  });
}; 